# Tutorial Completo: Portas Lógicas em Eletrônica Digital

**Portas lógicas são os blocos fundamentais de toda eletrônica digital moderna, desde smartphones até supercomputadores.** Este tutorial abrangente apresenta cada porta lógica com suas tabelas-verdade, expressões booleanas, símbolos de circuito, e aplicações práticas. Você aprenderá não apenas o "o quê", mas o "porquê" por trás de cada comportamento lógico, desenvolvendo intuição sólida para projetar circuitos combinacionais do zero.

A eletrônica digital revolucionou a tecnologia ao representar informação usando apenas dois estados: **0 (LOW)** e **1 (HIGH)**. Esta simplicidade binária permite construir sistemas complexos com componentes previsíveis e imunes a ruídos analógicos. Ao final deste tutorial, você será capaz de analisar, simplificar e implementar circuitos lógicos para aplicações do mundo real.

---

## 1. Introdução e fundamentos

### 1.1 O que são portas lógicas

Portas lógicas são **circuitos eletrônicos que executam operações booleanas** sobre sinais de entrada, produzindo uma saída determinada por regras lógicas específicas. Cada porta implementa uma função matemática definida pela álgebra de Boole, criada por George Boole em 1847.

Fisicamente, uma porta lógica é construída com transistores que funcionam como chaves eletrônicas. Quando um transistor recebe tensão suficiente em sua base (ou gate), ele conduz corrente—equivalente a um "1" lógico. Caso contrário, bloqueia corrente—equivalente a "0".

**Analogia prática:** Imagine uma porta AND como duas chaves em série num corredor. A luz só acende se AMBAS estiverem fechadas. Uma porta OR seria duas chaves em paralelo—a luz acende se QUALQUER uma estiver fechada.

### 1.2 Por que são importantes

As portas lógicas são importantes porque **toda computação digital reduz-se a combinações de operações lógicas básicas**. Processadores modernos contêm bilhões de transistores organizados em portas que executam trilhões de operações por segundo.

Aplicações diretas incluem:
- Processadores e microcontroladores
- Memórias RAM e ROM
- Sistemas de controle industrial
- Automação residencial e predial
- Sistemas de segurança eletrônica
- Equipamentos médicos e científicos

### 1.3 Conceitos preliminares: níveis lógicos e sistema binário

**Níveis Lógicos** representam a tensão elétrica interpretada como 0 ou 1:

| Família | VIL (máx) | VIH (mín) | VOL (máx) | VOH (mín) |
|---------|-----------|-----------|-----------|-----------|
| TTL (74LS) | 0,8V | 2,0V | 0,4V | 2,4V |
| CMOS (74HC a 5V) | 1,5V | 3,5V | 0,1V | 4,4V |

A **margem de ruído** é a diferença entre níveis de saída e entrada aceitáveis. CMOS possui margens superiores (**0,9V a 1,4V**) comparado a TTL (**0,4V**), tornando-o mais robusto em ambientes ruidosos.

**Sistema Binário:** Todo valor em eletrônica digital usa base 2. O número decimal 13 torna-se 1101 em binário (1×8 + 1×4 + 0×2 + 1×1).

---

## 2. Portas lógicas básicas

### 2.1 Porta AND (E)

A porta AND produz saída **1 somente quando TODAS as entradas são 1**. É a implementação eletrônica da conjunção lógica.

**Tabela-Verdade:**
| A | B | Y = A·B |
|---|---|---------|
| 0 | 0 | 0 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 1 |

**Expressão Booleana:** Y = A · B = A ∧ B = AB

**Símbolo ANSI (distintivo):**
```
A ──┬──╮
    │   D──── Y
B ──┴──╯
```

**Símbolo IEC (retangular):**
```
    ┌───┐
A ──┤ & ├── Y
B ──┤   │
    └───┘
```

**Mnemônico:** "AND = ALL" — saída 1 quando ALL (todas) entradas são 1.

**CI Comum:** 7408 (Quatro portas AND de 2 entradas)

**Exemplo Prático:** Sistema de ignição de veículo que só funciona se a chave estiver na posição correta (A=1) E o câmbio em ponto-morto (B=1).

### 2.2 Porta OR (OU)

A porta OR produz saída **1 quando QUALQUER entrada é 1**. Implementa a disjunção lógica.

**Tabela-Verdade:**
| A | B | Y = A+B |
|---|---|---------|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 1 |

**Expressão Booleana:** Y = A + B = A ∨ B

**Símbolo ANSI:**
```
A ──╲
     ╲
      ╱──── Y
B ──╱
```

**Símbolo IEC:**
```
    ┌────┐
A ──┤ ≥1 ├── Y
B ──┤    │
    └────┘
```

**Mnemônico:** "OR = ONE Required" — saída 1 quando ONE (pelo menos uma) entrada é 1.

**CI Comum:** 7432 (Quatro portas OR de 2 entradas)

**Exemplo Prático:** Alarme de portas que dispara se porta da frente (A=1) OU porta dos fundos (B=1) abrir.

### 2.3 Porta NOT (Inversor)

A porta NOT **inverte o estado lógico** da entrada. É a mais simples das portas lógicas.

**Tabela-Verdade:**
| A | Y = A' |
|---|--------|
| 0 | 1 |
| 1 | 0 |

**Expressão Booleana:** Y = A' = Ā = ¬A

**Símbolo ANSI:**
```
A ──▷o── Y
```

**Símbolo IEC:**
```
    ┌───┐
A ──┤ 1 ├o── Y
    └───┘
```

O pequeno círculo (bolha) na saída indica inversão.

**CI Comum:** 7404 (Seis inversores independentes)

**Exemplo Prático:** Indicador de "porta fechada" que acende LED quando sensor de porta (A=0, fechada) está inativo.

---

## 3. Portas lógicas derivadas

### 3.1 Porta NAND e sua universalidade

A porta NAND (NOT-AND) é uma **AND seguida de inversão**. Sua importância é monumental: é uma **porta universal**, capaz de implementar qualquer outra porta lógica.

**Tabela-Verdade:**
| A | B | Y = (A·B)' |
|---|---|------------|
| 0 | 0 | 1 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

**Expressão Booleana:** Y = (A · B)' = A↑B (símbolo de Sheffer)

**Símbolo:** AND com bolha na saída.

**Universalidade da NAND:**

| Porta | Implementação com NANDs | Qtd NANDs |
|-------|-------------------------|-----------|
| NOT | Entradas conectadas juntas | 1 |
| AND | NAND seguida de NOT | 2 |
| OR | NOT em ambas entradas, depois NAND | 3 |
| NOR | OR com NANDs, depois NOT | 4 |
| XOR | Combinação específica | 4 |

**NOT usando NAND:** Y = (A·A)' = A'
```
A ──┬──╮
    │  D──o── Y
A ──┴──╯
```

**AND usando NAND:**
```
A ──┬──╮          ┌──╮
    │  D──o──────┤  D──o── Y
B ──┴──╯         └──╯
```

**CI Comum:** 7400 (Quatro portas NAND de 2 entradas) — o CI mais utilizado na história.

### 3.2 Porta NOR e sua universalidade

A porta NOR (NOT-OR) também é **universal**, podendo implementar qualquer função lógica.

**Tabela-Verdade:**
| A | B | Y = (A+B)' |
|---|---|------------|
| 0 | 0 | 1 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 0 |

**Expressão Booleana:** Y = (A + B)' = A↓B (símbolo de Peirce)

**Curiosidade histórica:** Os computadores de orientação do programa Apollo usaram exclusivamente portas NOR—aproximadamente **5.600 portas NOR** por computador.

**CI Comum:** 7402 (Quatro portas NOR de 2 entradas)

### 3.3 Porta XOR (OU-Exclusivo)

A porta XOR produz **1 quando as entradas são DIFERENTES**. Para múltiplas entradas, saída é 1 quando há número ÍMPAR de 1s.

**Tabela-Verdade:**
| A | B | Y = A⊕B |
|---|---|---------|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

**Expressão Booleana:** Y = A ⊕ B = A'B + AB'

**Mnemônico:** "XOR = eXclusivo, diferentes resultam em 1"

**Aplicações críticas:**
- Geradores e verificadores de paridade
- Somadores (bit de soma = A ⊕ B ⊕ Cin)
- Comparadores (A ⊕ B = 1 indica diferença)
- Criptografia (operação XOR é reversível)

**CI Comum:** 7486 (Quatro portas XOR de 2 entradas)

### 3.4 Porta XNOR (Equivalência)

A porta XNOR produz **1 quando as entradas são IGUAIS**. É o complemento da XOR.

**Tabela-Verdade:**
| A | B | Y = A⊙B |
|---|---|---------|
| 0 | 0 | 1 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 1 |

**Expressão Booleana:** Y = A ⊙ B = AB + A'B' = (A ⊕ B)'

**Aplicação principal:** Comparador de bits—saída 1 quando bits são idênticos.

---

## 4. Álgebra booleana aplicada

### 4.1 Leis e teoremas fundamentais

A álgebra booleana fornece as ferramentas matemáticas para **simplificar expressões lógicas** e otimizar circuitos.

**Leis Fundamentais:**

| Lei | Forma OR | Forma AND |
|-----|----------|-----------|
| Identidade | A + 0 = A | A · 1 = A |
| Elemento Nulo | A + 1 = 1 | A · 0 = 0 |
| Idempotência | A + A = A | A · A = A |
| Complemento | A + A' = 1 | A · A' = 0 |
| Comutativa | A + B = B + A | A · B = B · A |
| Associativa | (A+B)+C = A+(B+C) | (A·B)·C = A·(B·C) |
| Distributiva | A+(B·C) = (A+B)·(A+C) | A·(B+C) = A·B + A·C |
| Dupla Negação | (A')' = A | (A')' = A |

**Leis de Absorção:**
- A + A·B = A
- A·(A + B) = A
- A + A'·B = A + B
- A·(A' + B) = A·B

**Prova de A + A·B = A:**
```
A + A·B = A·1 + A·B         (Lei da Identidade)
        = A·(1 + B)         (Distributiva)
        = A·1               (Lei do Elemento Nulo: 1+B=1)
        = A                 (Lei da Identidade)
```

**Teoremas de De Morgan — fundamentais para simplificação:**

**Primeiro Teorema:** (A + B)' = A' · B'
"O complemento de uma SOMA é o PRODUTO dos complementos"

**Segundo Teorema:** (A · B)' = A' + B'
"O complemento de um PRODUTO é a SOMA dos complementos"

**Mnemônico:** "Quebre a barra, troque o sinal"

**Prova do Primeiro Teorema (tabela-verdade):**
| A | B | A+B | (A+B)' | A' | B' | A'·B' |
|---|---|-----|--------|----|----|-------|
| 0 | 0 | 0 | **1** | 1 | 1 | **1** |
| 0 | 1 | 1 | **0** | 1 | 0 | **0** |
| 1 | 0 | 1 | **0** | 0 | 1 | **0** |
| 1 | 1 | 1 | **0** | 0 | 0 | **0** |

Colunas (A+B)' e A'·B' são idênticas ✓

**Teorema do Consenso:**
AB + A'C + BC = AB + A'C

O termo BC é redundante (termo de consenso). Esta simplificação frequentemente passa despercebida.

### 4.2 Simplificação de expressões

**Exemplo 1:** Simplificar F = A'BC + ABC + AB'C

**Passo 1:** Agrupar termos com fatores comuns
= BC(A' + A) + AB'C
= BC·1 + AB'C         (A' + A = 1)
= BC + AB'C

**Passo 2:** Fatorar C
= C(B + AB')
= C(B + A)(B + B')    (Distributiva inversa)
= C(B + A)·1
= **C(A + B)**

**Exemplo 2:** Simplificar F = (A + B)(A + C)

Usando distributiva especial do OR:
= A + BC

**Verificação:** Expandindo (A + B)(A + C) = A + AC + AB + BC = A(1 + C + B) + BC = A + BC ✓

### 4.3 Mapas de Karnaugh

Os mapas de Karnaugh (K-maps) são ferramentas visuais para **minimização sistemática** de expressões booleanas. Baseiam-se no código Gray, onde células adjacentes diferem em apenas uma variável.

**Estrutura dos K-maps:**
- 2 variáveis: grade 2×2 (4 células)
- 3 variáveis: grade 2×4 (8 células)
- 4 variáveis: grade 4×4 (16 células)
- 5 variáveis: duas grades 4×4 (32 células)

**Metodologia de Resolução:**

1. **Desenhe o K-map** apropriado para o número de variáveis
2. **Preencha com 1s** nas posições dos mintermos
3. **Agrupe 1s adjacentes** em retângulos de potências de 2 (1, 2, 4, 8, 16)
4. **Escreva o termo** para cada grupo (variáveis que não mudam)
5. **Some todos os termos**

**Regras críticas para agrupamento:**
- Grupos devem ser retangulares
- Tamanhos: 1, 2, 4, 8 ou 16 células
- Bordas conectam-se (wrap-around)
- Grupos podem sobrepor-se
- Faça grupos o maior possível

**Exemplo K-map 3 variáveis:** F(A,B,C) = Σm(0,2,4,5,6)

```
         BC
        00   01   11   10
   A=0 | 1  | 0  | 0  | 1  |
   A=1 | 1  | 1  | 0  | 1  |
```

**Grupos identificados:**
- Grupo 1: m0, m2, m4, m6 (coluna 00 e 10) → **C'**
- Grupo 2: m4, m5 (linha A=1, colunas 00,01) → **AB'**

**Resultado:** F = **C' + AB'**

**Exemplo K-map 4 variáveis:** F(A,B,C,D) = Σm(0,1,2,5,8,9,10)

```
          CD
         00   01   11   10
AB=00  | 1  | 1  | 0  | 1  |
AB=01  | 0  | 1  | 0  | 0  |
AB=11  | 0  | 0  | 0  | 0  |
AB=10  | 1  | 1  | 0  | 1  |
```

**Grupos:**
- {m0, m1, m8, m9}: B'C' (quatro cantos superiores)
- {m0, m2, m8, m10}: B'D' (bordas laterais)
- {m1, m5}: A'C'D

**Resultado:** F = **B'C' + B'D' + A'C'D**

### 4.4 Condições "Don't Care"

Representadas por **X** ou **d**, indicam combinações de entrada que:
- Nunca ocorrem no sistema
- Cujo valor de saída é irrelevante

**Estratégia:** Trate don't cares como 0 ou 1 para formar grupos maiores.

**Exemplo:** Decodificador BCD (0-9). Entradas 10-15 são don't care:

```
          CD
         00   01   11   10
AB=00  | 1  | 0  | 1  | 1  |
AB=01  | 0  | 1  | 1  | 1  |
AB=11  | X  | X  | X  | X  |
AB=10  | 1  | 1  | X  | X  |
```

Usar X como 1 permite formar grupo maior {m6,m7,m14,m15} = AB

### 4.5 Método de Quine-McCluskey

Para **mais de 4 variáveis**, o método tabular Quine-McCluskey é mais prático:

1. Liste mintermos agrupados por número de 1s
2. Compare grupos adjacentes; combine termos que diferem em 1 bit
3. Marque termos combinados; substitua bit diferente por "-"
4. Repita até não haver mais combinações
5. Use tabela de cobertura para selecionar implicantes essenciais

Este método é **algorítmico** e implementável em software, essencial para síntese lógica automatizada.

---

## 5. Circuitos combinacionais

### 5.1 Somadores e subtratores

**Meio-Somador (Half Adder):**

Soma dois bits sem considerar vai-um anterior.

| A | B | Soma (S) | Vai-um (C) |
|---|---|----------|------------|
| 0 | 0 | 0 | 0 |
| 0 | 1 | 1 | 0 |
| 1 | 0 | 1 | 0 |
| 1 | 1 | 0 | 1 |

**Expressões:**
- S = A ⊕ B
- C = A · B

**Implementação:** 1 porta XOR + 1 porta AND

**Somador Completo (Full Adder):**

Soma três bits: A, B e Cin (vai-um de entrada).

| A | B | Cin | Soma | Cout |
|---|---|-----|------|------|
| 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 1 | 0 |
| 0 | 1 | 0 | 1 | 0 |
| 0 | 1 | 1 | 0 | 1 |
| 1 | 0 | 0 | 1 | 0 |
| 1 | 0 | 1 | 0 | 1 |
| 1 | 1 | 0 | 0 | 1 |
| 1 | 1 | 1 | 1 | 1 |

**Expressões:**
- Soma = A ⊕ B ⊕ Cin
- Cout = AB + Cin(A ⊕ B)

**Somador Ripple Carry:**

Conecta N somadores completos em cascata. O Cout de cada estágio alimenta o Cin do próximo.

**Limitação:** Atraso proporcional a N (linear). Para 32 bits: ~9,6ns com portas de 300ps.

**Somador Carry Lookahead (CLA):**

Usa sinais de **Geração (G)** e **Propagação (P)** para calcular carries em paralelo:
- Gi = Ai · Bi (gera carry)
- Pi = Ai ⊕ Bi (propaga carry)

**Equações de carry:**
- C1 = G0 + P0·C0
- C2 = G1 + P1·G0 + P1·P0·C0
- C3 = G2 + P2·G1 + P2·P1·G0 + P2·P1·P0·C0

**Vantagem:** Atraso logarítmico—32 bits em ~3,3ns (3× mais rápido).

**CI:** 74LS283 (somador 4 bits), 74LS182 (gerador lookahead)

**Subtrator usando Complemento de Dois:**

A - B = A + B' + 1

Inverta B com portas NOT e aplique 1 no Cin do primeiro somador.

### 5.2 Multiplexadores e demultiplexadores

**Multiplexador (MUX):**

Seleciona uma entre várias entradas de dados baseado em linhas de seleção.

**MUX 4:1:**

| S1 | S0 | Y |
|----|----|---|
| 0 | 0 | D0 |
| 0 | 1 | D1 |
| 1 | 0 | D2 |
| 1 | 1 | D3 |

**Expressão:** Y = S̄1·S̄0·D0 + S̄1·S0·D1 + S1·S̄0·D2 + S1·S0·D3

**Implementando funções com MUX:**

Para F(A,B,C) = Σm(1,2,6,7) usando MUX 4:1 (A,B nas seleções):
- D0 = C (AB=00: F=1 só quando C=1)
- D1 = C̄ (AB=01: F=1 só quando C=0)
- D2 = 0 (AB=10: F nunca é 1)
- D3 = 1 (AB=11: F sempre é 1)

**CIs comuns:** 74LS151 (MUX 8:1), 74LS153 (dual MUX 4:1), 74LS157 (quad MUX 2:1)

**Demultiplexador (DEMUX):**

Direciona uma entrada de dados para uma entre várias saídas.

**DEMUX 1:4:**

| S1 | S0 | Y0 | Y1 | Y2 | Y3 |
|----|----|----|----|----|----|
| 0 | 0 | D | 0 | 0 | 0 |
| 0 | 1 | 0 | D | 0 | 0 |
| 1 | 0 | 0 | 0 | D | 0 |
| 1 | 1 | 0 | 0 | 0 | D |

**CI comum:** 74LS139 (dual DEMUX 1:4)

### 5.3 Codificadores e decodificadores

**Decodificador 3:8:**

Converte código binário de 3 bits em 8 saídas, ativando uma por vez.

| A2 | A1 | A0 | Y0 | Y1 | Y2 | Y3 | Y4 | Y5 | Y6 | Y7 |
|----|----|----|----|----|----|----|----|----|----|----|
| 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| ... | | | | | | | | | | |
| 1 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |

**CI:** 74LS138 (decodificador 3:8 com enables)

**Codificador de Prioridade 8:3:**

Codifica a entrada ativa de maior prioridade.

| D7 | D6 | D5 | D4 | D3 | D2 | D1 | D0 | A2 | A1 | A0 |
|----|----|----|----|----|----|----|----|----|----|-------|
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 1 | X | 0 | 0 | 1 |
| ... | | | | | | | | | | |
| 1 | X | X | X | X | X | X | X | 1 | 1 | 1 |

**CI:** 74LS148 (codificador de prioridade 8:3)

**Decodificador BCD para 7 Segmentos:**

| Dígito | D | C | B | A | a | b | c | d | e | f | g |
|--------|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 | 1 | 1 | 1 | 1 | 1 | 1 | 0 |
| 1 | 0 | 0 | 0 | 1 | 0 | 1 | 1 | 0 | 0 | 0 | 0 |
| 2 | 0 | 0 | 1 | 0 | 1 | 1 | 0 | 1 | 1 | 0 | 1 |
| 3 | 0 | 0 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | 0 | 1 |
| 4 | 0 | 1 | 0 | 0 | 0 | 1 | 1 | 0 | 0 | 1 | 1 |
| 5 | 0 | 1 | 0 | 1 | 1 | 0 | 1 | 1 | 0 | 1 | 1 |
| 6 | 0 | 1 | 1 | 0 | 1 | 0 | 1 | 1 | 1 | 1 | 1 |
| 7 | 0 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | 0 | 0 | 0 |
| 8 | 1 | 0 | 0 | 0 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| 9 | 1 | 0 | 0 | 1 | 1 | 1 | 1 | 1 | 0 | 1 | 1 |

**Layout dos segmentos:**
```
  aaa
 f   b
  ggg
 e   c
  ddd
```

**CIs:** 7447 (ânodo comum), 7448/CD4511 (cátodo comum)

### 5.4 Comparadores

**Comparador de 1 Bit:**

| A | B | A>B | A=B | A<B |
|---|---|-----|-----|-----|
| 0 | 0 | 0 | 1 | 0 |
| 0 | 1 | 0 | 0 | 1 |
| 1 | 0 | 1 | 0 | 0 |
| 1 | 1 | 0 | 1 | 0 |

**Expressões:**
- A > B: A·B̄
- A = B: A ⊙ B (XNOR)
- A < B: Ā·B

**CI:** 74LS85 (comparador de magnitude 4 bits), cascateável para palavras maiores.

---

## 6. Implementação prática

### 6.1 Famílias lógicas: TTL vs CMOS

**Comparação Principal:**

| Parâmetro | 74LS (TTL) | 74HC (CMOS) | 4000B (CMOS) |
|-----------|------------|-------------|--------------|
| Tensão | 4,75-5,25V | 2-6V | 3-18V |
| Potência estática | ~2mW/porta | ~µW | ~µW |
| Velocidade (tpd) | 10ns | 8ns @5V | 30ns @9V |
| Margem de ruído | 0,4V | 0,9-1,4V | ~30% Vdd |
| Corrente de saída | 16mA sink | 4mA | 1mA |
| Fan-out | 10 | 50+ | 50 |

**Quando usar cada família:**

- **74HC:** Melhor escolha geral—boa velocidade, baixo consumo, flexível
- **74HCT:** Interface com TTL legado—entradas compatíveis com TTL
- **74LS:** Sistemas legados—ainda encontrado em equipamentos antigos
- **4000B:** Baixíssimo consumo—ideal para baterias, faixa de tensão ampla
- **74LVC:** Baixa tensão moderna—para sistemas 3,3V/1,8V

### 6.2 CIs comuns e suas pinagens

**Pinagem padrão DIP 14 pinos:**
```
      +----U----+
   1  |         |  14 = Vcc (+5V)
   2  |         |  13
   3  |         |  12
   4  |         |  11
   5  |         |  10
   6  |         |  9
   7  |         |  8
      +---------+
      GND (Pino 7)
```

**7400 - Quatro portas NAND:**
```
      +----U----+
1A   1|         |14 Vcc
1B   2|  7400   |13 4B
1Y   3|         |12 4A
2A   4|         |11 4Y
2B   5|         |10 3B
2Y   6|         |9  3A
GND  7|         |8  3Y
      +---------+
```

**7404 - Seis inversores:**
```
      +----U----+
1A   1|         |14 Vcc
1Y   2|  7404   |13 6A
2A   3|         |12 6Y
2Y   4|         |11 5A
3A   5|         |10 5Y
3Y   6|         |9  4A
GND  7|         |8  4Y
      +---------+
```

**74283 - Somador de 4 bits:**
```
      +----U----+
 Σ2  1|         |16 Vcc
 B2  2| 74283   |15 B3
 A2  3|         |14 A3
 Σ1  4|         |13 Σ3
 A1  5|         |12 A4
 B1  6|         |11 B4
Cin  7|         |10 Σ4
GND  8|         |9  Cout
      +---------+
```

### 6.3 Considerações de projeto

**Desacoplamento de fonte:**

Cada CI requer capacitor de **100nF cerâmico** entre Vcc e GND, o mais próximo possível dos pinos de alimentação. Adicione **10-100µF eletrolítico** na entrada de alimentação da placa.

**Entradas não utilizadas:**

**CRÍTICO para CMOS:** Nunca deixe entradas flutuando!

| Tipo de Porta | Conectar Entrada Não Usada a |
|---------------|------------------------------|
| AND/NAND | Vcc (HIGH) |
| OR/NOR | GND (LOW) |
| XOR | GND (faz virar buffer) |

**Conversão de níveis entre famílias:**

- **74LS → 74HC:** Necessita resistor pull-up de 2,2kΩ (VOH do LS é baixo para VIH do HC)
- **74LS → 74HCT:** Conexão direta funciona (HCT tem entradas TTL-compatíveis)
- **74HC → 74LS:** Conexão direta funciona

**Proteção ESD para CMOS:**
- Use pulseira antiestática
- Armazene CIs em espuma condutiva
- Não aplique sinal antes da alimentação

---

## 7. Projetos do mundo real

### 7.1 Controle de luz com três interruptores

**Problema:** Controlar uma lâmpada de três pontos diferentes onde qualquer interruptor altera o estado.

**Entradas:** Três interruptores A, B, C (0=baixo, 1=alto)
**Saída:** L (luz: 0=apagada, 1=acesa)

**Tabela-Verdade:**
| A | B | C | Luz |
|---|---|---|-----|
| 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 1 |
| 0 | 1 | 0 | 1 |
| 0 | 1 | 1 | 0 |
| 1 | 0 | 0 | 1 |
| 1 | 0 | 1 | 0 |
| 1 | 1 | 0 | 0 |
| 1 | 1 | 1 | 1 |

**Observação:** Saída é 1 quando número ÍMPAR de entradas é 1 → função XOR.

**Expressão:** L = A ⊕ B ⊕ C

**Implementação:**
```
A ────┐
      XOR────┐
B ────┘      XOR──── Luz
C ───────────┘
```

**Componentes:** 74HC86 (usa 2 das 4 portas XOR)

**Para aplicação real:** Adicione optoacoplador e relé para controlar 127V/220V AC.

### 7.2 Sistema de alarme de segurança

**Problema:** Alarme dispara se (porta OU janela aberta) E (sistema armado).

**Entradas:**
- M: Master (1=armado)
- D: Porta (1=aberta)
- W1, W2: Janelas (1=aberta)

**Expressão derivada:** Alarme = M · (D + W1 + W2)

**K-map mostra:** Alarme = MD + MW1 + MW2 = M(D + W1 + W2)

**Implementação:**
```
D  ────┐
W1 ────┼─── OR ────┐
W2 ────┘           AND ──── Alarme
M  ────────────────┘
```

**Componentes:** 74LS32 (OR), 74LS08 (AND)

**Teste:** Com M=0, nenhuma combinação de sensores ativa alarme. Com M=1, qualquer sensor aberto dispara.

### 7.3 Controlador de semáforo simplificado

**Problema:** Sequência de semáforo: Vermelho → Vermelho+Amarelo → Verde → Amarelo

**Entradas:** J, K (estado de 2 bits de contador)
**Saídas:** X (vermelho), Y (amarelo), Z (verde)

**Tabela de estados:**
| Estado | J | K | Vermelho | Amarelo | Verde |
|--------|---|---|----------|---------|-------|
| 0 | 0 | 0 | 1 | 0 | 0 |
| 1 | 0 | 1 | 1 | 1 | 0 |
| 2 | 1 | 0 | 0 | 0 | 1 |
| 3 | 1 | 1 | 0 | 1 | 0 |

**Expressões minimizadas:**
- X = J' (NOT J)
- Y = K (direto)
- Z = J·K' (AND com K invertido)

**Componentes:** 74LS04 (inversores), 74LS08 (AND), 555 + contador para clock.

### 7.4 Lógica de máquina de venda

**Problema:** Aceitar moedas e liberar produto quando valor atingir R$0,35.

**Estados:** 0¢, 10¢, 25¢, 35¢+
**Entradas:** T (tipo moeda: 0=10¢, 1=25¢), Q1Q0 (estado atual)

**Expressão para Dispensar:** P = Q1·Q0' + Q0·T

**Componentes:** 74LS08, 74LS32, 74LS74 (flip-flops para estado)

### 7.5 Driver de display 7 segmentos

**Problema:** Converter BCD (0-9) para ativar segmentos apropriados.

**Método de projeto completo:**

1. **Tabela-verdade** para cada segmento (mostrada na Seção 5.3)

2. **K-map para segmento 'a':**
```
         BA
        00   01   11   10
DC  00 | 1  | 0  | 1  | 1  |
    01 | 0  | 1  | 1  | 1  |
    11 | X  | X  | X  | X  |
    10 | 1  | 1  | X  | X  |
```

3. **Expressão minimizada:** a = A + C + BD + B̄D̄

**CI dedicado:** CD4511 ou 7447 implementa toda lógica internamente.

### 7.6 Fechadura digital com código

**Problema:** Destravar quando código de 4 bits correto for inserido.

**Método:** Comparar entrada (A3A2A1A0) com código secreto (B3B2B1B0).

**Expressão:** UNLOCK = (A3⊙B3)·(A2⊙B2)·(A1⊙B1)·(A0⊙B0)

Cada XNOR produz 1 quando bits são iguais. AND de todos garante correspondência completa.

**Componentes:** 74LS85 (comparador 4 bits) ou 74LS86 + 74LS08

**Recurso adicional:** Contador de tentativas com 74LS93 para bloqueio após 3 erros.

### 7.7 Circuito de votação majoritária

**Problema:** Saída 1 quando maioria (2+ de 3) entradas é 1. Usado em sistemas tolerantes a falhas.

**Tabela-verdade (3 entradas):**
| A | B | C | Y |
|---|---|---|---|
| 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 0 |
| 0 | 1 | 0 | 0 |
| 0 | 1 | 1 | 1 |
| 1 | 0 | 0 | 0 |
| 1 | 0 | 1 | 1 |
| 1 | 1 | 0 | 1 |
| 1 | 1 | 1 | 1 |

**K-map:**
```
      BC
     00  01  11  10
A  0| 0 | 0 | 1 | 0 |
   1| 0 | 1 | 1 | 1 |
```

**Expressão:** Y = AB + BC + AC

**Implementação:** 3 portas AND (74LS08) + 1 porta OR de 3 entradas (74LS32 cascateado)

**Aplicação:** Redundância Modular Tripla (TMR) em sistemas críticos de aviação e espaciais.

### 7.8 Gerador/verificador de paridade

**Problema:** Detectar erros de transmissão de 1 bit.

**Gerador de paridade par (4 bits):**

**Expressão:** P = D3 ⊕ D2 ⊕ D1 ⊕ D0

O bit P é escolhido para tornar o número total de 1s par.

**Verificador:**

**Erro = D3 ⊕ D2 ⊕ D1 ⊕ D0 ⊕ P**

Se Erro=1, houve erro de transmissão.

**Implementação:** Cascata de 3-4 portas XOR (74LS86)

**CI dedicado:** 74280 (gerador/verificador de 9 bits)

**Limitação:** Detecta apenas número ímpar de erros; 2 bits invertidos passam despercebidos.

### 7.9 Codificador de prioridade para interrupções

**Problema:** Codificar a maior prioridade entre 8 fontes de interrupção.

**Entrada:** D0-D7 (requisições, D7 maior prioridade)
**Saída:** A2A1A0 (código binário), GS (grupo sinal)

O 74LS148 implementa esta função com entradas/saídas ativas em LOW.

**Cascateamento:** Conecte EO do chip de alta prioridade ao EI do chip de baixa prioridade para expandir para 16+ entradas.

**Aplicação:** Controladores de interrupção em microprocessadores.

### 7.10 ALU de calculadora de 4 bits

**Problema:** Executar ADD, SUB, AND, OR em operandos de 4 bits.

**Seleção de operação:**
| S1 | S0 | Operação |
|----|----|----------|
| 0 | 0 | A + B |
| 0 | 1 | A - B |
| 1 | 0 | A AND B |
| 1 | 1 | A OR B |

**Para subtração:** A - B = A + B' + 1 (complemento de dois)

**CI dedicado:** 74181 (ALU de 4 bits com 32 funções)

**Flags:**
- Zero: Z = NOR(F3,F2,F1,F0)
- Carry: C = Cout do MSB
- Overflow: V = Cn-1 ⊕ Cout

---

## 8. Metodologia de projeto

### 8.1 Do problema à solução

**Processo sistemático em 6 etapas:**

**1. Especificação:**
- Identifique entradas e saídas
- Defina comportamento para cada combinação
- Liste restrições e condições especiais

**2. Tabela-Verdade:**
- Liste todas as 2^n combinações de entrada
- Determine saída para cada combinação
- Identifique don't cares

**3. Expressão Booleana:**
- Escreva forma SOP (soma de mintermos)
- Ou forma POS (produto de maxtermos)

**4. Minimização:**
- Use K-map para ≤4 variáveis
- Use Quine-McCluskey para >4 variáveis
- Aproveite don't cares

**5. Implementação:**
- Escolha família lógica (74HC recomendado)
- Mapeie expressão para portas disponíveis
- Considere conversão para NAND-only ou NOR-only

**6. Verificação:**
- Simule antes de montar
- Teste todas as combinações de entrada
- Verifique timing e consumo

### 8.2 Verificação e testes

**Teste exaustivo:** Para n entradas, aplique todas as 2^n combinações e verifique saídas.

**Teste de bordas:** Foque em transições 0→1 e 1→0.

**Ferramentas:**
- Multímetro: Verificar níveis de tensão
- Sonda lógica: Verificação rápida HIGH/LOW
- Osciloscópio: Análise de timing e glitches
- LEDs com resistores: Indicadores visuais de saída

### 8.3 Depuração de circuitos

**Problemas comuns e soluções:**

| Sintoma | Causa Provável | Solução |
|---------|----------------|---------|
| Saída sempre LOW | Alimentação ausente | Verificar Vcc e GND |
| Saída sempre HIGH | Entrada flutuando | Conectar entrada apropriadamente |
| Comportamento errático | Ruído, falta desacoplamento | Adicionar capacitores 100nF |
| Aquecimento excessivo | Curto-circuito, CI danificado | Substituir CI |
| Saída intermediária | Mistura de famílias | Verificar níveis lógicos |

**Lista de verificação:**
1. Alimentação correta? (5V para TTL/HC, 3-18V para 4000)
2. Todas entradas conectadas?
3. Capacitor de desacoplamento presente?
4. Pino 1 orientado corretamente?
5. Conexões firmes no protoboard?

---

## 9. Exercícios propostos com gabarito

**Exercício 1:** Simplifique F = A'B + AB' + AB

**Solução:**
F = A'B + AB' + AB
= A'B + A(B' + B)
= A'B + A
= A + B (pela lei A + A'B = A + B)

**Exercício 2:** Projete circuito que detecta números primos de 0-7 (entrada de 3 bits).

**Solução:**
Primos: 2, 3, 5, 7 → mintermos: 2, 3, 5, 7
F = Σm(2,3,5,7)

K-map:
```
      BC
     00  01  11  10
A  0| 0 | 0 | 1 | 1 |
   1| 0 | 1 | 1 | 0 |
```
F = A'C + B'C + AB' = C(A' + B') + AB' = **BC' + AB' + A'C** (ou equivalente)

**Exercício 3:** Implemente F = A'B + BC' usando apenas portas NAND.

**Solução:**
1. F = A'B + BC' = ((A'B)'·(BC')')'  (De Morgan)
2. A'B = ((A'·B)')' → NAND de (NAND de A com A) e B
3. BC' = ((B·C')')' → NAND de B e (NAND de C com C)
4. Final: NAND dos resultados

**Exercício 4:** Projete somador BCD que detecta quando soma excede 9.

**Solução:**
Correção necessária quando: S>9 ou Cout=1
Detectar S>9: S3·S2 + S3·S1 (soma ≥10)
Expressão de correção: Corrigir = Cout + S3·S2 + S3·S1

**Exercício 5:** Quantas portas NAND de 2 entradas são necessárias para implementar XOR?

**Solução:** 4 portas NAND

```
      ┌──────────────┐
A ────┤1             │
      │  NAND ─────┬─┤3
B ────┤2           │ │  NAND ──── A⊕B
      └────────────│─┤4
A ─── NAND ────────│─┘
      (com si mesmo)│
B ─── NAND ────────┘
      (com si mesmo)
```

---

## 10. Recursos adicionais e próximos passos

**Simuladores Online Gratuitos:**
- CircuitVerse (circuitverse.org) — Excelente para iniciantes
- Logisim Evolution — Software desktop completo
- Falstad Circuit Simulator — Simulação em tempo real

**Kits de Prototipagem Recomendados:**
- Kit de portas lógicas 74HC com protoboard
- Arduino para projetos mais avançados (usa lógica digital internamente)
- FPGA (Lattice iCE40, Xilinx Artix) para implementações em larga escala

**Progressão de Aprendizado:**
1. ✓ Portas lógicas básicas (este tutorial)
2. → Circuitos sequenciais (flip-flops, contadores, registradores)
3. → Máquinas de estado finito
4. → Arquitetura de computadores
5. → Projeto com FPGA e HDL (Verilog/VHDL)

**Livros de Referência:**
- "Digital Design" - Morris Mano
- "Fundamentals of Digital Logic" - Brown & Vranesic
- "Digital Fundamentals" - Floyd

---

## Conclusão

Este tutorial percorreu os fundamentos das portas lógicas desde os conceitos básicos até projetos práticos completos. Os pontos essenciais para levar adiante são:

**Domínio conceitual:** Cada porta lógica implementa uma função booleana específica. AND requer todas entradas HIGH; OR requer qualquer uma; XOR detecta diferenças. NAND e NOR são universais—qualquer circuito pode ser construído com apenas um desses tipos.

**Competência de simplificação:** Mapas de Karnaugh transformam minimização de expressões complexas em exercício visual sistemático. A diferença entre um circuito de 15 portas e um de 5 portas frequentemente está na aplicação correta de álgebra booleana e K-maps.

**Habilidade prática:** A escolha entre 74HC (equilíbrio ideal), 4000B (baixíssimo consumo) ou 74HCT (compatibilidade TTL) depende da aplicação. Nunca deixe entradas CMOS flutuando. Sempre use capacitores de desacoplamento.

A eletrônica digital moderna evoluiu para FPGAs e ASICs, mas os princípios fundamentais permanecem idênticos aos apresentados aqui. Um engenheiro que domina portas lógicas, álgebra booleana e circuitos combinacionais possui a base sólida necessária para qualquer especialização em sistemas digitais.