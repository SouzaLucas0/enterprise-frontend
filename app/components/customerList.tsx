'use client'

import { PendingChangesType } from "@/@types/pendingChangesType"
import { cleanLogs, getCustomers, getLogs, handleSaveChanges } from "@/service/customerListService"
import { Search, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { CustomerType } from "../../@types/customerType"
import { Button } from "./ui/button"
import { Container } from "./ui/container"
import { Input } from "./ui/input"
import LoadingScreen from "./ui/loading"
import { PageTitle } from "./ui/pageTitle"
import { LogsType } from "@/@types/logsType"
import { LogsReport } from "./ui/logsReport"



export default function CustomerList() {
    const [customers, setCustomers] = useState<CustomerType[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [showInactive, setShowInactive] = useState<boolean>(false)
    const [pendingChanges, setPendingChanges] = useState<PendingChangesType>({})
    const [nameFilter, setNameFilter] = useState<string>("")
    const [logs, setLogs] = useState<LogsType[]>([])
    const [showLogs, setShowLogs] = useState<boolean>(false)

    function toggleField<K extends keyof CustomerType>(
        id: string,
        field: K,
        value: CustomerType[K]
    ) {
        setPendingChanges((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value,
            },
        }))
    }

    useEffect(() => {
        getCustomers(setLoading, setCustomers, setPendingChanges)
        getLogs(setLogs)
    }, [])

    const filteredCustomers = customers.filter((customer) => {
        const matchesActive = showInactive ? true : customer.active
        const matchesName = customer.name
            .toLowerCase()
            .includes(nameFilter.toLowerCase())

        return matchesActive && matchesName
    })

    return (
        <>
            <LoadingScreen />
            <div className="p-6">
                <div className="text-black max-w-[1366px] m-auto">
                    <PageTitle
                        Icon={Users}
                        title="Clientes"
                        subtitle="Gerencie clientes e permissões de envio."
                    />
                    <Container>
                        <div className="p-6 w-full">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                                <label className="flex items-center gap-2 text-sm text-gray-600">
                                    <input
                                        type="checkbox"
                                        checked={showInactive}
                                        onChange={(e) => setShowInactive(e.target.checked)}
                                    />
                                    Exibir inativos
                                </label>
                                <div className="flex items-center gap-2">
                                    <Search className="text-primary" />
                                    <Input
                                        type="text"
                                        placeholder="Filtrar por nome..."
                                        value={nameFilter}
                                        onChange={(e) => setNameFilter(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm text-gray-600">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left">ID</th>
                                            <th className="px-4 py-3 text-left">Nome</th>
                                            <th className="px-4 py-3 text-left">Empresa</th>
                                            <th className="px-4 py-3 text-left">Nascimento</th>
                                            <th className="px-4 py-3 text-left">Contato</th>
                                            <th className="px-4 py-3 text-center">Ativo</th>
                                            <th className="px-4 py-3 text-center">Aniv.</th>
                                            <th className="px-4 py-3 text-center">Cobrança</th>
                                            <th className="px-4 py-3 text-center">Boleto</th>
                                            <th className="px-4 py-3 text-center">NFe</th>
                                            <th className="px-4 py-3 text-center">Venda</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredCustomers.map((customer) => {
                                            const changes = pendingChanges[customer.id] ?? {}
                                            return (
                                                <tr
                                                    key={customer.id}
                                                    className="border-b last:border-0 hover:bg-gray-50"
                                                >
                                                    <td className="px-4 py-3">{customer.id}</td>
                                                    <td className="px-4 py-3 font-medium">
                                                        {customer.name}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {customer.company || "-"}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {customer.bithday
                                                            ? new Date(customer.bithday).toLocaleDateString("pt-BR")
                                                            : "-"
                                                        }
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {customer.contact || "-"}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={changes.active ?? customer.active}
                                                            onChange={(e) =>
                                                                toggleField(customer.id, "active", e.target.checked)
                                                            }
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={changes.sendBithday ?? customer.sendBithday}
                                                            onChange={(e) =>
                                                                toggleField(
                                                                    customer.id,
                                                                    "sendBithday",
                                                                    e.target.checked
                                                                )
                                                            }
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={changes.sendCharge ?? customer.sendCharge}
                                                            onChange={(e) =>
                                                                toggleField(
                                                                    customer.id,
                                                                    "sendCharge",
                                                                    e.target.checked
                                                                )
                                                            }
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                changes.sendBankSlip ?? customer.sendBankSlip
                                                            }
                                                            onChange={(e) =>
                                                                toggleField(
                                                                    customer.id,
                                                                    "sendBankSlip",
                                                                    e.target.checked
                                                                )
                                                            }
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={changes.sendNfe ?? customer.sendNfe}
                                                            onChange={(e) =>
                                                                toggleField(
                                                                    customer.id,
                                                                    "sendNfe",
                                                                    e.target.checked
                                                                )
                                                            }
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={changes.sendSale ?? customer.sendSale}
                                                            onChange={(e) =>
                                                                toggleField(
                                                                    customer.id,
                                                                    "sendSale",
                                                                    e.target.checked
                                                                )
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div className="w-full flex justify-end pt-4 gap-2">
                                <Button
                                    onClick={() => setShowLogs(true)}
                                    variant="secondary"
                                    >
                                    Relatório de desativados
                                </Button>
                                <Button
                                    onClick={() => handleSaveChanges(pendingChanges, setLoading, setCustomers, setPendingChanges)}
                                    disabled={Object.keys(pendingChanges).length === 0}
                                    variant="primary"
                                >
                                    Salvar alterações
                                </Button>
                            </div>
                        </div>
                    </Container>
                </div>
            </div>
            {showLogs && (
                <LogsReport
                    logs={logs}
                    setLogs={setLogs}
                    setShowLogs={setShowLogs}
                    showLog={showLogs}
                    cleanLogs={() => cleanLogs(setLogs)}
                />
            )}
        </>
    )
}
