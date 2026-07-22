import { Dispatch, SetStateAction } from "react"
import { Button } from "./button"
import { Input } from "./input"

export type SituationsCardProps = {
    active: boolean
    setActive: Dispatch<SetStateAction<boolean>>
    situationSelected: string | undefined
    setSituationSelected: Dispatch<SetStateAction<string | undefined>>
    msg: string
    setMsg: Dispatch<SetStateAction<string>>
    idEditing: number
    setIdEditing: Dispatch<SetStateAction<number>>
    isEditing: boolean
    setIsEditing: Dispatch<SetStateAction<boolean>>
    handleSaveMsg: (id: number, msg: string, active: boolean) => Promise<void>
    onClear?: () => void
}

export function SituationsCard({
    active,
    setActive,
    situationSelected,
    msg,
    setMsg,
    idEditing,
    setIsEditing,
    isEditing,
    handleSaveMsg,
    onClear
}: SituationsCardProps) {
    return (
        <div className="grid gap-4 text-gray-600">
            <div className="flex items-center justify-start gap-2">
                <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                />
                <p className="mt-0.5">Enviar Mensagem?</p>
            </div>
            <Input
                label="Situação: "
                value={situationSelected}
                disabled={!isEditing}
            />
            <div>
                <label className="text-gray-600">Mensagem:</label>
                <textarea
                    className="w-full border-2 bg-gray-100 border-gray-300 rounded-xl p-2"
                    placeholder="Olá, {{nomeCliente}}, seu veículo iniciou o serviço."
                    value={msg}
                    rows={3}
                    onChange={(e) => setMsg(e.target.value)}
                    disabled={!isEditing}
                />
            </div>
            <div className="w-full flex gap-2 pt-2 justify-end">
                <button
                    className="cursor-pointer bg-gray-300 text-gray-600 w-fit py-1 px-8 rounded-md hover:bg-gray-400"
                    type="button"
                    onClick={() => {
                        setMsg('')
                    }}
                >
                    Limpar
                </button>
                <Button
                    type="button"
                    variant="primary"
                    onClick={() => {
                        handleSaveMsg(idEditing!, msg, active)
                        setIsEditing(false)
                        onClear?.()
                    }}
                >
                    Salvar modelo
                </Button>
                <Button
                    type="button"
                    className={`bg-red-400 hover:bg-red-500 ${!isEditing ? 'hidden' : ''}`}
                    onClick={() => {
                        setIsEditing(false)
                        onClear?.()
                    }}
                >
                    Cancelar
                </Button>
            </div>
        </div>

    )
}