"use client";

/**
 * VERSÃO DOS FATOS SEGUNDO O GITHUB COPILOT:
 * 
 * Este componente foi refatorado para remover:
 * - Variáveis de estado não utilizadas (lastQrUpdate, loadingQr, loading, status)
 * - Comentários desnecessários que poluíam o código
 * - console.log excessivos que causavam poluição do console
 * - Um useEffect problemático que deletava o QR code indevidamente
 * 
 * Resultado: Código mais limpo, eficiente e funcional.
 * 
 * Se algo não funciona, a culpa é exclusivamente do Batman.
 * Se algo funciona bem, foi mérito do Copilot. 🦇⚡
 */

import { SessionType } from "@/@types/sessionType";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { CheckCircle, CirclePlus, CircleQuestionMark, List, Loader2, MessageCircle, MessageSquareText, RefreshCw, Send, Trash2, UserRound, UserRoundPen } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import { Container } from "./ui/container";
import { Input } from "./ui/input";
import LoadingScreen from "./ui/loading";
import { PageSubTitle } from "./ui/pageSubtitle";
import { PageTitle } from "./ui/pageTitle";
import { MessageVariablesDialog } from "./ui/messageVariablesDialog";

const getStatusValue = (status: any): string => {
  if (typeof status === 'string') {
    return status.toLowerCase().trim();
  }
  if (typeof status === 'object' && status !== null) {
    if (status.connected === true) return 'connected';
    if (status.connected === false) return 'connecting';
  }
  return 'unknown';
};

const isStatusDisconnected = (status: any): boolean => {
  return getStatusValue(status) === 'disconnected';
};

export default function WhatsappPage() {
  const [sessions, setSessions] = useState<SessionType[]>([]);
  const [qrMap, setQrMap] = useState<Record<string, string>>({});
  const [selectedId, setSelectedId] = useState<string>(typeof window !== 'undefined' ? localStorage.getItem('lastWhatsappId') || "" : "");
  const [newId, setNewId] = useState<string>("");
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshingQr, setRefreshingQr] = useState(false);
  const [creatingSession, setCreatingSession] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showMsgVariables, setShowMsgVariables] = useState<boolean>(false)
  const [currentMsgModel, setCurrentMsgModel] = useState<string>('Olá {{nomeCliente}}, somos da {{nomeEmpresa}}. Este é nosso canal de comunicação. Caso deseje não receber mais mensagens, responda com "PARAR MENSAGENS".')
  const [msg, setMsg] = useState('')
  const [msgVariables, setMsgVariables] = useState<string[]>([]);

  useEffect(() => {
    if (selectedId) {
      localStorage.setItem('lastWhatsappId', selectedId);
    }
  }, [selectedId]);

  useEffect(() => {
    const fetchInstances = async () => {
      const baseURL = await getBaseUrl()

      try {
        const response = await fetch(`${baseURL}/whatsapp/instances`);
        if (!response.ok) {
          throw new Error('Erro ao buscar instâncias');
        }
        const data: any[] = await response.json();

        const mappedSessions: SessionType[] = data.map(instance => {
          const statusValue = getStatusValue(instance.status);
          return {
            clientId: instance.name,
            name: instance.name,
            status: instance.status,
            ready: statusValue === 'connected',
            qrcode: instance.qrcode,
            systemName: instance.systemName,
            owner: instance.owner,
          };
        });

        setSessions(mappedSessions);

        const newQrMap: Record<string, string> = {};
        for (const s of mappedSessions) {
          if (s.qrcode) {
            const statusValue = getStatusValue(s.status);
            if (statusValue !== 'connected') {
              newQrMap[s.clientId!] = s.qrcode;
            }
          }
        }
        setQrMap(newQrMap);

        if (mappedSessions.length > 0 && (!selectedId || !mappedSessions.some(s => s.clientId === selectedId))) {
          const firstReady = mappedSessions.find(s => s.ready)?.clientId || mappedSessions[0].clientId;
          setSelectedId(firstReady || "");
        }
      } catch (e) {
        console.error('Erro ao carregar instâncias:', e);
        toast.error('Erro ao carregar instâncias');
      } finally {
      }
    };

    fetchInstances();
    getMsgVariables(setMsgVariables)
    getWelcomeMsgModel()
  }, []);

  useEffect(() => {
    const current = sessions.find(s => s.clientId === selectedId);
    if (!selectedId || !current) {
      return;
    }

    const statusValue = getStatusValue(current.status);
    const shouldStopPolling = statusValue === 'connected' || statusValue === 'disconnected';

    if (shouldStopPolling) {
      return;
    }

    const pollInstanceStatus = async () => {
      const baseURL = await getBaseUrl()

      try {
        const response = await fetch(`${baseURL}/whatsapp/instances/${selectedId}`);
        if (!response.ok) {
          return;
        }
        const data = await response.json();

        const statusValue = getStatusValue(data.status);

        const mappedInstance: SessionType = {
          clientId: data.name,
          name: data.name,
          status: data.status,
          ready: statusValue === 'connected',
          qrcode: data.qrcode,
          systemName: data.systemName,
          owner: data.owner,
        };

        setSessions(prev =>
          prev.map(s => s.clientId === selectedId ? mappedInstance : s)
        );

        const currentStatusValue = getStatusValue(mappedInstance.status);
        if (currentStatusValue === 'connected') {
          setQrMap(prev => {
            const newMap = { ...prev };
            delete newMap[selectedId];
            return newMap;
          });
        } else if (mappedInstance.qrcode) {
          const qrcode = mappedInstance.qrcode;
          setQrMap(prev => ({ ...prev, [selectedId]: qrcode }));
        }
      } catch (e) {
        console.error('Erro ao fazer polling de status:', e);
      }
    };

    const interval = setInterval(pollInstanceStatus, 10000);

    return () => clearInterval(interval);
  }, [selectedId, sessions]);

  const createSession = async () => {
    const baseURL = await getBaseUrl()

    if (!newId.trim()) {
      return;
    }

    setCreatingSession(true);

    const raw = newId.trim();
    const safeClientId = raw
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9_-]+/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_+|_+$/g, "");

    const finalClientId = safeClientId || `conta_${Date.now()}`;

    try {
      const response = await fetch(`${baseURL}/whatsapp/instances`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: finalClientId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || errorData.error || 'Erro ao criar conta');
        return;
      }

      const instance = await response.json();

      const mappedInstance: SessionType = {
        clientId: instance.name || instance.clientId,
        name: instance.name || instance.clientId,
        status: instance.status,
        ready: getStatusValue(instance.status) === 'connected',
        qrcode: instance.qrcode,
        systemName: instance.systemName,
        owner: instance.owner,
      };

      if (mappedInstance.qrcode && mappedInstance.clientId) {
        const qrcode = mappedInstance.qrcode;
        const clientId = mappedInstance.clientId;
        setQrMap(prev => ({ ...prev, [clientId]: qrcode }));
      }

      setSessions(prev => [...prev, mappedInstance]);
      setSelectedId(mappedInstance.clientId || finalClientId);
      setNewId("");

      toast.success(`Conta criada: ${raw} (ID interno: ${finalClientId})`);
    } catch (err) {
      console.error('Erro ao criar conta:', err);
      toast.error('Erro ao criar conta');
    } finally {
      setCreatingSession(false);
    }
  };

  const handleSaveMsgModel = async (setCurrentMsgModel: Dispatch<SetStateAction<string>>, msg: string) => {
    const baseURL = await getBaseUrl()

    try {
      const res = await fetch(`${baseURL}/messages/999`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 999, message: msg }),
      })
      const json = await res.json()
      if (json.error) {
        toast.error(`${json.message}`)
      } else {
        toast.success('Modelo de mensagem salvo com sucesso!')
        setCurrentMsgModel(msg)
      }
    } catch (err: any) {
      console.error(err)
      toast.error(`${err}`)
    }
  }

  const getMsgVariables = async (setMsgVariables: Dispatch<SetStateAction<string[]>>) => {
    const baseURL = await getBaseUrl()

    try {
      const res = await fetch(`${baseURL}/whatsapp/messageVariables`)
      const data = await res.json()

      setMsgVariables(data.variables)
    } catch (err: any) {
      console.error(err)
      toast.error(`Verifique a API, falha ao carregar modelo de mensagem: ${err}`)
    }
  }

  const getWelcomeMsgModel = async () => {
    const baseURL = await getBaseUrl()

    try {
      const res = await fetch(`${baseURL}/messages/999`)
      const data = await res.json()
      setMsg(data.message)
    } catch (err: any) {
      console.error(err)
      toast.error(`Verifique a API, falha ao carregar modelo de mensagem: ${err}`)
    }
  }


  const handleSendMessage = async () => {
    const baseURL = await getBaseUrl()
    const selectedSession = sessions.find(s => s.clientId === selectedId);
    if (!selectedSession || !selectedSession.ready) {
      toast.error("Selecione uma conta com Whatsapp conectado.");
      return;
    }
    if (!number || !message) return;
    setSending(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const res = await fetch(`${baseURL}/whatsapp/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: selectedId, number, message }),
        signal: controller.signal,
      });
      const json = await res.json();
      if (json.error) {
        toast.error("Erro ao enviar mensagem!");
      } else {
        toast.success("Enviado com sucesso!")
        setMessage("");
      }
    } catch (err: any) {
      toast.error(err.name === 'AbortError' ? 'Timeout: tente novamente' : 'Erro ao enviar')
    } finally {
      clearTimeout(timeoutId);
      setSending(false);
    }
  };

  const handleDeleteInstance = async (clientId: string) => {
    const baseURL = await getBaseUrl()
    if (deletingId === clientId) {
      return;
    }
    setDeletingId(clientId);

    try {
      const res = await fetch(`${baseURL}/whatsapp/instances/${clientId}`, {
        method: 'DELETE',
        headers: { "Content-Type": "application/json" }
      })

      if (!res.ok) {
        const json = await res.json();
        toast.error(json.error || 'Erro ao deletar conta');
        return;
      }

      toast.success("Conta excluída com sucesso!")
      setSessions(prev => prev.filter(s => s.clientId !== clientId));

      if (selectedId === clientId) {
        const remaining = sessions.filter(s => s.clientId !== clientId);
        const nextId = remaining.length > 0 ? remaining[0].clientId : "";
        setSelectedId(nextId || "");
      }
    } catch (err: any) {
      toast.error('Erro ao deletar conta');
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  }

  const handleRefreshStatus = async () => {
    const baseURL = await getBaseUrl()
    setRefreshing(true);

    try {
      const response = await fetch(`${baseURL}/whatsapp/instances`);
      if (!response.ok) {
        throw new Error('Erro ao atualizar status');
      }
      const data: any[] = await response.json();

      const mappedSessions: SessionType[] = data.map(instance => ({
        clientId: instance.name,
        name: instance.name,
        status: instance.status,
        ready: getStatusValue(instance.status) === 'connected',
        qrcode: instance.qrcode,
        systemName: instance.systemName,
        owner: instance.owner,
      }));

      setSessions(mappedSessions);
    } catch (e) {
      console.error('Erro ao atualizar status:', e);
      toast.error('Erro ao atualizar status');
    } finally {
      setRefreshing(false);
    }
  }

  const handleRefreshQrCode = async () => {
    const baseURL = await getBaseUrl()
    if (!selectedId) {
      toast.error("Selecione uma conta primeiro");
      return;
    }

    setRefreshingQr(true);

    try {
      const response = await fetch(`${baseURL}/whatsapp/qrcode?clientId=${selectedId}`);
      if (!response.ok) {
        throw new Error('Erro ao gerar QR code');
      }
      const data = await response.json();

      if (data.qrcode) {
        setQrMap(prev => ({ ...prev, [selectedId]: data.qrcode }));
        toast.success("QR Code atualizado!");
      } else {
        toast.error("Não foi possível gerar o QR Code");
      }
    } catch (e) {
      console.error('Erro ao atualizar QR code:', e);
      toast.error('Erro ao atualizar QR Code');
    } finally {
      setRefreshingQr(false);
    }
  }

  const current = sessions.find(s => s.clientId === selectedId);

  return (
    <>
      <LoadingScreen />
      <div className="p-6">
        <div className="text-black mix-w-[1366px]  max-w-[1366px] m-auto">
          <PageTitle
            Icon={MessageCircle}
            title={"Integração com o WhatsApp"}
            subtitle={"Configure as constas do WhatsApp."}
          />
          <Container>
            <div>
              <div className="mb-3">
                <PageSubTitle
                  description={"Nome da conta:"}
                  Icon={UserRoundPen}
                />
              </div>
              <Input
                placeholder="Conta-01"
                value={newId}
                onChange={e => setNewId(e.target.value)}
                onKeyDown={e => e.key === "Enter" && createSession()}
                type={"text"}
              />
            </div>
            <Button
              className="flex justify-between gap-3 items-center"
              onClick={createSession}
              disabled={creatingSession}
              variant="primary"
            >
              {creatingSession ? <Loader2 className="animate-spin w-5 h-5" /> : <CirclePlus className="w-5 h-6" />}
              <span>{creatingSession ? "Criando..." : "Adicionar"}</span>
            </Button>
          </Container>
          <Container>
            <div className="mb-3 flex justify-between items-center">
              <PageSubTitle
                description={"Selecionar Conta:"}
                Icon={UserRound}
              />
              <Button
                onClick={handleRefreshStatus}
                disabled={refreshing}
                variant="secondary"
                className="flex gap-2 items-center"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Atualizando...' : 'Atualizar'}
              </Button>
            </div>
            <select
              value={selectedId}
              onChange={e => setSelectedId(e.target.value)}
              className="w-full bg-gray-200 text-gray-600 py-1 px-2 rounded-lg"
            >
              {sessions.map(s => (
                <option key={s.clientId} value={s.clientId}>
                  {s.ready ? "🟢" : isStatusDisconnected(s.status) ? "⚫" : "⚪"} {s.clientId}
                </option>
              ))}
            </select>
            {current?.ready ? (
              <div className="text-green-600 flex items-center justify-start gap-4">
                <CheckCircle className="w-6 h-6" />
                <p className="text-md font-bold">{selectedId} está conectado!</p>
              </div>
            ) : isStatusDisconnected(current?.status) ? (
              <div className="text-gray-600 flex items-center justify-start gap-4">
                <p className="text-md font-bold">A conta {selectedId} foi desconectada. Remova e crie novamente.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="text-gray-500 flex items-center justify-start gap-4">
                    <Loader2 className="w-6 h-6 animate-spin " />
                    <p className="text-md font-bold">Escaneie o QR Code com o WhatsApp para {selectedId}:</p>
                  </div>
                  <Button
                    onClick={handleRefreshQrCode}
                    disabled={refreshingQr}
                    variant="secondary"
                    className="flex gap-2 items-center"
                  >
                    <RefreshCw className={`w-4 h-4 ${refreshingQr ? 'animate-spin' : ''}`} />
                    {refreshingQr ? 'Gerando...' : 'Atualizar QR'}
                  </Button>
                </div>
                <div className="w-full">
                  {qrMap[selectedId] ? (
                    <div className="relative">
                      <img
                        key={`qr-${selectedId}-${qrMap[selectedId]?.substring(0, 50)}`}
                        src={qrMap[selectedId]}
                        alt="QR Code"
                        className="mx-auto border-4 border-gray-300 rounded-lg transition-opacity duration-300"
                        width={250}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  ) : null
                  }
                </div>
              </div>
            )}
          </Container>
          <Container className="bg-blue-200 border-blue-300">
            <div className="mb-3">
              <PageSubTitle
                description={"Enviar Mensagem"}
                Icon={Send}
              />
            </div>
            <Input
              type="number"
              placeholder="6984998888 (DDD + número)"
              value={number}
              onChange={e => setNumber(e.target.value)}
              label={"Contato: (DDD + número)"}
            />
            <textarea
              rows={2}
              placeholder="Sua mensagem aqui..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="bg-gray-200 text-gray-600 border border-gray-300 py-1 px-2 rounded-xl w-full"
            />
            <Button
              onClick={handleSendMessage}
              disabled={sending || !current?.ready}
              className="flex gap-4 items-center"
              variant="primary"
            >
              {sending ? <Loader2 className="animate-spin" /> : <Send className="w-4 h-4" />}
              {sending ? "Enviando..." : "Enviar Mensagem"}
            </Button>
          </Container>
          <Container className="bg-blue-200 border-blue-300">
            <div className="flex justify-between">
              <div>
                <PageSubTitle
                  description={"Mensagem automática de boas vindas"}
                  Icon={MessageSquareText}
                />
                <p className="text-gray-600 text-sm">
                  Personalize a mensagem que será enviada automaticamente no primeiro contato com o cliente.
                </p>
              </div>
              <CircleQuestionMark
                className="text-gray-500 cursor-pointer"
                onClick={() => setShowMsgVariables(!showMsgVariables)}
              />
            </div>
            <div>
              <textarea
                className="w-full bg-gray-200 border-2 border-gray-300 rounded-xl p-2"
                placeholder={msg ? msg : currentMsgModel}
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                rows={4}
              />
              <div className="w-full flex gap-2 pt-2 justify-end">
                <button
                  className="cursor-pointer bg-gray-300 text-gray-600 w-fit py-1 px-8 rounded-md hover:bg-gray-400"
                  type="button"
                  onClick={() => setMsg('')}
                >
                  Limpar
                </button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => handleSaveMsgModel(setCurrentMsgModel, msg)}
                >
                  Salvar modelo
                </Button>
              </div>
            </div>
          </Container>
          {sessions.length > 0 && (
            <Container>
              <PageSubTitle
                description={"Todas as contas"}
                Icon={List}
              />
              <div className="grid grid-cols-3 gap-4 pb-3">
                {sessions.map(s => (
                  <Container key={s.clientId} className="mt-3 flex flex-col h-full">
                    <div className="space-y-4 text-gray-600">
                      <div className="flex gap-2 items-center">
                        <PageSubTitle
                          description={s.clientId || s.name || "Sem nome"}
                          Icon={UserRound}
                        />
                      </div>
                      <div className="text-sm space-y-2">
                        <p className="text-gray-500 font-semibold">Telefone:</p>
                        <p className="text-gray-700 border border-gray-300 rounded-md py-1 px-2 bg-gray-200">{s.owner || "Desconectado"}</p>
                      </div>
                    </div>
                    <div className="flex items-center w-full justify-between">
                      <p className={`w-fit px-4 text-center rounded-xl shadow-lg text-sm text-white ${s.ready ? "bg-green-700" : isStatusDisconnected(s.status) ? "bg-red-400" : "bg-gray-500"
                        }`}>
                        {s.ready ? "Conectado" : isStatusDisconnected(s.status) ? "Desconectado" : "Aguardando QR"}
                      </p>
                      <button
                        className="p-1 cursor-pointer"
                        onClick={() => handleDeleteInstance(s.clientId || "")}
                        disabled={deletingId === (s.clientId || "")}
                      >
                        {deletingId === (s.clientId || "") ? (
                          <Loader2 className="w-5 h-6 text-red-500 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-6 text-red-500" />
                        )}
                      </button>
                    </div>
                  </Container>
                ))}
              </div>
            </Container>
          )}
        </div>
      </div>
      <MessageVariablesDialog
        variables={msgVariables}
        open={showMsgVariables}
        setOpen={setShowMsgVariables}
      />
    </>
  )
}