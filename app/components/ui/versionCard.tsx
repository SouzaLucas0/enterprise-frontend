'use client'

import { checkUpdate, UpdateCheckInfo } from "@/service/versionService"
import { AlertCircle, CheckCircle2, Download, RefreshCw } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast } from "react-toastify"
import { Button } from "./button"
import { UpdatingModal } from "./updatingModal"

export function VersionCard() {
  const [updateInfo, setUpdateInfo] = useState<UpdateCheckInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isChecking, setIsChecking] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const hasAutoStartedUpdate = useRef(false)

  const fetchUpdateInfo = async () => {
    setIsChecking(true)
    try {
      const info = await checkUpdate()
      setUpdateInfo(info)
    } catch {
      setUpdateInfo(null)
    } finally {
      setIsLoading(false)
      setIsChecking(false)
    }
  }

  const handleStartUpdate = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    try {
      setShowUpdateModal(true)
      const response = await fetch('/api/update', {
        method: 'POST',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.details || error.error)
      }

      const result = await response.json()
      await new Promise(resolve => setTimeout(resolve, 3000))

    } catch (error) {
      toast.error(`Erro na atualização: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
      setShowUpdateModal(false)
    }
  }

  useEffect(() => {
    fetchUpdateInfo()
  }, [])

  useEffect(() => {
    if (!updateInfo?.updateAvailable) return
    if (showUpdateModal) return
    if (hasAutoStartedUpdate.current) return

    hasAutoStartedUpdate.current = true
    handleStartUpdate()
  }, [updateInfo, showUpdateModal])

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
          <h3 className="text-lg font-semibold text-gray-900">Verificando versão...</h3>
        </div>
      </div>
    )
  }

  if (!updateInfo) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">Erro ao verificar versão</h3>
          </div>
          <Button 
            onClick={handleStartUpdate} 
            disabled={showUpdateModal}
            variant="secondary" 
            className="py-1! px-3!"
            title="Atualizar Sistema"
          >
            <Download className={`w-4 h-4 ${showUpdateModal ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <p className="text-gray-600 mb-4">Não foi possível obter informações sobre a versão do sistema.</p>
        <Button onClick={fetchUpdateInfo} disabled={isChecking}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
          Tentar novamente
        </Button>
        {showUpdateModal && (
          <UpdatingModal
            isOpen={showUpdateModal}
            onClose={() => setShowUpdateModal(false)}
          />
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {updateInfo.updateAvailable ? (
            <Download className="w-6 h-6 text-orange-600" />
          ) : (
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          )}
          <h3 className="text-lg font-semibold text-gray-900">Versão do Sistema</h3>
        </div>
        <Button 
          onClick={handleStartUpdate} 
          disabled={showUpdateModal}
          variant="secondary" 
          className="py-1! px-3!"
          title="Atualizar Sistema"
        >
          <Download className={`w-4 h-4 ${showUpdateModal ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-600 mb-1">Versão Instalada</p>
          <p className="text-2xl font-bold text-gray-900">{updateInfo.currentVersion}</p>
        </div>

        {updateInfo.updateAvailable && (
          <>
            <div className="border-t border-gray-200 pt-3">
              <p className="text-sm text-gray-600 mb-1">Nova Versão Disponível</p>
              <p className="text-2xl font-bold text-orange-600">{updateInfo.remoteVersion}</p>
            </div>

            {updateInfo.changelog && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-orange-900 mb-2">Novidades:</p>
                <pre className="text-sm text-orange-800 whitespace-pre-wrap font-mono">
                  {updateInfo.changelog}
                </pre>
              </div>
            )}

            {updateInfo.releaseDate && (
              <p className="text-xs text-gray-500">
                Lançado em: {new Date(updateInfo.releaseDate).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            )}
          </>
        )}

        {!updateInfo.updateAvailable && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800 font-medium">
              ✓ Seu sistema está atualizado!
            </p>
          </div>
        )}
      </div>

      {showUpdateModal && (
        <UpdatingModal
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
        />
      )}
    </div>
  )
}
