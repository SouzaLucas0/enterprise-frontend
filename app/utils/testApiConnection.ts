export async function testApiConnection(host: string, port: string): Promise<{ success: boolean; message: string }> {
	const url = `http://${host}:${port}/health`

	try {
		const res = await fetch(url)

		if (!res.ok) {
			return { success: false, message: 'Servidor respondeu com erro.' }
		}

		const data = await res.json()

		if (data.status === 'UP') {
			return { success: true, message: 'A API está Conectada' }
		}

		return {
			success: false,
			message: 'A API responde, mas não está conectada.',
		}
	} catch (erro: any) {
		return {
			success: false,
			message: 'Não foi possível conectar na API.',
		}
	}
}
