import { getBaseUrl } from '@/lib/getBaseUrl'
import { use, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export type JobKey = 'anniversary' | 'bankSlip' | 'nfe' | 'charge' | 'sale'

export type JobStatusType = {
	key: JobKey
	title: string
	enabled: boolean
	running: boolean
	hasError: boolean
	errorMessage?: string
	lastRunAt?: Date
	lastSyncAt?: Date
	sentCount?: number
}

export type AlertType = {
	message: string
	type: 'success' | 'error' | 'info' | 'update'
}

const baseURL = await getBaseUrl()

export const useSocket = () => {
	const [soket, setSoket] = useState<Socket | null>(null)
	const [jobs, setJobs] = useState<Record<string, JobStatusType>>({})
	const [alerts, setAlerts] = useState<AlertType[]>([])
	const [connected, setConnected] = useState(false)

	useEffect(() => {
		const socketInstance = io(`${baseURL}`, {
			transports: ['websocket'],
			reconnection: true,
			reconnectionDelay: 1000,
			reconnectionAttempts: 10,
		})

		socketInstance.on('connect', () => {
			console.log('Conectado ao servidor de WebSocket')
			setConnected(true)
		})

		socketInstance.on('disconnect', () => {
			console.log('Desconectado do servidor de WebSocket')
			setConnected(false)
		})

		socketInstance.on('job:snapshot', (statuses: JobStatusType[]) => {
			console.log('Snapshot recebido:', statuses)
			const jobsMap: Record<string, JobStatusType> = {}
			statuses.forEach((status) => {
				jobsMap[status.key] = status
			})
			setJobs(jobsMap)
		})

		socketInstance.on('job:status', (status: JobStatusType) => {
			console.log('Recebido status do job:', status)
			setJobs((prev) => ({
				...prev,
				[status.key]: status,
			}))
		})

		socketInstance.on('alert', (alert: AlertType) => {
			setAlerts((prev) => [...prev, alert])
		})

		setSoket(socketInstance)

		return () => {
			socketInstance.disconnect()
		}
	}, [])

	return { soket, jobs, alerts, connected }
}
