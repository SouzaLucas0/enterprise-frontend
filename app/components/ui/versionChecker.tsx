'use client'

import { checkUpdate } from "@/service/versionService"
import { useEffect, useRef } from "react"

interface VersionCheckerProps {
  onUpdateAvailable: () => void
  onStartUpdate: () => Promise<void>
}

export function VersionChecker({ onUpdateAvailable, onStartUpdate }: VersionCheckerProps) {
  const hasChecked = useRef(false)

  useEffect(() => {
    if (hasChecked.current) return

    const checkAndUpdate = async () => {
      try {
        const updateInfo = await checkUpdate()
        if (updateInfo?.updateAvailable) {
          hasChecked.current = true
          onUpdateAvailable()
          await onStartUpdate()
        }
      } catch (error) {
        console.error('Erro ao verificar atualização:', error)
      }
    }

    checkAndUpdate()
  }, [onUpdateAvailable, onStartUpdate])

  return null
}
