# SmartBin Monitor 🗑️

> **Sistema de Monitoramento de Lixeiras Inteligentes com IoT**  
> TDE IoT — UNIFAN | Engenharia da Computação

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Firebase](https://img.shields.io/badge/Firebase-Realtime_DB-FFCA28?logo=firebase)](https://firebase.google.com)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss)](https://tailwindcss.com)

---

## 📌 Sobre o Projeto

O **SmartBin Monitor** é uma solução IoT para monitoramento em tempo real de lixeiras inteligentes. Sensores ultrassônicos HC-SR04 acoplados a microcontroladores ESP32 medem o nível de preenchimento das lixeiras e enviam os dados ao **Firebase Realtime Database**. Um painel web React consome esses dados e os exibe em um **mapa geográfico interativo**, permitindo que operadores visualizem o status de cada lixeira e sejam alertados quando atingir capacidade máxima.

---

## 🚀 Início Rápido

```bash
# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse em: `http://localhost:5173`

---

## 🛠️ Stack Tecnológico

| Camada | Tecnologia |
|---|---|
| Frontend | React 19 + Vite 8 |
| Mapa | Leaflet + React-Leaflet |
| Estilização | Tailwind CSS v4 |
| Animações | Framer Motion |
| Backend | Firebase Realtime Database |
| Autenticação | Firebase Authentication |
| Firmware | Arduino C++ (ESP32) |
| Simulador | Wokwi |

---

## 📁 Estrutura do Projeto

```
tde-iot-unifan/
├── src/
│   ├── components/         # Componentes React (layout, devices, modals, ui)
│   ├── contexts/           # AuthContext (Firebase Auth)
│   ├── hooks/              # useLixeiras, useLixeiraActions
│   ├── firebase/           # Configuração Firebase
│   └── pages/              # Login, Dashboard
├── wokwi/                  # Firmware ESP32 + diagrama de circuito
├── docs/                   # 📚 Documentação completa do projeto
│   ├── README.md           # Índice da documentação
│   ├── arquitetura.md      # Arquitetura e fluxo de dados
│   ├── banco_de_dados.md   # Estrutura Firebase e regras
│   ├── componentes.md      # Referência de componentes
│   ├── firmware.md         # Documentação do firmware ESP32
│   └── TAP.md              # Termo de Abertura do Projeto
├── firebase.json           # Configuração Firebase Hosting
└── database.rules.json     # Regras de segurança do Firebase
```

---

## 📚 Documentação

A documentação completa está na pasta [`docs/`](./docs/):

- 📐 [Arquitetura do Sistema](./docs/arquitetura.md)
- 🗄️ [Banco de Dados Firebase](./docs/banco_de_dados.md)
- 🧩 [Referência de Componentes](./docs/componentes.md)
- 🔌 [Firmware ESP32](./docs/firmware.md)
- 📋 [Termo de Abertura do Projeto (TAP)](./docs/TAP.md)

---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` na raiz:

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

## 📜 Scripts

```bash
npm run dev       # Desenvolvimento com HMR
npm run build     # Build de produção
npm run preview   # Pré-visualizar build
npm run lint      # Verificar código
```

---

## 🔌 Simulação IoT (Wokwi)

O firmware está em `wokwi/wokwi.ino`. Configure o `BIN_ID` para corresponder a uma lixeira criada pelo painel e simule no [Wokwi](https://wokwi.com). Consulte [`docs/firmware.md`](./docs/firmware.md) para detalhes.

---

*UNIFAN — TDE IoT — Maio 2026*
