import { ChargeRoleType } from '@/@types/chargeRoleType'
import { ChargeType } from '@/@types/chargeType'
import { ConfigsType } from '@/@types/configsType'
import { LogsType } from '@/@types/logsType'
import { SessionType } from '@/@types/sessionType'
import { UpdatedRoleType } from '@/@types/updatedRoleType'
import { getBaseUrl } from '@/lib/getBaseUrl'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'react-toastify'

export const getMsgVariables = async (setMsgVariables: Dispatch<SetStateAction<string[]>>) => {
	const baseURL = await getBaseUrl()

	try {
		const res = await fetch(`${baseURL}/charge/messageVariables`)
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
		const res = await fetch(`${baseURL}/charge/config`)
		const configs: ConfigsType = await res.json()
		setRunAuto(configs.runAuto)
		setRunTime(configs.runTime)
		setSelecteAccount(configs.runInstance)
	} catch (err: any) {
		console.error(err)
		toast.error(`Verifique a API, falha ao carregar as configurações: ${err}`)
	}
}

export const getRoles = async (setRoles: Dispatch<SetStateAction<ChargeRoleType[]>>) => {
	const baseURL = await getBaseUrl()

	try {
		const res = await fetch(`${baseURL}/charge/role`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		})
		const data = await res.json()

		const filtredRoles = data.filter((role: ChargeRoleType) => role.id !== 999)
		setRoles(filtredRoles)
	} catch (err: any) {
		console.error(err)
		toast.error(`Verifique a API, falha ao carregar regras de cobrança: ${err}`)
	}
}

export const getCharges = async (setCharges: Dispatch<SetStateAction<ChargeType[]>>) => {
	const baseURL = await getBaseUrl()

	try {
		const res = await fetch(`${baseURL}/charge`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		})
		const data = await res.json()
		setCharges(data)
	} catch (err: any) {
		console.error(err)
		toast.error(`Verifique a API, falha ao carregar regras de cobrança: ${err}`)
	}
}

export const handleCreateRole = async (
	description: string,
	daysLate: number,
	sendBol: boolean,
	msg: string,
	active: boolean,
	autoSend: boolean,
	setRoles: Dispatch<SetStateAction<ChargeRoleType[]>>,
	setCurrentMsgModel: Dispatch<SetStateAction<string>>,
	handleClearInputs: () => void,
) => {
	const baseURL = await getBaseUrl()

	try {
		const res = await fetch(`${baseURL}/charge/role`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				description: description,
				qtdDaysLate: daysLate,
				sendBol: sendBol,
				message: msg,
				active: active,
				autoSend: autoSend,
			}),
		})
		const json = await res.json()
		if (json.error) {
			toast.error(`${json.message}`)
		} else {
			getRoles(setRoles)
			toast.success('Regra de cobrança criada com sucesso!')
			setCurrentMsgModel(msg)
			handleClearInputs()
		}
	} catch (err: any) {
		console.error(err)
		toast.error(`Erro: ${err}`)
	}
}

export const handleUpdateRole = async (
	description: string,
	daysLate: number,
	sendBol: boolean,
	active: boolean,
	autoSend: boolean,
	msg: string,
	currentMsgModel: string,
	setCurrentMsgModel: Dispatch<SetStateAction<string>>,
	handleClearInputs: () => void,
	setIsEditing: Dispatch<SetStateAction<boolean>>,
	setRoles: Dispatch<SetStateAction<ChargeRoleType[]>>,
	idEditing: number | undefined,
) => {
	const updatedRole: UpdatedRoleType = {
		description: description,
		qtdDaysLate: daysLate,
		sendBol: sendBol,
		active: active,
		autoSend: autoSend,
	}

	if (msg !== currentMsgModel) {
		updatedRole['message'] = msg
	}

	const baseURL = await getBaseUrl()

	try {
		const res = await fetch(`${baseURL}/charge/role/${idEditing}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(updatedRole),
		})

		const json = await res.json()

		if (json.error) {
			toast.error(`Verifique a API: ${json.message}`)
		} else {
			getRoles(setRoles)
			toast.success('Regra de cobrança criada com sucesso!')
			setCurrentMsgModel(msg)
			setIsEditing(false)
			handleClearInputs()
		}
	} catch (err: any) {
		getRoles(setRoles)
		console.error(err)
		toast.error(`Verifique a API: ${err}`)
	}
}

export const getReminderMsg = async (
	setReminderMsg: Dispatch<
		SetStateAction<{
			active: boolean
			message: string
		}>
	>,
) => {
	const baseURL = await getBaseUrl()

	try {
		const res = await fetch(`${baseURL}/charge/role/999`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		})

		const json = await res.json()

		if (json.error) {
			toast.error(`Verifique a API: ${json.error}`)
		} else {
			setReminderMsg({ active: json.active, message: json.message.message })
		}
	} catch (err: any) {
		console.error(err)
		toast.error(`Verifique a API: ${err}`)
	}
}

export const handleSaveMsgModel = async (
	setReminderMsg: Dispatch<SetStateAction<{ active: boolean; message: string }>>,
	reminderMsg: { active: boolean; message: string },
) => {
	const baseURL = await getBaseUrl()

	try {
		const res = await fetch(`${baseURL}/charge/role/999`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ message: reminderMsg.message, active: reminderMsg.active }),
		})
		const json = await res.json()
		if (json.error) {
			toast.error(`${json.message}`)
		} else {
			toast.success('Modelo de mensagem salvo com sucesso!')
			setReminderMsg({ active: reminderMsg.active, message: reminderMsg.message })
		}
	} catch (err: any) {
		console.error(err)
		toast.error(`${err}`)
	}
}

export const handleDeleteRole = async (id: number, setRoles: Dispatch<SetStateAction<ChargeRoleType[]>>) => {
	const baseURL = await getBaseUrl()

	try {
		const res = await fetch(`${baseURL}/charge/role/${id}`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
		})
		const json = await res.json()
		if (json.error) {
			toast.error(`Verifique a API: ${json.error}`)
		} else {
			getRoles(setRoles)
			toast.success('Regra de cobrança deletada com sucesso!')
		}
	} catch (err: any) {
		console.error(err)
		toast.error(`Verifique a API: ${err}`)
	}
}

export const handleSaveConfig = async (runAuto: boolean, runTime: string, selectedAccount: string) => {
	const baseURL = await getBaseUrl()

	try {
		const res = await fetch(`${baseURL}/charge/config`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ runAuto: runAuto, runTime: runTime, runInstance: selectedAccount }),
		})
		const json = await res.json()
		if (json.error) {
			toast.error(`Verifique a API: ${json.error}`)
		} else {
			toast.success('Configuraçoes atualizadas com sucesso!')
		}
	} catch (err: any) {
		console.error(err)
		toast.error(`Verifique a API: ${err}`)
	}
}

export const handleSendManualMsg = async (chargeId: string, setCharges: Dispatch<SetStateAction<ChargeType[]>>) => {
	const baseURL = await getBaseUrl()

	try {
		const res = await fetch(`${baseURL}/charge/sendManualChageMessage`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ chargeId }),
		})

		const json = await res.json()

		if (json.error || !json.success) {
			toast.error(`${json.message}`)
			console.error(json.error)
			document.getElementById('refresh')?.click()
		} else {
			toast.success('Mensagem enviada com sucesso!')
		}

		document.getElementById('refresh')?.click()
	} catch (err: any) {
		console.error(err)
		toast.error(`Verifique a API, falha ao enviar mensagem: ${err}`)
		document.getElementById('refresh')?.click()
	}
}

export const handleManualFirebirdQuery = async () => {
	const baseURL = await getBaseUrl()

	try {
		const res = await fetch(`${baseURL}/charge/runFirebirdQuery`, {
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

export const getLogs = async (setLogs: Dispatch<SetStateAction<LogsType[]>>) => {
	const baseURL = await getBaseUrl()

	try {
		const res = await fetch(`${baseURL}/logs`)
		const data: LogsType[] = await res.json()
		const filtred = data.filter((log) => log.module === 'ChargeService')

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
			body: JSON.stringify({ module: 'ChargeService' }),
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
