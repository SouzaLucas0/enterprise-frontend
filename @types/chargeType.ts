export type ChargeType = {
    id: string,
    expiration: string
    value: number,
    installment: number,
    qtdInstallments: number,
    type: string,
    qtdSents: number,
    lastSentDate: string,
    paymentDate: Date,
    active: boolean,
    interest: number,
    fine: number,
    customer: {
        id: string,
        active: boolean,
        name: string,
        contact: string,
        bithday: Date
        bithdaySentDate: Date
        lastPurchaseDate: Date
        lastPurchaseValue: number
    }
}