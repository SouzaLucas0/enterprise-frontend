import { Dispatch, SetStateAction } from "react"

export type MessageVariablesDialogType = {
    variables: string[]
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
}