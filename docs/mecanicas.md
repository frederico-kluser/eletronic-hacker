# Electronic Hacker — Documento Complementar de Mecânicas

## Este documento complementa o v4.0, adicionando detalhes de mecânicas de gameplay

---

## Parte A: Portas Lógicas — Referência Completa

### Por Que Portas Lógicas?

A mecânica de portas lógicas é perfeita para minigames porque oferece:

- **Clareza visual**: inputs → gates → outputs (fluxo intuitivo da esquerda para direita)
- **Feedback imediato**: funciona ou não funciona, sem ambiguidade
- **Escalabilidade natural**: de 1 gate até circuitos complexos
- **Satisfação de maestria**: jogador "entende" o sistema e se sente inteligente

### Referência Rápida de Gates

| Gate | Símbolo | Função | Exemplo |
|------|---------|--------|---------|
| **AND** | `[AND]` | Saída 1 apenas se AMBOS inputs = 1 | 1 AND 1 = 1, 1 AND 0 = 0 |
| **OR** | `[OR]` | Saída 1 se QUALQUER input = 1 | 1 OR 0 = 1, 0 OR 0 = 0 |
| **NOT** | `[NOT]` | Inverte o input | NOT 1 = 0, NOT 0 = 1 |
| **NAND** | `[NAND]` | Inverso do AND | 1 NAND 1 = 0, 1 NAND 0 = 1 |
| **NOR** | `[NOR]` | Inverso do OR | 1 NOR 0 = 0, 0 NOR 0 = 1 |
| **XOR** | `[XOR]` | Saída 1 se inputs são DIFERENTES | 1 XOR 0 = 1, 1 XOR 1 = 0 |
| **XNOR** | `[XNOR]` | Saída 1 se inputs são IGUAIS | 1 XNOR 1 = 1, 1 XNOR 0 = 0 |

### Tabelas Verdade Completas

**AND** — "Ambos precisam estar ON"
```
A | B | Saída
0 | 0 |   0
0 | 1 |   0
1 | 0 |   0
1 | 1 |   1  ← único caso que liga
```

**OR** — "Qualquer um ON"
```
A | B | Saída
0 | 0 |   0  ← único caso que desliga
0 | 1 |   1
1 | 0 |   1
1 | 1 |   1
```

**NOT** — "Inverte"
```
A | Saída
0 |   1
1 |   0
```

**XOR** — "Apenas um ON" (Exclusive OR)
```
A | B | Saída
0 | 0 |   0
0 | 1 |   1
1 | 0 |   1
1 | 1 |   0  ← ambos ON = desliga
```

**NAND** — NOT(AND)
```
A | B | Saída
0 | 0 |   1
0 | 1 |   1
1 | 0 |   1
1 | 1 |   0  ← único caso que desliga
```

**NOR** — NOT(OR)
```
A | B | Saída
0 | 0 |   1  ← único caso que liga
0 | 1 |   0
1 | 0 |   0
1 | 1 |   0
```

### Introdução Gradual de Gates

Seguindo George Fan: "No máximo oito palavras na tela." Cada gate é introduzido isoladamente antes de combinar.

| Fase | Gate | Por que nesta ordem |
|------|------|---------------------|
| 1 | AND | Mais intuitivo: "ambos precisam estar ligados" |
| 2 | OR | Segundo mais intuitivo: "um ou outro" |
| 3 | NOT | Introduz inversão — novo conceito |
| 4 | XOR | "Diferente" — útil para seletores |
| 5 | NAND | Combinação AND + NOT |
| 6 | NOR | Combinação OR + NOT |
| 7 | XNOR | "Igual" — oposto do XOR |

### Gates para Ataque vs Defesa

| Situação | Gates Úteis | Por que |
|----------|-------------|---------|
| **Abrir porta (ataque)** | AND, OR | Combinar sinais para = 1 |
| **Evitar alarme (ataque)** | NOT, NOR | Garantir output = 0 |
| **Bloquear invasor (defesa)** | NOT, NAND, NOR | Inverter/bloquear para = 0 |
| **Caminho condicional** | XOR, XNOR | Selecionar baseado em inputs |

---

## Parte B: Variações de Puzzle

### Tipo 1: "Complete o Circuito"

**Mecânica**: Um gate está faltando. O jogador escolhe entre 2-3 opções.

```
INPUT A (1) ──┐
              ├── [ ??? ] ── DOOR
INPUT B (1) ──┘

Opções disponíveis: [AND] [OR] [XOR]
```

**Análise**:
- AND: 1 AND 1 = 1 ✓ (porta abre)
- OR: 1 OR 1 = 1 ✓ (porta abre)
- XOR: 1 XOR 1 = 0 ✗ (porta não abre)

**Por que funciona**: Ensina a mecânica básica. Múltiplas soluções corretas reduzem frustração inicial.

---

### Tipo 2: "Evite o Alarme"

**Mecânica**: O circuito tem dois outputs. O jogador precisa garantir DOOR = 1 e ALARM = 0 simultaneamente.

```
INPUT A (1) ──┬── [ ??? ] ── DOOR   (precisa = 1)
              │
INPUT B (0) ──┴── [ ??? ] ── ALARM  (precisa = 0)

Opções: [AND] [OR]
```

**Solução**:
- Para DOOR: usar OR → 1 OR 0 = 1 ✓
- Para ALARM: usar AND → 1 AND 0 = 0 ✓

**Armadilha**: Se colocar OR no alarme → 1 OR 0 = 1 → 🚨 DISPARA!

**Aprendizado**: O jogador entende que precisa pensar em AMBOS outputs.

---

### Tipo 3: "Cadeia de Gates"

**Mecânica**: Múltiplos estágios em sequência. O resultado do primeiro gate alimenta o segundo.

```
A (1) ──┐
        ├── [ ??? ] ──┐
B (0) ──┘             ├── [ ??? ] ── DOOR
                      │
C (1) ────────────────┘

Inventário: [AND] [OR] [NOT]
```

**Processo de solução**:
1. Primeiro gate: A AND B = 1 AND 0 = 0
2. Segundo gate: 0 ??? C = 0 ??? 1 = precisa ser 1
3. Portanto, segundo gate deve ser OR (0 OR 1 = 1)

**Aprendizado**: Pensamento em cascata, avaliar circuito passo a passo.

---

### Tipo 4: "Inversão Forçada"

**Mecânica**: Introduz o NOT gate. Às vezes a única solução requer inverter um sinal.

```
A (0) ──────────────┐
                    ├── [ ??? ] ── DOOR (precisa = 1)
B (0) ──────────────┘

Inventário: [AND] [OR] [NOT]
```

**Problema**: Com dois zeros, AND e OR sempre resultam em 0!

**Solução**: Usar NOT em um dos inputs
```
A (0) ── [NOT] ──┐
                 ├── [OR] ── DOOR
B (0) ───────────┘

NOT 0 = 1, depois 1 OR 0 = 1 ✓
```

**Aprendizado**: Às vezes é preciso "criar" um sinal 1 a partir de 0.

---

### Tipo 5: "Seletor de Rota" (XOR Avançado)

**Mecânica**: O jogador controla um input "KEY" além de escolher gates.

```
SIGNAL (1) ──┬── [ ??? ] ── DOOR
             │
KEY (?) ─────┤       ← jogador escolhe 0 ou 1
             │
             └── [ ??? ] ── ALARM
```

**Conceito**: XOR funciona como "chave seletora"
- XOR com KEY=0: passa o sinal original
- XOR com KEY=1: inverte o sinal

**Aprendizado**: Manipular inputs, não apenas gates.

---

### Tipo 6: "Construção Livre"

**Mecânica**: Dado um objetivo, o jogador tem inventário limitado de gates e constrói a solução do zero.

```
╔══════════════════════════════════════════════════════════════╗
║  OBJETIVO: DOOR = 1, ALARM = 0                               ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  INPUTS:              OUTPUTS:                               ║
║  A = 1                DOOR = ?                               ║
║  B = 0                ALARM = ?                              ║
║  C = 1                                                       ║
║                                                              ║
║  ┌────────────────────────────────────────────────────────┐  ║
║  │                                                        │  ║
║  │              ÁREA DE CONSTRUÇÃO                        │  ║
║  │           (arraste e conecte gates)                    │  ║
║  │                                                        │  ║
║  └────────────────────────────────────────────────────────┘  ║
║                                                              ║
║  INVENTÁRIO: [AND] [AND] [OR] [NOT]                          ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

**Aprendizado**: Criatividade dentro de constraints. Múltiplas soluções possíveis.

---

## Parte C: Sistema de Múltiplos Caminhos (Detalhado)

### Filosofia: Autonomia Máxima (Princípio Wright)

Cada puzzle oferece **2-4 caminhos** para a porta alvo. Todos funcionam, mas com trade-offs diferentes.

### Estrutura Visual de Caminhos

```
┌────────────────────────────────────────────────────────────────┐
│                    ESTRUTURA DE CAMINHOS                       │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  INPUT A ●───┬───[ CAMINHO SEGURO ]───────────────┐            │
│              │    4 gates, solução clara          │            │
│              │                                    │            │
│  INPUT B ●───┼───[ CAMINHO BALANCEADO ]───────────┼─── 🚪 DOOR │
│              │    3 gates, requer planejamento    │            │
│              │                                    │            │
│  INPUT C ●───┴───[ CAMINHO ARRISCADO ]────────────┤            │
│                   2 gates, margem mínima de erro  │            │
│                                                   │            │
│              ●────────────────────────────────────┴─── 🚨 ALARM│
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Características de Cada Caminho

| Caminho | Gates | Dificuldade | Risco de Alarme | Tempo | Perfil do Jogador |
|---------|-------|-------------|-----------------|-------|-------------------|
| 🟢 **Seguro** | 4-5 | Fácil | Baixo | Longo | Iniciantes, cautelosos |
| 🟡 **Balanceado** | 3 | Médio | Médio | Médio | Jogadores experientes |
| 🔴 **Arriscado** | 1-2 | Difícil | Alto | Curto | Speedrunners, experts |

### Exemplo Concreto: Puzzle com 3 Caminhos

```
INPUTS:                                              OUTPUTS:
A = 1  ●────┬────[ ? ]────[ ? ]────[ ? ]────[ ? ]────┐
            │         CAMINHO SEGURO                 │
            │                                        ├──── 🚪 DOOR
B = 0  ●────┼────────[ ? ]────[ ? ]────[ ? ]─────────┤
            │         CAMINHO BALANCEADO             │
            │                                        │
C = 1  ●────┴────────────────[ ? ]───────────────────┤
                       CAMINHO ARRISCADO             │
                                                     │
       ●─────────────────────────────────────────────┴──── 🚨 ALARM

INVENTÁRIO: [AND] [AND] [AND] [OR] [OR] [NOT] [XOR]
```

**Análise dos Caminhos**:

**Caminho Seguro** (4 gates):
- Usa A → múltiplas transformações → DOOR
- Mesmo errando um gate, os outros compensam
- Leva mais tempo, mas difícil disparar alarme

**Caminho Balanceado** (3 gates):
- Combina A e B de forma eficiente
- Requer entender como gates interagem
- Tempo médio, risco médio

**Caminho Arriscado** (1 gate):
- Usa C diretamente
- UM gate errado = alarme
- Extremamente rápido se acertar

### Por Que Múltiplos Caminhos Funcionam

**Autonomia** (Self-Determination Theory):
- Jogador ESCOLHE sua abordagem
- Não existe "jeito certo" forçado
- Expressão de estilo pessoal

**Possibility Space** (Will Wright):
- Mesmos inputs, mesmos gates, múltiplas soluções
- Jogador pode resolver de forma que ninguém mais resolveu
- Ownership da solução

**Replay Value**:
- Completou pelo caminho seguro? Tente o arriscado!
- Speedrunners otimizam o caminho mais rápido
- Perfeccionistas buscam a solução mais elegante

### Feedback Visual de Caminhos

Quando jogador escolhe um caminho, os outros ficam "dimmed":

```
ANTES (todos disponíveis):           DEPOIS (caminho escolhido):
                                    
A ●──┬── CAMINHO 1 ──┐              A ●──┬── ░░░░░░░░ ──┐
     │               │                   │   (dimmed)   │
B ●──┼── CAMINHO 2 ──┼── 🚪         B ●──┼── CAMINHO 2 ──┼── 🚪
     │               │                   │   (ATIVO!)   │
C ●──┴── CAMINHO 3 ──┘              C ●──┴── ░░░░░░░░ ──┘
                                              (dimmed)
```

---

## Parte D: Sistema de Invasores (Detalhado)

### Tipos de Invasores

#### 1. 🛡️ ADMIN (Administrador de Rede)

O sistema de defesa do alvo detecta sua invasão e contra-ataca.

**Comportamento**:
- Aparece após ~5 segundos de hack iniciado
- Progresso gradual: 0% → 100%
- Se chegar a 100% antes de você completar → SUA_DOOR é atacada
- Velocidade aumenta com a dificuldade do puzzle

```
┌─────────────────────────────────────┐
│  ⚠️ ADMIN DETECTOU SUA INVASÃO     │
│                                     │
│  Contra-ataque: [████████░░] 78%    │
│                                     │
│  Defenda seu sistema!               │
└─────────────────────────────────────┘
```

**Níveis de Admin**:

| Tipo | Velocidade | Complexidade | Aparece em |
|------|------------|--------------|------------|
| 🟢 Trainee | Lento (15s) | 1-2 gates | Fase 1-2 |
| 🟡 Standard | Médio (10s) | 2-3 gates | Fase 3 |
| 🔴 Senior | Rápido (7s) | 3-4 gates | Fase 4 |
| ⚫ Elite | Muito rápido (5s) | 4+ gates | Boss |

#### 2. 🏴‍☠️ HACKER RIVAL

Outros hackers detectam você na rede e tentam hackear você por oportunismo ou rivalidade.

**Comportamento**:
- Aparece aleatoriamente (~30% dos puzzles avançados)
- Mais agressivo que Admin
- Envia padrões de ataque mais complexos
- **ROUBA SEU DINHEIRO** se te hackear

```
┌─────────────────────────────────────┐
│  🏴‍☠️ HACKER "DarkNode" TE ENCONTROU │
│                                     │
│  "Vou pegar seus dados, noob!"      │
│                                     │
│  Ataque: [██████░░░░] 56%           │
│                                     │
│  Se passar: Rouba ~$1,100           │
└─────────────────────────────────────┘
```

#### 3. 🤖 FIREWALL AUTOMÁTICO

Sistema de defesa passivo que reage a erros do jogador.

**Comportamento**:
- Ativa se jogador disparar ALARM_ALVO
- Envia contra-ataque imediato e poderoso
- Punição por erro, não por tempo

```
┌─────────────────────────────────────┐
│  🤖 FIREWALL ATIVADO!               │
│                                     │
│  Você disparou o alarme do alvo.    │
│  Contra-ataque automático iniciado! │
│                                     │
│  Ataque: [██████████] 100%          │
└─────────────────────────────────────┘
```

#### 4. 🍯 HONEYPOT

Armadilha disfarçada de vulnerabilidade.

**Comportamento**:
- Parece um caminho fácil
- Se o jogador usar, aumenta rastreamento massivamente
- Não causa dano direto, mas expõe você

```
┌─────────────────────────────────────┐
│  🍯 HONEYPOT DETECTADO!             │
│                                     │
│  Você caiu em uma armadilha!        │
│  Rastreamento: +40%                 │
│                                     │
└─────────────────────────────────────┘
```

#### 5. 👮 POLÍCIA DIGITAL

Aparece quando heat está alto.

**Comportamento**:
- Muito agressivo
- Aumenta heat se você escapar
- Não rouba dinheiro, mas te rastreia

```
┌─────────────────────────────────────┐
│  👮 ALERTA: POLÍCIA NA REDE         │
│                                     │
│  Agentes monitorando sua conexão!   │
│  Heat: +25% se detectado            │
│                                     │
│  Ataque: [████░░░░░░] 40%           │
└─────────────────────────────────────┘
```

#### 6. 🕵️ INVESTIGADOR (Boss)

Aparece quando heat está crítico (>75%).

**Comportamento**:
- Extremamente perigoso
- Se te pegar = Game Over imediato
- Aparece como evento especial

```
╔═════════════════════════════════════════════════════════════════╗
║  🔴 ALERTA: INVESTIGADOR NA REDE                                ║
╠═════════════════════════════════════════════════════════════════╣
║                                                                 ║
║  Agente "CIPHER" está rastreando você!                          ║
║                                                                 ║
║  Ele tem:                                                       ║
║  • Ferramentas de rastreamento avançadas                        ║
║  • Acesso a logs de múltiplos sistemas                          ║
║  • Autorização para contra-ataque                               ║
║                                                                 ║
║  Se ele te encontrar: GAME OVER imediato                        ║
║                                                                 ║
║  Dica: Complete o trabalho RÁPIDO ou ABORTE                     ║
║                                                                 ║
╚═════════════════════════════════════════════════════════════════╝
```

### Tabela Resumo de Invasores

| Invasor | Frequência (Legal) | Frequência (Ilegal) | Dano |
|---------|-------------------|---------------------|------|
| Admin | 5% | 100% | Hackeia sua porta |
| Hacker Rival | 2% | 40% | Rouba dinheiro |
| Firewall | 0% | 30% (se errar) | Hackeia imediato |
| Honeypot | 0% | 15% | +Rastreamento |
| Polícia | 0% | 10% (heat >50%) | +Heat |
| Investigador | 0% | 10% (heat >75%) | Game Over |

### Mecânica de Defesa Detalhada

Quando um invasor ataca, o jogador vê o circuito de defesa:

```
┌─────────────────────────────────────────────────────────┐
│  🛡️ DEFESA NECESSÁRIA                                   │
│                                                         │
│  SINAL DO INVASOR: 1                                    │
│                                                         │
│  INVASOR (1) ───┬─── [ ??? ] ─── 🚪 SUA PORTA (= 0!)   │
│                 │                                       │
│                 └─── [ ??? ] ─── 🚨 SEU ALARME (ok)    │
│                                                         │
│  Objetivo: Faça SUA PORTA = 0                           │
│                                                         │
│  Dica: NOT inverte o sinal!                             │
└─────────────────────────────────────────────────────────┘
```

**Defesa Simples** (fases iniciais):
- Invasor envia sinal 1
- Jogador coloca NOT → 1 vira 0 → porta bloqueada

**Defesa Complexa** (fases avançadas):
- Invasor envia múltiplos sinais
- Jogador precisa combinar gates para bloquear todos
- Timing: defender enquanto continua atacando

### Fluxo de Gameplay com Invasor

```
TEMPO    ATAQUE                    DEFESA
─────────────────────────────────────────────────────────
0s       Puzzle aparece            (tranquilo)
         Jogador analisa           
                                   
3s       Coloca primeiro gate      
         Progresso: 25%            
                                   
5s       Coloca segundo gate       ⚠️ ADMIN DETECTADO
         Progresso: 50%            Contra-ataque: 0%
                                   
7s       Coloca terceiro gate      Contra-ataque: 30%
         Progresso: 75%            
                                   
9s       (jogador alterna foco)    Coloca gate de defesa
                                   Defesa configurada!
                                   
11s      Coloca quarto gate        Contra-ataque: 80%
         Progresso: 100%           (mas defesa OK)
                                   
12s      EXECUTA!                  Admin bloqueado!
         ────────────────────────────────────────────
         ✅ VITÓRIA COMPLETA!
```

---

## Parte E: Mecânicas Avançadas

### Signal Trace (Modo Debug)

**Trade-off estratégico**: Informação custa tempo.

- Jogador clica "TRACE"
- Sinais propagam em slow-motion (500ms por gate)
- Cores: 🟢 = 1, 🔴 = 0
- Se ALARM acenderia, warning pisca ANTES de confirmar
- **Custo**: 2 segundos do timer

**Por que funciona**: Autonomia (jogador escolhe usar ou não) + Competência (experts não precisam, novatos sim).

### Gates Queimados (Travados)

Alguns gates já estão no circuito mas **travados** (🔒) — o jogador não pode removê-los, só trabalhar ao redor.

```
A (1) ── [AND 🔒] ──┐
                    ├── [ ??? ] ── 🚪 DOOR
B (0) ──────────────┘
```

O AND travado vai outputar 0 (porque 1 AND 0 = 0). O jogador precisa compensar.

**Princípio Yokoi**: Constraints fomentam criatividade.

### Gates Instáveis

Alguns gates têm **comportamento probabilístico**:

```
[OR*] = 80% funciona como OR, 20% funciona como AND
```

**Feedback visual**: Gate treme, cor diferente, ícone de raio ⚡

**Escolha do jogador**: Arriscar o gate instável ou encontrar solução segura?

**Design**: Seguindo Fiorillo et al., incerteza de ~50% maximiza dopamina.

### Circuito Vivo

O circuito muda durante a resolução:

- A cada 3 segundos, um input aleatório troca de valor (0↔1)
- Inputs que vão mudar piscam como warning
- Jogador precisa de solução que funcione em MÚLTIPLAS configurações

**Flow intensificado**: Não basta resolver — precisa resolver de forma robusta.

### Contra-Hack

O sistema de segurança tenta reverter as mudanças do jogador:

- Após colocar gate, 30% chance do sistema "empurrar" de volta
- Jogador deve recolocar rapidamente
- Recurso limitado: 2 "fixadores" por puzzle travam gates permanentemente

---

## Parte F: Game Feel e Juice (Detalhado)

### Priorização de Técnicas por Impacto

Seguindo Jan Willem Nijman:

| Prioridade | Técnica | Impacto |
|------------|---------|---------|
| 1 | **Efeitos sonoros** | Adiciona dimensão inteira instantaneamente |
| 2 | **Screen shake** | Impacto visceral, rápido de implementar |
| 3 | **Propagação visual** | Core do feedback do jogo |
| 4 | **Partículas** | Recompensa visual por ações |
| 5 | **Easing/tweening** | Faz tudo parecer polido |

### Feedback Detalhado por Ação

**Pegar gate**:
- Som: Click suave, tom alto
- Visual: Gate levanta levemente, sombra aparece
- Cursor: Muda para "segurando"

**Soltar gate em slot válido**:
- Som: Snap metálico satisfatório (transiente forte)
- Visual: Gate "encaixa" com pequeno bounce
- Partículas: Faíscas sutis de conexão
- Fios: "Acendem" mostrando conexão

**Soltar gate em slot inválido**:
- Som: Buzz negativo suave
- Visual: Gate volta para inventário com ease-out
- Sem punição — apenas "não funcionou"

**Testar circuito (clicar EXECUTAR)**:
- Som: Whoosh elétrico crescente
- Visual: Barra de delay aparece "PROCESSANDO..."
- Durante delay: Jogador vulnerável, tensão máxima

**Sinais propagando**:
- Velocidade: ~200ms por gate (rápido mas legível)
- Cores mudam: cinza → verde (1) ou vermelho (0)
- Som: Click sutil por gate
- Gates "pulsam" quando sinal passa

**Sucesso (porta abre)**:
- Som: Click mecânico + chime ascendente + "ACCESS GRANTED"
- Visual: Flash verde (100ms), porta desliza
- Screen shake: Sutil, positivo (5px, 100ms)
- Partículas: "Dados" fluindo para porta

**Falha (alarme dispara)**:
- Som: Buzz harsh + sirene curta (500ms)
- Visual: Flash vermelho (2-3 pulsos)
- Screen shake: Médio (15px, 300ms)
- Highlight: Caminho que causou o alarme em vermelho
- Texto: "BREACH DETECTED" com glitch effect

**Você foi hackeado**:
- Som: Alarme pessoal + "COMPROMISED!"
- Visual: Flash vermelho intenso no lado esquerdo
- Screen shake: Forte (20px, 500ms)
- Glitch visual na sua tela
- Números de dinheiro caindo (se hacker roubou)

### Feedback Sonoro Completo

| Ação | Descrição do Som |
|------|------------------|
| Pegar gate | Click suave, tom alto |
| Soltar gate em slot | Snap metálico satisfatório |
| Gate conecta a fio | Bleep eletrônico curto |
| Remover gate | Som reverso do snap |
| Hover sobre slot válido | Hum elétrico sutil |
| Timer < 5s | Beeps a cada segundo |
| Timer < 3s | Beeps acelerando |
| Clicar TRACE | Whoosh + som de "scanning" |
| Testar circuito | Som de eletricidade propagando |
| Sinal passando por gate | Click sutil por gate |
| Porta abre | Click mecânico + slide + chime |
| Alarme dispara | Buzz harsh + sirene curta |
| Sendo hackeado | Alarme + heartbeat |
| Dinheiro roubado | Som de vidro quebrando |
| Recebendo pagamento | "Cha-ching" satisfatório |
| Comprando hardware | Confirmação + upgrade sound |
| Pagando contas | Transferência + beep |

### Timer como Instrumento de Tensão

```
Tempo    Visual                      Áudio           Intensidade
─────────────────────────────────────────────────────────────────
10s      [██████████] branco         Silêncio        ░░░░░░░░░░
7s       [███████░░░] branco         Silêncio        ░░░░░░░░░░
5s       [█████░░░░░] amarelo        Beep único      ███░░░░░░░
3s       [███░░░░░░░] laranja        Beeps/segundo   █████░░░░░
2s       [██░░░░░░░░] vermelho       Beeps rápidos   ███████░░░
1s       [█░░░░░░░░░] vermelho       Beeps urgentes  █████████░
         pulsando
0s       [░░░░░░░░░░] flash          ALARME          ██████████
```

---

## Parte G: Ensinando Sem Tutorial

### Princípio: A "Fiction" Ensina

Seguindo Chaim Gingold e WarioWare, cada elemento visual deve comunicar sua função:

- Fios parecem fios elétricos → "sinais fluem por aqui"
- Gates parecem chips/componentes → "isso processa o sinal"
- Porta parece porta → "objetivo é abrir isso"
- Alarme parece sirene vermelha → "isso é perigoso"
- Admin parece ameaça → "preciso me defender"

### Sequência de Onboarding

**Puzzle 1: Impossível Errar**

```
╔═══════════════════════════════════════╗
║  🔓 SECURITY PANEL                    ║
╠═══════════════════════════════════════╣
║                                       ║
║  POWER ●━━━━[ ??? ]━━━━● DOOR         ║
║                                       ║
║  Arraste para o slot:                 ║
║  ┌───────┐                            ║
║  │  AND  │  ← (piscando)              ║
║  └───────┘                            ║
║                                       ║
╚═══════════════════════════════════════╝
```

- 1 input (sempre = 1)
- 1 gate (só AND disponível)
- 1 slot
- Sem alarme, sem timer

**Resultado**: Qualquer ação → sucesso. Mecânica aprendida em 5 segundos.

**Puzzle 2: Alarme Visível mas Seguro**

```
POWER (1) ━━━[ AND ]━━━┬━━━● DOOR
                       │
          (0) ━━━━━━━━━┴━━━● ALARM ⚠️
```

Alarme conectado a input fixo 0. Impossível disparar.

**Propósito**: Jogador VÊ que alarme existe mas sem risco.

**Puzzle 3: Primeira Escolha Real**

```
A (1) ━━━[ ??? ]━━━● DOOR

Opções: [AND] [OR]
```

Primeiro puzzle onde PODE errar. Feedback de erro:
- Rápido (500ms)
- Claro (sirene + vermelho)
- Reinício instantâneo

**Puzzle 4: Timer Aparece**

Mesmo puzzle simples, mas timer inicia na primeira ação.

**Puzzle 6: Múltiplos Caminhos**

```
╔═══════════════════════════════════════════════════════════════╗
║  💡 NOVO: Múltiplos caminhos!                                 ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  A (1) ●──┬── CAMINHO FÁCIL (use OR) ──┐                     ║
║           │                             ├── 🚪 DOOR           ║
║  B (0) ●──┴── CAMINHO RÁPIDO (use ?) ──┘                     ║
║                                                               ║
║  Escolha seu caminho! Ambos funcionam.                        ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

**Puzzle 11: Introduz Defesa**

```
╔═══════════════════════════════════════════════════════════════╗
║  💡 NOVO: Defenda seu sistema!                                ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Um ADMIN está tentando hackear você!                         ║
║                                                               ║
║  INVASOR (1) ───[ ??? ]─── 🚪 SUA PORTA                       ║
║                                                               ║
║  Objetivo: Faça SUA PORTA = 0                                 ║
║  Dica: NOT inverte! (1 → 0)                                   ║
║                                                               ║
║  Inventário: [NOT]                                            ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

**Puzzle 13: Ataque + Defesa**

```
╔═══════════════════════════════════════════════════════════════╗
║  💡 Agora você ataca E defende!                               ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  DEFESA (esquerda)         │  ATAQUE (direita)                ║
║  ─────────────────         │  ────────────────                ║
║                            │                                  ║
║  ADMIN (1) ──[?]── 🚪      │  A (1) ──[?]── 🚪 ALVO          ║
║                            │                                  ║
║  Bloqueie o admin!         │  Abra a porta!                   ║
║                            │                                  ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## Parte H: Anti-Patterns a Evitar

### ❌ Puzzles Baseados em Sorte

**Problema**: Solução depende de adivinhar.

**Solução**: Valores de inputs sempre visíveis. TRACE permite calcular antes.

### ❌ Soluções Não-Intuitivas

**Problema**: Resposta parece arbitrária.

**Solução**: Lógica clara. Feedback explica POR QUE falhou.

### ❌ Punição Excessiva

**Problema**: Errar custa muito.

**Solução**: Reinício <500ms. Erro reinicia puzzle, não sequência.

### ❌ Timer Curto nos Primeiros Níveis

**Problema**: Novato não tem tempo de pensar.

**Solução**: Níveis 1-2 sem timer. Timer generoso (15s+) até fase 3.

### ❌ Muita Informação de Uma Vez

**Problema**: Todos os gates no nível 1.

**Solução**: Um gate novo por 2-3 níveis.

### ❌ Feedback Ambíguo

**Problema**: Jogador não sabe por que falhou.

**Solução**: Highlight do caminho que causou erro.

### ❌ Caminhos Falsos

**Problema**: Um caminho parece viável mas é armadilha.

**Solução**: Todos os caminhos REALMENTE funcionam.

### ❌ Defesa Impossível

**Problema**: Admin ataca mais rápido que humanamente possível.

**Solução**: Sempre dar tempo suficiente. Admin lento nos tutoriais.

### ❌ Muita Informação Visual

**Problema**: Dois circuitos + timer + invasor = overload.

**Solução**: Introduzir gradualmente. Cores distintas por sistema.

---

## Parte I: Métricas de Playtest

### O Que Observar

| Métrica | ✅ Bom | ❌ Problema |
|---------|--------|------------|
| Tempo no puzzle 1 | < 10s | > 30s |
| Taxa de retry média | 1-2 tentativas | > 5 tentativas |
| Expressão facial | Concentração → satisfação | Confusão → frustração |
| "Mais um nível" | Continua voluntariamente | Para após 2-3 |
| Verbalização | "Ah, entendi!" | "Não faz sentido" |
| Wife-o-meter | Não-gamer completa Fase 1 | Não-gamer desiste |

### Perguntas de Playtest

1. "Você entendeu o objetivo imediatamente?"
2. "Quando errou, você entendeu por quê?"
3. "O timer estressou de forma boa ou ruim?"
4. "Você quis continuar após terminar?"
5. "Algum puzzle pareceu injusto?"
6. "Você se sentiu inteligente ao resolver?"
7. "O que te fez querer jogar de novo?"
8. "Quando foi hackeado, entendeu como se defender?"

---

## Parte J: Expansões Futuras

### Novos Tipos de Gate

- **MUX (Multiplexador)**: Seletor de 2 inputs baseado em control signal
- **BUFFER**: Passa o sinal com delay (mecânica de timing)
- **TRI-STATE**: Pode ter estado "desconectado" além de 0/1

### Novos Elementos de Circuito

- **Capacitor**: Armazena sinal por X segundos
- **Flip-Flop**: Memória de 1 bit, toggle entre estados
- **Clock**: Gera pulsos em intervalo regular

### Modos Especiais

- **Daily Challenge**: Um puzzle novo por dia, leaderboard global
- **Editor**: Jogadores criam e compartilham puzzles
- **Torneios**: Competições semanais com prêmios
