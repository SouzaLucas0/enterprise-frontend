import { cleanLogs, getCharges, getConfigs, getLogs, getMsgVariables, getReminderMsg, getRoles, getSessions, handleCreateRole, handleDeleteRole, handleManualFirebirdQuery, handleSaveConfig, handleSaveMsgModel, handleSendManualMsg, handleUpdateRole } from "@/service/chargerService"
import { CircleQuestionMark, ClipboardList, Forward, List, MessageSquareText, RefreshCcw, Send, Settings2, SquarePen } from "lucide-react"
import { useEffect, useState } from "react"
import { ChargeRoleType } from "../../@types/chargeRoleType"
import { ChargeType } from "../../@types/chargeType"
import { SessionType } from "../../@types/sessionType"
import { ActiveChargeRolesCard } from "./ui/activeChargeRolesCard"
import { ChargeCard } from "./ui/chargeCard"
import { ChargeRole } from "./ui/chargeRole"
import { ConfigSection } from "./ui/configsSection"
import { Container } from "./ui/container"
import { Input } from "./ui/input"
import { MessageVariablesDialog } from "./ui/messageVariablesDialog"
import { PageSubTitle } from "./ui/pageSubtitle"
import { PageTitle } from "./ui/pageTitle"
import { SentChargeCard } from "./ui/sentChargeCard"
import { LogsReport } from "./ui/logsReport"
import { LogsType } from "@/@types/logsType"
import LoadingScreen from "./ui/loading"
import { Button } from "./ui/button"

export function ChargesPage() {
    const [runAuto, setRunAuto] = useState(false)
    const [runTime, setRunTime] = useState('')
    const [currentMsgModel, setCurrentMsgModel] = useState<string>('Olá {{nomeCliente}}, toda a nossa equipe te deseja um feliz aniversário!')
    const [selectedAccount, setSelecteAccount] = useState<string>('')
    const [accounts, setAccounts] = useState<SessionType[]>([])
    const [dateFilter, setDateFilter] = useState(new Date().toLocaleDateString("en-CA"))
    const [sentDateFilter, setSentDateFilter] = useState(new Date().toLocaleDateString("en-CA"))
    const [roles, setRoles] = useState<ChargeRoleType[]>([])
    const [charges, setCharges] = useState<ChargeType[]>([])
    const [description, setdescription] = useState('')
    const [daysLate, setDaysLate] = useState(0)
    const [msg, setMsg] = useState('')
    const [sendBol, setSendBol] = useState(true)
    const [active, setActive] = useState(true)
    const [autoSend, setAutoSend] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [idEditing, setIdEditing] = useState<number>()
    const [msgVariables, setMsgVariables] = useState<string[]>([]);
    const [showMsgVariables, setShowMsgVariables] = useState<boolean>(false)
    const [logs, setLogs] = useState<LogsType[]>([])
    const [showLogs, setShowLogs] = useState<boolean>(false)
    const [reminderMsg, setReminderMsg] = useState<{ active: boolean, message: string }>({ active: false, message: '' })

    useEffect(() => {
        getCharges(setCharges)
        getSessions(setAccounts)
        getConfigs(setRunAuto, setRunTime, setSelecteAccount)
        getRoles(setRoles)
        getMsgVariables(setMsgVariables)
        getReminderMsg(setReminderMsg)
    }, [])

    useEffect(() => {
        if (showLogs) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
    }, [showLogs])

    const filtredCharges = () => {
        if (charges.length === 0) {
            return [];
        }

        return charges.filter((charge) => {
            return new Date(charge.expiration) <= new Date(dateFilter) && charge.qtdSents <= 0 && charge.customer.active === true
        });
    };

    const filtredSentCharges = () => {
        if (charges.length === 0) {
            return [];
        }

        return charges.filter((charge) => {
            if (charge.lastSentDate) {
                console.log(charge.lastSentDate);
                console.log(sentDateFilter);


                return charge.qtdSents > 0 && charge.customer.active === true
                return charge.lastSentDate == sentDateFilter && charge.qtdSents > 0 && charge.customer.active === true
            }
        })
    };

    const handleEditRole = (id: number) => {
        setIdEditing(id)
        const role = roles.find(role => role.id === (id));
        setIsEditing(true)
        setdescription(role!.description)
        setDaysLate(role!.qtdDaysLate)
        setMsg(role!.message.message)
        setSendBol(role!.sendBol)
        setActive(role!.active)
        setAutoSend(role!.autoSend)
    }

    const handleClearInputs = () => {
        setdescription('')
        setDaysLate(0)
        setMsg('')
        setIdEditing(undefined)
    }

    return (
        <>
            <LoadingScreen />
            <div className="p-6">
                <div className="text-black max-w-[1366px] m-auto">
                    <PageTitle
                        Icon={SquarePen}
                        title={"Cobrança"}
                        subtitle={"Crie e personalize as cobraças."}
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
                            handleManualFirebirdQuery={handleManualFirebirdQuery}
                            handleSaveConfig={handleSaveConfig}
                            handleGetLogs={getLogs}
                            setLogs={setLogs}
                            setShowLogs={setShowLogs}
                        />
                        <Container>
                            <div>
                                <PageSubTitle
                                    description={"Regas de cobrança"}
                                    Icon={ClipboardList}
                                />
                                <p className="text-gray-400 text-sm mt-1">
                                    Veja as regras de cobrança que estão ativas no momento.
                                </p>
                            </div>
                            <div className="grid gap-2 grid-cols-2">
                                {roles.map((role) => {
                                    return (
                                        <ActiveChargeRolesCard
                                            role={role}
                                            key={role.id}
                                            onDelete={() => handleDeleteRole(role.id, setRoles)}
                                            onEdit={() => handleEditRole(role.id)}
                                        />
                                    )
                                })}
                            </div>
                        </Container>
                        <Container className="bg-blue-200 border-blue-300">
                            <div className="flex justify-between">
                                <div>
                                    <PageSubTitle
                                        description={"Regra de cobrança"}
                                        Icon={MessageSquareText}
                                    />
                                    <p className="text-gray-600 text-sm">
                                        Personalize as regras de cobrança que serão enviadas aos clientes.
                                    </p>
                                </div>
                                <CircleQuestionMark
                                    className="text-gray-500 cursor-pointer"
                                    onClick={() => setShowMsgVariables(!showMsgVariables)}
                                />
                            </div>
                            {isEditing ?
                                <ChargeRole
                                    description={description}
                                    setDescription={setdescription}
                                    daysLate={daysLate}
                                    setDaysLate={setDaysLate}
                                    msg={msg}
                                    setMsg={setMsg}
                                    currentMsgModel={`{{nomeCliente}}, sua fatura está atrasada em {{diasAtraso}} dias. Por favor, regularize o pagamento o mais breve possível.`}
                                    onClick={() => handleUpdateRole(
                                        description,
                                        daysLate,
                                        sendBol,
                                        active,
                                        autoSend,
                                        msg,
                                        currentMsgModel,
                                        setCurrentMsgModel,
                                        handleClearInputs,
                                        setIsEditing,
                                        setRoles,
                                        idEditing,
                                    )}
                                    sendBol={sendBol}
                                    autoSend={autoSend}
                                    active={active}
                                    btnDescription="Salvar alterações"
                                    isEdit={isEditing}
                                    setIsEdit={setIsEditing}
                                    onClear={() => handleClearInputs()}
                                />
                                :
                                <ChargeRole
                                    description={description}
                                    setDescription={setdescription}
                                    daysLate={daysLate}
                                    setDaysLate={setDaysLate}
                                    msg={msg}
                                    setMsg={setMsg}
                                    currentMsgModel={`{{nomeCliente}}, sua fatura está atrasada em {{diasAtraso}} dias. Por favor, regularize o pagamento o mais breve possível.`}
                                    onClick={() => handleCreateRole(
                                        description,
                                        daysLate,
                                        sendBol,
                                        msg,
                                        active,
                                        autoSend,
                                        setRoles,
                                        setCurrentMsgModel,
                                        handleClearInputs
                                    )}
                                    sendBol={sendBol}
                                    autoSend={autoSend}
                                    active={active}
                                    btnDescription="Adicionar regra"
                                    isEdit={isEditing}
                                    setIsEdit={setIsEditing}
                                />
                            }
                        </Container>
                        <Container className={`border-blue-300 ${reminderMsg.active ? 'bg-blue-200' : 'bg-gray-200'}`}>
                            <div className="flex justify-between">
                                <div>
                                    <PageSubTitle
                                        description={"Lembrete de vencimento"}
                                        Icon={MessageSquareText}
                                    />
                                    <p className="text-gray-600 text-sm">
                                        Personalize a mensagem que será enviada no dia do vencimento do documento.
                                    </p>
                                </div>
                                <CircleQuestionMark
                                    className="text-gray-500 cursor-pointer"
                                    onClick={() => setShowMsgVariables(!showMsgVariables)}
                                />
                            </div>
                            <div className="flex items-center justify-start gap-2">
                                <input
                                    type="checkbox"
                                    checked={reminderMsg.active}
                                    onChange={(e) => setReminderMsg({ ...reminderMsg, active: e.target.checked })}
                                />
                                <p className="mt-0.5">Enviar lembrete?</p>
                            </div>
                            <div>
                                <textarea
                                    className={`w-full bg-gray-200 border-2 border-gray-300 rounded-xl p-2 ${!reminderMsg.active && 'cursor-not-allowed text-gray-400'}`}
                                    placeholder={reminderMsg.message}
                                    value={reminderMsg.message}
                                    onChange={(e) => setReminderMsg({ ...reminderMsg, message: e.target.value })}
                                    rows={5}
                                    disabled={!reminderMsg.active}
                                />
                                <div className="w-full flex gap-2 pt-2 justify-end">
                                    <button
                                        className="cursor-pointer bg-gray-300 text-gray-600 w-fit py-1 px-8 rounded-md hover:bg-gray-400"
                                        type="button"
                                        onClick={() => setReminderMsg({ ...reminderMsg, message: '' })}
                                    >
                                        Limpar
                                    </button>
                                    <Button
                                        type="button"
                                        variant="primary"
                                        onClick={() => handleSaveMsgModel(setReminderMsg, reminderMsg)}
                                    >
                                        Salvar modelo
                                    </Button>
                                </div>
                            </div>
                        </Container>
                    </Container>
                    <Container>
                        <div className="flex gap-6 items-center justify-between">
                            <PageSubTitle
                                description={"Lista de cobranças:"}
                                Icon={List}
                            />
                            <div className="bg-gray-800/10 p-2 rounded-xl cursor-pointer"
                                id="refresh"
                                onClick={() => getCharges(setCharges)}
                            >
                                <RefreshCcw />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Container className="w-1/2 mt-0 p-0 h-fit">
                                <div className="bg-secondary rounded-t-lg py-3 px-4 flex items-center justify-start gap-3">
                                    <Send className="text-white" />
                                    <span className="text-white font-semibold">A Enviar</span>
                                    <div className="w-fit">
                                        <Input
                                            type="date"
                                            value={dateFilter}
                                            onChange={(e) => setDateFilter(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="p-4 grid gap-4">
                                    {filtredCharges()
                                        .map((charge) => {
                                            return (
                                                <ChargeCard
                                                    key={charge.id}
                                                    id={charge.id}
                                                    name={charge.customer.name}
                                                    contact={charge.customer.contact}
                                                    onSend={(id) => handleSendManualMsg(id, setCharges)}
                                                    expiration={charge.expiration}
                                                    value={charge.value}
                                                    installment={charge.installment}
                                                    qtdInstallments={charge.qtdInstallments}
                                                    type={charge.type}
                                                    interest={charge.interest}
                                                    fine={charge.fine}
                                                />
                                            )
                                        })}
                                </div>
                            </Container>
                            <Container className="w-1/2 mt-0 p-0 h-fit">
                                <div className="bg-primary rounded-t-lg py-3 px-4 flex items-center justify-start gap-3">
                                    <Forward className="text-white" />
                                    <span className="text-white font-semibold">Enviados</span>
                                    <div className="w-fit">
                                        <Input
                                            type="date"
                                            value={sentDateFilter}
                                            onChange={(e) => setSentDateFilter(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="p-4 grid gap-2">
                                    {filtredSentCharges()
                                        .map((charge) => {
                                            return (
                                                <SentChargeCard
                                                    key={charge.id}
                                                    id={charge.id}
                                                    name={charge.customer.name}
                                                    contact={charge.customer.contact}
                                                    onSend={(id) => handleSendManualMsg(id, setCharges)}
                                                    expiration={charge.expiration}
                                                    value={charge.value}
                                                    installment={charge.installment}
                                                    qtdInstallments={charge.qtdInstallments}
                                                    type={charge.type}
                                                    interest={charge.interest}
                                                    fine={charge.fine}
                                                    qtdSents={charge.qtdSents}
                                                    lastSentDate={charge.lastSentDate}
                                                />
                                            )
                                        })}
                                </div>
                            </Container>
                        </div>
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