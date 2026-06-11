# Referência de Componentes — SmartBin Monitor

Todos os componentes seguem a identidade visual do sistema: dark mode, paleta verde/azul neon sobre fundo escuro (`#0B0F13`), tipografia monospace e animações suaves via Framer Motion.

---

## 📁 `src/pages/`

### `Login.jsx`

Página de autenticação com suporte a login e cadastro de novos operadores.

**Props:** Nenhuma (acessa `AuthContext` via hook)

**Estados internos:**

| State | Tipo | Default | Descrição |
|---|---|---|---|
| `isLogin` | `boolean` | `true` | Alterna entre modo login e cadastro |
| `email` | `string` | `''` | E-mail do operador |
| `password` | `string` | `''` | Senha do operador |
| `loading` | `boolean` | `false` | Estado de submissão |

**Comportamento:**
- Chama `login()` ou `signup()` do `AuthContext`
- Redireciona para `/` após autenticação bem-sucedida
- Exibe toasts de erro para credenciais inválidas, e-mail já em uso, senha fraca

---

### `Dashboard.jsx`

Página principal do sistema. Orquestra o layout (Header + Sidebar + MapView).

**Props:** Nenhuma

**Estados internos:**

| State | Tipo | Default | Descrição |
|---|---|---|---|
| `selectedLixeira` | `string \| null` | `null` | ID da lixeira selecionada |
| `isSidebarOpen` | `boolean` | `false` | Controla abertura do sidebar em mobile |

**Dependências:** `useLixeiras()`, `Header`, `Sidebar`, `MapView`

---

## 📁 `src/components/layout/`

### `Header.jsx`

Barra superior do dashboard com logo, nome do sistema e botão de menu hambúrguer (mobile).

**Props:**

| Prop | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `onMenuClick` | `() => void` | ✅ | Callback ao clicar no menu hambúrguer |

---

### `Sidebar.jsx`

Painel lateral esquerdo com listagem de lixeiras e opção "Visão Geral do Mapa".

**Props:**

| Prop | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `selectedLixeira` | `string \| null` | ✅ | ID da lixeira atualmente selecionada |
| `setSelectedLixeira` | `(id: string \| null) => void` | ✅ | Callback para selecionar uma lixeira |
| `isOpen` | `boolean` | ✅ | Se o sidebar está visível (mobile) |
| `onClose` | `() => void` | ✅ | Callback para fechar o sidebar |

**Comportamento:**
- Em mobile: renderiza como overlay com backdrop escurecido
- Em desktop: sempre visível (posição relativa no layout flex)
- Exibe `LixeiraCard` para cada lixeira carregada do Firebase
- Mostra email do usuário logado e botão de logout no rodapé

---

### `MapView.jsx`

Mapa interativo Leaflet com tiles escuros (CartoDB Dark Matter) e marcadores coloridos.

**Props:**

| Prop | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `lixeiras` | `object` | ✅ | Mapa `{ [id]: LixeiraData }` do Firebase |
| `selectedLixeira` | `string \| null` | ✅ | ID da lixeira selecionada |
| `setSelectedLixeira` | `(id: string \| null) => void` | ✅ | Callback de seleção |

**Subcomponentes:**

- **`MapController`** (interno): controla `flyTo()` ao selecionar lixeira — voa suavemente para a posição com zoom 18, duração de 1,5s
- **`LixeiraDrawer`**: painel lateral que aparece ao selecionar uma lixeira no mapa

**Centro padrão do mapa:** `-12.199110, -38.969515` (UEFS, Feira de Santana - BA)

---

## 📁 `src/components/devices/`

### `LixeiraCard.jsx`

Card clicável exibido na sidebar para cada lixeira cadastrada.

**Props:**

| Prop | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `lixeira` | `LixeiraData` | ✅ | Dados da lixeira |
| `onClick` | `() => void` | ✅ | Callback de seleção |
| `isSelected` | `boolean` | ✅ | Se este card está selecionado |

**Comportamento:**
- Atualiza o tempo decorrido desde o último heartbeat a cada 1 segundo (intervalo interno)
- Exibe badge "COLETA NECESSÁRIA" se `status === 'cheia'`
- Animações de hover/tap via Framer Motion

---

### `FillProgressBar.jsx`

Barra de progresso visual para exibir o nível de preenchimento.

**Props:**

| Prop | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `percentage` | `number` (0-100) | ✅ | Percentual de preenchimento |
| `status` | `string` | ✅ | `'normal'` \| `'atencao'` \| `'cheia'` |

**Cores por status:**

| Status | Cor da barra |
|---|---|
| `normal` | `#00E676` (verde neon) |
| `atencao` | `#FFD600` (amarelo) |
| `cheia` | `#FF1744` (vermelho) |

---

### `FillStatusBadge.jsx`

Badge compacto com ícone e texto indicando o status atual.

**Props:**

| Prop | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `status` | `string` | ✅ | `'normal'` \| `'atencao'` \| `'cheia'` |

---

### `DeviceCard.jsx`

Card genérico para exibição de dispositivos IoT (uso futuro ou componente auxiliar).

---

### `DeviceStatusBadge.jsx`

Badge de status de conectividade de dispositivo (online/offline).

---

## 📁 `src/components/modals/`

### `LixeiraDrawer.jsx`

Painel deslizante da direita com detalhes completos da lixeira selecionada.

**Props:**

| Prop | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `isOpen` | `boolean` | ✅ | Controla visibilidade |
| `onClose` | `() => void` | ✅ | Callback para fechar |
| `lixeira` | `LixeiraData & { id: string }` | ✅ | Dados da lixeira selecionada |

**Funcionalidades:**
- Exibe status de capacidade com `FillProgressBar` e `FillStatusBadge`
- Exibe coordenadas GPS formatadas (6 casas decimais)
- Indicador de online/offline com pulse animado
- Botão de edição → abre `EditLixeiraModal`
- Botão de exclusão com `window.confirm`
- Banner vermelho piscante quando `status === 'cheia'`

---

### `AddLixeiraModal.jsx`

Modal para cadastrar uma nova lixeira com seleção de posição via mapa interativo.

**Props:**

| Prop | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `isOpen` | `boolean` | ✅ | Controla visibilidade |
| `onClose` | `() => void` | ✅ | Callback para fechar |

**Funcionalidades:**
- Campos: ID único do dispositivo, Nome de exibição
- Mini-mapa Leaflet embutido: clique para posicionar, marcador arrastável
- Campos numéricos de lat/lng sincronizados com o mapa
- Validação básica de campos obrigatórios
- Escreve diretamente em `/lixeiras/{id}` no Firebase

---

### `EditLixeiraModal.jsx`

Modal para editar uma lixeira existente (nome e localização).

**Props:**

| Prop | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `isOpen` | `boolean` | ✅ | Controla visibilidade |
| `onClose` | `() => void` | ✅ | Callback para fechar |
| `lixeira` | `LixeiraData & { id: string }` | ✅ | Dados atuais da lixeira |

---

### `AddRoomModal.jsx` / `EditRoomModal.jsx`

Modais para gerenciamento de salas/zonas de coleta (funcionalidade em desenvolvimento).

---

### `AddDeviceModal.jsx`

Modal para cadastrar dispositivos IoT genéricos além das lixeiras.

---

## 📁 `src/components/ui/`

### `TrashBinMarker.jsx`

Cria ícones SVG customizados para o mapa Leaflet de acordo com o status da lixeira.

**Exportação:**

```javascript
createTrashBinIcon(status: 'normal' | 'atencao' | 'cheia'): L.DivIcon
```

**Cores dos ícones:**

| Status | Cor do ícone | Cor da sombra |
|---|---|---|
| `normal` | `#00E676` (verde) | `rgba(0,230,118,0.4)` |
| `atencao` | `#FFD600` (amarelo) | `rgba(255,214,0,0.4)` |
| `cheia` | `#FF1744` (vermelho) | `rgba(255,23,68,0.4)` |

---

### `Switch.jsx`

Componente de toggle (ligado/desligado) para controle de dispositivos.

**Props:**

| Prop | Tipo | Descrição |
|---|---|---|
| `checked` | `boolean` | Estado atual |
| `onChange` | `(val: boolean) => void` | Callback de mudança |
| `disabled` | `boolean` | Se desativado |

---

### `Slider.jsx`

Componente de slider para controle de valores numéricos (ex.: brilho, volume).

**Props:**

| Prop | Tipo | Descrição |
|---|---|---|
| `value` | `number` | Valor atual |
| `min` | `number` | Valor mínimo |
| `max` | `number` | Valor máximo |
| `onChange` | `(val: number) => void` | Callback de mudança |

---

## 📁 `src/contexts/`

### `AuthContext.jsx`

Provedor de contexto de autenticação Firebase.

**Hook de consumo:** `useAuth()`

**Valores expostos:**

| Valor | Tipo | Descrição |
|---|---|---|
| `currentUser` | `User \| null` | Usuário Firebase autenticado |
| `login(email, password)` | `Promise` | Realiza login |
| `signup(email, password)` | `Promise` | Cria nova conta |
| `logout()` | `Promise` | Realiza logout |

---

## 📁 `src/hooks/`

### `useLixeiras()`

Hook para **leitura em tempo real** das lixeiras do Firebase.

**Retorno:**

```typescript
{
  lixeiras: Record<string, LixeiraData>,
  loading: boolean
}
```

**Comportamento:**
- Assina `onValue` no nó `/lixeiras` do Realtime Database
- Detecta transições de status para `'full'` (⚠️ inconsistência: firmware grava `'cheia'`) e dispara toast de alerta
- Cancela a assinatura ao desmontar o componente

---

### `useLixeiraActions()`

Hook com as **ações de escrita** no Firebase.

**Retorno:**

```typescript
{
  addLixeira: (data: LixeiraInput) => Promise<{ success: boolean, id?: string, error?: Error }>,
  updateLixeira: (id: string, data: Partial<LixeiraData>) => Promise<{ success: boolean }>,
  removeLixeira: (id: string) => Promise<{ success: boolean }>,
  resetAlert: (id: string) => Promise<{ success: boolean }>
}
```

---

## Tipos de Dados (TypeScript-equivalente)

```typescript
interface LixeiraState {
  fillLevel: number;        // 0-100
  status: 'normal' | 'atencao' | 'cheia';
  lastSeen: number;         // Unix timestamp (ms)
}

interface LixeiraLocation {
  lat: number;
  lng: number;
}

interface LixeiraData {
  name: string;
  location: LixeiraLocation;
  online?: boolean;
  alertPin?: boolean;
  state: LixeiraState;
}
```
