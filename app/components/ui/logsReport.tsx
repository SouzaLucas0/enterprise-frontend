import { LogsType } from "@/@types/logsType"
import { CircleX, ListX } from "lucide-react"
import { Dispatch, SetStateAction, useEffect } from "react"
import { Button } from "./button"
import { Container } from "./container"
import { PageSubTitle } from "./pageSubtitle"

export type LogsReportType = {
    showLog: boolean
    setShowLogs: Dispatch<SetStateAction<boolean>>
    logs: LogsType[]
    setLogs: Dispatch<SetStateAction<LogsType[]>>
    cleanLogs: (setLogs: Dispatch<SetStateAction<LogsType[]>>) => Promise<void>
}

export function LogsReport({ showLog, setShowLogs, logs, setLogs, cleanLogs }: LogsReportType) {
    const closeModal = () => {
        setShowLogs(!showLog)
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                closeModal()
            }
        }

        if (showLog) {
            window.addEventListener("keydown", handleKeyDown)
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [showLog])

    return (
        <div className={`${showLog ? '' : 'hidden'} fixed left-0 top-0 w-screen h-screen bg-black/40 z-10 grid justify-center items-center`}>
            <Container className="p-6 space-y-6">
                <div className="flex justify-between">
                    <PageSubTitle
                        description={"Relatório de envios não realizados:"}
                        Icon={ListX}
                    />
                    <div className="text-primary">
                        <CircleX
                            className="w-8 h-8 cursor-pointer"
                            onClick={closeModal}
                        />
                    </div>
                </div>
                <div className="overflow-y-scroll max-h-[65vh] w-[90vw]">
                    <table className="w-full text-black bg-primary rounded-xl">
                        <thead>
                            <tr className=" text-white text-left">
                                <th className="px-3 py-2">ID</th>
                                <th className="px-3 py-2">Cliente</th>
                                <th className="px-3 py-2">WhatsApp</th>
                                <th className="px-3 py-2">Observações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-200 text-md">
                            {logs.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-3 py-4 text-center"
                                    >
                                        Nenhum registro encontrado
                                    </td>
                                </tr>
                            )}
                            {logs.map((item, index) => (
                                <tr key={index} className="hover:bg-secondary/20">
                                    <td className="px-3 py-2">{item.customer.id}</td>
                                    <td className="px-3 py-2">{item.customer.name}</td>
                                    <td className="px-3 py-2">{item.whatsappNumber}</td>
                                    <td className="px-3 py-2">{item.obs}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="w-full grid justify-end">
                    <Button
                        onClick={() => {
                            cleanLogs(setLogs)
                        }}
                        variant="primary"
                    >
                        Limpar registros
                    </Button>
                </div>
            </Container>
        </div>
    )
}