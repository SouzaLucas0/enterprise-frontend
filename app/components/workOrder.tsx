import { LogsType } from "@/@types/logsType"
import { SituationType } from "@/@types/situationType"
import { cleanLogs, getConfigs, getLogs, getMsgVariables, getSessions, getSituations, handleSaveConfig, handleSaveMsg, updateSituations } from "@/service/workOrderService"
import { CircleQuestionMark, ClipboardList, MessageSquareText, Settings2, Wrench } from "lucide-react"
import { useEffect, useState } from "react"
import { SessionType } from "../../@types/sessionType"
import { ActiveSituationsCard } from "./ui/activeSituationsCard"
import { ConfigSection } from "./ui/configsSection"
import { Container } from "./ui/container"
import LoadingScreen from "./ui/loading"
import { LogsReport } from "./ui/logsReport"
import { MessageVariablesDialog } from "./ui/messageVariablesDialog"
import { PageSubTitle } from "./ui/pageSubtitle"
import { PageTitle } from "./ui/pageTitle"
import { SituationsCard } from "./ui/situationsCard"

export function WorkOrderPage() {
    const [runAuto, setRunAuto] = useState(false)
    const [runTime, setRunTime] = useState('')
    const [selectedAccount, setSelecteAccount] = useState<string>('')
    const [accounts, setAccounts] = useState<SessionType[]>([])
    const [msgVariables, setMsgVariables] = useState<string[]>([]);
    const [showMsgVariables, setShowMsgVariables] = useState<boolean>(false)
    const [logs, setLogs] = useState<LogsType[]>([])
    const [showLogs, setShowLogs] = useState<boolean>(false)
    const [situations, setSituations] = useState<SituationType[]>([])
    const [idEditing, setIdEditing] = useState<number>(0)
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [msg, setMsg] = useState<string>('')
    const [active, setActive] = useState<boolean>(false)
    const [situationSelected, setSituationSelected] = useState<string>()

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
        updateSituations()
        getMsgVariables(setMsgVariables)
        getSituations(setSituations)
    }, [])

    useEffect(() => {
        getSituations(setSituations)
    }, [isEditing])

    const handleEditSituation = (id: number) => {
        const situation = situations.find(situation => situation.id === (id))
        if (!situation!.message) {
            setMsg('Olá, {{nomeCliente}}, seu veículo iniciou o serviço.')
        } else {
            setMsg(situation!.message.message)
        }
        setIdEditing(id)
        setIsEditing(true)
        setActive(situation!.active)
        setSituationSelected(situation!.description)
    }

    const onClear = () => {
        setIdEditing(0)
        setSituationSelected('')
        setMsg('')
        setIsEditing(false)
    }

    return (
        <>
            <LoadingScreen />
            <div className="p-6">
                <div className="text-black max-w-[1366px] m-auto">
                    <PageTitle
                        Icon={Wrench}
                        title={"Ordem de Serviço"}
                        subtitle={"Personalize a mensagem automática e gerencie os envios de ordens de serviço"}
                    />
                    <Container>
                        <PageSubTitle
                            description={"Configurações"}
                            Icon={Settings2}
                        />
                        <ConfigSection
                            showBtnConsultaEco={true}
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
                        <Container>
                            <div>
                                <PageSubTitle
                                    description={"Situações da O.S."}
                                    Icon={ClipboardList}
                                />
                                <p className="text-gray-400 text-sm mt-1">
                                    Veja as situações de cobrança que estão ativas no Eco.
                                </p>
                            </div>
                            <div className="grid gap-2 grid-cols-2">
                                {situations.map((situation) => {
                                    return (
                                        <ActiveSituationsCard
                                            key={situation.id}
                                            situation={situation}
                                            onEdit={() => handleEditSituation(situation.id)}
                                        />
                                    )
                                })}
                            </div>
                        </Container>
                        <Container className="bg-blue-200 border-blue-300">
                            <div className="flex justify-between">
                                <div>
                                    <PageSubTitle
                                        description={"Mensagem para Situações da O.S."}
                                        Icon={MessageSquareText}
                                    />
                                    <p className="text-gray-600 text-sm">
                                        Personalize as mensagens que serão enviadas aos clientes com base na situação da O.S
                                    </p>
                                </div>
                                <CircleQuestionMark
                                    className="text-gray-500 cursor-pointer"
                                    onClick={() => setShowMsgVariables(!showMsgVariables)}
                                />
                            </div>
                            <SituationsCard
                                active={active}
                                setActive={setActive}
                                situationSelected={situationSelected}
                                setSituationSelected={setSituationSelected}
                                msg={msg}
                                setMsg={setMsg}
                                idEditing={idEditing}
                                setIdEditing={setIdEditing}
                                isEditing={isEditing}
                                setIsEditing={setIsEditing}
                                handleSaveMsg={handleSaveMsg}
                                onClear={onClear}
                            />
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
