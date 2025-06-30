"use client"
// import { useEffect, useState } from "react"
// import { WS_URL } from '@/config'

import { useEffect, useRef } from "react"


// export default function RoomCanvas({roomId} : {
//     roomId : string
// }) {
//     const [socket, setSocket ] = useState< WebSocket | null >(null)

//     useEffect(() =>{
//         const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0OTM0ZTE3Ny1hMDAzLTQ3ZWItODM2NC0wZWM3NTU4YmY2ZTAiLCJpYXQiOjE3NTEyNzYzNzZ9.K-RdDAwj6eKOdpS6LZngX6TaMsaZmv5j39ZVZFP_T-A`)

//         ws.onopen = () => {
//             setSocket(ws)
//             const data = JSON.stringify({
//                 "type" : "join_room",
//                 roomId
//             })
//             // console.log(data)
//             ws.send(data)
//         }
//     }, [])
//     if (!socket) {
//         return <div>Connecting to server....</div>
//     }
//     return <canvas height={innerHeight} width={innerWidth}></canvas>
    
// }


 export default function RoomCanvas({roomId} : {
    roomId : string
 }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current
            const ctx = canvas.getContext("2d")

            if (!ctx) {
                return
            }
            // ctx.strokeStyle = "white";
            // ctx.strokeRect(25, 25, 300, 100)
            let clicked :boolean ;
            canvas.addEventListener("mousedown", (e) => {
                clicked = true;
                console.log(e.clientX);
                console.log(e.clientY);
            })

            canvas.addEventListener("mouseup", (e) => {
                clicked = false;
                console.log(e.clientX);
                console.log(e.clientY);
            })

            canvas.addEventListener("mousemove", (e) => {
                if (clicked) {
                    console.log(e.clientX);
                    console.log(e.clientY)
                }
            })
        }

    },[canvasRef])
    return <canvas ref={canvasRef} width={500} height={500}></canvas>
 }