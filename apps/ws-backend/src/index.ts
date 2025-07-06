import { WebSocketServer, WebSocket } from "ws";
import { JWT_SECRET } from "@repo/backend-common/config";
import jwt from 'jsonwebtoken'
import { prismaClient } from "@repo/db/client";
import { chatQueue } from "./queue";
const wss = new WebSocketServer({ port : 8080 })
interface User {
    ws : WebSocket,
    userId : string,
    rooms : string[]
}

const users: User[] = []

function verifyToken(token: string): string | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        
        if (typeof decoded == "string") {
            return null
        }

        if (!decoded.userId && !decoded ) {
            return null
        }
        return decoded.userId
    } catch (error) {
        return null
    }
    return null
}


wss.on("connection", function connection(ws, req) {
  
    const url = req.url;
    const queryParams = new URLSearchParams(url?.split("?")[1])
    const token = queryParams.get('token') || ""
    const userId = verifyToken(token)

    if (userId == null){
        ws.close()
        return null;
    }

    users.push({
        userId,
        rooms : [],
        ws
    })
   
    ws.on("message", async function message(data) {
        const parsedData = JSON.parse(data as unknown as string);
       
        if (parsedData.type == "join_room") {
          
            const user = users.find( x => x.ws === ws)
            if (!user) {
                return null
            }
            user.rooms.push(parsedData.roomId)
        }

        if (parsedData.type == "leave_room") {
          
            const user = users.find( x => x.ws === ws)
            if (!user) {
                return null
            }
            user.rooms = user.rooms.filter(x => x === parsedData.roomId)
        }

        if (parsedData.type == "chat") {
            const roomId = parsedData.roomId;
            const message = parsedData.message;

            await chatQueue.add('savaChat',{
                roomId: parseInt(roomId),
                message,
                userId
            }, {
                attempts: 3,
                removeOnComplete: true,
                removeOnFail: false,
            });
            console.log("shape added to worker queue")
            // await prismaClient.chat.create({
            //     data : {
            //         roomId : parseInt(roomId),
            //         message,
            //         userId
            //     }
            // })
            users.forEach(user => {
                if (user.rooms.includes(roomId)) {
                    user.ws.send(JSON.stringify({
                        type : "chat",
                        message : message,
                        roomId
                    }))
                }
            })
        }
    })
})