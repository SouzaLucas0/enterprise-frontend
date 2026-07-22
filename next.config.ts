import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	output: 'standalone',
	outputFileTracingExcludes: {
		'*': [
			'C:/CeConnect/**',
			'C:\\CeConnect\\**',
		],
	},
}

export default nextConfig
