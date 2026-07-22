import { useEffect, useRef, useState } from 'react'

export type UpdateEvent = {
	timestamp: string
	event: string
	message: string
	data?: Record<string, any>
}

export function useWebSocketUpdate(autoConnect: boolean = false) {
	const [isConnected, setIsConnected] = useState(false)
	const [messages, setMessages] = useState<UpdateEvent[]>([])
	const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle')
	const wsRef = useRef<WebSocket | null>(null)

	useEffect(() => {
		if (!autoConnect) return

		const connectWebSocket = () => {
			try {
				setStatus('connecting')
				const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
				const wsUrl = `${protocol}//${window.location.hostname}:8765`

				const ws = new WebSocket(wsUrl)

				ws.onopen = () => {
					console.log('✓ WebSocket conectado')
					setIsConnected(true)
					setStatus('connected')
					setMessages([])
				}

				ws.onmessage = (event) => {
					try {
						const data = JSON.parse(event.data) as UpdateEvent
						setMessages((prev) => [...prev, data])
					} catch (err) {
						console.error('Erro ao parsear mensagem WebSocket:', err)
					}
				}

				ws.onerror = (error) => {
					console.error('Erro WebSocket:', error)
					setStatus('error')
					setIsConnected(false)
				}

				ws.onclose = () => {
					console.log('WebSocket desconectado')
					setIsConnected(false)
					setStatus('idle')
				}

				wsRef.current = ws
			} catch (err) {
				console.error('Erro ao conectar WebSocket:', err)
				setStatus('error')
			}
		}

		connectWebSocket()

		return () => {
			wsRef.current?.close()
		}
	}, [autoConnect])

	const connect = () => {
		if (isConnected || wsRef.current) return

		let retryCount = 0
		const maxRetries = 20
		const retryDelay = 2000

		const attemptConnect = () => {
			try {
				setStatus('connecting')
				const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
				const wsUrl = `${protocol}//${window.location.hostname}:8765`

				console.log(`[WebSocket] Tentativa ${retryCount + 1}/${maxRetries} - Conectando em ${wsUrl}`)

				const ws = new WebSocket(wsUrl)

				const connectTimeout = setTimeout(() => {
					if (ws.readyState !== WebSocket.OPEN) {
						console.log('[WebSocket] Timeout na conexão, forçando retry...')
						ws.close()
					}
				}, 3000)

				ws.onopen = () => {
					clearTimeout(connectTimeout)
					console.log('✓ WebSocket conectado com sucesso!')
					setIsConnected(true)
					setStatus('connected')
					retryCount = 0
				}

				ws.onmessage = (event) => {
					try {
						const data = JSON.parse(event.data) as UpdateEvent
						console.log('[WebSocket] Mensagem recebida:', data.event, data.message)
						setMessages((prev) => [...prev, data])
					} catch (err) {
						console.error('Erro ao parsear mensagem WebSocket:', err)
					}
				}

				ws.onerror = (error) => {
					clearTimeout(connectTimeout)
					console.error('[WebSocket] Erro de conexão:', error)
					setStatus('error')
					setIsConnected(false)
					ws.close()
				}

				ws.onclose = () => {
					clearTimeout(connectTimeout)
					console.log('[WebSocket] Conexão fechada')
					setIsConnected(false)

					if (retryCount < maxRetries) {
						retryCount++
						setStatus('connecting')
						console.log(`[WebSocket] Retry ${retryCount}/${maxRetries} em ${retryDelay}ms...`)
						setTimeout(attemptConnect, retryDelay)
					} else {
						console.error('[WebSocket] Máximo de tentativas atingido')
						setStatus('error')
					}

					wsRef.current = null
				}

				wsRef.current = ws
			} catch (err) {
				console.error('[WebSocket] Erro ao tentar conectar:', err)
				setStatus('error')

				if (retryCount < maxRetries) {
					retryCount++
					console.log(`[WebSocket] Retry ${retryCount}/${maxRetries} em ${retryDelay}ms...`)
					setTimeout(attemptConnect, retryDelay)
				}
			}
		}

		attemptConnect()
	}

	const disconnect = () => {
		wsRef.current?.close()
		setIsConnected(false)
		setStatus('idle')
	}

	const clearMessages = () => {
		setMessages([])
	}

	return {
		isConnected,
		messages,
		status,
		connect,
		disconnect,
		clearMessages,
	}
}
