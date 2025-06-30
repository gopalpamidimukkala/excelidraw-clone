"use client"
import { useEffect, useRef } from "react"

export default function RoomCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current
            const ctx = canvas.getContext("2d")

            if (!ctx) {
                return
            }

            const clicked = { value: false }; // ✅ fix

            canvas.addEventListener("mousedown", (e) => {
                clicked.value = true;
                console.log(e.clientX);
                console.log(e.clientY);
            })

            canvas.addEventListener("mouseup", (e) => {
                clicked.value = false;
                console.log(e.clientX);
                console.log(e.clientY);
            })

            canvas.addEventListener("mousemove", (e) => {
  console.log("moving", e.clientX, e.clientY);
});

        }
    }, [canvasRef])

    return (
  <canvas
    ref={canvasRef}
    width={500}
    height={500}
    style={{ border: "1px solid white", background: "black" }}
  />
);

}




 // import RoomCanvas from "@/app/components/RoomCanvas";
 // export default async function FindRoomId({params} : {
//     params : {
//         roomId : string
//     }
// }) {
//     const roomId = (await params).roomId;
//     return <RoomCanvas  roomId = {roomId}/>
// }