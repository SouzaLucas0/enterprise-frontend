'use client'

import { useWebSocketUpdate } from "@/hooks/useWebSocketUpdate"
import { AlertCircle, CheckCircle2, Download } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export type UpdatingModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function UpdatingModal({ isOpen, onClose }: UpdatingModalProps) {
  const [updateProgress, setUpdateProgress] = useState(0)
  const [updateMessage, setUpdateMessage] = useState('Iniciando atualização...')
  const [updateLogs, setUpdateLogs] = useState<string[]>([])
  const [updateError, setUpdateError] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const { isConnected, messages, connect, clearMessages } = useWebSocketUpdate()
  const lastProcessedMessageIndex = useRef(0)

  useEffect(() => {
    if (isOpen && !isConnected) {
      console.log('[UPDATE] Modal aberto, conectando ao WebSocket...')
      connect()
    }
  }, [isOpen, isConnected, connect])


  useEffect(() => {
    if (messages.length === 0) return
    if (lastProcessedMessageIndex.current >= messages.length) return


    const newMessages = messages.slice(lastProcessedMessageIndex.current)

    newMessages.forEach((msg) => {
      console.log('[UPDATE] Processando mensagem:', msg.event, msg.message)

      const eventTime = msg.timestamp.split('T')[1]?.slice(0, 8) ||
        msg.timestamp.split(' ')[1]?.slice(0, 8) || ''
      const logEntry = `[${eventTime}] ${msg.event.toUpperCase()}: ${msg.message}`

      setUpdateLogs((prev) => [...prev, logEntry])


      switch (msg.event) {
        case 'connected':
          console.log('[UPDATE] WebSocket conectado')
          setUpdateProgress(5)
          setUpdateMessage('Conectado ao servidor de atualização')
          break
        case 'started':
          console.log('[UPDATE] Atualização iniciada')
          setUpdateError(false)
          setUpdateProgress(10)
          setUpdateMessage('Atualização iniciada')
          break
        case 'service_stopped':
          console.log('[UPDATE] Serviço parado')
          setUpdateProgress(20)
          setUpdateMessage('Serviço parado')
          break
        case 'file_removed':
          console.log('[UPDATE] Arquivo removido')
          setUpdateProgress(30)
          setUpdateMessage('Arquivo antigo removido')
          break
        case 'download_started':
          console.log('[UPDATE] Download iniciado')
          setUpdateProgress(40)
          setUpdateMessage('Baixando arquivo...')
          break
        case 'download_completed':
          console.log('[UPDATE] Download concluído')
          setUpdateProgress(60)
          setUpdateMessage('Download concluído')
          break
        case 'service_starting':
          console.log('[UPDATE] Iniciando serviço')
          setUpdateProgress(80)
          setUpdateMessage('Iniciando serviço...')
          break
        case 'service_started':
          console.log('[UPDATE] Serviço iniciado')
          setUpdateProgress(90)
          setUpdateMessage('Serviço iniciado')
          break
        case 'completed':
          console.log('[UPDATE] Atualização concluída!')
          setUpdateProgress(100)
          setUpdateMessage('Atualização concluída com sucesso!')
          setIsCompleted(true)
          break
        case 'error':
          console.error('[UPDATE] Erro:', msg.message)
          setUpdateError(true)
          setUpdateMessage(`Erro: ${msg.message}`)
          break
        case 'log':


          if (msg.message.includes('Progresso:')) {
            const match = msg.message.match(/(\d+)%/)
            if (match) {
              const progress = parseInt(match[1])
              console.log(`[UPDATE] Progresso extraído do log: ${progress}%`)

              const uiProgress = 40 + (progress * 0.2)
              setUpdateProgress(Math.min(uiProgress, 60))
            }
          }
          break
      }
    })

    lastProcessedMessageIndex.current = messages.length
  }, [messages])

  const handleCloseModal = () => {
    console.log('[UPDATE] Fechando modal de atualização')

    if (isCompleted) {
      console.log('[UPDATE] Recarregando página após atualização concluída...')
      window.location.reload()
      return
    }

    setUpdateProgress(0)
    setUpdateMessage('Iniciando atualização...')
    setUpdateLogs([])
    setUpdateError(false)
    setIsCompleted(false)
    clearMessages()
    lastProcessedMessageIndex.current = 0
    onClose()
  }

  const handleCancelUpdate = async () => {
    try {
      console.log('[UPDATE] Cancelando atualização...')
      setUpdateMessage('Cancelando atualização...')

      const response = await fetch('/api/update', {
        method: 'DELETE',
      })

      console.log('[UPDATE] Status da resposta:', response.status, response.statusText)

      const result = await response.json()
      console.log('[UPDATE] Resposta do cancelamento:', result)

      if (result.success) {
        setUpdateMessage(result.message || 'Atualização cancelada')
        setUpdateError(false)

        setTimeout(() => {
          handleCloseModal()
        }, 1000)
      } else {
        setUpdateError(true)
        const errorMsg = result.message || result.error || 'Não foi possível cancelar a atualização'
        console.error('[UPDATE] Erro ao cancelar:', errorMsg, result)
        setUpdateMessage(errorMsg)
      }
    } catch (error) {
      console.error('[UPDATE] Erro ao cancelar atualização:', error)
      setUpdateError(true)
      setUpdateMessage(`Erro ao cancelar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 text-gray-900">
      <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-6 w-[90vw] max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="relative">
          {updateProgress < 100 ? (
            <div className="animate-bounce">
              <Download className="w-16 h-16 text-blue-600" strokeWidth={2} />
            </div>
          ) : updateError ? (
            <div>
              <AlertCircle className="w-16 h-16 text-red-600" strokeWidth={2} />
            </div>
          ) : (
            <div className="animate-scale-in">
              <CheckCircle2 className="w-16 h-16 text-green-600" strokeWidth={2} />
            </div>
          )}
          {updateProgress < 100 && !updateError && (
            <div className="absolute inset-0 animate-ping opacity-20">
              <Download className="w-16 h-16 text-blue-600" strokeWidth={2} />
            </div>
          )}
        </div>

        <div className="text-center w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {updateError ? 'Erro na Atualização!' : updateProgress < 100 ? 'Atualizando Sistema' : 'Atualização Concluída!'}
          </h2>
          <p className="text-gray-600 text-sm">
            {updateMessage}
          </p>
        </div>

        {updateProgress < 100 && !updateError && (
          <div className="w-full space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 font-medium">Progresso</span>
              <span className="text-blue-600 font-bold">{updateProgress}%</span>
            </div>
            <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${updateProgress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>
          </div>
        )}

        {/* Logs da atualização */}
        {updateLogs.length > 0 && (
          <div className="w-full bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
            <p className="text-xs font-semibold text-gray-700 mb-2">Logs de Atualização:</p>
            <div className="space-y-1">
              {updateLogs.map((log, index) => (
                <p key={index} className="text-xs text-gray-600 font-mono">
                  {log}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Botões */}
        {updateProgress < 100 && !updateError && (
          <button
            onClick={handleCancelUpdate}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
          >
            Cancelar Atualização
          </button>
        )}

        {(updateProgress === 100 || updateError) && (
          <button
            onClick={handleCloseModal}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Fechar
          </button>
        )}
      </div>
    </div>
  )
}
