<<<<<<< HEAD
/**
 * TDE IoT UNIFAN - Sensor Ultrassônico + Firebase
 * ============================================
 * Lê a distância usando um HC-SR04, acende LEDs baseados na distância,
 * conecta ao Firebase Realtime Database via HTTP REST API e
 * envia os dados de distância para o dashboard.
 */

#include <WiFi.h>
#include <HTTPClient.h>

// ─── Credenciais WiFi ─────────────────────────────────────────────────────────
const char* WIFI_SSID     = "Casa35_2G";
const char* WIFI_PASSWORD = "maieroliveira35@";

// ─── Firebase ─────────────────────────────────────────────────────────────────
const String FIREBASE_HOST = "https://tde-iot-yannes-default-rtdb.firebaseio.com";
const String FIREBASE_SECRET = "";  

// ID do dispositivo cadastrado no Firebase
const String DEVICE_SENSOR = "esp-test"; // Crie esse ID no Firebase ou altere para o gerado no dashboard

// ─── Pinos ────────────────────────────────────────────────────────────────────
const int trigPin = 12;
const int echoPin = 13;
const int ledVerde    = 14;
const int ledAmarelo  = 27;
const int ledVermelho = 26;

// ─── Variáveis ────────────────────────────────────────────────────────────────
long duration;
float distance;

unsigned long lastReport = 0;
const unsigned long REPORT_INTERVAL = 2000; // Envia pro Firebase a cada 2 segundos

// ─── Helpers Firebase ─────────────────────────────────────────────────────────
String buildURL(String path, String suffix = ".json") {
  String url = FIREBASE_HOST + "/" + path + suffix;
  if (FIREBASE_SECRET.length() > 0) {
    url += "?auth=" + FIREBASE_SECRET;
  }
  return url;
}

bool httpPATCH(String url, String body) {
  HTTPClient http;
  http.setTimeout(2000); // Timeout de 2s para evitar travar o loop
  http.begin(url);
  http.addHeader("Content-Type", "ap;plication/json");
  int code = http.PATCH(body);
  http.end();
  return (code == HTTP_CODE_OK);
}

// ─── Enviar Leitura ao Firebase ───────────────────────────────────────────────
void reportSensorState(float dist) {
  // Converter a distância lida em % de preenchimento (fillLevel)
  // Supondo que a lixeira tenha 20cm de profundidade. Ajuste 'binHeight' para a altura real.
  float binHeight = 20.0;
  float fillDist = binHeight - dist;
  if (fillDist < 0) fillDist = 0;
  int fillLevel = (int)((fillDist / binHeight) * 100.0);
  if (fillLevel > 100) fillLevel = 100;

  String url  = buildURL("lixeiras/" + DEVICE_SENSOR + "/state");
  
  // Envia o fillLevel e usa o ".sv": "timestamp" para o Firebase registrar a hora exata do servidor
  String body = "{\"fillLevel\":" + String(fillLevel) + ", \"lastSeen\": {\".sv\": \"timestamp\"}}";
  
  bool ok = httpPATCH(url, body);
  
  if (ok) {
    Serial.printf("[FIREBASE] Distância %.2f cm -> Nível %d%% enviado com sucesso.\n", dist, fillLevel);
  } else {
    Serial.println("[FIREBASE] Erro ao enviar os dados.");
  }
}

// ─── Atualiza status online do dispositivo ────────────────────────────────────
void updateOnlineStatus(bool online) {
  String url  = buildURL("lixeiras/" + DEVICE_SENSOR + "/state");
  String body = "{\"online\":" + String(online ? "true" : "false") +
                ",\"lastSeen\": {\".sv\": \"timestamp\"}}";
  httpPATCH(url, body);
  Serial.println(online ? "[ESP32] Marcado como ONLINE no Firebase" : "[ESP32] Marcado como OFFLINE");
}

void setup() {
  Serial.begin(115200); 
  
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(ledVerde,    OUTPUT);
  pinMode(ledAmarelo,  OUTPUT);
  pinMode(ledVermelho, OUTPUT);

  // ─── Conectar ao WiFi ───────────────────────────────────────────────────────
  Serial.println();
  Serial.printf("Conectando ao WiFi: %s\n", WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  int tries = 0;
  while (WiFi.status() != WL_CONNECTED && tries < 30) {
    delay(500);
    Serial.print(".");
    tries++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.printf("\nConectado! IP: %s\n", WiFi.localIP().toString().c_str());
    updateOnlineStatus(true);
  } else {
    Serial.println("\n[ERRO] WiFi não conectou! Rodando apenas localmente.");
  }
}

void loop() {
  // ─── Leitura do Sensor ──────────────────────────────────────────────────────
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);

  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  duration = pulseIn(echoPin, HIGH);
  distance = duration * 0.0343 / 2;

  // ─── Lógica Local dos LEDs ──────────────────────────────────────────────────
  digitalWrite(ledVerde,    LOW);
  digitalWrite(ledAmarelo,  LOW);
  digitalWrite(ledVermelho, LOW);

  if (distance >= 12.0) {
    digitalWrite(ledVerde, HIGH);
  } else if (distance >= 6.0) {
    digitalWrite(ledAmarelo, HIGH);
  } else {
    digitalWrite(ledVermelho, HIGH);
  }

  // ─── Enviar para o Firebase periodicamente ──────────────────────────────────
  unsigned long now = millis();
  if (now - lastReport >= REPORT_INTERVAL) {
    lastReport = now;
    if (WiFi.status() == WL_CONNECTED) {
      reportSensorState(distance);
    }
  }

  delay(100);
=======
/**
 * TDE IoT UNIFAN - Sensor Ultrassônico + Firebase
 * ============================================
 * Lê a distância usando um HC-SR04, acende LEDs baseados na distância,
 * conecta ao Firebase Realtime Database via HTTP REST API e
 * envia os dados de distância para o dashboard.
 */

#include <WiFi.h>
#include <HTTPClient.h>

// ─── Credenciais WiFi ─────────────────────────────────────────────────────────
const char* WIFI_SSID     = "Casa35_2G";
const char* WIFI_PASSWORD = "maieroliveira35@";

// ─── Firebase ─────────────────────────────────────────────────────────────────
const String FIREBASE_HOST = "https://tde-iot-yannes-default-rtdb.firebaseio.com";
const String FIREBASE_SECRET = "";  

// ID do dispositivo cadastrado no Firebase
const String DEVICE_SENSOR = "esp-test"; // Crie esse ID no Firebase ou altere para o gerado no dashboard

// ─── Pinos ────────────────────────────────────────────────────────────────────
const int trigPin = 12;
const int echoPin = 13;
const int ledVerde    = 14;
const int ledAmarelo  = 27;
const int ledVermelho = 26;

// ─── Variáveis ────────────────────────────────────────────────────────────────
long duration;
float distance;

unsigned long lastReport = 0;
const unsigned long REPORT_INTERVAL = 2000; // Envia pro Firebase a cada 2 segundos

// ─── Helpers Firebase ─────────────────────────────────────────────────────────
String buildURL(String path, String suffix = ".json") {
  String url = FIREBASE_HOST + "/" + path + suffix;
  if (FIREBASE_SECRET.length() > 0) {
    url += "?auth=" + FIREBASE_SECRET;
  }
  return url;
}

bool httpPATCH(String url, String body) {
  HTTPClient http;
  http.setTimeout(2000); // Timeout de 2s para evitar travar o loop
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  int code = http.PATCH(body);
  http.end();
  return (code == HTTP_CODE_OK);
}

// ─── Enviar Leitura ao Firebase ───────────────────────────────────────────────
void reportSensorState(float dist) {
  String url  = buildURL("devices/" + DEVICE_SENSOR + "/state");
  // Envia a distância como "value". 
  String body = "{\"value\":" + String(dist, 2) + "}";
  bool ok = httpPATCH(url, body);
  
  if (ok) {
    Serial.printf("[FIREBASE] Distância %.2f cm enviada com sucesso.\n", dist);
  } else {
    Serial.println("[FIREBASE] Erro ao enviar os dados.");
  }
}

// ─── Atualiza status online do dispositivo ────────────────────────────────────
void updateOnlineStatus(bool online) {
  String url  = buildURL("devices/" + DEVICE_SENSOR);
  String ts   = String(millis());
  String body = "{\"online\":" + String(online ? "true" : "false") +
                ",\"lastSeen\":" + ts + "}";
  httpPATCH(url, body);
  Serial.println(online ? "[ESP32] Marcado como ONLINE no Firebase" : "[ESP32] Marcado como OFFLINE");
}

void setup() {
  Serial.begin(115200); 
  
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(ledVerde,    OUTPUT);
  pinMode(ledAmarelo,  OUTPUT);
  pinMode(ledVermelho, OUTPUT);

  // ─── Conectar ao WiFi ───────────────────────────────────────────────────────
  Serial.println();
  Serial.printf("Conectando ao WiFi: %s\n", WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  int tries = 0;
  while (WiFi.status() != WL_CONNECTED && tries < 30) {
    delay(500);
    Serial.print(".");
    tries++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.printf("\nConectado! IP: %s\n", WiFi.localIP().toString().c_str());
    updateOnlineStatus(true);
  } else {
    Serial.println("\n[ERRO] WiFi não conectou! Rodando apenas localmente.");
  }
}

void loop() {
  // ─── Leitura do Sensor ──────────────────────────────────────────────────────
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);

  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  duration = pulseIn(echoPin, HIGH);
  distance = duration * 0.0343 / 2;

  // ─── Lógica Local dos LEDs ──────────────────────────────────────────────────
  digitalWrite(ledVerde,    LOW);
  digitalWrite(ledAmarelo,  LOW);
  digitalWrite(ledVermelho, LOW);

  if (distance >= 12.0) {
    digitalWrite(ledVerde, HIGH);
  } else if (distance >= 7.0) {
    digitalWrite(ledAmarelo, HIGH);
  } else {
    digitalWrite(ledVermelho, HIGH);
  }

  // ─── Enviar para o Firebase periodicamente ──────────────────────────────────
  unsigned long now = millis();
  if (now - lastReport >= REPORT_INTERVAL) {
    lastReport = now;
    if (WiFi.status() == WL_CONNECTED) {
      reportSensorState(distance);
    }
  }

  delay(100);
>>>>>>> cd5bfdf905b11e2d606ac43f2ff3b580bd445c0f
}