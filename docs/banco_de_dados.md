# Banco de Dados — Firebase Realtime Database

## Visão Geral

O projeto utiliza o **Firebase Realtime Database** (NoSQL orientado a grafos JSON) para armazenar e sincronizar dados de lixeiras inteligentes em tempo real.

- **Projeto Firebase:** `tde-iot-yannes`
- **URL do Banco:** `https://tde-iot-yannes-default-rtdb.firebaseio.com`
- **Região:** us-central1 (padrão Firebase)

---

## Estrutura de Dados

```json
{
  "lixeiras": {
    "{binId}": {
      "name": "string",
      "location": {
        "lat": "number",
        "lng": "number"
      },
      "online": "boolean",
      "alertPin": "boolean",
      "state": {
        "fillLevel": "number (0-100)",
        "status": "string ('normal' | 'atencao' | 'cheia')",
        "lastSeen": "number (Unix timestamp ms)"
      }
    }
  }
}
```

### Exemplo Real

```json
{
  "lixeiras": {
    "bin-01": {
      "name": "Lixeira Entrada Principal",
      "location": {
        "lat": -12.19911,
        "lng": -38.96951
      },
      "online": true,
      "alertPin": false,
      "state": {
        "fillLevel": 72,
        "status": "atencao",
        "lastSeen": 1715120000000
      }
    },
    "lixeira-refeitorio": {
      "name": "Lixeira Refeitório",
      "location": {
        "lat": -12.19920,
        "lng": -38.96980
      },
      "online": false,
      "alertPin": false,
      "state": {
        "fillLevel": 20,
        "status": "normal",
        "lastSeen": 1715115000000
      }
    }
  }
}
```

---

## Campos da Entidade `lixeira`

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `name` | `string` | ✅ | Nome de exibição da lixeira |
| `location.lat` | `number` | ✅ | Latitude (WGS84) |
| `location.lng` | `number` | ✅ | Longitude (WGS84) |
| `online` | `boolean` | ❌ | Indica se o dispositivo está conectado |
| `alertPin` | `boolean` | ❌ | Flag de alerta ativo (resetável pelo painel) |
| `state.fillLevel` | `number` (0-100) | ✅ | Percentual de preenchimento |
| `state.status` | `string` | ✅ | Status calculado pelo firmware |
| `state.lastSeen` | `timestamp (ms)` | ✅ | Último heartbeat do dispositivo |

### Valores de `status`

| Valor | Cor no UI | Condição (Firmware) | Ação Ativada |
|---|---|---|---|
| `"normal"` | 🟢 Verde | `fillLevel < 50%` | Nenhuma |
| `"atencao"` | 🟡 Amarelo | `50% ≤ fillLevel < 85%` | Nenhuma |
| `"cheia"` | 🔴 Vermelho | `fillLevel ≥ 85%` | LED + Buzzer + Toast de alerta |

> **Nota de inconsistência:** O firmware grava `status: "cheia"` enquanto o frontend verifica `status === 'full'` (em inglês) em algumas partes. Isso pode causar a ausência de notificações toast. Verifique o `useLixeiras.js` para uniformizar o valor.

---

## Regras de Segurança

Arquivo: `database.rules.json`

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

### Análise de Segurança

| Aspecto | Status | Recomendação |
|---|---|---|
| Leitura pública | ❌ Bloqueada | ✅ Correto |
| Escrita pública | ❌ Bloqueada | ✅ Correto |
| Autenticação exigida | ✅ Sim | ✅ Correto |
| Regras granulares por nó | ❌ Ausentes | ⚠️ Considerar |
| Validação de schema | ❌ Ausente | ⚠️ Considerar |

**Regras mais granulares recomendadas (para produção):**

```json
{
  "rules": {
    "lixeiras": {
      ".read": "auth != null",
      "$binId": {
        ".write": "auth != null",
        "state": {
          ".validate": "newData.hasChildren(['fillLevel', 'status', 'lastSeen'])",
          "fillLevel": {
            ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 100"
          },
          "status": {
            ".validate": "newData.isString() && (newData.val() === 'normal' || newData.val() === 'atencao' || newData.val() === 'cheia')"
          }
        }
      }
    }
  }
}
```

---

## Operações CRUD Implementadas

| Operação | Hook | Firebase Op | Caminho |
|---|---|---|---|
| **Listar (em tempo real)** | `useLixeiras()` | `onValue` | `/lixeiras` |
| **Criar** | `useLixeiraActions().addLixeira()` | `set` | `/lixeiras/{id}` |
| **Atualizar** | `useLixeiraActions().updateLixeira()` | `update` | `/lixeiras/{id}` |
| **Deletar** | `useLixeiraActions().removeLixeira()` | `remove` | `/lixeiras/{id}` |
| **Reset Alerta** | `useLixeiraActions().resetAlert()` | `update` | `/lixeiras/{id}/alertPin` |
| **Atualizar Estado (Firmware)** | `updateBinState()` | HTTP PATCH | `/lixeiras/{id}/state` |

---

## Chave de Autenticação do Firmware

> ⚠️ **ATENÇÃO DE SEGURANÇA**  
> O arquivo `wokwi/wokwi.ino` contém uma **Firebase Secret (Database Secret)** hardcoded.  
> Essa abordagem é aceitável para fins acadêmicos e simulação (Wokwi), mas **não deve ser usada em produção**.  
> Em ambiente real, use Firebase Service Account com autenticação anônima ou token JWT.

```cpp
// wokwi.ino — NÃO expor em repositórios públicos em produção
const String FIREBASE_SECRET = "jjt1UiDp9iewimxIuvbhwU23zWvd5qpAZet7GCZS";
```

---

## Índice de Presença Online

A lógica de "online/offline" não é gerenciada diretamente pelo Firebase Presence Protocol, mas sim inferida no frontend pelo campo `lastSeen`:

```javascript
// LixeiraCard.jsx e LixeiraDrawer.jsx
const isOnline = lastSeen ? (currentTime - lastSeen) < 60000 : false;
// Considera online se o último heartbeat foi há menos de 60 segundos
```
