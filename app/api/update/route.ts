import { ChildProcess, execFile } from 'child_process'
import { NextRequest, NextResponse } from 'next/server'

let updateProcess: ChildProcess | null = null

export async function POST(request: NextRequest) {
	try {
		if (request.method !== 'POST') {
			return NextResponse.json({ error: 'Método não permitido' }, { status: 405 })
		}

		const batPath = 'C:\\CeConnect\\update\\atualizar_servico.bat'

		console.log(`[UPDATE API] Iniciando atualização com: ${batPath}`)

		updateProcess = execFile(
			'cmd.exe',
			['/c', batPath],
			{
				cwd: 'C:\\CeConnect\\update',
				timeout: 60000,
				windowsHide: true,
			},
			(error, stdout, stderr) => {
				if (error) {
					console.error('[UPDATE API] Erro ao executar atualização:', error)
				} else {
					console.log('[UPDATE API] Atualização iniciada com sucesso')
				}
				if (stdout) {
					console.log('[UPDATE API] Saída:', stdout)
				}
				if (stderr) {
					console.error('[UPDATE API] Erro stderr:', stderr)
				}

				updateProcess = null
			},
		)

		console.log(`[UPDATE API] Processo iniciado com PID: ${updateProcess.pid}`)

		return NextResponse.json({
			success: true,
			message: 'Atualização iniciada. Verifique o servidor WebSocket para atualizações em tempo real.',
		})
	} catch (error) {
		console.error('[UPDATE API] Erro ao iniciar atualização:', error)
		return NextResponse.json(
			{
				error: 'Erro ao iniciar atualização',
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 },
		)
	}
}

export async function DELETE(request: NextRequest): Promise<Response> {
	try {
		console.log('[UPDATE API] Solicitação de cancelamento recebida')

		const { exec } = require('child_process')

		const findCommand = `wmic process where "name='python.exe' and commandline like '%service_updater%'" get processid`

		console.log('[UPDATE API] Procurando processos python com service_updater...')

		return new Promise((resolve: (value: Response) => void) => {
			exec(findCommand, (error: any, stdout: any, stderr: any) => {
				if (error) {
					console.error('[UPDATE API] Erro ao buscar processos:', error)

					if (updateProcess && updateProcess.pid) {
						const pid = updateProcess.pid
						console.log('[UPDATE API] Tentando matar PID conhecido:', pid)
						exec(`taskkill /F /T /PID ${pid}`, (err2: any) => {
							updateProcess = null
							resolve(
								NextResponse.json({
									success: true,
									message: 'Cancelamento solicitado',
								}),
							)
						})
					} else {
						updateProcess = null
						resolve(
							NextResponse.json({
								success: true,
								message: 'Nenhum processo ativo encontrado',
							}),
						)
					}
				} else {
					console.log('[UPDATE API] Resultado da busca:', stdout)

					const lines = stdout.split('\n')
					const pids: string[] = []

					lines.forEach((line: string) => {
						const trimmed = line.trim()
						if (trimmed && !trimmed.includes('ProcessId') && /^\d+$/.test(trimmed)) {
							pids.push(trimmed)
						}
					})

					console.log('[UPDATE API] PIDs encontrados:', pids)

					if (pids.length === 0) {
						updateProcess = null
						resolve(
							NextResponse.json({
								success: true,
								message: 'Nenhum processo de atualização ativo',
							}),
						)
					} else {
						const killPromises = pids.map((pid) => {
							return new Promise((res) => {
								exec(`taskkill /F /T /PID ${pid}`, (err: any, out: any) => {
									console.log(`[UPDATE API] Matando PID ${pid}:`, err ? err.message : 'OK')
									res(true)
								})
							})
						})

						Promise.all(killPromises).then(() => {
							updateProcess = null
							resolve(
								NextResponse.json({
									success: true,
									message: 'Atualização cancelada',
								}),
							)
						})
					}
				}
			})
		})
	} catch (error) {
		console.error('[UPDATE API] Erro ao cancelar atualização:', error)
		return NextResponse.json(
			{
				success: false,
				error: 'Erro ao cancelar atualização',
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 },
		)
	}
}
