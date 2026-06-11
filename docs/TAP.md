# Termo de Abertura de Projeto (TAP)

**Projeto:** SmartBin Monitor — Sistema de Monitoramento de Lixeiras Inteligentes com IoT  
**Disciplina:** Projeto de Engenharia Integrada (PEI) — UNIFAN  
**Curso:** Engenharia da Computação / Ciência da Computação  
**Instituição:** UNIFAN — Centro Universitário UNIFAN  
**Data de Elaboração:** Maio de 2026  
**Versão:** 1.0

---

## 1. Identificação do Projeto

| Campo | Valor |
|---|---|
| **Nome do Projeto** | SmartBin Monitor |
| **Código/Sigla** | TDE-IoT-UNIFAN |
| **Área Temática** | Internet das Coisas (IoT) / Cidades Inteligentes |
| **Natureza** | Trabalho de Disciplina / Protótipo Funcional |
| **Patrocinador/Orientador** | Professor(a) da disciplina PEI |
| **Equipe** | Yannes (discente) + colaboradores |
| **Início Previsto** | Abril de 2026 |
| **Término Previsto** | Julho de 2026 |

---

## 2. Justificativa

O gerenciamento ineficiente de resíduos sólidos urbanos é um problema crescente em cidades e campi universitários. A ausência de informações em tempo real sobre o estado das lixeiras leva a coletas desnecessárias (aumentando custos de combustível e emissão de CO₂) ou a lixeiras transbordando (comprometendo higiene e saúde pública).

Este projeto propõe uma solução de baixo custo baseada em IoT para monitorar remotamente o nível de preenchimento de lixeiras em tempo real, utilizando:

- Hardware acessível (ESP32 + sensor ultrassônico HC-SR04)
- Infraestrutura serverless e gratuita (Firebase)
- Interface web moderna e responsiva (React + Leaflet)

**Alinhamento com ODS:** O projeto contribui com os Objetivos de Desenvolvimento Sustentável da ONU, especialmente:
- **ODS 11** — Cidades e Comunidades Sustentáveis
- **ODS 12** — Consumo e Produção Responsáveis

---

## 3. Objetivo Geral

Desenvolver um sistema de monitoramento IoT de lixeiras inteligentes que permita a visualização em tempo real do nível de preenchimento, status e localização geográfica das lixeiras através de um painel web, integrando hardware (ESP32), firmware embarcado e uma aplicação web moderna com Firebase como backend.

---

## 4. Objetivos Específicos

| # | Objetivo | Indicador de Sucesso |
|---|---|---|
| 1 | Desenvolver firmware ESP32 para leitura do sensor HC-SR04 e envio ao Firebase | Dados atualizados no Firebase a cada 5 segundos |
| 2 | Implementar dashboard web React com mapa Leaflet interativo | Mapa exibindo lixeiras com marcadores coloridos por status |
| 3 | Implementar CRUD de lixeiras via interface web | Criar, editar e excluir lixeiras com persistência no Firebase |
| 4 | Implementar alertas em tempo real para lixeiras cheias | Toast notification disparado quando `fillLevel >= 85%` |
| 5 | Garantir autenticação e controle de acesso | Apenas usuários autenticados acessam o painel |
| 6 | Simular o hardware via Wokwi | Simulação funcional com dados chegando ao Firebase |

---

## 5. Escopo do Projeto

### 5.1 Incluso no Escopo (IN)

- [x] Firmware para ESP32 com leitura do sensor HC-SR04
- [x] Cálculo de nível de preenchimento (0-100%)
- [x] Envio de dados ao Firebase Realtime Database via HTTP REST
- [x] Alertas locais no hardware (LED + Buzzer)
- [x] Dashboard web com mapa geográfico interativo
- [x] Marcadores coloridos por status (normal/atenção/cheio)
- [x] CRUD completo de lixeiras (Criar, Listar, Editar, Excluir)
- [x] Autenticação Firebase (Email/Senha)
- [x] Notificações em tempo real via toast
- [x] Drawer de detalhes com telemetria da lixeira
- [x] Simulação via Wokwi
- [x] Interface responsiva (desktop e mobile)
- [x] Deploy via Firebase Hosting

### 5.2 Fora do Escopo (OUT)

- [ ] Aplicativo mobile nativo (Android/iOS)
- [ ] Integração com sistemas municipais de coleta de lixo
- [ ] Rotas otimizadas de coleta (roteirização)
- [ ] Câmeras ou visão computacional
- [ ] Análise de tipo de resíduo (reciclável vs orgânico)
- [ ] Múltiplos usuários com diferentes permissões (RBAC)
- [ ] Histórico e relatórios de coleta
- [ ] Pagamento ou monetização

---

## 6. Requisitos do Sistema

### 6.1 Requisitos Funcionais

| ID | Descrição | Prioridade |
|---|---|---|
| RF01 | O sistema deve ler o nível de preenchimento da lixeira via sensor ultrassônico | Alta |
| RF02 | O sistema deve calcular o percentual de preenchimento (0-100%) | Alta |
| RF03 | O sistema deve enviar dados ao Firebase a cada 5 segundos | Alta |
| RF04 | O sistema deve exibir o mapa com lixeiras georreferenciadas | Alta |
| RF05 | O sistema deve atualizar a interface em tempo real sem recarregar a página | Alta |
| RF06 | O sistema deve permitir cadastrar novas lixeiras com localização via mapa | Alta |
| RF07 | O sistema deve permitir editar nome e localização de lixeiras existentes | Média |
| RF08 | O sistema deve permitir excluir lixeiras cadastradas | Média |
| RF09 | O sistema deve alertar o operador quando uma lixeira atingir 85% de capacidade | Alta |
| RF10 | O sistema deve exibir o status online/offline baseado no último heartbeat | Média |
| RF11 | O acesso ao painel deve ser protegido por autenticação | Alta |
| RF12 | O sistema deve acionar LED e Buzzer quando a lixeira estiver cheia | Alta |

### 6.2 Requisitos Não Funcionais

| ID | Descrição | Categoria |
|---|---|---|
| RNF01 | A interface deve carregar em menos de 3 segundos em conexão banda larga | Performance |
| RNF02 | Os dados devem ser atualizados em até 1 segundo após mudança no Firebase | Tempo Real |
| RNF03 | A aplicação deve funcionar em Chrome, Firefox e Edge (versões recentes) | Compatibilidade |
| RNF04 | A interface deve ser responsiva para telas de 320px a 1920px | Usabilidade |
| RNF05 | Dados no Firebase só podem ser lidos/escritos por usuários autenticados | Segurança |
| RNF06 | O firmware deve tolerar falha de WiFi sem travar (modo offline) | Confiabilidade |
| RNF07 | O código deve seguir padrões ESLint configurados no projeto | Manutenibilidade |
| RNF08 | Credenciais sensíveis devem ser externalizadas em variáveis de ambiente | Segurança |

---

## 7. Arquitetura da Solução

```
[ESP32 + HC-SR04]  ←→  [Firebase Realtime DB]  ←→  [React Web App]
   (Firmware C++)         (Backend BaaS)              (Frontend)
   Wokwi Simulator        NoSQL JSON Tree             Vite + Leaflet
```

**Tecnologias:**

| Camada | Tecnologia | Versão |
|---|---|---|
| Firmware | Arduino C++ / ESP32 | ESP-IDF 5.x |
| Simulador | Wokwi | Cloud |
| BaaS | Firebase Realtime Database | v12+ |
| Autenticação | Firebase Auth | v12+ |
| Frontend | React | 19.x |
| Build Tool | Vite | 8.x |
| Estilização | Tailwind CSS | 4.x |
| Mapa | Leaflet + react-leaflet | 1.9 / 5.0 |
| Animações | Framer Motion | 12.x |
| Hosting | Firebase Hosting | — |

---

## 8. Cronograma

| Fase | Atividade | Início | Fim | Status |
|---|---|---|---|---|
| **Fase 1 - Pesquisa** | Levantamento de requisitos e tecnologias | Abr/2026 | Abr/2026 | ✅ Concluído |
| **Fase 2 - Hardware** | Desenvolvimento do firmware ESP32 + simulação Wokwi | Abr/2026 | Abr/2026 | ✅ Concluído |
| **Fase 3 - Backend** | Configuração Firebase (Database + Auth + Rules) | Abr/2026 | Abr/2026 | ✅ Concluído |
| **Fase 4 - Frontend** | Desenvolvimento da interface React + Mapa + CRUD | Abr/2026 | Mai/2026 | ✅ Concluído |
| **Fase 5 - Integração** | Integração hardware-firebase-frontend + testes | Mai/2026 | Mai/2026 | 🔄 Em andamento |
| **Fase 6 - Docs** | Documentação técnica e TAP | Mai/2026 | Mai/2026 | 🔄 Em andamento |
| **Fase 7 - Deploy** | Deploy em produção (Firebase Hosting) | Jun/2026 | Jun/2026 | ⏳ Pendente |
| **Fase 8 - Apresentação** | Apresentação final para a banca | Jul/2026 | Jul/2026 | ⏳ Pendente |

---

## 9. Recursos do Projeto

### 9.1 Recursos Humanos

| Papel | Responsabilidade |
|---|---|
| Desenvolvedor Full-Stack | Desenvolvimento frontend, backend e firmware |
| Orientador | Orientação técnica e avaliação |

### 9.2 Recursos de Hardware

| Componente | Quantidade | Uso |
|---|---|---|
| ESP32 DevKit V1 | 1 | Microcontrolador principal (ou simulado no Wokwi) |
| Sensor HC-SR04 | 1 | Medição de distância / nível de preenchimento |
| LED Vermelho | 1 | Alerta visual de lixeira cheia |
| Buzzer Passivo | 1 | Alerta sonoro de lixeira cheia |
| Resistor 220Ω | 1 | Limitador de corrente do LED |
| Cabos jumper | N/A | Conexões do circuito |
| Protoboard | 1 | Prototipagem |

### 9.3 Recursos de Software / Serviços

| Serviço | Custo | Observação |
|---|---|---|
| Firebase Realtime Database | Gratuito (Spark Plan) | 1 GB armazenamento, 10 GB/mês transferência |
| Firebase Authentication | Gratuito | 10.000 autenticações/mês |
| Firebase Hosting | Gratuito | 10 GB armazenamento, 360 MB/dia |
| Wokwi | Gratuito | Simulação ESP32 |
| GitHub | Gratuito | Controle de versão |

**Custo total estimado do projeto:** **R$ 0,00** (uso de serviços gratuitos e hardware acessível)

---

## 10. Riscos e Mitigações

| # | Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|---|
| R01 | Inconsistência de status entre firmware (`"cheia"`) e frontend (`"full"`) | Alta | Médio | Padronizar o valor de status em todo o sistema |
| R02 | Firebase Secret exposta no código do firmware | Alta | Alto | Usar arquivo `.env` ou variável de ambiente; nunca comitar em repositório público |
| R03 | Regras Firebase muito permissivas em produção | Média | Alto | Implementar regras granulares com validação de schema |
| R04 | Hardware real não disponível para demonstração | Média | Médio | Manter simulação Wokwi funcional como fallback |
| R05 | Limite do Firebase Spark Plan atingido | Baixa | Médio | Monitorar uso no console Firebase; implementar cache no frontend |
| R06 | Latência de rede afetando tempo real | Baixa | Baixo | Firebase WebSocket minimiza latência; ajustar `REPORT_INTERVAL` se necessário |
| R07 | Sensor HC-SR04 com leituras instáveis no hardware real | Média | Médio | Implementar filtro de média móvel no firmware |

---

## 11. Critérios de Aceitação

O projeto será considerado bem-sucedido quando:

- [ ] O firmware ESP32 (via Wokwi) enviar dados ao Firebase com sucesso
- [ ] O dashboard web exibir as lixeiras no mapa com marcadores coloridos
- [ ] As atualizações de nível aparecerem na interface em menos de 2 segundos
- [ ] O CRUD de lixeiras funcionar sem erros
- [ ] O alerta de lixeira cheia ser disparado automaticamente
- [ ] O sistema de autenticação impedir acesso não autorizado
- [ ] A interface funcionar corretamente em dispositivos móveis
- [ ] A documentação técnica estar completa

---

## 12. Stakeholders

| Stakeholder | Interesse | Nível de Influência |
|---|---|---|
| Equipe de desenvolvimento (Yannes) | Aprendizado, nota na disciplina | Alto |
| Professor(a) orientador(a) | Qualidade técnica e pedagógica | Alto |
| Banca avaliadora | Inovação, aplicabilidade, qualidade | Médio |
| Usuários finais (operadores de coleta) | Facilidade de uso, confiabilidade | Médio |
| Administração do campus (potencial) | Custo, escalabilidade | Baixo |

---

## 13. Entregas do Projeto

| Entrega | Artefato | Data Prevista |
|---|---|---|
| E1 — Firmware | `wokwi/wokwi.ino` + `diagram.json` | Abr/2026 ✅ |
| E2 — Frontend | Código-fonte React completo | Mai/2026 ✅ |
| E3 — Integração | Sistema integrado e funcional | Mai/2026 🔄 |
| E4 — Documentação | `docs/` (README, arquitetura, componentes, firmware, TAP) | Mai/2026 🔄 |
| E5 — Protótipo em produção | URL pública via Firebase Hosting | Jun/2026 ⏳ |
| E6 — Apresentação | Slides + demonstração ao vivo | Jul/2026 ⏳ |

---

## 14. Melhorias Futuras (Backlog)

| Prioridade | Melhoria |
|---|---|
| Alta | Corrigir inconsistência de status (`"cheia"` vs `"full"`) |
| Alta | Implementar regras Firebase granulares com validação |
| Alta | Mover `FIREBASE_SECRET` para variáveis de ambiente seguras |
| Média | Adicionar histórico de coletas com gráficos de tendência |
| Média | Implementar sistema de notificações push (FCM) |
| Média | Adicionar suporte a múltiplos usuários com roles diferentes |
| Média | Otimizar presença online com Firebase Presence Protocol |
| Baixa | Desenvolver aplicativo mobile (React Native) |
| Baixa | Implementar roteirização otimizada de coleta |
| Baixa | Adicionar filtro de média móvel no firmware (anti-ruído) |

---

## 15. Aprovações

| Papel | Nome | Assinatura | Data |
|---|---|---|---|
| Desenvolvedor | Yannes | ___________________ | ___/___/2026 |
| Orientador | ___________________ | ___________________ | ___/___/2026 |
| Coordenador(a) de curso | ___________________ | ___________________ | ___/___/2026 |

---

*Documento gerado automaticamente com base no código-fonte do projeto. Versão 1.0 — Maio 2026.*
