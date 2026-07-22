
export type InputProps = {
    type?: string
    placeholder?: string
    value?: string
    label?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
    disabled?: boolean
    min?: string
    max?: string
    step?: string
}