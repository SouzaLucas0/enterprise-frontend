import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	output: 'standalone',
	outputFileTracingExcludes: {
		'*': [
			'C:/Enterprise/**',
			'C:\\Enterprise\\**',
		],
	},
}

export default nextConfig
