import fs from 'fs'
import ini from 'ini'
import { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest } from 'next/server'
import path from 'path'

export async function POST(req: NextRequest) {
	try {
		const configs = await req.json()
		const iniString = ini.stringify(configs)
		const pathFile = path.join(process.cwd(), 'config.ini')
		fs.writeFileSync(pathFile, iniString, 'utf-8')

		return new Response(JSON.stringify({ status: 'ok' }), { status: 200 })
	} catch (err: any) {
		console.error(err)
		return new Response(JSON.stringify({ status: 'erro', message: err.message }), { status: 500 })
	}
}
export async function GET() {
	try {
		const pathFile = path.join(process.cwd(), 'config.ini')
		if (!fs.existsSync(pathFile)) {
			return new Response(
				JSON.stringify({
					status: 'erro',
					message: 'Config file not found',
				}),
				{ status: 404 },
			)
		}
		const iniString = fs.readFileSync(pathFile, 'utf-8')
		const configs = ini.parse(iniString)
		return new Response(JSON.stringify(configs), { status: 200 })
	} catch (err: any) {
		console.error(err)
		return new Response(JSON.stringify({ status: 'erro', message: err.message }), { status: 500 })
	}
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

	if (req.method === 'OPTIONS') {
		res.status(200).end()
		return
	}

	res.status(200).json({ config: 'ok' })
}
