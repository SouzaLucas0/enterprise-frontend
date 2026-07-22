'use client'

import { JobStatusType } from "@/hooks/useSokect"
import { LayoutDashboard, Server } from "lucide-react"
import { Container } from "./ui/container"
import { DashboardServicesCard } from "./ui/dashboardServicesCard"
import LoadingScreen from "./ui/loading"
import { PageSubTitle } from "./ui/pageSubtitle"
import { PageTitle } from "./ui/pageTitle"

export function DashboardPage({ jobs }: { jobs: Record<string, JobStatusType> }) {
    return (
        <>
            <LoadingScreen />
            <div className="p-6">
                <div className="text-black max-w-[1366px] m-auto">
                    <PageTitle
                        Icon={LayoutDashboard}
                        title={"Dashboard"}
                        subtitle={"Visao geral do status e desempenho de todos os servicos."}
                    />
                    <Container>
                        <PageSubTitle
                            description={"Status dos serviços"}
                            Icon={Server}
                        />
                        <div className="grid grid-cols-2 2xl:grid-cols-3 gap-4">
                            {Object.values(jobs).map((job) => (
                                <DashboardServicesCard
                                    key={job.key}
                                    type={job.hasError ? "error" : job.running ? "running" : "idle"}
                                    title={job.title}
                                    status={job.hasError ? "Erro" : job.enabled ? "Ativo" : "Desativado"}
                                    errorMessage={job.errorMessage}
                                    lastSync={job.lastSyncAt ? job.lastSyncAt.toLocaleString() : "N/A"}
                                    sentCount={job.sentCount || 0}
                                />
                            ))}                            
                        </div>
                    </Container>
                </div>
            </div>
        </>
    )
}