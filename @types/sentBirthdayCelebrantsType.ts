export type SentBirthdayCelebrantsType = {
    id: number
    isntance: string
    sentDate: Date
    message: string
    customer: {
        id: string
        active: boolean
        name: string
        contact: string
        bithday: Date
        bithdaySentDate: Date
    }
}