import { BirthdayCelebrantsType } from '@/@types/birthdayCelebrantsType'
import { ConfigsType } from '@/@types/configsType'
import { LogsType } from '@/@types/logsType'
import { SentBirthdayCelebrantsType } from '@/@types/sentBirthdayCelebrantsType'
import { SessionType } from '@/@types/sessionType'
import { getBaseUrl } from '@/lib/getBaseUrl'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'react-toastify'

export const getMsgVariables = async (setMsgVariables: Dispatch<SetStateAction<string[]>>) => {
	const baseURL = await getBaseUrl()

	try {
		const res = await fetch(`${baseURL}/anniversary/messageVariables`)
		const data = await res.json()

		setMsgVariables(data.variables)
	} catch (err: any) {
		console.error(err)
		toast.error(`Verifique a API, falha ao carregar modelo de mensagem: ${err}`)
	}
}

export const getLogs = async (setLogs: Dispatch<SetStateAction<LogsType[]>>) => {
	const baseURL = await getBaseUrl()

	try {
		const res = await fetch(`${baseURL}/logs`)
		const data: LogsType[] = await res.json()
		const filtred = data.filter(log => log.module === 'AnniversaryService')
		
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
			body: JSON.stringify({ module: 'AnniversaryService' })
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
		const res = await fetch(`${baseURL}/anniversary/config`)
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
		const res = await fetch(`${baseURL}/messages/1`)
		const data = await res.json()

		if (data.message) {
			setCurrentMsgModel(data.message)
		}
	} catch (err: any) {
		console.error(err)
		toast.error(`Verifique a API, falha ao carregar modelo de mensagtem: ${err}`)
	}
}

export const getBithdayCelebrants = async (
	setBirthdayCelebrants: Dispatch<SetStateAction<BirthdayCelebrantsType[]>>,
) => {
	const baseURL = await getBaseUrl()

	try {
		const res = await fetch(`${baseURL}/anniversary/birthdayCelebrants`)
		const data: BirthdayCelebrantsType[] = await res.json()
		setBirthdayCelebrants(data)
	} catch (err: any) {
		console.error(err)
		toast.error(`Verifique a API, falha ao carregar aniversáriantes: ${err}`)
	}
}

export const getSentBithdayCelebrants = async (
	setSentBirthdayCelebrants: Dispatch<SetStateAction<SentBirthdayCelebrantsType[]>>,
) => {
	const baseURL = await getBaseUrl()

	try {
		const res = await fetch(`${baseURL}/anniversary/sentBirthdayCelebrants`)
		const data: SentBirthdayCelebrantsType[] = await res.json()
		setSentBirthdayCelebrants(data)
	} catch (err: any) {
		console.error(err)
		toast.error(`Verifique a API, falha ao carregar aniversáriantes com mensagem enviada: ${err}`)
	}
}

export const handleSendManualMsg = async (
	id: string,
	contact: string,
	selectedAccount: string,
	currentMsgModel: string,
) => {
	if (contact.length < 10) {
		toast.error(`Falha no envio da mensagem: número de WhatsApp inexistente ou inválido no cadastro do cliente.`)
		return
	}
	
	const baseURL = await getBaseUrl()

	try {
		const res = await fetch(`${baseURL}/anniversary/sendManualAnniversaryMessage`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				clientId: selectedAccount,
				customerId: id,
				number: contact,
				message: currentMsgModel,
			}),
		})

		const json = await res.json()

		if (!json.success) {
			toast.error(`${json.message}`)
			console.error(json.message)
			document.getElementById('refresh')?.click()
		} else {
			toast.success('Mensagem enviada com sucesso!')
			document.getElementById('refresh')?.click()
		}
	} catch (err: any) {
		console.error(err)
		toast.error(`Verifique a API, falha ao enviar mensagem: ${err}`)
		document.getElementById('refresh')?.click()
	}
}

export const handleSaveMsgModel = async (setCurrentMsgModel: Dispatch<SetStateAction<string>>, msg: string) => {
	const baseURL = await getBaseUrl()

	try {
		const res = await fetch(`${baseURL}/messages/1`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id: 1, message: msg }),
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
		const res = await fetch(`${baseURL}/anniversary/config`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ runAuto: runAuto, runTime: runTime, runInstance: selectedAccount }),
		})
		const json = await res.json()
		if (json.error) {
			toast.error(`${json.message}`)
		} else {
			toast.success('Configuraçoes atualizadas com sucesso!')
		}
	} catch (err: any) {
		console.error(err)
		toast.error(`${err}`)
	}
}

export const handleManualFirebirdQuery = async () => {
	const baseURL = await getBaseUrl()

	try {
		const res = await fetch(`${baseURL}/anniversary/runFirebirdQuery`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
		})
		const json = await res.json()
		if (json.error) {
			toast.error(`${json.message}`)
		} else {
			toast.success(`${json.message}`)
		}

		document.getElementById('refresh')?.click()
	} catch (err: any) {
		console.error(err)
		toast.error(`${err}`)
	}
}
