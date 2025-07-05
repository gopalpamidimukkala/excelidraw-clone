import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Hand, Circle, Minus, RectangleHorizontalIcon, MoveRight, TypeOutline } from "lucide-react";
import { Game } from "@/app/draw/game";

export type Tool = "circle" | "rect" | "line" | "hand" | "arrow" | "text";

export function Canvas({
    roomId,
    socket
}: {
    socket: WebSocket;
    roomId: string;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<Game>();
    const [selectedTool, setSelectedTool] = useState<Tool>("hand")

    useEffect(() => {
        const preventScroll = (e: WheelEvent) => {
            if (e.ctrlKey || e.metaKey) return; // allow pinch-zoom on mac
            e.preventDefault();
        };
        document.addEventListener("wheel", preventScroll, { passive: false });
        return () => {
            document.removeEventListener("wheel", preventScroll);
        };
    }, []);

    useEffect(() => {
        game?.setTool(selectedTool);
    }, [selectedTool, game]);

    useEffect(() => {

        if (canvasRef.current) {
            const g = new Game(canvasRef.current, roomId, socket);
            setGame(g);

            return () => {
                g.destroy();
            }
        }


    }, [canvasRef]);

    return <div style={{
        height: "100vh",
        overflow: "hidden"
    }}>
        <Topbar setSelectedTool={setSelectedTool} selectedTool={selectedTool} />
        <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
    </div>
}

function Topbar({selectedTool, setSelectedTool}: {
    selectedTool: Tool,
    setSelectedTool: (s: Tool) => void
}) {
    return <div style={{
            position: "fixed",
            top: 10,
            left: 450
        }}>
            <div className="flex gap-t  bg-gray-800 px-2 py-1 rounded-2xl items-center ">
                <IconButton onClick={() => {
                    setSelectedTool("hand")
                }} activated={selectedTool === "hand"} icon={<Hand />}></IconButton>
                <IconButton onClick={() => {
                    setSelectedTool("rect")
                }} activated={selectedTool === "rect"} icon={<RectangleHorizontalIcon />} ></IconButton>
                <IconButton onClick={() => {
                        setSelectedTool("arrow")
                }} activated={selectedTool === "arrow"} icon={<MoveRight/>}/>
                <IconButton onClick={() => {
                    setSelectedTool("circle")
                }} activated={selectedTool === "circle"} icon={<Circle />}></IconButton>
                <IconButton onClick={() => {
                        setSelectedTool("line")
                }} activated={selectedTool === "line"} icon={<Minus/>}/>
                <IconButton onClick={() => {
                        setSelectedTool("text")
                }} activated={selectedTool === "text"} icon={<TypeOutline/>}/>
            </div>
        </div>
}