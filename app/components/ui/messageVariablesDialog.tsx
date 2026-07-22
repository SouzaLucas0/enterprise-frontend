import { MessageVariablesDialogType } from "@/@types/messageVariablesDialogType"
import { CircleX } from "lucide-react"
import { useEffect } from "react"

export function MessageVariablesDialog({ variables, open, setOpen }: MessageVariablesDialogType) {
    const closeModal = () => {
        setOpen(!open)
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                closeModal()
            }
        }

        if (open) {
            window.addEventListener("keydown", handleKeyDown)
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [open])

    return (
        <div className={`overflow-y-auto fixed left-0 top-0 w-full h-full bg-black/40 z-10  ${open ? '' : 'hidden'}`}>
            <div className="grid justify-center items-center h-full w-full">
                <div className="px-12 py-6 bg-white border-gray-300 rounded-lg shadow-md relative text-gray-700 space-y-4">
                    <CircleX
                        className="absolute top-3 right-3 text-gray-500 cursor-pointer"
                        onClick={closeModal}
                    />
                    <p className="pt-2">Variáveis para usar com a mensagem:</p>
                    <div>
                        {variables.map((msg, index) => (
                            <p key={index}>{msg}</p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}