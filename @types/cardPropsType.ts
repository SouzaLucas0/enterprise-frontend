export type CardPropsType = {
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
    qtdSents: number
    lastSentDate: string
    onSend: (id: string, contact: string) => void
}