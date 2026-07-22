import { ConfigsType } from '@/@types/configsType'
import { LogsType } from '@/@types/logsType'
import { SessionType } from '@/@types/sessionType'
import { getBaseUrl } from '@/lib/getBaseUrl'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'react-toastify'

export const getMsgVariables = async (setMsgVariables: Dispatch<SetStateAction<string[]>>) => {
	const baseURL = await getBaseUrl()

	try {
		const res = await fetch(`${baseURL}/pdf/bankSlip/messageVariables`)
		const data = await res.json()

		setMsgVariables(data.variables)
	} catch (err: any) {
		console.error(err)
		toast.error(`Verifique a API, falha ao carregar modelo de mensagem: ${err}`)
	}
}

export const getSessions = async (setAccounts: Dispatch<SetStateAction<SessionType[]>>) => {
	const baseURL = await getBaseUrl()

	try {
		const res = await fetch(`${baseURL}/whatsapp/instances`)
		const data: any[] = await res.json()
		const mappedSessions: SessionType[] = data.map((instance) => ({
			clientId: instance.name,
			name: instance.name,
			status: instance.status,
			ready: instance.status?.toString().toLowerCase().trim() === 'connected',
			systemName: instance.systemName,
			owner: instance.owner,
		}))
		setAccounts(mappedSessions)
	} catch (err: any) {
		console.error(err)
		toast.error(`Verifique a API, falha ao carregar as sessões: ${err}`)
	}
}

export const getConfigs = async (
	setRunAuto: Dispatch<SetStateAction<boolean>>,
	setRunTime: Dispatch<SetStateAction<string>>,
	setSelecteAccount: Dispatch<SetStateAction<string>>,
) => {
	const baseURL = await getBaseUrl()

	try {
		const res = await fetch(`${baseURL}/pdf/bankSlip/config`)
		const configs: ConfigsType = await res.json()
		setRunAuto(configs.runAuto)
		setRunTime(configs.runTime)
		setSelecteAccount(configs.runInstance)
	} catch (err: any) {
		console.error(err)
		toast.error(`Verifique a API, falha ao carregar as configurações: ${err}`)
	}
}

export const getMsgModel = async (setCurrentMsgModel: Dispatch<SetStateAction<string>>) => {
	const baseURL = await getBaseUrl()

	try {
		const res = await fetch(`${baseURL}/pdf/bankSlip/message`)
		const data = await res.json()

		if (data.message) {
			setCurrentMsgModel(data.message)
		}
	} catch (err: any) {
		console.error(err)
		toast.error(`Verifique a API, falha ao carregar modelo de mensagtem: ${err}`)
	}
}

export const handleSaveMsgModel = async (setCurrentMsgModel: Dispatch<SetStateAction<string>>, msg: string) => {
	const baseURL = await getBaseUrl()

	try {
		const res = await fetch(`${baseURL}/pdf/bankSlip/message`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ message: msg }),
		})
		const json = await res.json()
		if (json.error) {
			toast.error(`${json.message}`)
		} else {
			toast.success('Modelo de mensagem salvo com sucesso!')
			setCurrentMsgModel(msg)
		}
	} catch (err: any) {
		console.error(err)
		toast.error(`${err}`)
	}
}

export const handleSaveConfig = async (runAuto: boolean, runTime: string, selectedAccount: string) => {
	const baseURL = await getBaseUrl()

	try {
		const res = await fetch(`${baseURL}/pdf/bankSlip/config`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ runAuto: runAuto, runTime: runTime, runInstance: selectedAccount }),
		})
		const json = await res.json()
		if (json.error) {
			toast.error(json.error)
		} else {
			toast.success('Configuraçoes atualizadas com sucesso!')
		}
	} catch (err: any) {
		console.error(err)
		toast.error(`${err}`)
	}
}

export const getLogs = async (setLogs: Dispatch<SetStateAction<LogsType[]>>) => {
	const baseURL = await getBaseUrl()

	try {
		const res = await fetch(`${baseURL}/logs`)
		const data: LogsType[] = await res.json()
		const filtred = data.filter((log) => log.module === 'TaskBankSlipService')

		setLogs(filtred)
	} catch (err: any) {
		console.error(err)
		toast.error(`Verifique a API, falha ao carregar modelo de mensagem: ${err}`)
	}
}

export const cleanLogs = async (setLogs: Dispatch<SetStateAction<LogsType[]>>) => {
	const baseURL = await getBaseUrl()
	try {
		const res = await fetch(`${baseURL}/logs/removeLogs`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ module: 'TaskBankSlipService' }),
		})
		const data = await res.json()
		if (!data.success) {
			toast.error(`${data.message}`)
			getLogs(setLogs)
		} else {
			toast.success(`${data.message}`)
			getLogs(setLogs)
		}
	} catch (err: any) {
		console.error(err)
		toast.error(`Verifique a API, falha ao carregar as sessões: ${err}`)
	}
}