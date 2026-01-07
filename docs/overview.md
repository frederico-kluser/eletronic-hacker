# Electronic Hacker: Minigame de Hackeamento com Portas Lógicas

## Documento de Design — Versão 4.0

---

## Visão Geral

**Electronic Hacker** é um minigame de hackeamento baseado em lógica digital onde o jogador vive a vida de um hacker underground. O jogador precisa equilibrar trabalhos, investimentos em hardware, e sua própria sobrevivência — porque hackers podem roubar seu dinheiro, e as contas do mês não esperam.

### O Loop Central do Jogo

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                         💰 GANHAR DINHEIRO                                  │
│                                │                                            │
│              ┌─────────────────┼─────────────────┐                          │
│              │                 │                 │                          │
│              ▼                 ▼                 ▼                          │
│     ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                   │
│     │   TRABALHO   │  │   TRABALHO   │  │   HACKEAR    │                   │
│     │    LEGAL     │  │   ILEGAL     │  │   OUTROS     │                   │
│     │    ($)       │  │   ($$$)      │  │   ($$$$)     │                   │
│     │   Seguro     │  │   Arriscado  │  │   PvP        │                   │
│     └──────────────┘  └──────────────┘  └──────────────┘                   │
│                                │                                            │
│                                ▼                                            │
│                    ┌─────────────────────┐                                  │
│                    │   💸 PAGAR CONTAS   │◄────── Todo mês!                │
│                    │   Aluguel, Luz, Net │                                  │
│                    └─────────────────────┘                                  │
│                                │                                            │
│              ┌─────────────────┼─────────────────┐                          │
│              │                 │                 │                          │
│              ▼                 ▼                 ▼                          │
│     ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                   │
│     │   INVESTIR   │  │   RESERVA    │  │   VENDER     │                   │
│     │  EM HARDWARE │  │  DE EMERGÊN. │  │   HARDWARE   │                   │
│     │   (upgrade)  │  │  (segurança) │  │  (desespero) │                   │
│     └──────────────┘  └──────────────┘  └──────────────┘                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### As Três Formas de Game Over

| Tipo | Causa | Prevenção |
|------|-------|-----------|
| 🚔 **Captura** | Pego pelo Admin em trabalho ilegal | Não fazer ilegais, usar VPN, Kill Switch |
| 💀 **Falência** | Sem dinheiro E sem hardware para vender | Manter reserva, não ser hackeado |
| ☠️ **Hackeado** (MP) | Outro jogador drena sua conta | Investir em defesa |

---

## Parte I: Conceito Core e Mecânicas de Gameplay

### Por Que Portas Lógicas?

A mecânica de portas lógicas é perfeita para minigames porque oferece:

- **Clareza visual**: inputs → gates → outputs (fluxo intuitivo da esquerda para direita)
- **Feedback imediato**: funciona ou não funciona, sem ambiguidade
- **Escalabilidade natural**: de 1 gate até circuitos complexos
- **Satisfação de maestria**: jogador "entende" o sistema e se sente inteligente

### A Metáfora Visual

O jogador vê um **painel de circuito** com três zonas:

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY PANEL v2.1                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   INPUTS          ZONA DE CONSTRUÇÃO           OUTPUTS      │
│                                                             │
│   A ●━━━━━━━━━┓                              ┏━━● 🚪 DOOR   │
│               ┣━━━━━[ ??? ]━━━━[ ??? ]━━━━━━━┫              │
│   B ●━━━━━━━━━┛                              ┗━━● 🚨 ALARM  │
│                                                             │
│   INVENTÁRIO: [AND] [OR] [NOT]                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

| Zona | Função |
|------|--------|
| **Inputs (esquerda)** | Sinais fixos (0 ou 1), representados como fios apagados/acesos |
| **Construção (centro)** | Slots vazios onde o jogador arrasta gates |
| **Outputs (direita)** | DOOR (precisa = 1 para abrir) e ALARM (se = 1, game over) |

### Condições de Vitória e Derrota (Por Puzzle)

| Resultado | Condição | Feedback |
|-----------|----------|----------|
| ✅ **Vitória Completa** | DOOR_ALVO = 1 E SUA_DOOR = 0 | "HACK SUCCESSFUL + DEFENDED" |
| ⚠️ **Vitória Parcial** | DOOR_ALVO = 1 MAS SUA_DOOR = 1 | "HACKED BUT COMPROMISED" (menos pontos) |
| ❌ **Alarme do Alvo** | ALARM_ALVO = 1 | "DETECTED - HACK FAILED" |
| ❌ **Hackeado** | SUA_DOOR = 1 (antes de completar) | "YOU WERE HACKED" + dinheiro roubado |
| ❌ **Timeout** | Timer = 0 | "CONNECTION LOST" |

---

## Parte II: O Sistema Dual de Circuitos

### Conceito Central: Dualidade Ataque/Defesa

**O jogador gerencia dois circuitos simultaneamente**:
1. **Circuito de Ataque**: Invadir o sistema alvo (DOOR_ALVO = 1, ALARM_ALVO = 0)
2. **Circuito de Defesa**: Proteger seu sistema (SUA_DOOR = 0, impedir invasão)

```
╔═══════════════════════════════════════════════════════════════════════════╗
║                         ELECTRONIC HACKER                                  ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   SEU SISTEMA (DEFENDER)          │        ALVO (ATACAR)                  ║
║   ─────────────────────           │        ─────────────                  ║
║                                   │                                       ║
║   🚪 SUA PORTA ← [proteger]       │        [invadir] → 🚪 PORTA ALVO      ║
║   🚨 SEU ALARME                   │                    🚨 ALARME ALVO     ║
║                                   │                                       ║
║   ⚠️ ADMIN tentando hackear você! │        Timer: [████░░] 6.2s          ║
║                                   │                                       ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

### Circuito de Ataque (Lado Direito)

**Objetivo**: DOOR_ALVO = 1, ALARM_ALVO = 0

O jogador tem **múltiplos caminhos** para chegar à porta:

```
     INPUTS                CAMINHOS                      OUTPUTS
                    
                      ┌─── CAMINHO 1 (Fácil) ───┐
                      │   Mais gates, mais tempo │
     A ●──────────────┼─── CAMINHO 2 (Médio) ───┼────── 🚪 DOOR
                      │   Balanceado             │
     B ●──────────────┼─── CAMINHO 3 (Difícil) ─┤
                      │   Menos gates, arriscado │
     C ●──────────────┴──────────────────────────┴────── 🚨 ALARM
```

### Circuito de Defesa (Lado Esquerdo)

**Objetivo**: SUA_DOOR = 0 (bloquear invasor), SEU_ALARM pode ou não disparar

```
     INVASOR                  SEU SISTEMA
                    
     ADMIN ●─────┬─── [ ? ] ─── [ ? ] ───── 🚪 SUA PORTA
                 │                              (manter = 0!)
                 └─── [ ? ] ─────────────── 🚨 SEU ALARME
                                               (opcional)
```

**Mecânica de Defesa**:
- O invasor (Admin/Hacker) envia sinais tentando abrir SUA porta
- Você precisa configurar gates para BLOQUEAR (output = 0)
- Se SUA_DOOR = 1 → Você foi hackeado! Dinheiro roubado.
- SEU_ALARM disparar não te prejudica (é SEU sistema)

### Camadas de Defesa (Baseado em Hardware)

Cada camada é um circuito adicional que o invasor precisa quebrar:

```
SISTEMA COM 1 CAMADA (básico):
                    
INVASOR ──[ ? ]── 🚪 SUA PORTA


SISTEMA COM 3 CAMADAS (Firewall Pro):

INVASOR ──[ ? ]──[ ? ]── CAMADA 1 ──┐
                                    │
          [ ? ]──[ ? ]── CAMADA 2 ──┼── 🚪 SUA PORTA
                                    │
          [ ? ]──[ ? ]── CAMADA 3 ──┘

O invasor precisa quebrar TODAS as camadas!
```

**Mecânica**:
- Cada camada = um mini-puzzle que o invasor (IA) precisa resolver
- Mais camadas = mais tempo para você completar seu ataque
- Algumas camadas têm gates pré-configurados (defesa passiva)
- Outras requerem sua configuração (defesa ativa)

---

## Parte III: Portas Lógicas — Referência Completa

### Tabela de Gates

| Gate | Símbolo | Função | Exemplo |
|------|---------|--------|---------|
| **AND** | `[AND]` | Saída 1 apenas se AMBOS inputs = 1 | 1 AND 1 = 1, 1 AND 0 = 0 |
| **OR** | `[OR]` | Saída 1 se QUALQUER input = 1 | 1 OR 0 = 1, 0 OR 0 = 0 |
| **NOT** | `[NOT]` | Inverte o input | NOT 1 = 0, NOT 0 = 1 |
| **NAND** | `[NAND]` | Inverso do AND | 1 NAND 1 = 0, 1 NAND 0 = 1 |
| **NOR** | `[NOR]` | Inverso do OR | 1 NOR 0 = 0, 0 NOR 0 = 1 |
| **XOR** | `[XOR]` | Saída 1 se inputs são DIFERENTES | 1 XOR 0 = 1, 1 XOR 1 = 0 |
| **XNOR** | `[XNOR]` | Saída 1 se inputs são IGUAIS | 1 XNOR 1 = 1, 1 XNOR 0 = 0 |

### Tabelas Verdade

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

**XOR** — "Apenas um ON"
```
A | B | Saída
0 | 0 |   0
0 | 1 |   1
1 | 0 |   1
1 | 1 |   0  ← ambos ON = desliga
```

### Introdução Gradual de Gates

| Fase | Gate Novo | Por que nesta ordem |
|------|-----------|---------------------|
| 1-2 | AND | Mais intuitivo: "ambos precisam estar ligados" |
| 3-4 | OR | Segundo mais intuitivo: "um ou outro" |
| 5-6 | NOT | Introduz inversão — novo conceito |
| 7-8 | XOR | "Diferente" — útil para seletores |
| 9-10 | NAND | Combinação AND + NOT |
| 11+ | NOR, XNOR | Gates avançados |

### Gates para Ataque vs Defesa

| Situação | Gates Úteis | Por que |
|----------|-------------|---------|
| **Abrir porta (ataque)** | AND, OR | Combinar sinais para = 1 |
| **Evitar alarme (ataque)** | NOT, NOR | Garantir output = 0 |
| **Bloquear invasor (defesa)** | NOT, NAND, NOR | Inverter/bloquear para = 0 |
| **Caminho condicional** | XOR, XNOR | Selecionar baseado em inputs |

---

## Parte IV: Variações de Puzzle

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

### Tipo 2: "Evite o Alarme"

**Mecânica**: Dois outputs. Garantir DOOR = 1 e ALARM = 0.

```
INPUT A (1) ──┬── [ ??? ] ── DOOR   (precisa = 1)
              │
INPUT B (0) ──┴── [ ??? ] ── ALARM  (precisa = 0)
```

**Armadilha**: Se colocar OR no alarme → 1 OR 0 = 1 → 🚨 DISPARA!

### Tipo 3: "Cadeia de Gates"

**Mecânica**: Múltiplos estágios em sequência.

```
A (1) ──┐
        ├── [ ??? ] ──┐
B (0) ──┘             ├── [ ??? ] ── DOOR
                      │
C (1) ────────────────┘
```

**Processo**: Avaliar circuito passo a passo.

### Tipo 4: "Inversão Forçada"

**Mecânica**: Às vezes a única solução requer inverter um sinal.

```
A (0) ──────────────┐
                    ├── [ ??? ] ── DOOR (precisa = 1)
B (0) ──────────────┘
```

**Problema**: Com dois zeros, AND e OR sempre resultam em 0!
**Solução**: Usar NOT em um dos inputs.

### Tipo 5: "Construção Livre"

**Mecânica**: Inventário limitado, jogador constrói do zero.

```
INPUTS: A=1, B=0, C=1
OUTPUTS: DOOR=?, ALARM=?
OBJETIVO: DOOR=1, ALARM=0
INVENTÁRIO: [AND] [AND] [OR] [NOT]
```

### Tipo 6: "Ataque + Defesa Simultâneos"

**Mecânica**: Resolver circuito de ataque ENQUANTO defende.

---

## Parte V: Sistema de Múltiplos Caminhos

### Filosofia: Autonomia Máxima (Princípio Wright)

Cada puzzle oferece **2-4 caminhos** para a porta alvo. Todos funcionam, mas com trade-offs.

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

| Caminho | Gates | Dificuldade | Risco | Tempo | Perfil |
|---------|-------|-------------|-------|-------|--------|
| 🟢 **Seguro** | 4-5 | Fácil | Baixo | Longo | Iniciantes |
| 🟡 **Balanceado** | 3 | Médio | Médio | Médio | Experientes |
| 🔴 **Arriscado** | 1-2 | Difícil | Alto | Curto | Speedrunners |

### Por Que Múltiplos Caminhos Funcionam

**Autonomia** (Self-Determination Theory):
- Jogador ESCOLHE sua abordagem
- Não existe "jeito certo" forçado

**Possibility Space** (Will Wright):
- Mesmos inputs, mesmos gates, múltiplas soluções
- Ownership da solução

**Replay Value**:
- Completou pelo seguro? Tente o arriscado!

---

## Parte VI: Sistema de Invasores

### Tipos de Invasores

#### 1. 🛡️ ADMIN (Administrador de Rede)

```
┌─────────────────────────────────────┐
│  ⚠️ ADMIN DETECTOU SUA INVASÃO     │
│                                     │
│  Contra-ataque: [████████░░] 78%    │
│                                     │
│  Defenda seu sistema!               │
└─────────────────────────────────────┘
```

**Comportamento**:
- Aparece após ~5 segundos de hack iniciado
- Progresso gradual: 0% → 100%
- Se chegar a 100% → ataca SUA_DOOR

**Níveis**:
| Tipo | Velocidade | Complexidade | Aparece em |
|------|------------|--------------|------------|
| 🟢 Trainee | 15s | 1-2 gates | Trabalhos legais |
| 🟡 Standard | 10s | 2-3 gates | Ilegais fáceis |
| 🔴 Senior | 7s | 3-4 gates | Ilegais médios |
| ⚫ Elite | 5s | 4+ gates | Ilegais difíceis |

#### 2. 🏴‍☠️ HACKER RIVAL

```
┌─────────────────────────────────────┐
│  🏴‍☠️ HACKER "DarkNode" TE ENCONTROU │
│                                     │
│  "Vou pegar seus dados, noob!"      │
│                                     │
│  Ataque: [██████░░░░] 56%           │
│  Se passar: Rouba ~$1,100           │
└─────────────────────────────────────┘
```

**Comportamento**:
- Aparece em ~40% dos trabalhos ilegais
- Mais agressivo que Admin
- **ROUBA SEU DINHEIRO** se te hackear

#### 3. 🤖 FIREWALL AUTOMÁTICO

**Comportamento**:
- Ativa se você disparar ALARM_ALVO
- Contra-ataque imediato e poderoso
- Punição por erro

#### 4. 🍯 HONEYPOT

**Comportamento**:
- Armadilha disfarçada de caminho fácil
- Se usar: Rastreamento +40%
- Não causa dano direto, mas expõe você

#### 5. 👮 POLÍCIA DIGITAL (Heat > 50%)

**Comportamento**:
- Aparece quando heat está alto
- Muito agressivo
- Aumenta heat se escapar

#### 6. 🕵️ INVESTIGADOR (Boss - Heat > 75%)

```
╔═════════════════════════════════════════════════════════════════╗
║  🔴 ALERTA: INVESTIGADOR NA REDE                                ║
╠═════════════════════════════════════════════════════════════════╣
║                                                                 ║
║  Agente "CIPHER" está rastreando você!                          ║
║                                                                 ║
║  Se ele te encontrar: GAME OVER imediato                        ║
║                                                                 ║
╚═════════════════════════════════════════════════════════════════╝
```

### Tabela de Frequência de Invasores

| Invasor | Trabalho Legal | Trabalho Ilegal |
|---------|----------------|-----------------|
| Admin | 5% | 100% |
| Hacker Rival | 2% | 40% |
| Firewall | 0% | 30% (se errar) |
| Honeypot | 0% | 15% |
| Polícia | 0% | 10% (heat >50%) |
| Investigador | 0% | 10% (heat >75%) |

### Fluxo de Gameplay com Invasor

```
TEMPO    ATAQUE                    DEFESA
─────────────────────────────────────────────────────────
0s       Puzzle aparece            (tranquilo)
3s       Coloca primeiro gate      
5s       Coloca segundo gate       ⚠️ ADMIN DETECTADO (0%)
7s       Coloca terceiro gate      Contra-ataque: 30%
9s       (alterna foco)            Coloca gate de defesa ✅
11s      Coloca quarto gate        Contra-ataque: 80%
12s      EXECUTA!                  Admin bloqueado!
         ────────────────────────────────────────────
         ✅ VITÓRIA COMPLETA!
```

---

## Parte VII: Mecânicas Avançadas

### Signal Trace (Modo Debug)

- Jogador clica "TRACE"
- Sinais propagam em slow-motion
- Warning pisca se ALARM acenderia
- **Custo**: 2 segundos do timer

### Gates Queimados (Travados)

Alguns gates já estão no circuito mas **travados** (🔒):

```
A (1) ── [AND 🔒] ──┐
                    ├── [ ??? ] ── 🚪 DOOR
B (0) ──────────────┘
```

Jogador não pode remover, só trabalhar ao redor.

### Gates Instáveis

Comportamento probabilístico:
```
[OR*] = 80% funciona como OR, 20% funciona como AND
```

Gate treme, ícone de raio ⚡. Jogador decide: arriscar ou solução segura?

### Circuito Vivo

- A cada 3 segundos, um input troca de valor (0↔1)
- Inputs que vão mudar piscam como warning
- Jogador precisa de solução robusta

### Contra-Hack

- Após colocar gate, 30% chance do sistema "empurrar" de volta
- 2 "fixadores" por puzzle travam gates permanentemente

---

## Parte VIII: Sistema Econômico

### Visão Geral da Economia

```
╔═════════════════════════════════════════════════════════════════════════════╗
║  📊 PAINEL FINANCEIRO                                                       ║
╠═════════════════════════════════════════════════════════════════════════════╣
║                                                                             ║
║  💰 SALDO ATUAL: $1,847                                                     ║
║                                                                             ║
║  ┌─────────────────────────────────────────────────────────────────────┐   ║
║  │  📅 PRÓXIMO PAGAMENTO DE CONTAS: 3 dias                             │   ║
║  │                                                                     │   ║
║  │  🏠 Aluguel:        $400                                            │   ║
║  │  💡 Energia:        $80                                             │   ║
║  │  🌐 Internet:       $60                                             │   ║
║  │  🍕 Alimentação:    $150                                            │   ║
║  │  ─────────────────────────                                          │   ║
║  │  📋 TOTAL MENSAL:   $690                                            │   ║
║  │                                                                     │   ║
║  │  ⚠️ Você precisa de pelo menos $690 no dia do pagamento!           │   ║
║  └─────────────────────────────────────────────────────────────────────┘   ║
║                                                                             ║
║  💾 VALOR DO SEU HARDWARE: $2,100 (se precisar vender)                     ║
║                                                                             ║
╚═════════════════════════════════════════════════════════════════════════════╝
```

### Contas Mensais

Todo mês (a cada X trabalhos ou tempo real), o jogador precisa pagar:

| Conta | Valor Base | Pode Reduzir? |
|-------|------------|---------------|
| 🏠 **Aluguel** | $400 | Não (fixo) |
| 💡 **Energia** | $80 | Sim (hardware consome energia) |
| 🌐 **Internet** | $60 | Sim (planos diferentes) |
| 🍕 **Alimentação** | $150 | Sim (modo "miojo") |
| **TOTAL BASE** | **$690** | Variável |

### Variações nas Contas

**Energia** varia com hardware:
| Setup | Consumo | Conta |
|-------|---------|-------|
| Básico | Normal | $80 |
| Gaming | +25% | $100 |
| Workstation | +50% | $120 |
| Quantum Rig | +100% | $160 |

**Internet** pode ser escolhida:
| Plano | Velocidade | Preço | Efeito |
|-------|------------|-------|--------|
| Básico | Lento | $40 | +0.5s delay em tudo |
| Padrão | Normal | $60 | Normal |
| Fibra | Rápido | $100 | -0.3s delay |
| Dedicada | Ultra | $200 | -0.5s delay, -10% rastreamento |

**Alimentação** pode ser cortada:
| Modo | Preço | Efeito |
|------|-------|--------|
| Normal | $150 | Nenhum |
| Econômico | $100 | Leve debuff em concentração |
| Miojo | $50 | Debuff significativo |
| Jejum | $0 | ⚠️ Debuff severo, risco de "desmaio" |

### O Dia do Pagamento

```
╔═════════════════════════════════════════════════════════════════════════════╗
║  📅 DIA DE PAGAR AS CONTAS                                                  ║
╠═════════════════════════════════════════════════════════════════════════════╣
║                                                                             ║
║  Seu saldo: $1,847                                                          ║
║  Contas: $690                                                               ║
║  ────────────────                                                           ║
║  Saldo após: $1,157 ✅                                                      ║
║                                                                             ║
║  [PAGAR CONTAS]                                                             ║
║                                                                             ║
╚═════════════════════════════════════════════════════════════════════════════╝
```

**Se não tiver dinheiro suficiente**:

```
╔═════════════════════════════════════════════════════════════════════════════╗
║  ⚠️ SALDO INSUFICIENTE                                                      ║
╠═════════════════════════════════════════════════════════════════════════════╣
║                                                                             ║
║  Seu saldo: $423                                                            ║
║  Contas: $690                                                               ║
║  ────────────────                                                           ║
║  FALTAM: $267 ❌                                                            ║
║                                                                             ║
║  OPÇÕES:                                                                    ║
║                                                                             ║
║  [💾 VENDER HARDWARE]                                                       ║
║     CPU Gaming vale $720 (60% do preço de compra)                           ║
║                                                                             ║
║  [🦈 EMPRÉSTIMO COM AGIOTA]                                                 ║
║     Pegar $267 emprestado (pagar $400 no próximo mês)                       ║
║                                                                             ║
║  [💀 DECLARAR FALÊNCIA]                                                     ║
║     Game Over - Sua carreira acabou                                         ║
║                                                                             ║
╚═════════════════════════════════════════════════════════════════════════════╝
```

---

## Parte IX: Sistema de Roubo por Hackers

### Como Hackers Roubam Seu Dinheiro

Quando um hacker (NPC ou jogador) invade seu sistema com sucesso:

```
╔═════════════════════════════════════════════════════════════════════════════╗
║  🚨 VOCÊ FOI HACKEADO!                                                      ║
╠═════════════════════════════════════════════════════════════════════════════╣
║                                                                             ║
║  O hacker "DarkNode" invadiu seu sistema!                                   ║
║                                                                             ║
║  💰 DINHEIRO ROUBADO: $834                                                  ║
║                                                                             ║
║  Seu saldo anterior: $1,847                                                 ║
║  Seu saldo atual:    $1,013                                                 ║
║                                                                             ║
║  ⚠️ Contas em 3 dias: $690                                                  ║
║  ⚠️ Saldo após contas: $323                                                 ║
║                                                                             ║
║  O hacker também obteve:                                                    ║
║  • Seus logs de trabalho (aumenta seu Heat +15%)                            ║
║  • Lista de contatos (alguns clientes podem sumir)                          ║
║                                                                             ║
╚═════════════════════════════════════════════════════════════════════════════╝
```

### Quanto o Hacker Rouba?

| Tipo de Invasor | % do Saldo | Mínimo | Máximo |
|-----------------|------------|--------|--------|
| 🤖 Hacker NPC (Fácil) | 20% | $100 | $500 |
| 🤖 Hacker NPC (Médio) | 35% | $200 | $1,000 |
| 🤖 Hacker NPC (Difícil) | 50% | $500 | $2,500 |
| 👤 Jogador (PvP) | 40% | $300 | Sem limite |

### Proteções Contra Roubo

| Proteção | Preço | Efeito |
|----------|-------|--------|
| **Conta Offshore** | $1,000 | 30% do dinheiro fica protegido |
| **Criptografia Bancária** | $2,500 | Máximo de roubo limitado a 25% |
| **Multi-Wallet** | $500/mês | Divide dinheiro em 3 contas (hacker pega só 1) |
| **Seguro Digital** | $200/mês | Reembolsa 50% do roubado |

### Consequências em Cascata

```
ESPIRAL DA FALÊNCIA:

Você foi hackeado → Perdeu $800
        │
        ▼
Não consegue pagar contas → Vende CPU Gaming ($720)
        │
        ▼
Agora tem CPU Básica → Delay 3.0s (era 2.0s)
        │
        ▼
Mais lento = Mais vulnerável → Hackeado de novo
        │
        ▼
Perdeu mais dinheiro → Vende Firewall Pro
        │
        ▼
Menos defesa → Mais fácil de hackear
        │
        ▼
Ciclo continua até GAME OVER
```

---

## Parte X: Sistema de Venda de Hardware

### Loja de Hardware (Compra e Venda)

```
╔═════════════════════════════════════════════════════════════════════════════╗
║  🏪 TECH SHOP                                          Seu saldo: $423     ║
╠═════════════════════════════════════════════════════════════════════════════╣
║                                                                             ║
║  ┌─ COMPRAR ──────────────────────────────────────────────────────────┐    ║
║  │                                                                     │    ║
║  │  CPU Rápida          $500     [COMPRAR]                            │    ║
║  │  Firewall Standard   $600     [COMPRAR]                            │    ║
║  │  ...                                                               │    ║
║  └─────────────────────────────────────────────────────────────────────┘    ║
║                                                                             ║
║  ┌─ VENDER (SEU HARDWARE) ────────────────────────────────────────────┐    ║
║  │                                                                     │    ║
║  │  ⚠️ Itens vendidos valem 60% do preço de compra                    │    ║
║  │                                                                     │    ║
║  │  CPU Gaming          Comprou: $1,200   Vende: $720    [VENDER]     │    ║
║  │  Firewall Pro        Comprou: $1,500   Vende: $900    [VENDER]     │    ║
║  │  IDS Avançado        Comprou: $1,200   Vende: $720    [VENDER]     │    ║
║  │  ─────────────────────────────────────────────────────             │    ║
║  │  💾 VALOR TOTAL VENDÁVEL: $2,340                                   │    ║
║  │                                                                     │    ║
║  │  ⚠️ CPU Básica e Firewall Básico não podem ser vendidos           │    ║
║  │     (você precisa do mínimo para operar)                           │    ║
║  │                                                                     │    ║
║  └─────────────────────────────────────────────────────────────────────┘    ║
║                                                                             ║
╚═════════════════════════════════════════════════════════════════════════════╝
```

### Regras de Venda

**Valor de revenda**: 60% do preço de compra

**Hardware que NÃO pode ser vendido** (mínimo para operar):
- CPU Básica
- Firewall Básico

**Quando você vende, você perde os benefícios**:
```
ANTES: CPU Gaming (Delay 2.0s)
       ↓ Vendeu
DEPOIS: CPU Básica (Delay 3.0s)

ANTES: Firewall Pro (3 camadas)
       ↓ Vendeu
DEPOIS: Firewall Básico (1 camada)
```

### Tabela de Revenda

| Item | Preço Compra | Preço Venda (60%) |
|------|--------------|-------------------|
| CPU Rápida | $500 | $300 |
| Co-Processador | $400 | $240 |
| CPU Gaming | $1,200 | $720 |
| Processador Paralelo | $1,000 | $600 |
| Workstation | $3,000 | $1,800 |
| Quantum Rig | $10,000 | $6,000 |
| Firewall Standard | $600 | $360 |
| IDS Básico | $450 | $270 |
| Firewall Pro | $1,500 | $900 |
| IDS Avançado | $1,200 | $720 |
| Security Suite | $4,000 | $2,400 |
| Fortress | $12,000 | $7,200 |

### Mercado de Usados (Opcional)

Para adicionar mais estratégia:

```
╔═════════════════════════════════════════════════════════════════════════════╗
║  🔄 MERCADO DE USADOS (P2P)                                                 ║
╠═════════════════════════════════════════════════════════════════════════════╣
║                                                                             ║
║  Outros jogadores vendendo:                                                 ║
║                                                                             ║
║  CPU Gaming (usado)      $850 (loja: $1,200)    Vendedor: Hax0r_23         ║
║  Firewall Pro (usado)    $1,100 (loja: $1,500)  Vendedor: CipherX          ║
║                                                                             ║
║  ⚠️ Itens usados podem ter "defeitos ocultos"                              ║
║                                                                             ║
╚═════════════════════════════════════════════════════════════════════════════╝
```

---

## Parte XI: Os Dois Game Overs

### Game Over 1: Captura (Trabalhos Ilegais)

**Causa**: Admin te pega durante trabalho ilegal + rastreamento bem-sucedido

```
╔═════════════════════════════════════════════════════════════════════════════╗
║                                                                             ║
║                         🚔 VOCÊ FOI PRESO 🚔                                ║
║                                                                             ║
║  ┌─────────────────────────────────────────────────────────────────────┐   ║
║  │                                                                     │   ║
║  │                    [Animação de prisão]                             │   ║
║  │                                                                     │   ║
║  │     A polícia rastreou suas atividades ilegais.                     │   ║
║  │     Você foi preso por crimes cibernéticos.                         │   ║
║  │                                                                     │   ║
║  └─────────────────────────────────────────────────────────────────────┘   ║
║                                                                             ║
║  ESTATÍSTICAS FINAIS:                                                       ║
║  • Trabalhos completados: 47                                                ║
║  • Dinheiro total ganho: $34,500                                           ║
║  • Dias sobrevividos: 23                                                    ║
║  • Maior hack: Banco Regional ($8,000)                                     ║
║                                                                             ║
║                    [NOVO JOGO]    [MENU PRINCIPAL]                          ║
║                                                                             ║
╚═════════════════════════════════════════════════════════════════════════════╝
```

### Game Over 2: Falência

**Causa**: Dia de pagar contas + Sem dinheiro + Sem hardware para vender

```
╔═════════════════════════════════════════════════════════════════════════════╗
║                                                                             ║
║                         💀 FALÊNCIA 💀                                      ║
║                                                                             ║
║  ┌─────────────────────────────────────────────────────────────────────┐   ║
║  │                                                                     │   ║
║  │                    [Animação de despejo]                            │   ║
║  │                                                                     │   ║
║  │     Você não conseguiu pagar as contas.                             │   ║
║  │     Sem dinheiro e sem equipamento, sua carreira acabou.            │   ║
║  │                                                                     │   ║
║  └─────────────────────────────────────────────────────────────────────┘   ║
║                                                                             ║
║  O QUE ACONTECEU:                                                           ║
║  • Saldo final: $156                                                        ║
║  • Contas devidas: $690                                                     ║
║  • Hardware restante: Apenas básicos (não vendáveis)                       ║
║  • Déficit: $534                                                           ║
║                                                                             ║
║  ESTATÍSTICAS FINAIS:                                                       ║
║  • Vezes hackeado: 7                                                        ║
║  • Dinheiro roubado de você: $4,230                                        ║
║  • Hardware vendido: 4 itens                                               ║
║                                                                             ║
║                    [NOVO JOGO]    [MENU PRINCIPAL]                          ║
║                                                                             ║
╚═════════════════════════════════════════════════════════════════════════════╝
```

### Prevenção de Falência

| Estratégia | Descrição |
|------------|-----------|
| **Reserva de Emergência** | Sempre manter 2x as contas mensais guardado |
| **Diversificar Renda** | Mix de trabalhos legais e ilegais |
| **Investir em Defesa** | Dificultar hackers de roubar você |
| **Seguros** | Seguro Digital reembolsa parte do roubo |
| **Não Ostentar** | Hardware caro = mais a perder |

---

## Parte XII: Multiplayer — Economia PvP

### Hacker vs Hacker: Apostando Tudo

No modo PvP, dois jogadores competem para hackear um ao outro. O perdedor **perde dinheiro real do jogo** para o vencedor.

```
╔═════════════════════════════════════════════════════════════════════════════╗
║  ⚔️ HACKER BATTLE: Player_1 vs Player_2                                    ║
╠═════════════════════════════════════════════════════════════════════════════╣
║                                                                             ║
║  APOSTAS:                                                                   ║
║  ────────                                                                   ║
║  Player_1 saldo: $3,450     │    Player_2 saldo: $2,890                    ║
║                             │                                               ║
║  Em jogo: 40% do saldo do perdedor                                         ║
║  (Se você perder: -$1,156 a -$1,380)                                       ║
║                                                                             ║
║  ┌───────────────────────────────────────────────────────────────────┐     ║
║  │                                                                   │     ║
║  │  VOCÊ (atacando P2)          │  OPONENTE (atacando você)         │     ║
║  │  Progresso: [████░░] 67%     │  Progresso: [███░░░] 52%          │     ║
║  │                              │                                    │     ║
║  │  Sua defesa: 3 camadas       │  Defesa dele: 2 camadas           │     ║
║  │                              │                                    │     ║
║  └───────────────────────────────────────────────────────────────────┘     ║
║                                                                             ║
╚═════════════════════════════════════════════════════════════════════════════╝
```

### Resultado da Batalha PvP

**Se você VENCER**:
```
╔═════════════════════════════════════════════════════════════════════════════╗
║  🏆 VITÓRIA!                                                                ║
╠═════════════════════════════════════════════════════════════════════════════╣
║                                                                             ║
║  Você hackeou Player_2!                                                     ║
║                                                                             ║
║  💰 DINHEIRO ROUBADO: $1,156 (40% do saldo dele)                           ║
║                                                                             ║
║  Seu saldo anterior: $3,450                                                 ║
║  Seu saldo atual:    $4,606                                                 ║
║                                                                             ║
║  🎖️ Ranking atualizado: #234 → #198                                        ║
║                                                                             ║
╚═════════════════════════════════════════════════════════════════════════════╝
```

**Se você PERDER**:
```
╔═════════════════════════════════════════════════════════════════════════════╗
║  💀 DERROTA                                                                 ║
╠═════════════════════════════════════════════════════════════════════════════╣
║                                                                             ║
║  Player_2 hackeou você!                                                     ║
║                                                                             ║
║  💸 DINHEIRO PERDIDO: $1,380 (40% do seu saldo)                            ║
║                                                                             ║
║  Seu saldo anterior: $3,450                                                 ║
║  Seu saldo atual:    $2,070                                                 ║
║                                                                             ║
║  ⚠️ Contas em 2 dias: $690                                                  ║
║  ⚠️ Saldo após contas: $1,380                                               ║
║                                                                             ║
║  🎖️ Ranking atualizado: #234 → #267                                        ║
║                                                                             ║
╚═════════════════════════════════════════════════════════════════════════════╝
```

### Modos de Aposta PvP

| Modo | Aposta | Risco |
|------|--------|-------|
| **Casual** | 10% do menor saldo | Baixo |
| **Ranked** | 25% do menor saldo | Médio |
| **High Stakes** | 40% do menor saldo | Alto |
| **All-In** | 100% do menor saldo | ☠️ Extremo |

### Matchmaking por Riqueza

Para evitar injustiças:
- Jogadores só enfrentam outros com saldo similar (±30%)
- Hardware é considerado no matchmaking
- Novatos têm proteção nas primeiras 5 batalhas

### Game Over por PvP

Se um jogador perde tanto dinheiro em PvP que não consegue pagar as contas:

```
╔═════════════════════════════════════════════════════════════════════════════╗
║                                                                             ║
║                     💀 ELIMINADO DO RANKING 💀                              ║
║                                                                             ║
║  Você perdeu todo seu dinheiro em batalhas PvP.                            ║
║  Sem recursos para continuar, você foi eliminado do ranking.               ║
║                                                                             ║
║  OPÇÕES:                                                                    ║
║                                                                             ║
║  [🔄 RECOMEÇAR] - Novo personagem, do zero                                 ║
║  [📺 MODO ESPECTADOR] - Assistir batalhas                                  ║
║  [🎮 MODO ARCADE] - Jogar sem economia                                     ║
║                                                                             ║
╚═════════════════════════════════════════════════════════════════════════════╝
```

---

## Parte XIII: Sistema de Hardware Completo

### Árvore de Hardware: ATAQUE

```
                         ┌─────────────────┐
                         │   CPU BÁSICA    │
                         │  Delay: 3.0s    │
                         │  Energia: $80   │
                         │  (não vendável) │
                         └────────┬────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
           ┌────────▼────────┐        ┌────────▼────────┐
           │  CPU RÁPIDA     │        │  CO-PROCESSADOR │
           │  Delay: 2.5s    │        │  Delay: 2.7s    │
           │  Energia: $85   │        │  +TRACE grátis  │
           │  $500 ($300)    │        │  Energia: $85   │
           └────────┬────────┘        │  $400 ($240)    │
                    │                 └────────┬────────┘
                    │                          │
           ┌────────▼────────┐        ┌────────▼────────┐
           │  CPU GAMING     │        │  PROCESSADOR    │
           │  Delay: 2.0s    │        │  PARALELO       │
           │  Energia: $100  │        │  Delay: 2.2s    │
           │  $1,200 ($720)  │        │  +2 TRACEs      │
           └────────┬────────┘        │  Energia: $95   │
                    │                 │  $1,000 ($600)  │
                    │                 └────────┬────────┘
                    │                          │
                    └──────────┬───────────────┘
                               │
                      ┌────────▼────────┐
                      │  WORKSTATION    │
                      │  Delay: 1.5s    │
                      │  +3 TRACEs      │
                      │  Energia: $120  │
                      │  $3,000 ($1,800)│
                      └────────┬────────┘
                               │
                      ┌────────▼────────┐
                      │  QUANTUM RIG    │
                      │  Delay: 0.8s    │
                      │  +5 TRACEs      │
                      │  +Auto-correct  │
                      │  Energia: $160  │
                      │  $10,000($6,000)│
                      └─────────────────┘
```

### Árvore de Hardware: DEFESA

```
                         ┌─────────────────┐
                         │  FIREWALL       │
                         │  BÁSICO         │
                         │  1 camada       │
                         │  (não vendável) │
                         └────────┬────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
           ┌────────▼────────┐        ┌────────▼────────┐
           │  FIREWALL       │        │  IDS BÁSICO     │
           │  STANDARD       │        │  Warning +3s    │
           │  2 camadas      │        │  1 camada       │
           │  $600 ($360)    │        │  $450 ($270)    │
           └────────┬────────┘        └────────┬────────┘
                    │                          │
           ┌────────▼────────┐        ┌────────▼────────┐
           │  FIREWALL PRO   │        │  IDS AVANÇADO   │
           │  3 camadas      │        │  Warning +5s    │
           │  $1,500 ($900)  │        │  +Identifica    │
           └────────┬────────┘        │  $1,200 ($720)  │
                    │                 └────────┬────────┘
                    │                          │
                    └──────────┬───────────────┘
                               │
                      ┌────────▼────────┐
                      │  SECURITY SUITE │
                      │  4 camadas      │
                      │  Warning +7s    │
                      │  +Auto-block    │
                      │  $4,000 ($2,400)│
                      └────────┬────────┘
                               │
                      ┌────────▼────────┐
                      │  FORTRESS       │
                      │  5 camadas      │
                      │  Warning +10s   │
                      │  +Contra-ataque │
                      │  $12,000($7,200)│
                      └─────────────────┘
```

### Upgrades Especiais

| Upgrade | Preço | Revenda | Efeito |
|---------|-------|---------|--------|
| **SSD Criptografado** | $800 | $480 | Dados protegidos se hackeado |
| **Conta Offshore** | $1,000 | $600 | 30% do dinheiro protegido |
| **Criptografia Bancária** | $2,500 | $1,500 | Máx 25% pode ser roubado |
| **Kill Switch** | $1,500 | $900 | Perde só 50% se capturado |
| **Identidade Falsa** | $5,000 | - | 1 vida extra (uso único) |

### Consumíveis (Não Revendáveis)

| Item | Preço | Efeito | Uso |
|------|-------|--------|-----|
| **VPN Premium** | $300 | -20% rastreamento | Por trabalho |
| **Botnet Alugada** | $500 | +1 camada temporária | Por trabalho |
| **Zero-Day Exploit** | $2,000 | Ignora 1 camada | Uso único |
| **Multi-Wallet** | $500/mês | Divide dinheiro em 3 | Mensal |
| **Seguro Digital** | $200/mês | Reembolsa 50% roubo | Mensal |

---

## Parte XIV: Interface Completa

### Tela Principal (Hub)

```
╔═════════════════════════════════════════════════════════════════════════════╗
║  ELECTRONIC HACKER v4.0                                                     ║
║  ═══════════════════════════════════════════════════════════════════════════║
║                                                                             ║
║  👤 H4CK3R_N00B          💰 $2,847          🔥 Heat: 23%                    ║
║                                                                             ║
║  ┌─ STATUS ─────────────────────────────────────────────────────────────┐  ║
║  │  📅 Próximas contas: 5 dias ($690)                                   │  ║
║  │  💾 Hardware: CPU Gaming + Firewall Pro + IDS Básico                 │  ║
║  │  📊 Valor total vendável: $2,160                                     │  ║
║  │  🛡️ Defesa: 4 camadas | ⚔️ Ataque: 2.0s delay                        │  ║
║  └──────────────────────────────────────────────────────────────────────┘  ║
║                                                                             ║
║  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       ║
║  │  📋         │  │  🏪         │  │  ⚔️         │  │  📊         │       ║
║  │  TRABALHOS  │  │  LOJA       │  │  PVP        │  │  FINANÇAS   │       ║
║  │             │  │             │  │             │  │             │       ║
║  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘       ║
║                                                                             ║
║  ┌─ NOTIFICAÇÕES ───────────────────────────────────────────────────────┐  ║
║  │  📧 Shadow tem um novo trabalho para você ($3,500)                   │  ║
║  │  ⚠️ Seu Heat está subindo. Considere trabalhos legais.               │  ║
║  │  🏆 Player_X te desafiou para uma batalha!                           │  ║
║  └──────────────────────────────────────────────────────────────────────┘  ║
║                                                                             ║
╚═════════════════════════════════════════════════════════════════════════════╝
```

### Tela de Trabalho (Gameplay)

```
╔═════════════════════════════════════════════════════════════════════════════╗
║  💼 Roubo de Dados - Empresa X          ☠️ ILEGAL          💰 $2,500       ║
║  ═══════════════════════════════════════════════════════════════════════════║
║                                                                             ║
║  ⏱️ Timer: 14.3s    🔍 Rastreamento: [███░░░░░] 34%    🔥 Heat: 23%→+8%   ║
║                                                                             ║
║  ┌─ 🛡️ SEU SISTEMA ─────────────────┐  ┌─ ⚔️ SISTEMA ALVO ──────────────┐ ║
║  │                                   │  │                                │ ║
║  │  Camadas: 4/4 ✅                  │  │  A ●──┬── [SEGURO] ────┐      │ ║
║  │                                   │  │       │                │      │ ║
║  │  ⚠️ HACKER atacando!              │  │  B ●──┼── [PADRÃO] ────┼── 🚪 │ ║
║  │  Camada 1: [████████░░] 78%       │  │       │                │      │ ║
║  │                                   │  │  C ●──┴── [RÁPIDO] ────┘      │ ║
║  │  Tipo: NPC "DarkNode"             │  │                         🚨    │ ║
║  │  Se passar: Rouba ~$1,100         │  │                                │ ║
║  │                                   │  │                                │ ║
║  └───────────────────────────────────┘  └────────────────────────────────┘ ║
║                                                                             ║
║  INVENTÁRIO: [AND] [AND] [OR] [OR] [NOT] [XOR]                             ║
║                                                                             ║
║  ⚡ DELAY: 2.0s (CPU Gaming)                                                ║
║                                                                             ║
║  [🔍 TRACE: 2]  [⚡ EXECUTAR]  [🚪 ABORTAR: Perde $500 de fiança]          ║
║                                                                             ║
╚═════════════════════════════════════════════════════════════════════════════╝
```

---

## Parte XV: Progressão da Campanha

### Fase 1: "Sobrevivência" (Dias 1-7)

**Foco**: Aprender mecânicas, pagar primeira conta.

| Dia | Eventos | Meta |
|-----|---------|------|
| 1 | Tutorial de gates | Completar 2 trabalhos |
| 2 | Tutorial de caminhos | Ganhar $200 |
| 3 | Primeiro trabalho pago | Acumular $400 |
| 4 | Introduz contas | Entender sistema |
| 5 | Introduz defesa | Configurar defesa |
| 6 | Aviso de pagamento | Ter $690+ |
| 7 | **DIA DE PAGAMENTO** | Pagar contas! |

### Fase 2: "Crescimento" (Dias 8-21)

**Foco**: Juntar dinheiro, primeiro upgrade.

- Trabalhos legais médios disponíveis
- Primeiro trabalho ilegal aparece (tentação)
- Meta: Comprar primeiro upgrade de hardware
- Segundo pagamento de contas

### Fase 3: "Decisão" (Dias 22-35)

**Foco**: Escolher caminho (legal vs ilegal).

- Trabalhos ilegais mais lucrativos
- Hackers NPC começam a aparecer
- Primeiro risco real de perder dinheiro
- Hardware começa a importar muito

### Fase 4: "Consequências" (Dias 36+)

**Foco**: Viver com suas escolhas.

- Heat acumulado afeta jogabilidade
- Hackers mais agressivos
- Contas mais altas (upgrades = mais energia)
- Possibilidade real de espiral de falência

---

## Parte XVI: Balanceamento Econômico

### Fluxo de Caixa Típico

**Jogador Cauteloso (só legal)**:
```
Renda mensal: ~$1,500-2,000 (trabalhos legais)
Contas: $690
Sobra: $810-1,310
Tempo para CPU Gaming: ~2 meses
```

**Jogador Moderado (mix)**:
```
Renda mensal: ~$3,000-4,500 (mix)
Contas: $690
Possíveis perdas: ~$500-1,000 (hacks)
Sobra: $1,810-2,810
Tempo para CPU Gaming: ~2-3 semanas
```

**Jogador Agressivo (muito ilegal)**:
```
Renda mensal: ~$6,000-12,000 (ilegais)
Contas: $690
Possíveis perdas: ~$2,000-4,000 (hacks frequentes)
Heat alto: +invasores, +risco
Sobra: Alta mas volátil
Risco: Game over em qualquer trabalho
```

### A Espiral Ilustrada

```
                    INÍCIO
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
    CAUTELOSO      MODERADO      AGRESSIVO
        │              │              │
        │              │              │
        ▼              ▼              ▼
   Progresso      Progresso       Progresso
     Lento         Médio          Rápido
        │              │              │
        │              │              ▼
        │              │         FOI HACKEADO
        │              │              │
        │              │              ▼
        │              │         Perdeu $3,000
        │              │              │
        │              │              ▼
        │              │         Vendeu hardware
        │              │              │
        │              │              ▼
        │              │         Mais vulnerável
        │              │              │
        │              │       ┌──────┴──────┐
        │              │       │             │
        │              │       ▼             ▼
        │              │   Recuperou    FALÊNCIA
        │              │       │         GAME OVER
        │              │       │
        ▼              ▼       ▼
    VITÓRIA        VITÓRIA  VITÓRIA?
    (longa)        (média)  (incerta)
```

---

## Parte XVII: Game Feel e Juice

### Priorização de Técnicas (Jan Willem Nijman)

| Prioridade | Técnica | Impacto |
|------------|---------|---------|
| 1 | **Efeitos sonoros** | Adiciona dimensão inteira instantaneamente |
| 2 | **Screen shake** | Impacto visceral, rápido de implementar |
| 3 | **Propagação visual** | Core do feedback do jogo |
| 4 | **Partículas** | Recompensa visual por ações |
| 5 | **Easing/tweening** | Faz tudo parecer polido |

### Feedback de Gameplay (Circuitos)

**Pegar gate**:
- Som: Click suave, tom alto
- Visual: Gate levanta levemente, sombra aparece

**Soltar gate em slot válido**:
- Som: Snap metálico satisfatório
- Visual: Gate "encaixa" com pequeno bounce
- Partículas: Faíscas sutis de conexão
- Fios: "Acendem" mostrando conexão

**Testar circuito (EXECUTAR)**:
- Som: Whoosh elétrico crescente
- Visual: Barra de delay "PROCESSANDO..."
- Durante delay: Tensão máxima, vulnerável

**Sinais propagando**:
- Velocidade: ~200ms por gate
- Cores: cinza → verde (1) ou vermelho (0)
- Som: Click sutil por gate
- Gates "pulsam" quando sinal passa

**Sucesso (porta abre)**:
- Som: Click mecânico + chime + "ACCESS GRANTED"
- Visual: Flash verde (100ms), porta desliza
- Screen shake: Sutil positivo (5px, 100ms)
- Partículas: "Dados" fluindo

**Alarme dispara**:
- Som: Buzz harsh + sirene (500ms)
- Visual: Flash vermelho (2-3 pulsos)
- Screen shake: Médio (15px, 300ms)
- Highlight: Caminho que causou erro

**Você foi hackeado**:
- Som: Alarme + "COMPROMISED!"
- Visual: Flash vermelho intenso no lado esquerdo
- Screen shake: Forte (20px, 500ms)
- Glitch visual + números de dinheiro caindo

### Timer como Instrumento de Tensão

```
Tempo    Visual                      Áudio           
─────────────────────────────────────────────────────
10s      [██████████] branco         Silêncio        
7s       [███████░░░] branco         Silêncio        
5s       [█████░░░░░] amarelo        Beep único      
3s       [███░░░░░░░] laranja        Beeps/segundo   
2s       [██░░░░░░░░] vermelho       Beeps rápidos   
1s       [█░░░░░░░░░] vermelho       Beeps urgentes  
         pulsando
0s       [░░░░░░░░░░] flash          ALARME          
```

### Feedback de Economia

**Recebendo pagamento**:
- Números subindo com easing
- Som de "cha-ching" satisfatório
- Partículas verdes de dinheiro
- "+$X" aparece e flutua

**Sendo hackeado (perdendo dinheiro)**:
- Números descendo RÁPIDO
- Som de alarme + vidro quebrando
- Tela treme
- Partículas vermelhas de dinheiro "vazando"
- "-$X" em vermelho, grande

**Pagando contas**:
- Animação de transferência
- Som de "processando"
- Barra de progresso
- "Contas pagas ✓"

**Vendendo hardware**:
- Animação de item saindo do inventário
- Som melancólico (perda)
- Stats caindo visivelmente
- "Hardware vendido... 😔"

### Tensão de Fim de Mês

```
5 DIAS PARA CONTAS:
Interface normal

3 DIAS PARA CONTAS:
Sutil borda amarela
Som de notificação

1 DIA PARA CONTAS:
Borda vermelha pulsando
Música mais tensa
Lembretes frequentes

DIA DO PAGAMENTO:
Tela especial de pagamento
Alta tensão se saldo baixo
```

### Feedback de PvP

**Entrando em batalha**:
- Tela divide ao meio
- VS aparece grande
- Avatares se encaram
- Som de "round start"

**Vencendo**:
- Seu lado brilha dourado
- Confete digital
- Dinheiro fluindo para você
- "VICTORY" em verde

**Perdendo**:
- Seu lado escurece
- Glitch visual
- Dinheiro vazando
- "DEFEATED" em vermelho

---

## Parte XVIII: Resumo Executivo

### Os Quatro Pilares do Electronic Hacker v4.0

| Pilar | Implementação |
|-------|---------------|
| **Puzzles** | Gates lógicos, múltiplos caminhos, ataque + defesa |
| **Economia** | Trabalhos → Dinheiro → Hardware → Contas |
| **Risco** | Legal (seguro) vs Ilegal (lucrativo mas perigoso) |
| **Consequências** | Ser hackeado = perder dinheiro → espiral → falência |

### Loop de Gameplay Completo

```
┌───────────────────────────────────────────────────────────────────┐
│                                                                   │
│  TRABALHO → DINHEIRO → HARDWARE ↔ DEFESA → SOBREVIVER           │
│      ↑                                         │                  │
│      │         ┌─────────────────────────────┘                  │
│      │         │                                                  │
│      │         ▼                                                  │
│      │    CONTAS MENSAIS ←──── HACKERS ROUBAM                    │
│      │         │                     │                            │
│      │         ▼                     │                            │
│      │    NÃO TEM? → VENDE HARDWARE ─┘                           │
│      │         │                                                  │
│      │         ▼                                                  │
│      │    SEM HARDWARE? → GAME OVER                              │
│      │                                                            │
│      └────────────── SOBREVIVEU ─────────────────────────────────┘
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

### Por Que Este Design Funciona

| Princípio | Aplicação |
|-----------|-----------|
| **Stakes Reais** | Perder dinheiro IMPORTA porque contas existem |
| **Escolhas Significativas** | Legal vs Ilegal tem consequências reais |
| **Espiral de Consequências** | Erros se acumulam, criando tensão |
| **Recuperação Possível** | Sempre há chance de se recuperar (até certo ponto) |
| **Multiplayer Justo** | Punição é econômica, não arbitrária |
| **Progressão com Risco** | Upgrades podem ser perdidos, então importam mais |

### O Dilema Central Refinado

> "Preciso de $690 em 3 dias. Tenho $400. Faço 3 trabalhos legais ($100 cada) OU arrisco 1 ilegal ($500) que pode me fazer perder $800 se eu for hackeado?"

Este dilema aparece CONSTANTEMENTE, criando tensão real em cada decisão.

---

## Parte XIX: Ensinando Sem Tutorial

### Princípio: A "Fiction" Ensina (WarioWare/Chaim Gingold)

Cada elemento visual comunica sua função:
- Fios parecem fios elétricos → "sinais fluem por aqui"
- Gates parecem chips → "isso processa o sinal"
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
╚═══════════════════════════════════════╝
```
- 1 input (sempre = 1), 1 gate, 1 slot
- Sem alarme, sem timer
- Qualquer ação → sucesso

**Puzzle 2: Alarme Visível mas Seguro**
```
POWER (1) ━━━[ AND ]━━━┬━━━● DOOR
                       │
          (0) ━━━━━━━━━┴━━━● ALARM ⚠️
```
- Alarme conectado a 0 fixo (impossível disparar)
- Jogador VÊ que alarme existe

**Puzzle 3: Primeira Escolha Real**
- Primeiro puzzle onde PODE errar
- Feedback de erro rápido (500ms) e claro

**Puzzle 4: Timer Aparece**
- Mesmo puzzle simples, mas timer inicia

**Puzzle 6: Múltiplos Caminhos**
```
╔═══════════════════════════════════════════════════════════════╗
║  💡 NOVO: Múltiplos caminhos!                                 ║
║                                                               ║
║  A (1) ●──┬── CAMINHO FÁCIL ──┐                              ║
║           │                    ├── 🚪 DOOR                    ║
║  B (0) ●──┴── CAMINHO RÁPIDO ──┘                              ║
║                                                               ║
║  Escolha seu caminho! Ambos funcionam.                        ║
╚═══════════════════════════════════════════════════════════════╝
```

**Puzzle 11: Introduz Defesa**
```
╔═══════════════════════════════════════════════════════════════╗
║  💡 NOVO: Defenda seu sistema!                                ║
║                                                               ║
║  Um ADMIN está tentando hackear você!                         ║
║                                                               ║
║  INVASOR (1) ───[ ??? ]─── 🚪 SUA PORTA                       ║
║                                                               ║
║  Objetivo: Faça SUA PORTA = 0                                 ║
║  Dica: NOT inverte! (1 → 0)                                   ║
╚═══════════════════════════════════════════════════════════════╝
```

**Puzzle 13: Ataque + Defesa Simultâneos**
- Primeira vez gerenciando dois circuitos
- Timer generoso, invasor lento

---

## Parte XX: Anti-Patterns a Evitar

### ❌ Puzzles Baseados em Sorte

**Problema**: Solução depende de adivinhar.
**Solução**: Valores de inputs sempre visíveis. TRACE permite calcular.

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

### ❌ Overload Visual

**Problema**: Dois circuitos + timer + invasor = confusão.
**Solução**: Introduzir gradualmente. Cores distintas por sistema.

---

## Parte XXI: Métricas de Playtest

### O Que Observar

| Métrica | ✅ Bom | ❌ Problema |
|---------|--------|------------|
| Tempo no puzzle 1 | < 10s | > 30s |
| Taxa de retry | 1-2 tentativas | > 5 tentativas |
| Expressão facial | Concentração → satisfação | Confusão → frustração |
| "Mais um nível" | Continua voluntariamente | Para após 2-3 |
| Wife-o-meter | Não-gamer completa Fase 1 | Não-gamer desiste |

### Perguntas de Playtest

1. "Você entendeu o objetivo imediatamente?"
2. "Quando errou, você entendeu por quê?"
3. "O timer estressou de forma boa ou ruim?"
4. "Você quis continuar após terminar?"
5. "Algum puzzle pareceu injusto?"
6. "Você se sentiu inteligente ao resolver?"
7. "Quando foi hackeado, entendeu como se defender?"

---

## Apêndice: Referência Rápida de Economia

### Contas Mensais Base: $690

| Conta | Valor |
|-------|-------|
| Aluguel | $400 |
| Energia | $80-160 (varia com hardware) |
| Internet | $40-200 (escolha do jogador) |
| Alimentação | $0-150 (escolha do jogador) |

### Renda por Trabalho

| Tipo | Faixa |
|------|-------|
| Legal Fácil | $100-200 |
| Legal Médio | $250-500 |
| Legal Difícil | $500-1,200 |
| Ilegal Fácil | $1,500-3,000 |
| Ilegal Médio | $3,000-8,000 |
| Ilegal Difícil | $8,000-25,000 |

### Roubo por Hacker

| Tipo | % do Saldo |
|------|------------|
| NPC Fácil | 20% |
| NPC Médio | 35% |
| NPC Difícil | 50% |
| Jogador (PvP) | 40% |

### Hardware Essencial

| Item | Compra | Venda | Efeito Principal |
|------|--------|-------|------------------|
| CPU Gaming | $1,200 | $720 | Delay 2.0s |
| Firewall Pro | $1,500 | $900 | 3 camadas |
| Conta Offshore | $1,000 | $600 | 30% protegido |
