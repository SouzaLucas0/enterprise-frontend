'use client'

import { Lock } from 'lucide-react'
import { useState } from 'react'

interface PasswordModalProps {
	isOpen: boolean
	onPasswordCorrect: () => void
}

const CORRECT_PASSWORD = 'T9@vL3#qZ7!mR2$k'

export function PasswordModal({ isOpen, onPasswordCorrect }: PasswordModalProps) {
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		if (password === CORRECT_PASSWORD) {
			setPassword('')
			setError('')
			onPasswordCorrect()
		} else {
			setError('Senha incorreta!')
			setPassword('')
		}
	}

	const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		e.stopPropagation()
		window.location.href = '/'
	}

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-8 w-96 shadow-2xl">
				<div className="flex items-center justify-center mb-6">
					<Lock className="h-8 w-8 text-blue-600 mr-2" />
					<h2 className="text-2xl font-bold text-gray-800">Acesso Restrito</h2>
				</div>

				<p className="text-gray-600 text-center mb-6">
					Digite a senha para acessar as configurações
				</p>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Digite a senha"
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
							autoFocus
						/>
					</div>

					{error && (
						<div className="text-red-500 text-sm text-center font-semibold">
							{error}
						</div>
					)}

					<div className="flex gap-3">
						<button
							type="button"
							onClick={handleCancel}
							className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
						>
							Cancelar
						</button>
						<button
							type="submit"
							className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
						>
							Acessar
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
