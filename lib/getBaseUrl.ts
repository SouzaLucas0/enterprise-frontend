export const GetConfigService = async () => {  
  const response = await fetch('/api/config', {
    method: 'GET',
    cache: 'no-store',
  })
  return response.json()
}

export const getBaseUrl = async () => {
  const configs = await GetConfigService()
  return `http://${configs.apiIp}:${configs.apiPort}`
}