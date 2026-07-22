import { ButtonHTMLAttributes } from "react"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary"
}

export function Button({ variant, ...props }: ButtonProps) {
    const primary = 'bg-primary hover:bg-primary/80 text-white'
    const secontary = 'bg-white hover:bg-primary/80 text-primary hover:text-white'

    return (
        <button
            type={props.type || "button"}
            className={`${props.className}
            ${variant === 'primary'? primary : secontary }
            border border-primary cursor-pointer w-fit py-1 px-5 rounded-md flex gap-2 items-center justify-center shadow-md
            `}
            onClick={props.onClick}
            disabled={props.disabled}
        >
            {props.children}
        </button>
    )
}