import { LogsType } from "@/@types/logsType"
import { cleanLogs, getBithdayCelebrants, getConfigs, getLogs, getMsgModel, getMsgVariables, getSentBithdayCelebrants, getSessions, handleManualFirebirdQuery, handleSaveConfig, handleSaveMsgModel, handleSendManualMsg } from "@/service/birthdayCelebrantsService"
import { Cake, CircleQuestionMark, Forward, List, MessageSquareText, RefreshCcw, Send, Settings2 } from "lucide-react"
import { useEffect, useState } from "react"
import { BirthdayCelebrantsType } from "../../@types/birthdayCelebrantsType"
import { SentBirthdayCelebrantsType } from "../../@types/sentBirthdayCelebrantsType"
import { SessionType } from "../../@types/sessionType"
import { BirthdayCelebrantsCard } from "./ui/birthdayCelebrantsCard"
import { BirthdayCelebrantsSentCard } from "./ui/birthdayCelebrantsSentCard"
import { Button } from "./ui/button"
import { ConfigSection } from "./ui/configsSection"
import { Container } from "./ui/container"
import { Input } from "./ui/input"
import { MessageVariablesDialog } from "./ui/messageVariablesDialog"
import { PageSubTitle } from "./ui/pageSubtitle"
import { PageTitle } from "./ui/pageTitle"
import { LogsReport } from "./ui/logsReport"
import LoadingScreen from "./ui/loading"

export function BirthdayCelebrantsPage() {
    const [runAuto, setRunAuto] = useState(false)
    const [runTime, setRunTime] = useState('')
    const [msg, setMsg] = useState('')
    const [currentMsgModel, setCurrentMsgModel] = useState<string>('Olá {{nomeCliente}}, toda a nossa equipe te deseja um feliz aniversário!')
    const [selectedAccount, setSelecteAccount] = useState<string>('')
    const [accounts, setAccounts] = useState<SessionType[]>([])
    const [dateFilter, setDateFilter] = useState(new Date().toLocaleDateString("en-CA"));
    const [bithdayCelebrants, setBirthdayCelebrants] = useState<BirthdayCelebrantsType[]>([])
    const [sentBithdayCelebrants, setSentBirthdayCelebrants] = useState<SentBirthdayCelebrantsType[]>([])
    const [msgVariables, setMsgVariables] = useState<string[]>([]);
    const [showMsgVariables, setShowMsgVariables] = useState<boolean>(false)
    const [logs, setLogs] = useState<LogsType[]>([])
    const [showLogs, setShowLogs] = useState<boolean>(false)

    useEffect(() => {
        getSessions(setAccounts)
        getConfigs(setRunAuto, setRunTime, setSelecteAccount)
        getMsgModel(setMsg)
        getBithdayCelebrants(setBirthdayCelebrants)
        getSentBithdayCelebrants(setSentBirthdayCelebrants)
        getMsgVariables(setMsgVariables)
    }, [])

    useEffect(() => {
        if (showLogs) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
    }, [showLogs])

    const filtredBithdayCelebrants = () => {
        if (bithdayCelebrants.length === 0) {
            return [];
        }

        const [, filterMonth, filterDay] = dateFilter.split("-");

        return bithdayCelebrants.filter((customer) => {
            const [, birthMonth, birthDay] =
                customer.bithday.toString().split("-");

            return birthMonth === filterMonth && birthDay === filterDay && customer.active === true
        });
    };

    const filtredSentBithdayCelebrants = () => {
        if (sentBithdayCelebrants.length === 0) {
            return [];
        }

        const [, filterMonth, filterDay] = dateFilter.split("-");

        return sentBithdayCelebrants.filter((sentCustomer) => {
            const [, birthMonth, birthDay] =
                sentCustomer.customer.bithday.toString().split("-");

            return birthMonth === filterMonth && birthDay === filterDay && sentCustomer.customer.active === true
        });
    };

    return (
        <>
            <LoadingScreen />
            <div className="p-6">
                <div className="text-black max-w-[1366px] m-auto">
                    <PageTitle
                        Icon={Cake}
                        title={"Aniversariantes do dia"}
                        subtitle={"Personalize a mensagem automática e gerencie os envios por data."}
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
                        <Container className="bg-blue-200 border-blue-300">
                            <div className="flex justify-between">
                                <div>
                                    <PageSubTitle
                                        description={"Mensagem automática"}
                                        Icon={MessageSquareText}
                                    />
                                    <p className="text-gray-600 text-sm">
                                        Personalize a mensagem que será enviada automaticamente aos aniversariantes.
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
                                    placeholder={msg ? msg : currentMsgModel}
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
                    <Container>
                        <div className="flex gap-6 items-center justify-between">
                            <div className="flex gap-6 items-center justify-start">
                                <PageSubTitle
                                    description={"Lista de Aniversáriantes:"}
                                    Icon={List}
                                />
                                <div className="w-fit">
                                    <Input
                                        type="date"
                                        value={dateFilter}
                                        onChange={(e) => setDateFilter(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="bg-gray-800/10 p-2 rounded-xl cursor-pointer"
                                id="refresh"
                                onClick={() => {
                                    getBithdayCelebrants(setBirthdayCelebrants)
                                    getSentBithdayCelebrants(setSentBirthdayCelebrants)
                                }}>
                                <RefreshCcw />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Container className="w-1/2 mt-0 p-0 h-fit">
                                <div className="bg-green-500 rounded-t-lg py-3 px-4 flex items-center justify-start gap-3">
                                    <Send className="text-white" />
                                    <span className="text-white font-semibold">A Enviar</span>
                                </div>
                                <div className="p-4 grid gap-2">
                                    {filtredBithdayCelebrants()
                                        .filter((bithdayCelebrant) => bithdayCelebrant.bithdaySentDate === null)
                                        .map((bithdayCelebrant) => {
                                            return (
                                                <BirthdayCelebrantsCard
                                                    key={bithdayCelebrant.id}
                                                    id={bithdayCelebrant.id}
                                                    name={bithdayCelebrant.name}
                                                    contact={bithdayCelebrant.contact}
                                                    onSend={(id, contact) => handleSendManualMsg(
                                                        id,
                                                        contact,
                                                        selectedAccount,
                                                        currentMsgModel,
                                                    )}
                                                />
                                            )
                                        })}
                                </div>
                            </Container>
                            <Container className="w-1/2 mt-0 p-0 h-fit">
                                <div className="bg-blue-500 rounded-t-lg py-3 px-4 flex items-center justify-start gap-3">
                                    <Forward className="text-white" />
                                    <span className="text-white font-semibold">Enviados</span>
                                </div>
                                <div className="p-4 grid gap-2">
                                    {filtredSentBithdayCelebrants().map((sentCustomer) => {
                                        return (
                                            <BirthdayCelebrantsSentCard
                                                key={sentCustomer.id}
                                                id={sentCustomer.customer.id}
                                                name={sentCustomer.customer.name}
                                                contact={sentCustomer.customer.contact}
                                                instance={sentCustomer.isntance}
                                                messagem={sentCustomer.message}
                                                sentDate={sentCustomer.sentDate}
                                                onReSend={(id, contact) => handleSendManualMsg(
                                                    id,
                                                    contact,
                                                    selectedAccount,
                                                    currentMsgModel,
                                                )}
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