export type ChargeRoleType = {
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