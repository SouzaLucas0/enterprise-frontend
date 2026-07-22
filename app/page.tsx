'use client'

import { useSocket } from "@/hooks/useSokect"
import {
  Barcode,
  Cake,
  LayoutDashboard,
  MessageCircle,
  Settings,
  SquarePen,
  StickyNote,
  Tags,
  Users,
  Wrench
} from "lucide-react"
import Image from 'next/image'
import { useEffect, useRef, useState } from "react"
import { toast } from "react-toastify"
import { BankSlipPage } from "./components/bankSlip"
import { BirthdayCelebrantsPage } from "./components/birthdayCelebrants"
import { ChargesPage } from "./components/chargers"
import CustomerList from "./components/customerList"
import { DashboardPage } from "./components/dashboard"
import { NfePage } from "./components/nfe"
import { SalePage } from "./components/sale"
import { WorkOrderPage } from "./components/workOrder"
import { SettingsPage } from "./components/settings"
import { UpdatingModal } from "./components/ui/updatingModal"
import { VersionChecker } from "./components/ui/versionChecker"
import WhatsappPage from "./components/whatsapp"

export default function Home() {
  const [activeComponent, setActiveComponent] = useState('dashboard')
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const { alerts, jobs } = useSocket()
  const lastAlertIndex = useRef(0)

  useEffect(() => {
    if (!alerts || alerts.length === 0) return

    const newAlerts = alerts.slice(lastAlertIndex.current)
    newAlerts.forEach((alert) => {
      switch (alert.type) {
        case "success":
          if (!showUpdateModal) toast.success(alert.message)
          break
        case "error":
          if (!showUpdateModal) toast.error(alert.message)
          break
        case "info":
          if (!showUpdateModal) toast.info(alert.message)
          break
        case "update":
          setShowUpdateModal(true)
          break
      }
    })
    lastAlertIndex.current = alerts.length
  }, [alerts, showUpdateModal])

  const handleStartUpdate = async () => {
    try {
      const response = await fetch('/api/update', {
        method: 'POST',
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.details || error.error)
      }
    } catch (error) {
      toast.error(`Erro na atualização: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    }
  }

  const renderComponent = () => {
    switch (activeComponent) {
      case 'dashboard':
        return <DashboardPage jobs={jobs} />
      case 'configs':
        return <SettingsPage />
      case 'whatsapp':
        return <WhatsappPage />
      case 'birthday':
        return <BirthdayCelebrantsPage />
      case 'chargers':
        return <ChargesPage />
      case 'bankSlip':
        return <BankSlipPage />
      case 'nfe':
        return <NfePage />
      case 'sale':
        return <SalePage />
      case 'customer':
        return <CustomerList />
      case 'workOrder':
        return <WorkOrderPage />
    }
  }

  return (
    <>
      <main className="flex min-h-screen bg-gray-100 relative">
        <aside className="fixed w-[15vw] top-0 left-0 h-full p-8 bg-[#0F1E2E] text-white flex flex-col justify-between shadow-[0px_0px_10px_0px_rgba(0,0,0,0.15)] overflow-y-auto">
          <div>
            <div className="pb-6 flex items-start justify-start">
              <Image
                src={"/logo.png"}
                alt={"Logo da CEConect"}
                width={40}
                height={40}
              />
            </div>
            <div className="mb-8">
              <h1 className="text-xl font-bold tracking-wide">
                CE Connect
              </h1>
              <p className="text-xs text-gray-300 mt-1">
                Plataforma de Integrações
              </p>
              <div className="mt-4 h-px w-full bg-white/20" />
            </div>
            <div className="flex flex-col items-start gap-5 mt-6">

              <button onClick={() => setActiveComponent('dashboard')}>
                <div className={`flex items-center gap-3 hover:text-gray-300 transition delay-100 ${activeComponent === 'dashboard' ? 'text-green-300 font-semibold hover:text-green-500' : ''}`}>
                  <LayoutDashboard />
                  <p className="mt-1">Dashboard</p>
                </div>
              </button>

              <button onClick={() => setActiveComponent('whatsapp')}>
                <div className={`flex items-center gap-3 hover:text-gray-300 transition delay-100 ${activeComponent === 'whatsapp' ? 'text-green-300 font-semibold hover:text-green-500' : ''}`}>
                  <MessageCircle />
                  <p className="mt-1">WhatsApp</p>
                </div>
              </button>

              <button onClick={() => setActiveComponent('birthday')}>
                <div className={`flex items-center gap-3 hover:text-gray-300 transition delay-100 ${activeComponent === 'birthday' ? 'text-green-300 font-semibold hover:text-green-500' : ''}`}>
                  <Cake />
                  <p className="mt-1">Aniversariantes</p>
                </div>
              </button>

              <button onClick={() => setActiveComponent('chargers')}>
                <div className={`flex items-center gap-3 hover:text-gray-300 transition delay-100 ${activeComponent === 'chargers' ? 'text-green-300 font-semibold hover:text-green-500' : ''}`}>
                  <SquarePen />
                  <p className="mt-1">Cobrança</p>
                </div>
              </button>

              <button onClick={() => setActiveComponent('bankSlip')}>
                <div className={`flex items-center gap-3 hover:text-gray-300 transition delay-100 ${activeComponent === 'bankSlip' ? 'text-green-300 font-semibold hover:text-green-500' : ''}`}>
                  <Barcode />
                  <p className="mt-1">Boletos</p>
                </div>
              </button>

              <button onClick={() => setActiveComponent('nfe')}>
                <div className={`flex items-center gap-3 hover:text-gray-300 transition delay-100 ${activeComponent === 'nfe' ? 'text-green-300 font-semibold hover:text-green-500' : ''}`}>
                  <StickyNote />
                  <p className="mt-1">Nota Fiscal</p>
                </div>
              </button>

              <button onClick={() => setActiveComponent('sale')}>
                <div className={`flex items-center gap-3 hover:text-gray-300 transition delay-100 ${activeComponent === 'sale' ? 'text-green-300 font-semibold hover:text-green-500' : ''}`}>
                  <Tags />
                  <p className="mt-1">Vendas</p>
                </div>
              </button>

              <button onClick={() => setActiveComponent('workOrder')}>
                <div className={`flex items-center gap-3 hover:text-gray-300 transition delay-100 ${activeComponent === 'workOrder' ? 'text-green-300 font-semibold hover:text-green-500' : ''}`}>
                  <Wrench />
                  <p className="mt-1">O. S.</p>
                </div>
              </button>

              <button onClick={() => setActiveComponent('customer')}>
                <div className={`flex items-center gap-3 hover:text-gray-300 transition delay-100 ${activeComponent === 'customer' ? 'text-green-300 font-semibold hover:text-green-500' : ''}`}>
                  <Users />
                  <p className="mt-1">Clientes</p>
                </div>
              </button>

            </div>
          </div>
          <div className="flex flex-col gap-3 mt-8">
            <button onClick={() => setActiveComponent('configs')}>
              <Settings className={`w-8 h-8 hover:text-gray-300 transition delay-100 ${activeComponent === 'configs' ? 'text-green-300 font-semibold hover:text-green-500' : ''}`} />
            </button>
          </div>
        </aside>
        <div className="ml-[15vw] w-full">
          {renderComponent()}
        </div>
      </main>

      <VersionChecker
        onUpdateAvailable={() => setShowUpdateModal(true)}
        onStartUpdate={handleStartUpdate}
      />

      {showUpdateModal && (
        <UpdatingModal
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
        />
      )}
    </>
  )
}
