'use client'

import { ApiParamasType, ParamsType } from "@/@types/paramsType"
import { createApiConfig, createDbConfig, createPathsConfig, getApiConfig, getApiKey, getDbConfig, getPathsConfig, startCEConnectService, stopCEConnectService, testKey, validateKey } from "@/lib/paramsService"
import { Check, Database, Folders, Power, Save, Settings, Unplug } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { testApiConnection } from "../utils/testApiConnection"
import { testFirebirdApi } from "../utils/testFirebirdConnection"
import { Button } from "./ui/button"
import { Container } from "./ui/container"
import { Input } from "./ui/input"
import LoadingScreen from "./ui/loading"
import { PageSubTitle } from "./ui/pageSubtitle"
import { PageTitle } from "./ui/pageTitle"
import { PasswordModal } from "./ui/passwordModal"
import { VersionCard } from "./ui/versionCard"

export function SettingsPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [ipServer, setIpServer] = useState('')
    const [portServer, setPortServer] = useState('')
    const [dbIp, setDbIp] = useState('')
    const [dbPort, setDbPort] = useState('')
    const [dbPath, setDbPath] = useState('')
    const [dbUser, setDbUser] = useState('')
    const [dbPassword, setDbPassword] = useState('')
    const [bolPath, setBolPath] = useState('')
    const [nfPath, setNfPath] = useState('')
    const [apiKey, setKeyApi] = useState('')
    const [isValidKey, setIsValidKey] = useState<boolean>(true)
    const [isServiceLoading, setIsServiceLoading] = useState(false)

    useEffect(() => {
        const auth = sessionStorage.getItem('settingsAuth')
        if (auth === 'true') {
            setIsAuthenticated(true)
        }
    }, [])

    const getInitialConfigs = async () => {
        let configs = await getApiConfig()
        setIpServer(configs.apiIp)
        setPortServer(configs.apiPort)
        setKeyApi(await getApiKey() || '')

        configs = await getDbConfig()
        setDbIp(configs.dbIp)
        setDbPort(configs.dbPort)
        setDbPath(configs.dbPath)
        setDbUser(configs.dbUser)
        setDbPassword(configs.dbPassword)

        configs = await getPathsConfig()
        setBolPath(configs.bolPath)
        setNfPath(configs.nfPath)

        await validateKey(setIsValidKey)
    }

    useEffect(() => {
        getInitialConfigs()
    }, [])

    const handleSaveApiConfigs = async (e: React.FormEvent) => {
        e.preventDefault()

        const checkFields = checkEmptyApiFilds()
        if (!checkFields) return

        const apiParams: ApiParamasType = {
            apiIp: ipServer,
            apiPort: portServer,
            apiKey: apiKey
        }

        const response = await createApiConfig(apiParams)

        if (response.error) {
            toast.error(`Erro ao salvar: ${response}!`)
        } else {
            toast.success("Salvo com sucesso!");
            await validateKey(setIsValidKey)
        }
    }

    const handleCheckApiKey = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        await testKey(apiKey, setIsValidKey)
    }

    const handleSaveDbConfigs = async (e: React.FormEvent) => {
        e.preventDefault()

        const checkFields = checkEmptyDbFilds()
        if (!checkFields) return

        const configs: ParamsType = {
            dbIp: dbIp,
            dbPort: dbPort,
            dbPath: dbPath,
            dbUser: dbUser,
            dbPassword: dbPassword,
            nfPath: nfPath,
            bolPath: bolPath,
            apiKey: apiKey
        }

        const response = await createDbConfig(configs)

        if (response.erro) {
            toast.error(`Erro ao salvar: ${response}!`)
        } else {
            toast.success("Salvo com sucesso!");
        }
    }

    const handleSavePathsConfigs = async (e: React.FormEvent) => {
        e.preventDefault()

        const checkFields = checkEmptyPathsFilds()
        if (!checkFields) return

        const configs: ParamsType = {
            dbIp: dbIp,
            dbPort: dbPort,
            dbPath: dbPath,
            dbUser: dbUser,
            dbPassword: dbPassword,
            nfPath: nfPath,
            bolPath: bolPath,
            apiKey: apiKey
        }

        const response = await createPathsConfig(configs)

        if (response.erro) {
            toast.error(`Erro ao salvar: ${response}!`)
        } else {
            toast.success("Salvo com sucesso!");
        }
    }

    const handleCheckApiConection = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const res = await testApiConnection(ipServer, portServer)

        if (!res.success) {
            toast.error(res.message)
        } else {
            toast.success(res.message)
        }
    }

    const handleCheckFirebirdConnection = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        const checkFields = checkEmptyDbFilds()
        if (!checkFields) return

        const res = await testFirebirdApi(dbIp, dbPort, dbPath, dbUser, dbPassword)

        if (!res.success) {
            toast.error(res.message)
        } else {
            toast.success(res.message)
        }
    }

    const handleStopService = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setIsServiceLoading(true)
        try {
            await stopCEConnectService()
        } catch (error) {
            console.error('Erro ao parar serviço:', error)
        } finally {
            setIsServiceLoading(false)
        }
    }

    const handleStartService = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setIsServiceLoading(true)
        try {
            await startCEConnectService()
        } catch (error) {
            console.error('Erro ao iniciar serviço:', error)
        } finally {
            setIsServiceLoading(false)
        }
    }

    const handlePasswordCorrect = () => {
        sessionStorage.setItem('settingsAuth', 'true')
        setIsAuthenticated(true)
    }

    if (!isAuthenticated) {
        return <PasswordModal isOpen={true} onPasswordCorrect={handlePasswordCorrect} />
    }

    return (
        <>
            <LoadingScreen />
            <div className="p-6">
                <div className="text-black max-w-[1366px] m-auto">
                    <form className="flex flex-col justify-center items-start">
                        <PageTitle
                            Icon={Settings}
                            title={"Configurações"}
                            subtitle={"Configura as integrações e preferências do sistema"}
                        />
                        <Container>
                            <PageSubTitle
                                description={"Configurações da API"}
                                Icon={Unplug}
                            />
                            <div className="grid grid-cols-2 gap-8">
                                <Input
                                    type="text"
                                    placeholder="127.0.0.1"
                                    label="Servidor:"
                                    value={ipServer}
                                    onChange={(e) => setIpServer(e.target.value)}
                                />
                                <Input
                                    type="text"
                                    placeholder="4000"
                                    label="Porta:"
                                    value={portServer}
                                    onChange={(e) => setPortServer(e.target.value)}
                                />
                                <Input
                                    type="text"
                                    placeholder="b9b37ef"
                                    label="Licença:"
                                    value={apiKey}
                                    onChange={(e) => setKeyApi(e.target.value)}
                                />
                                <div className="h-full grid items-end">
                                    <span className={`${isValidKey ? 'hidden' : ''} text-red-500 font-semibold text-xl mb-1`}>
                                        Chave inválida!
                                    </span>
                                </div>
                            </div>
                            <div className="space-x-2 flex">
                                <Button
                                    id="2"
                                    type="submit"
                                    onClick={handleSaveApiConfigs}
                                    variant="primary"
                                >
                                    <Save className="h-5 w-5" />
                                    <span>Salvar</span>
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleCheckApiConection}
                                    variant="secondary"
                                >
                                    <Check className="h-5 w-5" />
                                    <span>Testar Conexão</span>
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleCheckApiKey}
                                    variant="secondary"
                                >
                                    <Check className="h-5 w-5" />
                                    <span>Testar licença</span>
                                </Button>
                            </div>
                        </Container>
                        <Container>
                            <PageSubTitle
                                description={"Configuração do Banco de Dados"}
                                Icon={Database}
                            />
                            <div className="grid grid-cols-2 gap-8 text-gray-600">
                                <Input
                                    type="text"
                                    placeholder="127.0.0.1"
                                    label="Servidor:"
                                    value={dbIp}
                                    onChange={(e) => setDbIp(e.target.value)}
                                />
                                <Input
                                    type="text"
                                    placeholder="3050"
                                    label="Porta:"
                                    value={dbPort}
                                    onChange={(e) => setDbPort(e.target.value)}
                                />
                                <Input
                                    type="text"
                                    placeholder="C:/ecosis/dados/ECODADOS.ECO"
                                    label="Caminho do Banco:"
                                    value={dbPath}
                                    onChange={(e) => setDbPath(e.target.value)}
                                />
                                <Input
                                    type="text"
                                    placeholder="SYSDBA"
                                    label="Usuário:"
                                    value={dbUser}
                                    onChange={(e) => setDbUser(e.target.value)}
                                />
                                <Input
                                    type="text"
                                    placeholder="masterkey"
                                    label="Senha:"
                                    value={dbPassword}
                                    onChange={(e) => setDbPassword(e.target.value)}
                                />
                            </div>
                            <div className="space-x-2 flex">
                                <Button
                                    id="2"
                                    type="submit"
                                    onClick={handleSaveDbConfigs}
                                    variant="primary"
                                >
                                    <Save className="h-5 w-5" />
                                    <span>Salvar</span>
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleCheckFirebirdConnection}
                                    variant="secondary"
                                >
                                    <Check className="h-5 w-5" />
                                    <span>Testar Conexão</span>
                                </Button>
                            </div>
                        </Container>
                        <Container>
                            <PageSubTitle
                                description={"Configurações de pastas"}
                                Icon={Folders}
                            />
                            <div className="flex flex-col gap-8">
                                <Input
                                    type="text"
                                    placeholder="C:/ecosis"
                                    label="Pasta de Boletos:"
                                    value={bolPath}
                                    onChange={(e) => setBolPath(e.target.value)}
                                />
                                <Input
                                    type="text"
                                    placeholder="C:/ecosis"
                                    label="Pasta de Nfs:"
                                    value={nfPath}
                                    onChange={(e) => setNfPath(e.target.value)}
                                />
                            </div>
                            <div className="space-x-2">
                                <Button
                                    id="2"
                                    className="cursor-pointer bg-blue-700 w-fit py-1 px-8 rounded-md text-white hover:bg-blue-800"
                                    type="submit"
                                    onClick={handleSavePathsConfigs}
                                    variant="primary"
                                >
                                    <Save className="h-5 w-5" />
                                    <span>Salvar</span>
                                </Button>
                            </div>
                        </Container>
                        <Container>
                            <VersionCard />
                        </Container>
                        <Container>
                            <PageSubTitle
                                description={"Controle do Serviço"}
                                Icon={Power}
                            />
                            <div className="flex gap-4">
                                <Button
                                    className="cursor-pointer bg-red-600 w-fit py-1 px-8 rounded-md text-white hover:bg-red-700 disabled:bg-gray-400"
                                    onClick={handleStopService}
                                    disabled={isServiceLoading}
                                    type="button"
                                    variant="primary"
                                >
                                    <Power className="h-5 w-5" />
                                    <span>{isServiceLoading ? 'Processando...' : 'Parar Serviço'}</span>
                                </Button>
                                <Button
                                    className="cursor-pointer bg-green-600 w-fit py-1 px-8 rounded-md text-white hover:bg-green-700 disabled:bg-gray-400"
                                    onClick={handleStartService}
                                    disabled={isServiceLoading}
                                    type="button"
                                    variant="primary"
                                >
                                    <Power className="h-5 w-5" />
                                    <span>{isServiceLoading ? 'Processando...' : 'Iniciar Serviço'}</span>
                                </Button>
                            </div>
                        </Container>
                    </form>
                </div>
            </div>
            <div className={`absolute top-0 left-0 w-[15vw] h-full bg-gray-800/90 ${isValidKey ? 'hidden' : ''}`}>
            </div>
        </>
    )

    function checkEmptyDbFilds() {
        if (
            dbIp === '' ||
            dbPort === '' ||
            dbPath === '' ||
            dbUser === '' ||
            dbPassword === ''

        ) {
            toast.error('Todos os campos devem ser preenchidos!')
            return
        } else {
            return true
        }
    }

    function checkEmptyPathsFilds() {
        if (nfPath === '' || bolPath === '') {
            toast.error('Todos os campos devem ser preenchidos!')
            return
        } else {
            return true
        }
    }

    function checkEmptyApiFilds() {
        if (ipServer === '' || portServer === '') {
            toast.error('Todos os campos devem ser preenchidos!')
            return
        } else {
            return true
        }
    }
}