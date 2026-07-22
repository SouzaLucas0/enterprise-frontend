import { CustomerType } from "./customerType";

export type PendingChangesType = Record<
    string,
    Partial<Pick<
        CustomerType,
        | "active"
        | "sendBithday"
        | "sendCharge"
        | "sendBankSlip"
        | "sendNfe"
        | "sendSale"
    >>
>