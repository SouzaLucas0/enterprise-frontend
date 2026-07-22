import { cleanLogs, getConfigs, getLogs, getMsgModel, getMsgVariables, getSessions, handleSaveConfig, handleSaveMsgModel } from "@/service/bankSlipService"
import { Barcode, CircleQuestionMark, Clock, MessageSquareText, PhoneForwarded, Power, Settings2, Zap } from "lucide-react"
import { useEffect, useState } from "react"
import { SessionType } from "../../@types/sessionType"
import { Button } from "./ui/button"
import { Container } from "./ui/container"
import { MessageVariablesDialog } from "./ui/messageVariablesDialog"
import { PageSubTitle } from "./ui/pageSubtitle"
import { PageTitle } from "./ui/pageTitle"
import { ConfigSection } from "./ui/configsSection"
import { LogsType } from "@/@types/logsType"
import { LogsReport } from "./ui/logsReport"
import LoadingScreen from "./ui/loading"

export function BankSlipPage() {
    const [runAuto, setRunAuto] = useState(false)
    const [runTime, setRunTime] = useState('')
    const [msg, setMsg] = useState('')
    const [currentMsgModel, setCurrentMsgModel] = useState<string>('Olá {{nomeCliente}}, segue o boleto para pagamento')
    const [selectedAccount, setSelecteAccount] = useState<string>('')
    const [accounts, setAccounts] = useState<SessionType[]>([])
    const [msgVariables, setMsgVariables] = useState<string[]>([]);
    const [showMsgVariables, setShowMsgVariables] = useState<boolean>(false)
    const [logs, setLogs] = useState<LogsType[]>([])
    const [showLogs, setShowLogs] = useState<boolean>(false)

    useEffect(() => {
        if (showLogs) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
    }, [showLogs])

    useEffect(() => {
        getSessions(setAccounts)
        getConfigs(setRunAuto, setRunTime, setSelecteAccount)
        getMsgModel(setMsg)
        getMsgVariables(setMsgVariables)
    }, [])

    return (
        <>
            <LoadingScreen />
            <div className="p-6">
                <div className="text-black max-w-[1366px] m-auto">
                    <PageTitle
                        Icon={Barcode}
                        title={"Boletos"}
                        subtitle={"Personalize a mensagem automática e gerencie os envios de boletos"}
                    />
                    <Container>
                        <PageSubTitle
                            description={"Configurações"}
                            Icon={Settings2}
                        />
                        <ConfigSection
                            showBtnConsultaEco={false}
                            runAuto={runAuto}
                            setRunAuto={setRunAuto}
                            runTime={runTime}
                            setRunTime={setRunTime}
                            selectedAccount={selectedAccount}
                            setSelecteAccount={setSelecteAccount}
                            accounts={accounts}
                            handleSaveConfig={handleSaveConfig}
                            handleGetLogs={getLogs}
                            setLogs={setLogs}
                            setShowLogs={setShowLogs}
                        />
                        <Container className="bg-blue-200 border-blue-300">
                            <div className="flex justify-between">
                                <div>
                                    <PageSubTitle
                                        description={"Mensagem automática"}
                                        Icon={MessageSquareText}
                                    />
                                    <p className="text-gray-600 text-sm">
                                        Personalize a mensagem que será enviada automaticamente com o boletos.
                                    </p>
                                </div>
                                <CircleQuestionMark
                                    className="text-gray-500 cursor-pointer"
                                    onClick={() => setShowMsgVariables(!showMsgVariables)}
                                />
                            </div>
                            <div>
                                <textarea
                                    className="w-full bg-gray-200 border-2 border-gray-300 rounded-xl p-2"
                                    placeholder={currentMsgModel}
                                    value={msg}
                                    onChange={(e) => setMsg(e.target.value)}
                                    rows={4}
                                />
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
                                        variant="primary"
                                        onClick={() => handleSaveMsgModel(setCurrentMsgModel, msg)}
                                    >
                                        Salvar modelo
                                    </Button>
                                </div>
                            </div>
                        </Container>
                    </Container>
                </div>
                <MessageVariablesDialog
                    variables={msgVariables}
                    open={showMsgVariables}
                    setOpen={setShowMsgVariables}
                />
                <LogsReport
                    logs={logs}
                    setLogs={setLogs}
                    setShowLogs={setShowLogs}
                    showLog={showLogs}
                    cleanLogs={() => cleanLogs(setLogs)}
                />
            </div>
        </>
    )
}