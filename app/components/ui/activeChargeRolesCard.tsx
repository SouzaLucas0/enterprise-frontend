import { Calendar1, Pencil, PencilLine, TextQuote, Trash2 } from "lucide-react";
import { useState } from "react";
import { Container } from "./container";

export interface ActiveChargeRolesCardProps {
    onDelete: () => void;
    onEdit: () => void;
    role: {
        id: number
        description: string
        qtdDaysLate: number
        sendBol: boolean
        active: boolean
        autoSend: boolean
        message: {
            id: number
            message: string
        }
    }
}

export function ActiveChargeRolesCard({ onEdit, onDelete, role }: ActiveChargeRolesCardProps) {
    const [showBtns, setShowBtns] = useState(false);

    return (
        <Container className="border border-gray-200 rounded-lg p-4 shadow-md relative"
            onMouseOver={() => setShowBtns(true)}
            onMouseLeave={() => setShowBtns(false)}
        >
            <div className={`absolute right-2 top-2  grid gap-1 justify-center items-center transition-all delay-100 ${showBtns ? 'opacity-100' : 'opacity-0'}`}>
                <button
                    className="p-1 text-red-500 cursor-pointer"
                    onClick={onDelete}
                >
                    <Trash2 className="w-4 h-4" />
                </button>
                <button
                    className="p-1 cursor-pointer"
                    onClick={onEdit}
                >
                    <Pencil className="w-4 h-4 " />
                </button>
            </div>
            <div className="flex flex-col gap-1 text-sm">
                <div className="flex items-center gap-2">
                    <PencilLine className="p-1 text-primary" />
                    <span className="font-semibold">{role.description}</span>
                </div>
                <div className="text-sm text-gray-400 flex items-center gap-1">
                    <Calendar1 className="p-1 text-primary" />
                    <span className={`${role.qtdDaysLate > 1 ? '' : 'hidden'}`}>{role.qtdDaysLate} dias de atraso</span>
                    <span className={`${role.qtdDaysLate > 1 ? 'hidden' : ''}`}>{role.qtdDaysLate} dia de atraso</span>

                </div>
                <div className="text-sm text-gray-400 flex flex-col">
                    <div className="flex gap-1 items-center">
                        <TextQuote className="p-1 text-primary" />
                        <span>Mensagem:</span>
                    </div>
                    <span className="underline">{role.message.message}</span>
                </div>
            </div>
        </Container>
    )
}