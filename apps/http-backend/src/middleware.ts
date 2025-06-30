import { JWT_SECRET } from "@repo/backend-common/config";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'

export function middleware(req: Request, res: Response, next: NextFunction) {
    try {
        console.log("entered the middleware")
        const token = req.headers["authorization"] ?? ""
        console.log(token)
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload

        if (decoded) {
            //@ts-ignore
            req.userId = decoded.userId;
            next();
        } else {
            res.status(401).json("Unauthorized")
            return
        }
    } catch (error) {
         res.status(401).json("Error in the SERVER")
         return
    }
}