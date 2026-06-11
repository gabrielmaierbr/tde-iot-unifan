# Arquitetura — SmartBin Monitor

## Visão Geral

O SmartBin Monitor é um sistema **full-stack IoT** composto por três camadas principais:

1. **Firmware (ESP32)** — coleta dados físicos dos sensores e envia ao Firebase
2. **Firebase** — atua como broker de dados em tempo real (BaaS)
3. **Frontend React** — interface web que consome e exibe os dados em tempo real

---

## Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                        HARDWARE (Wokwi / Real)                  │
│                                                                 │
│   ┌──────────────┐    ┌────────────┐    ┌───────────────────┐   │
│   │  HC-SR04     │    │  LED Alert │    │  Buzzer           │   │
│   │  (Ultrasônico│    │  (GPIO 2)  │    │  (GPIO 4)         │   │
│   │   GPIO 5/18) │    └─────┬──────┘    └─────┬─────────────┘   │
│   └──────┬───────┘          │                 │                 │
│          │                  └────────┬────────┘                 │
│          └───────────────────────────▼─────────────────────┐   │
│                         ESP32 DevKit V1                     │   │
│                         (wokwi.ino)                         │   │
│                         ─ WiFi: Wokwi-GUEST                │   │
│                         ─ HTTP REST PATCH → Firebase        │   │
└─────────────────────────────────────────────────────────────────┘
                                   │
                                   │ HTTPS REST (PATCH)
                                   │ a cada 5 segundos
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│               FIREBASE REALTIME DATABASE                        │
│                                                                 │
│   lixeiras/                                                     │
│   └── {binId}/                                                  │
│       ├── name: string                                          │
│       ├── location: { lat, lng }                                │
│       ├── online: boolean                                       │
│       ├── alertPin: boolean                                     │
│       └── state/                                                │
│           ├── fillLevel: number (0-100)                         │
│           ├── status: "normal"|"atencao"|"cheia"                │
│           └── lastSeen: timestamp                               │
│                                                                 │
│   Rules: .read/.write = auth != null                            │
└─────────────────────────────────────────────────────────────────┘
                                   │
                                   │ Firebase SDK (onValue listener)
                                   │ WebSocket em tempo real
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                  FRONTEND REACT (Vite + TailwindCSS)            │
│                                                                 │
│   AuthContext (Firebase Auth)                                   │
│   │                                                             │
│   └── App.jsx (Router)                                          │
│       ├── /login → Login.jsx                                    │
│       └── / → PrivateRoute → Dashboard.jsx                      │
│                   ├── Header.jsx                                │
│                   ├── Sidebar.jsx (lista de lixeiras)           │
│                   │   └── LixeiraCard (por lixeira)             │
│                   └── MapView.jsx (Leaflet)                     │
│                       ├── TrashBinMarker (ícones SVG)           │
│                       └── LixeiraDrawer (painel lateral)        │
│                           ├── EditLixeiraModal                  │
│                           └── AddLixeiraModal                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Fluxo de Dados

### 1. Coleta (ESP32 → Firebase)

```
ESP32 (loop a cada 5s)
  │
  ├─ Dispara ultrassom HC-SR04
  ├─ Calcula distância (cm)
  ├─ Converte para fillLevel (0-100%)
  ├─ Determina status:
  │   ├── >= 85% → "cheia"   (LED + Buzzer LIGADOS)
  │   ├── >= 50% → "atencao" (LED DESLIGADO)
  │   └── < 50%  → "normal"
  └─ HTTP PATCH → Firebase /lixeiras/{binId}/state
```

### 2. Exibição em Tempo Real (Firebase → React)

```
Firebase onValue listener (useLixeiras hook)
  │
  ├─ Detecta mudança de status → toast de alerta (lixeira cheia)
  ├─ Atualiza estado React (setLixeiras)
  │
  ├─ Sidebar: atualiza lista de LixeiraCards
  └─ MapView: atualiza ícones coloridos no mapa
       └── verde = normal | amarelo = atenção | vermelho = cheia
```

### 3. Gerenciamento CRUD (React → Firebase)

```
Dashboard UI
  ├─ AddLixeiraModal → useLixeiraActions.addLixeira()
  │                     → Firebase set() na rota /lixeiras/{id}
  ├─ EditLixeiraModal → useLixeiraActions.updateLixeira()
  │                     → Firebase update()
  └─ LixeiraDrawer    → useLixeiraActions.removeLixeira()
                        → Firebase remove()
```

---

## Padrões Arquiteturais Utilizados

| Padrão | Onde | Descrição |
|---|---|---|
| **Custom Hooks** | `useLixeiras`, `useLixeiraActions` | Separação de lógica de dados da UI |
| **Context API** | `AuthContext` | Estado de autenticação global |
| **Compound Components** | `MapView` + `LixeiraDrawer` | Composição de UI complexa |
| **Observer (onValue)** | Firebase SDK | Reatividade em tempo real |
| **Protected Routes** | `PrivateRoute` | Controle de acesso por autenticação |

---

## Módulos e Responsabilidades

```
src/
├── App.jsx             → Roteamento e providers globais
├── main.jsx            → Entry point React
├── index.css           → Tokens de design global
│
├── firebase/
│   └── config.js       → Inicialização e exportação (app, database, auth)
│
├── contexts/
│   └── AuthContext.jsx → Estado global de auth (login, logout, signup)
│
├── hooks/
│   └── useLixeiras.js  → useLixeiras() + useLixeiraActions()
│
├── pages/
│   ├── Login.jsx       → Tela de login/cadastro
│   └── Dashboard.jsx   → Página principal (mapa + sidebar)
│
└── components/
    ├── auth/
    │   └── PrivateRoute.jsx    → Guard de rota autenticada
    ├── layout/
    │   ├── Header.jsx          → Barra superior com logo e ações
    │   ├── Sidebar.jsx         → Lista lateral de lixeiras
    │   └── MapView.jsx         → Mapa Leaflet com marcadores
    ├── devices/
    │   ├── LixeiraCard.jsx     → Card de uma lixeira na sidebar
    │   ├── FillProgressBar.jsx → Barra de progresso de nível
    │   ├── FillStatusBadge.jsx → Badge colorido de status
    │   ├── DeviceCard.jsx      → Card genérico de dispositivo
    │   └── DeviceStatusBadge.jsx → Badge de status de dispositivo
    ├── modals/
    │   ├── AddLixeiraModal.jsx → Modal de cadastro de lixeira
    │   ├── EditLixeiraModal.jsx→ Modal de edição de lixeira
    │   ├── LixeiraDrawer.jsx   → Painel lateral de detalhes
    │   ├── AddRoomModal.jsx    → Modal de adição de sala/área
    │   ├── EditRoomModal.jsx   → Modal de edição de sala/área
    │   └── AddDeviceModal.jsx  → Modal de adição de dispositivo
    └── ui/
        ├── TrashBinMarker.jsx  → Ícone SVG customizado para o mapa
        ├── Switch.jsx          → Componente de toggle
        └── Slider.jsx          → Componente de slider
```
