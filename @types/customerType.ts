export interface CustomerType {
	id: string
	active: boolean
	name: string
	contact: string
	bithday: string | null
	bithdaySentDate: string | null
	lastPurchaseDate: string
	lastPurchaseValue: number
	company: string
	sendBithday: boolean
	sendCharge: boolean
	sendBankSlip: boolean
	sendNfe: boolean
	sendSale: boolean
}
