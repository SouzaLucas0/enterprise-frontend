import { CustomerType } from '@/@types/customerType'
import { LogsType } from '@/@types/logsType'
import { PendingChangesType } from '@/@types/pendingChangesType'
import { getBaseUrl } from '@/lib/getBaseUrl'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'react-toastify'

export async function handleSaveChanges(
	pendingChanges: PendingChangesType,
	setLoading: Dispatch<SetStateAction<boolean>>,
	setCustomers: Dispatch<SetStateAction<CustomerType[]>>,
	setPendingChanges: Dispatch<SetStateAction<{}>>,
): Promise<void> {
	try {
		const entries = Object.entries(pendingChanges)
		if (entries.length === 0) return

		for (const [id, changes] of entries) {
			const baseURL = await getBaseUrl()   
			const res = await fetch(`${baseURL}/customer/${id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(changes),
			})

			if (!res.ok) {
				throw new Error(`Erro ao atualizar cliente ${id}`)
			}
		}

		toast.success('Alterações salvas com sucesso')
		getCustomers(setLoading, setCustomers, setPendingChanges)
	} catch (error) {
		toast.error('Erro ao salvar alterações. Tente novamente.')
		console.error(error)
	}
}

export async function getCustomers(
	setLoading: Dispatch<SetStateAction<boolean>>,
	setCustomers: Dispatch<SetStateAction<CustomerType[]>>,
	setPendingChanges: Dispatch<SetStateAction<{}>>,
): Promise<void> {
	const baseURL = await getBaseUrl()   
	setLoading(true)
	const res = await fetch(`${baseURL}/customer`)
	const data: CustomerType[] = await res.json()
	setCustomers(data)
	setPendingChanges({})
	setLoading(false)
}

export async function getLogs(setLogs: Dispatch<SetStateAction<LogsType[]>>): Promise<void> {
	const baseURL = await getBaseUrl()   
	const res = await fetch(`${baseURL}/logs`)
	const data: LogsType[] = await res.json()
	setLogs(data)
}

export async function cleanLogs(setLogs: Dispatch<SetStateAction<LogsType[]>>): Promise<void> {
	const baseURL = await getBaseUrl()   
	await fetch(`${baseURL}/logs/removeAll`, {
		method: 'DELETE',
	})
	setLogs([])
}