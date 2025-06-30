import { WebSocketServer, WebSocket } from "ws";
import { JWT_SECRET } from "@repo/backend-common/config";
import jwt from 'jsonwebtoken'
import { prismaClient } from "@repo/db/client";
const wss = new WebSocketServer({ port : 8080 })
console.log(JWT_SECRET)
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
    console.log("entered connection")
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
    console.log("user is pushed to variable ")
    ws.on("message", async function message(data) {
        const parsedData = JSON.parse(data as unknown as string);
        console.log("enter the message")
        if (parsedData.type == "join_room") {
            console.log("entered the join_room")
            const user = users.find( x => x.ws === ws)
            if (!user) {
                return null
            }
            user.rooms.push(parsedData.roomID)
        }

        if (parsedData.type == "leave_room") {
            console.log("entered the leave_room")
            const user = users.find( x => x.ws === ws)
            if (!user) {
                return null
            }
            user.rooms = user.rooms.filter(x => x === parsedData.roomID)
        }

        if (parsedData.type == "chat") {
            console.log("Entered the chat")
            const roomId = parsedData.roomID;
            const message = parsedData.message;

            await prismaClient.chat.create({
                data : {
                    roomId,
                    message,
                    userId
                }
            })
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