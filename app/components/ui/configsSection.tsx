import { Clock, PhoneForwarded, Power, Zap } from "lucide-react"
import { Button } from "./button"
import { Container } from "./container"
import { Dispatch, SetStateAction } from "react"
import { SessionType } from "@/@types/sessionType"
import { LogsType } from "@/@types/logsType"

export type ConfigSectionType = {
    showBtnConsultaEco: boolean
    runAuto: boolean
    setRunAuto: Dispatch<SetStateAction<boolean>>
    runTime: string
    setRunTime: Dispatch<SetStateAction<string>>
    selectedAccount: string
    setSelecteAccount: Dispatch<SetStateAction<string>>
    accounts: SessionType[]
    handleManualFirebirdQuery?: () => Promise<void>
    handleSaveConfig: (runAuto: boolean, runTime: string, selectedAccount: string) => Promise<void>
    handleGetLogs: (setLogs: Dispatch<SetStateAction<LogsType[]>>) => void
    setLogs: Dispatch<SetStateAction<LogsType[]>>
    setShowLogs: Dispatch<SetStateAction<boolean>>
}

export function ConfigSection({
    runAuto,
    setRunAuto,
    runTime,
    setRunTime,
    selectedAccount,
    setSelecteAccount,
    accounts,
    handleManualFirebirdQuery,
    handleSaveConfig,
    handleGetLogs,
    setLogs,
    setShowLogs
}: ConfigSectionType) {
    return (
        <Container className="grid grid-cols-3 gap-3">
            <Container className={`transition-all delay-100 mt-0 border-2 ${runAuto ? `border-secondary bg-secondary/10` : `bg-gray-700/10`}`}>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className={`${runAuto ? `bg-secondary/10 text-secondary` : `bg-gray-700/10 gray-700`} p-2  rounded-xl`}>
                            <Zap />
                        </div>
                        <div>
                            <p className="font-semibold">Disparo automático</p>
                        </div>
                    </div>
                    <p className="text-gray-600 text-sm">Ative ou desative o sistema de envio.</p>
                    <div>
                        <div className="flex justify-center py-2">
                            <button
                                onClick={() => setRunAuto(!runAuto)}
                                className={`cursor-pointer relative w-14 h-14 rounded-full transition-all duration-500 transform hover:scale-102 active:scale-95 ${runAuto
                                    ? "bg-linear-to-br from-secondary to-emerald-700 shadow-2xl shadow-secondary/50"
                                    : "bg-linear-to-br from-gray-300 to-gray-400 shadow-xl shadow-gray-400/50"
                                    }`}
                            >
                                <div
                                    className={`absolute inset-1 rounded-full flex items-center justify-center transition-all duration-500 ${runAuto ? "bg-white/20" : "bg-black/10"}`}
                                >
                                    <Power
                                        className={`w-8 h-8 transition-all duration-500 ${runAuto ? "text-white rotate-0" : "text-gray-600 rotate-180"}`}
                                    />
                                </div>
                            </button>
                        </div>
                        <div>
                            <div className={`${runAuto ? `block` : `hidden`} flex gap-2 items-center`}>
                                <div className={`w-4 h-4 rounded-full bg-secondary`}></div>
                                <span className="mt-0.5 text-secondary font-semibold">Ativado</span>
                            </div>
                            <div className={`${runAuto ? `hidden` : `block`} flex gap-2 items-center`}>
                                <div className={`w-4 h-4 rounded-full bg-gray-400`}></div>
                                <span className="mt-0.5 text-gray-400 font-semibold">Desativado</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
            <Container className={`mt-0 border-2 bg-blue-500/10 border-blue-500/80`}>
                <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl bg-blue-500/10 text-blue-500`}>
                        <Clock />
                    </div>
                    <div>
                        {handleManualFirebirdQuery ? (
                            <p className="font-semibold">Horario de disparo</p>
                        ) : (
                            <p className="font-semibold">Intervalo entre disparos</p>
                        )}
                    </div>
                </div>
                {handleManualFirebirdQuery ? (
                    <p className="text-gray-600 text-sm">
                        Horário em que a mensagem será enviada automaticamente.
                    </p>
                ) : (
                    <p className="text-gray-600 text-sm">
                        Intervalo entre os envios automáticos.
                    </p>
                )}

                <div className="grid justify-center items-center">
                    <input
                        type="time"
                        min="00:01"
                        max="23:59"
                        step="60"
                        value={runTime}
                        onChange={(e) => setRunTime(e.target.value)}
                        className="px-4 py-2 mt-3 text-center text-black text-2xl rounded-xl border-2 border-blue-500/30"
                    />
                </div>
            </Container>
            <Container className="mt-0 border-2 border-secondary bg-secondary/10">
                <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl bg-secondary/10 text-secondary`}>
                        <PhoneForwarded />
                    </div>
                    <div>
                        <p className="font-semibold">Conta para disparo</p>
                    </div>
                </div>
                <p className="text-gray-600 text-sm">
                    Selecione a conta do Whatsapp para disparo das mensagens.
                </p>
                <div className="w-fit">
                    <label className="text-gray-700">Selectionar Conta:</label>
                    <select
                        value={selectedAccount}
                        onChange={e => setSelecteAccount(e.target.value)}
                        className="w-full bg-gray-200 text-gray-600 py-1 px-2 rounded-lg"
                    >
                        {!accounts.some(a => a.clientId === selectedAccount) && (
                            <option value="">Selecione</option>
                        )}
                        {accounts.map(s => (
                            <option key={s.clientId} value={s.clientId}>
                                {s.ready ? "🟢" : "⚪"} {s.clientId}
                            </option>
                        ))}
                    </select>
                </div>
            </Container>
            <div className="col-start-2 col-end-4 flex gap-2 justify-end py-2">
                <Button
                    onClick={() => {
                        handleGetLogs(setLogs)
                        setShowLogs(true)
                    }}
                    variant="secondary"
                >
                    Relatório de falhas de envio
                </Button>
                {handleManualFirebirdQuery && (
                    <Button
                        onClick={() => {
                            handleManualFirebirdQuery()
                        }}
                        variant="secondary"
                    >
                        Consultar no Eco
                    </Button>
                )}

                <Button
                    onClick={() => handleSaveConfig(runAuto, runTime, selectedAccount)}
                    variant="primary"
                >
                    Salvar Configurações
                </Button>
            </div>
        </Container>
    )
}