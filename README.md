# 🚀 Enterprise Frontend

![Next.js](https://img.shields.io/badge/Next.js-16.0.3-000000?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-06B6D4?logo=tailwindcss)
![Socket.io](https://img.shields.io/badge/Socket.io-4.8.3-010101?logo=socketdotio)
![ESLint](https://img.shields.io/badge/ESLint-9.x-4B32C3?logo=eslint)
![Node.js](https://img.shields.io/badge/Node.js-18.20.x-339933?logo=node.js&logoColor=white)
---

### 🚨 A versão do Next, React e Node utilizadas são defasadas para que o sistema possa operar em ambientes Windowns Server 2012!

---

# 💡 Visão geral

O **Enterprise Frontend** é uma aplicação web moderna desenvolvida com **Next.js**, projetada para centralizar operações empresariais, integrações e monitoramento de serviços em uma única interface.

A plataforma fornece um painel administrativo modular para gerenciamento de processos operacionais, comunicação em tempo real e configuração de serviços integrados.

O projeto foi desenvolvido para rodar como um serviço do windows, seguindo uma arquitetura preparada para ambientes corporativos, com foco em escalabilidade, organização de módulos e experiência de uso.

---

# ✨ Principais valores e objetivos

- Centralizar operações empresariais em uma única interface.
- Reduzir processos manuais através de automações.
- Disponibilizar acompanhamento em tempo real dos serviços.
- Facilitar configurações de ambiente e integrações externas.
- Criar uma experiência administrativa simples e eficiente.

---

# 🧩 O que o projeto entrega

A aplicação fornece uma interface completa para gerenciamento de módulos empresariais:

- Dashboard operacional.
- Monitoramento de serviços em tempo real.
- Configuração de integrações.
- Comunicação com serviços externos.
- Gestão de processos automatizados.
- Integração com sistemas de mensagens.
- Gerenciamento de parâmetros da aplicação.
- Ambientes para personalização de modelo de mensagens para Aniversáriantes, Cobranças, Vendas, Envio de Boleto bancário, Envio de NFE e Acompanhamento de Ordem de Serviços.
- Ambiente para configuração de regras de negócios
- Ambiente para getenciamento de contas WhatsApp.
- Ambiente para controle de disparo de mensagens por cliente.
- Controle de versão e atualização automática do serviço do Backend.

---

# 🛠️ Stack técnico

| Camada | Tecnologia |
| --- | --- |
| Framework | Next.js 16 |
| Interface | React 19 |
| Linguagem | TypeScript |
| Estilização | Tailwind CSS 4 |
| Comunicação em tempo real | Socket.io |
| Qualidade de código | ESLint |
| Ambiente | Node.js |
| Arquitetura | Next.js App Router |

---

# 🧱 Arquitetura resumida

O projeto utiliza o padrão **App Router do Next.js**, mantendo uma estrutura modular organizada por responsabilidade.

```
src/
│
├── app/
│   ├── api/
│   ├── dashboard/
│   ├── settings/
│   ├── layouts/
│   └── pages/
│
├── components/
│   ├── ui/
│   ├── dashboard/
│   └── modules/
│
├── hooks/
│   └── websocket/
│
├── services/
│   └── integrations/
│
├── lib/
│   └── configuration/
│
└── types/
```

Principais responsabilidades:

- `app/` — páginas, rotas e composição da aplicação.
- `app/api/` — rotas internas para comunicação e configuração.
- `components/` — componentes reutilizáveis e módulos visuais.
- `hooks/` — lógica compartilhada e comunicação em tempo real.
- `services/` — serviços de integração.
- `lib/` — configurações e utilitários.
- `types/` — tipagens TypeScript.

---

# 🔌 Integração com Backend

O frontend foi desenvolvido para trabalhar integrado a uma API empresarial responsável pelos processos de negócio.

Comunicação realizada através de:

- Requisições HTTP.
- WebSocket utilizando Socket.io.
- Configurações dinâmicas de ambiente.
- Monitoramento de serviços em tempo real.

Principais integrações:

- Status de serviços.
- Processos automatizados.
- Configuração da aplicação.
- Atualizações de ambiente.
- Comunicação entre módulos.

---

# ▶️ Como rodar localmente

## Pré-requisitos

- Node.js 18
- npm, pnpm ou yarn

## Instalação

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

A aplicação ficará disponível em:

```
http://localhost:3001
```

---

# 🔧 Comandos úteis

```bash
npm run dev      # inicia ambiente de desenvolvimento

npm run build    # gera build de produção

npm run start    # executa aplicação em produção

npm run lint     # análise estática do código
```

---

# 💿 Instalação e deploy

O projeto possui suporte para execução em ambientes corporativos utilizando build otimizada do Next.js.

Possibilidades de execução:

- Node.js diretamente.
- Serviço Windows utilizando NSSM.
- Instalação automatizada através de instalador corporativo.

A instalação pode realizar:

- Configuração do ambiente.
- Registro do serviço frontend.
- Inicialização automática.
- Integração com API local.
- Execução após reinicialização do servidor.

---

# 📌 Rotas internas da aplicação

A aplicação possui endpoints internos para gerenciamento de configuração e serviços:

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/config` | Consulta configurações |
| POST | `/api/config` | Salva configurações |
| GET | `/api/key` | Recupera chave da API |
| PATCH | `/api/key` | Atualiza chave da API |
| POST | `/api/update` | Executa atualização |
| POST | `/api/service/start` | Inicializa serviço |
| POST | `/api/service/stop` | Finaliza serviço |

---

# 🌟 Destaques para recrutadores

- Aplicação frontend empresarial utilizando Next.js moderno.
- Arquitetura modular baseada em App Router.
- Desenvolvimento com TypeScript em ambiente real de produção.
- Comunicação em tempo real utilizando WebSocket.
- Integração com serviços externos e APIs.
- Estrutura preparada para distribuição corporativa.
- Experiência com configuração dinâmica e automação de processos.

---

# 📬 Contato

- GitHub: https://github.com/SouzaLucas0
- LinkedIn: linkedin.com/in/souzalucas0/
