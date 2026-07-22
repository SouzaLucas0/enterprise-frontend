import { formatName } from "@/app/utils/formatName"
import { Phone, Redo2, Send, UserRound } from "lucide-react"
import { Button } from "./button"

export type BirthdayCelebrantsSentCardType = {
    id: string
    name: string
    contact: string
    instance: string
    messagem: string
    sentDate: Date
    onReSend: (id: string, contact: string) => void
}

export function BirthdayCelebrantsSentCard({ id, name, contact, instance, messagem, sentDate, onReSend }: BirthdayCelebrantsSentCardType) {
    return (
        <div className="border border-gray-200 rounded-lg p-2 shadow-md relative">
            <div className="absolute right-0 pr-4 grid justify-center items-center">
                <span className="w-full text-center text-sm text-gray-400">{new Date(sentDate).toLocaleDateString()}</span>
                <Button
                    onClick={() => onReSend(id, contact)}
                    className="flex items-center gap-2 h-fit"
                    variant="secondary"
                    >
                    <Redo2 className="w-4 h-4" />
                    Reenviar
                </Button>
            </div>
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                    <UserRound className="p-1 text-primary" />
                    <span className="font-semibold text-gray-500">{formatName(name)}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Phone className="p-1 text-primary" />
                    <span className="text-sm text-gray-400">{contact}</span>
                </div>
                <div className="text-sm text-gray-400 flex items-center gap-1">
                    <Send className="p-1 text-primary" />
                    <span>Enviado via: </span>
                    <span className="font-semibold">{instance}</span>
                </div>
            </div>
        </div>
    )
}