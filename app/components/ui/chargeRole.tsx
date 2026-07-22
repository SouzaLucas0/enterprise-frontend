import { Button } from "./button";
import { Input } from "./input";

export interface ChargeRoleProps {
    description: string;
    setDescription: (value: string) => void;
    daysLate: number;
    setDaysLate: (value: number) => void;
    msg: string;
    setMsg: (value: string) => void;
    currentMsgModel: string;
    onClick?: () => void;
    sendBol?: boolean;
    active?: boolean;
    autoSend?: boolean;
    btnDescription: string;
    isEdit: boolean;
    setIsEdit: (value: boolean) => void;
    onClear?: () => void;
}

export function ChargeRole(
    {
        description,
        setDescription,
        daysLate,
        setDaysLate,
        msg,
        setMsg,
        currentMsgModel,
        onClick,
        sendBol,
        autoSend,
        active,
        btnDescription,
        isEdit,
        setIsEdit,
        onClear,
    }: ChargeRoleProps
) {
    return (
        <>
            <div>
                <div className="grid gap-4">
                    <Input
                        type="text"
                        label="Aviso:"
                        placeholder="Primeiro aviso"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <Input
                        type="number"
                        label="Dias de atraso:"
                        placeholder="10"
                        value={`${daysLate}`}
                        onChange={(e) => setDaysLate(Number(e.target.value))}
                    />
                    <div>
                        <label>Mensagem:</label>
                        <textarea
                            className="w-full bg-gray-200 border-2 border-gray-300 rounded-xl p-2"
                            placeholder={currentMsgModel}
                            value={msg}
                            onChange={(e) => setMsg(e.target.value)}
                            rows={4}
                        />
                    </div>
                </div>
                <div className="w-full flex gap-2 pt-2 justify-end">
                    <button
                        className="cursor-pointer bg-gray-300 text-gray-600 w-fit py-1 px-8 rounded-md hover:bg-gray-400"
                        type="button"
                        onClick={() => setMsg('')}
                    >
                        Limpar
                    </button>
                    <Button
                        type="button"
                        onClick={onClick}
                    >
                        {btnDescription}
                    </Button>
                    <Button
                        type="button"
                        className={`bg-red-400 hover:bg-red-500 ${!isEdit ? 'hidden' : ''}`}
                        onClick={() => {
                            setIsEdit(false)
                            onClear?.()
                        }
                        }
                    >
                        Cancelar
                    </Button>
                </div>
            </div>
        </>
    )
}