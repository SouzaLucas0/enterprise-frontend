'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setLeaving(true)
    }, 400)
    const hideTimer = setTimeout(() => {
      setVisible(false)
    }, 600)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  if (!visible) return null

  return (
    <>
      <div
        className={`ml-[15vw] fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-500
        ${leaving ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <div className={`logo-wrapper ${leaving ? 'logo-leave' : ''}`}>
          <div className="pulse-ring" />
          <Image
            src="/logo.png"
            alt="Logo da CEConect"
            width={80}
            height={80}
            priority
          />
        </div>
      </div>

      <style jsx global>{`
        .logo-wrapper {
          position: relative;
          animation: float 2s ease-in-out infinite;
        }

        .pulse-ring {
          position: absolute;
          inset: -20px;
          border-radius: 9999px;
          border: 2px solid rgba(0, 0, 0, 0.15);
          animation: pulse 1.5s ease-out infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(0.8);
            opacity: 0.6;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        /* animação final de saída */
        .logo-leave {
          animation: exit 0.5s ease-in forwards;
        }

        @keyframes exit {
          to {
            transform: translate(-120px, -80px) scale(0.4);
            opacity: 0;
          }
        }
      `}</style>
    </>
  )
}
