import { formatName } from "@/app/utils/formatName";
import { Phone, Send, UserRound } from "lucide-react";
import { Button } from "./button";

export type CardProps = {
    id: string
    name: string
    contact: string
    onSend: (id:string, contact: string) => void
}

export function BirthdayCelebrantsCard({ id, name, contact, onSend }: CardProps) {
    return (
        <div className="flex border gap-2 border-gray-200 rounded-lg justify-between items-center p-2 shadow-md">
            <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                        <UserRound className="p-1 text-primary" />
                        <span className="font-semibold text-gray-500">{formatName(name)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Phone className="p-1 text-primary" />
                        <span className="text-sm text-gray-400">{contact}</span>
                    </div>
            </div>
            <Button
                onClick={() => onSend(id, contact)}
                className="flex items-center gap-2 h-fit"
                variant="primary"
                >
                <Send className="w-4 h-4" />
                Enviar
            </Button>
        </div>
    )
}