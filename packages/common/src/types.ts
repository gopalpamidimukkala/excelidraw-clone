import { z } from "zod"


export const SignUpSchema = z.object({
    email : z.string().email(),
    password : z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])((?=.*[!@#$%^&*]))/),
    name : z.string().min(3).max(20)
})

export const SignInSchema = z.object({
    email :z.string().email(),
    password : z.string()
})

export const RoomSchema = z.object({
    name : z.string().min(3).max(20)
})