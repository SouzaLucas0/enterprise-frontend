import { formatData } from "@/app/utils/formatDate";
import { formatName } from "@/app/utils/formatName";
import { formatValue } from "@/app/utils/formatValue";
import { Send, File, UserRound, Phone, Calendar, DollarSign } from "lucide-react";
import { Button } from "./button";
import { Container } from "./container";

export type CardProps = {
    id: string
    name: string
    contact: string
    expiration: string
    value: number
    installment: number
    qtdInstallments: number
    type: string
    interest: number
    fine: number
    onSend: (id: string, contact: string) => void
}

export function ChargeCard({ id, name, contact, onSend, type, expiration, value, installment, qtdInstallments, interest, fine }: CardProps) {
    return (
        <Container className="m-0">
            <div className="flex w-full justify-between">
                <div className="justify-between grid">
                    <div className="flex items-center gap-1">
                        <File className="p-1 text-primary" />
                        <p className="font-semibold text-gray-500">
                            <span>{type}: </span>
                            <span>{id}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-1">
                        <UserRound className="p-1 text-primary" />
                        <span className="font-semibold text-gray-500">{formatName(name)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Phone className="p-1 text-primary" />
                        <span className="text-sm text-gray-400">{contact}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                        <div className="flex items-center gap-1">

                            <p>
                                <span>Vencimento: </span>
                                <span>{formatData(expiration).toLocaleDateString('pt-BR')}</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-1">

                            <p>
                                <span>Valor: </span>
                                <span>R$ {formatValue(value)}</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="text-sm text-gray-500 flex flex-col gap-2 justify-between">
                    <p className="text-end">
                        <span>Parcela: </span>
                        <span>{installment}/{qtdInstallments}</span>
                    </p>
                    <div className="grid justify-end">
                        <p>
                            <span>Juros: </span>
                            <span>R$ {formatValue(interest)}</span>
                        </p>
                        <p>
                            <span>Multa: </span>
                            <span>R$ {formatValue(fine)}</span>
                        </p>
                        <p>
                            <span>Total: </span>
                            <span>R$ {formatValue(Number(value) + Number(fine) + Number(interest))}</span>
                        </p>
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
            </div>
        </Container>
    )
}