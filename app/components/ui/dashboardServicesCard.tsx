import { Barcode, CircleX, TriangleAlert, Send, RefreshCw, LucideIcon, SquarePen, Cake, StickyNote, Tags, Power, PowerOff, RefreshCcw, Wrench } from "lucide-react"
import { Container } from "./container"

export type DashboardServicesCardType = {
    type: 'error' | 'inactive' | 'running' | 'idle'
    title: string
    key: string
    status: string
    errorMessage?: string
    lastSync: string
    sentCount: number
}

export function DashboardServicesCard({ type, key, title, status, errorMessage, lastSync, sentCount }: DashboardServicesCardType) {
    let Icon: LucideIcon
    let StatusIcon: LucideIcon

    switch (title) {
        case 'Cobranças':
            Icon = SquarePen
            break
        case 'Boletos':
            Icon = SquarePen
            break
        case 'Boletos':
            Icon = Barcode
            break
        case 'NFe':
            Icon = StickyNote
            break
        case 'Vendas':
            Icon = Tags
            break
        case 'Aniversariantes':
            Icon = Cake
            break
        case 'Ordem de Serviço':
            Icon = Wrench
            break
        default:
            Icon = CircleX
            break
    }

    switch (status) {
        case 'Ativo':
            StatusIcon = Power
            break
        case 'Desativado':
            StatusIcon = PowerOff
            break
        case 'Erro':
            StatusIcon = CircleX
            break
        default:
            StatusIcon = CircleX
            break
    }

    return (
        <Container className="flex flex-col justify-between mt-0">
            <div className="flex items-center justify-between ">
                <div className={`${status === 'Desativado' ? 'text-gray-400' : 'text-gray-800'} flex items-center gap-2 `}>
                    <Icon className="h-5" />
                    <h3 className={`text-lg font-semibold mt-1`}>{title}</h3>
                </div>
                <div className={`flex items-center mt-1 gap-1 py-1 px-2 ${status === 'Erro' ? 'bg-red-400/30 text-red-700' : ''} ${status === 'Desativado' ? 'bg-gray-400/30 text-gray-700' : 'bg-green-400/30 text-green-700'} rounded-xl text-sm`}>
                    <StatusIcon className={`h-4 ${type === 'idle' ? '': 'hidden'}`} />
                    <CircleX className={`h-4 ${status === 'Erro' ? '': 'hidden'}`} />
                    <RefreshCw className={`h-4 ${type === 'running' ? 'animate-spin' : 'hidden'}`} />
                    <p className={`${type === 'idle' ? '': 'hidden'}`}>{status}</p>
                    <p className={`${status === 'Erro' ? '' : 'hidden'}`}>{status}</p>
                    <span className={`${type === 'running' ? '': 'hidden'}`}>Executando</span>
                </div>
            </div>
            <div className={`${type === 'error' ? '' : 'hidden'}`}>
                <p className="flex items-center bg-red-100 text-red-600 py-1 px-2 rounded-xl border border-red-300 text-sm">
                    <TriangleAlert className="h-4" />
                    <span>{errorMessage}</span>
                </p>
            </div>
            <div className="flex gap-4">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Send className="h-4" />
                    <p>
                        <span className="font-semibold">{sentCount} </span>
                        <span>Enviada(s)</span>
                    </p>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                    <RefreshCw className="h-4" />
                    <p>
                        <span>{timeAgo(lastSync)}</span>
                    </p>
                </div>
            </div>
        </Container>
    )
}

function timeAgo(dateString?: string) {
  if (!dateString) return null

  const date = new Date(dateString)
  if (isNaN(date.getTime())) return 'há muito tempo'
  
  const diffMs = Date.now() - date.getTime()

  const seconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  if (seconds < 60) return 'agora mesmo'
  if (minutes < 60) return `há ${minutes} min`
  if (hours < 24) return `há ${hours}h`

  const days = Math.floor(hours / 24)
  return `há ${days}d`
}