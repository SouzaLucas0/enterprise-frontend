import { getBaseUrl } from '@/lib/getBaseUrl';

export type VersionInfo = {
  version: string;
}

export type UpdateCheckInfo = {
  currentVersion: string;
  remoteVersion: string;
  updateAvailable: boolean;
  downloadUrl?: string;
  releaseDate?: string;
  changelog?: string;
}

export async function getVersion(): Promise<VersionInfo | null> {
  try {
    const baseUrl = await getBaseUrl();
    const response = await fetch(`${baseUrl}/params/version?t=${Date.now()}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      console.error('Erro ao buscar versão:', response.status);
      return null;
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar versão:', error);
    return null;
  }
}

export async function checkUpdate(): Promise<UpdateCheckInfo | null> {
  try {
    const baseUrl = await getBaseUrl();
    const response = await fetch(`${baseUrl}/params/check-update?t=${Date.now()}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      console.error('Erro ao verificar atualização:', response.status);
      return null;
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao verificar atualização:', error);
    return null;
  }
}
