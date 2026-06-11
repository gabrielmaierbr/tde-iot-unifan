# Firmware ESP32 — SmartBin Monitor

## Visão Geral

O firmware roda em um **ESP32 DevKit V1** (simulado no Wokwi) e tem como responsabilidade:

1. Conectar-se à rede WiFi
2. Ler a distância do sensor ultrassônico HC-SR04
3. Calcular o nível de preenchimento da lixeira (0-100%)
4. Acionar alertas locais (LED + Buzzer) quando a lixeira está cheia
5. Enviar os dados ao Firebase via HTTP REST (PATCH)

---

## Diagrama do Circuito

```
ESP32 DevKit V1
│
├── GPIO 5  (D5)  ──────────── TRIG do HC-SR04
├── GPIO 18 (D18) ──────────── ECHO do HC-SR04
├── GPIO 2  (D2)  ── R1 (220Ω) ─── LED (Anodo) ─── GND
└── GPIO 4  (D4)  ──────────── Buzzer (+) ─── GND

HC-SR04:
├── VCC ──── 5V (ESP32)
└── GND ──── GND (ESP32)
```

Arquivo de diagrama: [`wokwi/diagram.json`](../wokwi/diagram.json)

---

## Configuração Inicial

### Parâmetros editáveis em `wokwi.ino`

| Constante | Valor Padrão | Descrição |
|---|---|---|
| `WIFI_SSID` | `"Wokwi-GUEST"` | SSID WiFi (automático no Wokwi) |
| `WIFI_PASSWORD` | `""` | Senha WiFi (vazia no Wokwi) |
| `FIREBASE_HOST` | `https://tde-iot-yannes-default-rtdb.firebaseio.com` | URL do banco Firebase |
| `FIREBASE_SECRET` | `jjt1UiDp9iew...` | Chave de autenticação do banco |
| `BIN_ID` | `"bin-01"` | ID da lixeira que este dispositivo representa |
| `BIN_HEIGHT_CM` | `50.0` | Altura total da lixeira em centímetros |
| `CAPACITY_FULL_THRESHOLD` | `85` | % para considerar a lixeira cheia |
| `REPORT_INTERVAL` | `5000` ms | Intervalo de envio ao Firebase |

---

## Mapeamento de Pinos

| Pino GPIO | Pino ESP32 | Componente | Modo |
|---|---|---|---|
| 5 | D5 | HC-SR04 TRIG | OUTPUT |
| 18 | D18 | HC-SR04 ECHO | INPUT |
| 2 | D2 | LED de Alerta | OUTPUT |
| 4 | D4 | Buzzer | OUTPUT |

---

## Fluxo de Execução

### `setup()`

```
1. Inicializa Serial (115200 baud)
2. Configura modos dos pinos (OUTPUT/INPUT)
3. Conecta ao WiFi (até 30 tentativas × 500ms = 15s máx)
4. Imprime IP local no Serial (se conectado)
```

### `loop()` — executado a cada 5 segundos

```
1. Dispara pulso TRIG (10µs HIGH)
2. Mede duração do pulso ECHO
3. Converte duração → distância em cm
   fórmula: distancia = duracao * 0.034 / 2
4. Converte distância → fillLevel (0-100%)
   fórmula: fillLevel = map(distancia, BIN_HEIGHT_CM, 0, 0, 100)
5. Determina status:
   - fillLevel >= 85% → "cheia" + LED HIGH + Buzzer 1kHz/200ms
   - fillLevel >= 50% → "atencao" + LED LOW
   - fillLevel < 50%  → "normal" + LED LOW
6. Se WiFi conectado:
   HTTP PATCH /lixeiras/{BIN_ID}/state.json
   Body: { fillLevel, status, lastSeen: {".sv": "timestamp"} }
```

---

## Funções Principais

### `readDistanceCM()`

Lê a distância do sensor HC-SR04 em centímetros.

```cpp
int readDistanceCM()
```

- **Timeout:** 30ms (pulseIn com timeout evita travamento)
- **Fallback:** retorna `BIN_HEIGHT_CM` (lixeira vazia) se não houver leitura

---

### `updateBinState(fillLevel, status)`

Envia o estado atual ao Firebase via HTTP PATCH.

```cpp
void updateBinState(int fillLevel, String status)
```

- **Endpoint:** `PATCH /lixeiras/{BIN_ID}/state.json?auth={SECRET}`
- **Body:**
  ```json
  {
    "fillLevel": 72,
    "status": "atencao",
    "lastSeen": {".sv": "timestamp"}
  }
  ```
- O campo `{".sv": "timestamp"}` instrui o Firebase a usar o timestamp do servidor

---

### `buildURL(path, suffix)`

Constrói a URL completa para requisições Firebase.

```cpp
String buildURL(String path, String suffix = ".json")
// Exemplo: buildURL("lixeiras/bin-01/state")
// → "https://tde-iot-yannes-default-rtdb.firebaseio.com/lixeiras/bin-01/state.json?auth=..."
```

---

### `httpPATCH(url, body)`

Executa uma requisição HTTP PATCH.

```cpp
bool httpPATCH(String url, String body)
// Retorna true se HTTP 200 OK
```

---

## Simulação no Wokwi

### Configuração

Arquivo: `wokwi/wokwi.toml`

```toml
[wokwi]
version = 1
firmware = 'wokwi.ino.bin'
chip = 'esp32'
```

### Como Simular

1. Acesse [wokwi.com](https://wokwi.com) ou use a extensão VS Code
2. Importe o `diagram.json` e o `wokwi.ino`
3. A simulação WiFi conecta automaticamente via "Wokwi-GUEST"
4. Arraste o slider de distância do HC-SR04 para simular diferentes níveis
5. Observe o Serial Monitor e os dados chegando no Firebase

### Controle de Distância no Wokwi

No `diagram.json`, o sensor HC-SR04 tem `"distance": "50"` como valor padrão (50 cm = lixeira vazia). Para simular lixeira cheia, reduza o valor de distância no simulador para 5-10 cm.

---

## Dependências (Libraries)

Arquivo: `wokwi/libraries.txt`

```
WiFi
HTTPClient
```

Ambas são bibliotecas nativas do ESP32 Arduino Framework.

---

## Fluxo de Status Completo

```
Distância (cm)    fillLevel (%)    status      LED     Buzzer
──────────────    ─────────────    ──────      ───     ──────
> 50 cm           0%               normal      OFF     OFF
25–50 cm          0–50%            normal      OFF     OFF
7–25 cm           50–85%           atencao     OFF     OFF
< 7 cm            85–100%          cheia       ON      ON (1kHz, 200ms)
```

---

## Troubleshooting

| Problema | Possível Causa | Solução |
|---|---|---|
| Firebase retorna HTTP 401 | `FIREBASE_SECRET` inválida ou expirada | Regenerar a Database Secret no console Firebase |
| Firebase retorna HTTP 403 | Regras de segurança bloqueando | Verificar `database.rules.json` e autenticação |
| `duration == 0` no sensor | Timeout de leitura | Normal em Wokwi; ajustar distância ou timeout |
| WiFi não conecta | SSID errado | No Wokwi use `"Wokwi-GUEST"` com senha vazia |
| Status "cheia" mas sem alerta no app | Inconsistência de string | Firmware grava `"cheia"`, frontend espera `"full"` em partes — padronizar |
