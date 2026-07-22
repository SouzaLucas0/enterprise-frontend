import { execSync } from 'child_process'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	let serviceName = 'CEConnectApi'

	try {
		const contentType = request.headers.get('content-type')
		if (contentType?.includes('application/json')) {
			try {
				const body = await request.json()
				serviceName = body.serviceName || serviceName
			} catch (e) {}
		}

		execSync(`net start "${serviceName}"`, { encoding: 'utf-8' })

		return NextResponse.json({
			success: true,
			message: `Serviço ${serviceName} iniciado com sucesso`,
		})
	} catch (error: any) {
		const errorMsg = error.message.toLowerCase()

		if (errorMsg.includes('já foi iniciado') || errorMsg.includes('already started') || errorMsg.includes('3735')) {
			return NextResponse.json({
				success: true,
				message: `Serviço ${serviceName} já estava em execução`,
			})
		}

		return NextResponse.json({ success: false, message: error.message }, { status: 500 })
	}
}
