import { SituationType } from "@/@types/situationType";
import { CircleCheck, CircleX, Pencil, SquareArrowRight, TextQuote } from "lucide-react";
import { useState } from "react";
import { Container } from "./container";

export interface ActiveSituationsCardProps {
    onEdit: () => void;
    situation: SituationType
}

export function ActiveSituationsCard({ onEdit, situation }: ActiveSituationsCardProps) {
    const [showBtns, setShowBtns] = useState(false);

    return (
        <Container className="border border-gray-200 rounded-lg p-4 shadow-md relative m-0"
            onMouseOver={() => setShowBtns(true)}
            onMouseLeave={() => setShowBtns(false)}
        >
            <div className={`absolute right-2 top-2  grid gap-1 justify-center items-center transition-all delay-100 ${showBtns ? 'opacity-100' : 'opacity-0'}`}>
                <button
                    className="p-1 cursor-pointer"
                    onClick={onEdit}
                >
                    <Pencil className="w-4 h-4 " />
                </button>
            </div>
            <div className="flex flex-col gap-1 text-sm">
                <div className="flex items-center gap-2">
                    <SquareArrowRight className="p-1 text-primary" />
                    <span className="font-semibold">{situation.description}</span>
                </div>
                <div className="text-sm text-gray-400 flex flex-col">
                    <div className="flex gap-1 items-center">
                        <TextQuote className="p-1 text-primary" />
                        <span>Mensagem:</span>
                    </div>
                    {situation.message ? (
                        <span className="underline">{situation.message.message}</span>
                    ) : (
                        <span className="text-gray-400">Nenhuma mensagem informada</span>
                    )}
                </div>
                <span className="text-gray-400">{situation.active ? <CircleCheck className="inline-block text-green-600" /> : <CircleX className="inline-block text-red-600" />} Ativo: {situation.active ? 'Sim' : 'Não'} </span>
            </div>
        </Container>
    )
}