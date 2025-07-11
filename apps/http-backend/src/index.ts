import express, { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { SignUpSchema, SignInSchema, RoomSchema } from '@repo/common/types'
import { prismaClient } from '@repo/db/client'
import { JWT_SECRET } from '@repo/backend-common/config'
import { middleware } from './middleware'
import cors from 'cors'
const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

app.post('/api/v1/signup', async (req, res) => {
    
    try {
        const safeParse = SignUpSchema.safeParse(req.body)

        if (safeParse.success) {
            const { email, password, name } = safeParse.data
            try {
                const hashedPassword = await bcrypt.hash(password, 5)
                await prismaClient.user.create({
                    data : {
                        email,
                        password : hashedPassword,
                        name
                    }
                })
                res.status(200).json("User Created Successfully")
            } catch (error) {
                res.status(400).json("User with Same Mail Already Exists")
            }
        } else {
            res.status(400).json("Invalid input format")
        }
    } catch (error) {
        res.status(500).json('Error in the Server')
    }

})

app.post('/api/v1/signin', async (req , res) => {
try {
    const safeParse = SignInSchema.safeParse(req.body)
    if (safeParse.success) {
        const { email, password } = safeParse.data
        try {
            const response =  await prismaClient.user.findFirst({
                    where : {
                        email
                    }
                })
            if (!response) {
                res.status(400).json("User Not Found")
                return 
            }
            const verifyPassword = await bcrypt.compare(password, response.password)
            if (verifyPassword) {
                const token = jwt.sign({
                        userId : response.id
                    },JWT_SECRET)
                res.status(200).json({token : token})
            } else {
                res.status(400).json("Incorrect Password")
                return
            }
        } catch (error) {
            res.status(500).json("Error in Comparing Hashed Password")
        }
    } else {
         res.status(411).json("Enter Valid Data")
         return
   }
} catch (error) {
    res.status(500).json("Error in the Server")
}
})

app.post('/api/v1/room', middleware , async(req, res) => {
    try {
       
        const safeParse = RoomSchema.safeParse(req.body);
        if (safeParse.success) {
          
            //@ts-ignore
            const adminId = req.userId;
           
            const response = await prismaClient.room.create({
                data : {
                    slug : safeParse.data.name,
                    adminId
                }
            })
         
            res.status(200).json({roomID: response.id})
        } else {
            res.status(401).json("Invalid Input")
            return
        }
    } catch (error) {
        res.status(401).json("Error in the SERVER")
    }

})

app.get('/api/v1/room:roomId', async (req, res) => {
    try {
        const roomId = Number(req.params.roomId)
        const message = await prismaClient.chat.findMany({
            where : { roomId }, orderBy : { id : "desc" }, take : 50
        })
        if (!message) {
            res.status(401).json("There is no chat in the room ")
            return
        }
        res.status(200).json({message})
    } catch (error) {
        res.status(500).json("Error in the SERVER")
    }
})

app.get('/api/v1/room:slug', async (req, res) => {
    try {
        const slug = req.params.slug;
        const response = await prismaClient.room.findFirst({
            where : { slug }
        })
        res.status(200).json({ roomId : response?.id })
    } catch (error) {
        res.status(500).json("Error in the SERVER")
    }
})

app.get('/api/v1/chats/:roomId', async(req, res) => {
    try {
        console.log("chat is called");
       const roomId = parseInt(req.params.roomId, 10)
       console.log(roomId);
        const messages = await prismaClient.chat.findMany({
            where : {
                roomId
            },
            orderBy : {
                id : "desc"
            },
            take : 1000
        })
        console.log(messages)
        res.json(messages)
    } catch (error) {
        res.status(500).json({ messages : [] })
    }
})

app.get('/', (req, res) => {
  res.send("API is alive");
});

app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
})