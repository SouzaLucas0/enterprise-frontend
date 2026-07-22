import { ApiParamasType, ParamsType } from '@/@types/paramsType'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'react-toastify'
import { getBaseUrl } from './getBaseUrl'

export const createDbConfig = async (params: ParamsType) => {
	const baseURL = await getBaseUrl()
	const response = await fetch(`${baseURL}/params`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(params),
	})

	const data = await response.json()
	return data
}

export const getDbConfig = async () => {
	const baseURL = await getBaseUrl()
	const response = await fetch(`${baseURL}/params`, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
	})

	return await response.json()
}

export const createPathsConfig = async (params: ParamsType) => {
	const baseURL = await getBaseUrl()
	const response = await fetch(`${baseURL}/params`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(params),
	})

	const data = await response.json()
	return data
}

export const getPathsConfig = async () => {
	const baseURL = await getBaseUrl()
	const response = await fetch(`${baseURL}/params`, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
	})

	return await response.json()
}

export const createApiConfig = async (apiParams: ApiParamasType) => {
	const response = await fetch('/api/config', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(apiParams),
	})

	await updateApiKey(apiParams.apiKey)

	const data = await response.json()

	return data
}

export const getApiConfig = async () => {
	const response = await fetch('/api/config', {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
	})

	const data = await response.json()

	return data
}

export async function validateKey(setIsValidKey: Dispatch<SetStateAction<boolean>>) {
	const key = await getApiKey()

	const validatePath = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/validate` : '/api/validate'

	const response = await fetch(`${validatePath}/${key}`, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
	})

	if (!response.ok) {
		toast.error('Chave inválida.')
		setIsValidKey(false)
		return
	}

	setIsValidKey(true)
}

export async function testKey(key: string, setIsValidKey: Dispatch<SetStateAction<boolean>>) {
	const validatePath = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/validate` : '/api/validate'

	const response = await fetch(`${validatePath}/${key}`, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
	})

	if (!response.ok) {
		toast.error('Chave inválida.')
		setIsValidKey(false)
		return
	}

	toast.success('Chave testada com sucesso.')
	setIsValidKey(true)
}

export async function getApiKey() {
	const response = await fetch('/api/key', {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
	})

	const data = await response.json()

	return data
}

export async function updateApiKey(key :string) {
	const response = await fetch('/api/key', {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ apiKey: key }),
	})
	
	const data = await response.json()

	if (!data.success) {
		return toast.error(`Erro ao atualizar a chave da API`)
	}

}

export async function stopEnterpriseService() {
	try {
		const response = await fetch('/api/service/stop', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({}),
		})

		const data = await response.json()

		if (!response.ok) {
			throw new Error(data.message || 'Erro ao parar o serviço')
		}

		toast.success(data.message)
		return data
	} catch (error) {
		const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido'
		toast.error(`Erro: ${errorMsg}`)
		throw error
	}
}

export async function startEnterpriseService() {
	try {
		const response = await fetch('/api/service/start', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({}),
		})

		const data = await response.json()

		if (!response.ok) {
			throw new Error(data.message || 'Erro ao iniciar o serviço')
		}

		toast.success(data.message)
		return data
	} catch (error) {
		const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido'
		toast.error(`Erro: ${errorMsg}`)
		throw error
	}
}
