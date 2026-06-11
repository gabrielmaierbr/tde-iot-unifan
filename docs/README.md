# SmartBin Monitor — Documentação do Projeto

> Sistema de monitoramento de lixeiras inteligentes com IoT + Firebase + React

---

## 📁 Estrutura da Documentação

| Arquivo | Descrição |
|---|---|
| [`arquitetura.md`](./arquitetura.md) | Visão de arquitetura, diagrama de componentes e fluxo de dados |
| [`banco_de_dados.md`](./banco_de_dados.md) | Estrutura do Firebase Realtime Database e regras de segurança |
| [`componentes.md`](./componentes.md) | Referência de todos os componentes React |
| [`firmware.md`](./firmware.md) | Documentação do firmware ESP32 (Wokwi) |
| [`TAP.md`](./TAP.md) | Termo de Abertura do Projeto (TAP) |

---

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no Firebase (projeto: `tde-iot-yannes`)

### Instalação

```bash
# 1. Clone o repositório
git clone <url-do-repo>
cd tde-iot-unifan

# 2. Instale as dependências
npm install

# 3. (Opcional) Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas chaves Firebase

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

### Variáveis de Ambiente (`.env`)

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_DATABASE_URL=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

---

## 🛠️ Stack Tecnológico

| Camada | Tecnologia |
|---|---|
| Frontend | React 19 + Vite 8 |
| Estilização | Tailwind CSS v4 |
| Animações | Framer Motion |
| Mapa | Leaflet + React-Leaflet |
| Backend / BaaS | Firebase Realtime Database |
| Autenticação | Firebase Auth (Email/Senha) |
| Firmware | C++ / Arduino (ESP32) |
| Simulador IoT | Wokwi |
| Notificações | react-hot-toast + SweetAlert2 |
| Ícones | lucide-react |

---

## 📜 Scripts Disponíveis

```bash
npm run dev       # Servidor de desenvolvimento com HMR
npm run build     # Build de produção
npm run preview   # Pré-visualizar build de produção
npm run lint      # Verificar código com ESLint
```

---

## 🔐 Autenticação

O sistema utiliza **Firebase Authentication** com e-mail e senha. Rotas protegidas redirecionam para `/login` caso o usuário não esteja autenticado (via `PrivateRoute`).

---

*Gerado em: Maio 2026 — TDE IoT UNIFAN*
