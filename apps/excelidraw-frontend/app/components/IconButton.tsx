import { ReactNode } from "react";

export function IconButton({
    icon, onClick, activated
}: {
    icon: ReactNode,
    onClick: () => void,
    activated: boolean
}) {
    return <div className={`m-2 pointer p-2 bg-gray-800 hover:bg-gray ${activated ? "text-red-400" : "text-white"}`} onClick={onClick}>
        {icon}
    </div>
}