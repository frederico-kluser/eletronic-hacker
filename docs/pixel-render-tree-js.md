# Renderização pixelada com detecção de bordas em Three.js

A técnica **RenderPixelatedPass** combina renderização em baixa resolução, detecção de bordas via depth e normal buffers, e escurecimento multiplicativo para criar um estilo visual reminiscente de pixel art clássico com contornos precisos. Esta abordagem multi-pass é fundamentalmente diferente de simplesmente reduzir a resolução — ela preserva informações geométricas cruciais para gerar **silhuetas de um único pixel** que definem claramente cada objeto na cena.

A implementação oficial do Three.js, criada por Kody King, executa três passes principais: renderização de cor com depth buffer, renderização de normais via `scene.overrideMaterial`, e composição final com detecção de bordas. O resultado é um efeito que evoca jogos como Return of the Obra Dinn e o estilo retro de Valheim, onde texturas pixeladas coexistem com iluminação moderna.

## A arquitetura de renderização em baixa resolução

O coração do sistema é um **WebGLRenderTarget** configurado especificamente para pixel art. A configuração crítica envolve `NearestFilter` tanto para `minFilter` quanto para `magFilter`, desabilitando qualquer interpolação bilinear:

```javascript
const beautyRenderTarget = new THREE.WebGLRenderTarget(
    Math.floor(width / pixelSize),
    Math.floor(height / pixelSize),
    {
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        generateMipmaps: false
    }
);
```

Quando o **magFilter** está configurado como `NearestFilter`, cada texel do render target de baixa resolução se transforma em um bloco de pixels nítidos ao ser ampliado para a tela. A resolução pixelada é calculada como `screenWidth / pixelSize`, então um `pixelSize` de 6 em uma tela de **1920×1080** resulta em um render target de apenas **320×180 pixels**. Essa redução drástica no fill rate é uma das principais vantagens de performance do sistema.

O **DepthTexture** anexado ao render target permite acessar informações de profundidade no pass de composição. A configuração requer `THREE.DepthFormat` com `THREE.UnsignedShortType` e, crucialmente, também utiliza `NearestFilter` para evitar artefatos de interpolação nas bordas detectadas.

Um detalhe frequentemente negligenciado é o **pixel-aligned panning** — sem ele, movimentos de câmera causam "swimming" visual onde os pixels parecem deslizar. O exemplo oficial do Three.js inclui uma função `pixelAlignFrustum` que ajusta o frustum da câmera ortográfica para alinhar com a grade de pixels, eliminando completamente esse artefato.

## Fundamentos matemáticos da detecção por depth

A detecção de bordas baseada em profundidade identifica **silhuetas** — limites onde a profundidade muda abruptamente entre pixels vizinhos. O conceito fundamental é simples: onde `|depth(x,y) - depth(x+1,y)| > threshold`, existe uma borda.

O problema clássico é a **borda dupla**: sem tratamento especial, ambos os lados de uma descontinuidade de profundidade detectam a borda, criando linhas duplicadas de 2 pixels. A solução elegante é **clampar diferenças de profundidade para valores positivos**:

```glsl
float depthDiff = centerDepth - neighborDepth;
float edge = max(0.0, depthDiff);
```

Esta técnica garante que apenas o pixel **mais próximo da câmera** (shallower) desenhe a borda. Quando iteramos do objeto mais próximo para o mais distante, `depthDiff > 0` e a borda é detectada. Na direção oposta, `depthDiff < 0` é clampado para zero.

A função **smoothstep** refina ainda mais a detecção, convertendo diferenças brutas em intensidades suaves entre thresholds:

```glsl
float threshold_low = 0.01;
float threshold_high = 0.02;
float edgeIntensity = smoothstep(threshold_low, threshold_high, depthDifference);
```

A fórmula matemática do smoothstep — `3t² - 2t³` — produz uma interpolação Hermite que elimina ruído de variações menores de profundidade enquanto cria bordas suavizadas naturalmente.

Um desafio persistente é a **precisão não-linear do depth buffer**. A distribuição de valores de profundidade concentra precisão próximo ao near plane devido ao mapeamento `1/z`. Com near=0.01 e far=1000, objetos distantes podem compartilhar os mesmos valores de depth buffer, causando z-fighting. A técnica de **Reversed-Z** (mapear near para 1.0 e far para 0.0) com floating-point cancela parcialmente essa não-linearidade, maximizando precisão onde mais importa.

## Detecção de bordas por normais de superfície

Enquanto a profundidade captura silhuetas externas, a **detecção por normais** revela bordas internas da geometria — arestas de cubos, vincos, e mudanças de orientação de superfície. Dois pixels adjacentes com normais significativamente diferentes indicam uma crease ou corner, mesmo que estejam na mesma profundidade.

O **MeshNormalMaterial** do Three.js renderiza normais de superfície como cores RGB, mapeando cada componente do vetor normal de [-1, 1] para [0, 1]:

```glsl
// Encoding
R = (Nx + 1) / 2
G = (Ny + 1) / 2  
B = (Nz + 1) / 2

// Decoding
vec3 normal = encodedNormal * 2.0 - 1.0;
```

A medida de similaridade entre normais usa o **dot product**. Para vetores unitários, `dot(N1, N2) = cos(θ)`, onde θ é o ângulo entre as normais. A diferença de normais então é `1.0 - dot(centerNormal, neighborNormal)`, resultando em 0 para superfícies paralelas e valores crescentes para ângulos maiores.

O conceito de **normal edge bias** (ou depthIndicator) previne bordas duplas também nas normais. A ideia é que apenas o pixel mais próximo da câmera "possui" a borda:

```glsl
float depthIndicator = step(neighborDepth, centerDepth);
float normalEdge = normalDiff * depthIndicator;
```

A função `step` retorna 1.0 se `centerDepth > neighborDepth` (centro mais distante), caso contrário 0.0. Isso garante que a borda seja desenhada apenas pelo pixel mais próximo, eliminando duplicação.

## Por que escurecimento multiplicativo supera linhas aditivas

A estratégia de combinação de bordas é crítica para a qualidade visual. **Linhas aditivas pretas** (`finalColor = sceneColor - edgeIntensity`) produzem contornos uniformes que parecem "colados" sobre a cena. O **escurecimento multiplicativo** oferece resultados superiores:

```glsl
finalColor = sceneColor * (1.0 - edge * edgeStrength);
```

Esta abordagem preserva o **matiz das cores** enquanto escurece, fazendo as bordas se integrarem naturalmente como sombras ou oclusão. O efeito é visualmente similar ao **ambient occlusion** — ambas as técnicas identificam áreas "ocluídas" onde a luz teria dificuldade de alcançar.

A combinação típica de depth e normal edges usa adição saturada ou máximo:

```glsl
float combinedEdge = saturate(
    depthEdge * depthEdgeStrength + 
    normalEdge * normalEdgeStrength
);
```

Os parâmetros padrão do RenderPixelatedPass (`normalEdgeStrength: 0.3`, `depthEdgeStrength: 0.4`) foram calibrados para balancear detalhes internos com silhuetas pronunciadas sem oversaturation.

## Exemplos em produção: de Obra Dinn ao HD-2D

**Return of the Obra Dinn** (Lucas Pope, 2018) demonstra uma aplicação sofisticada dessas técnicas. O jogo renderiza internamente em 8-bit grayscale e converte para 1-bit via dithering. Pope desenvolveu uma técnica de **sphere-mapped dithering** para estabilidade temporal — o padrão de dither é mapeado em uma esfera centrada na cabeça do jogador, permanecendo fixo durante rotações de câmera. O jogo também utiliza edge detection post-processing para criar outlines que invertem automaticamente (preto sobre branco, branco sobre preto).

**Valheim** (Iron Gate Studio, 2021) combina estética PS1/DOS com tecnologia moderna: texturas de baixa resolução sem filtering, modelos low-poly, mas com iluminação PBR, depth of field, e god rays. É um exemplo perfeito de como renderização pixelada pode coexistir com efeitos contemporâneos.

O estilo **HD-2D** da Square Enix (Octopath Traveler, Triangle Strategy) representa outra variação: sprites 2D em estilo 16-bit como billboards em ambientes 3D completos com point lighting, depth of field, e partículas modernas. A equipe da Acquire explicitamente adicionou point lights simultâneos aos visual effects para que personagens pixelados projetassem sombras nos cenários 3D.

**Sable** utiliza cell shading inspirado em Moebius com edge detection em depth, normais e cor para criar linhas uniformes estilo caneta. O projeto **t3ssel8r** (viral no YouTube) demonstra pixel art 3D em tempo real com camera snapping para grids de texels, evitando "pixel creep" durante movimentos suaves.

## Variações avançadas e técnicas complementares

### Quantização de cores e dithering

A **posterização** reduz cores usando a fórmula `floor(color * (n-1) + 0.5) / (n-1)` onde n é o número de cores. Combinada com **ordered dithering** (matriz Bayer), simula gradientes suaves com paleta limitada:

```glsl
float threshold = bayerMatrix8x8[y * 8 + x];
color.rgb += threshold;
color = floor(color * (colorNum - 1.0) + 0.5) / (colorNum - 1.0);
```

O **blue noise dithering** oferece aparência mais orgânica que Bayer, essencial para o visual de Obra Dinn em ambientes naturais.

### Efeitos CRT e scanlines

Scanlines básicas usam `sin(uv.y * frequency)`, mas CRTs autênticos requerem simulação de **shadow mask RGB**, curvatura de tela, e decay de fósforo. A aberração cromática adiciona separação de canais:

```glsl
color.r = texture2D(inputBuffer, uv + SPREAD).r;
color.g = texture2D(inputBuffer, uv).g;
color.b = texture2D(inputBuffer, uv - SPREAD).b;
```

### Fontes adicionais de edge detection

Além de depth e normais, o **Sobel operator no canal de cor** detecta bordas em texturas, e **Object ID edges** permitem highlighting de objetos selecionados renderizando IDs únicos para um buffer separado.

## Implementação completa: o pipeline de três passes

O sistema RenderPixelatedPass executa a seguinte sequência:

**Pass 1 (Beauty)**: Renderiza a cena normalmente para o `beautyRenderTarget` de baixa resolução. O DepthTexture é populado automaticamente.

**Pass 2 (Normal)**: Define `scene.overrideMaterial = MeshNormalMaterial` e renderiza para `normalRenderTarget`. O override material força todos os objetos a renderizarem apenas suas normais de superfície.

**Pass 3 (Composição)**: Um fullscreen quad amostra as três texturas (color, depth, normal), executa edge detection, aplica escurecimento multiplicativo, e outputa o resultado final com upscaling via NearestFilter.

A escolha de **passes separados vs MRT** (Multiple Render Targets) favorece simplicidade e compatibilidade. MRT reduziria draw calls mas complica o uso de `scene.overrideMaterial` e tem suporte inconsistente em navegadores.

## Considerações de performance e troubleshooting

A renderização em baixa resolução reduz drasticamente o fill rate — um render target de 320×180 tem apenas **2.9%** dos pixels de 1080p. Os dois scene renders por frame (color + normal) são o principal custo.

Problemas comuns incluem:
- **Bordas duplas**: Verificar se depth clamping está implementado corretamente
- **Shimmer durante movimento**: Implementar pixel-aligned camera panning
- **Z-fighting em objetos distantes**: Aumentar near plane ou usar Reversed-Z
- **Bordas ausentes em superfícies planas**: Esperado — normais idênticas não geram edge

Para integração com TAA, aplicar anti-aliasing **antes** da pixelização no buffer de alta resolução, ou usar SMAA que preserva melhor bordas nítidas.

## Conclusão

A técnica RenderPixelatedPass representa uma convergência elegante de conceitos de computer graphics — depth buffers, surface normals, edge detection operators, e post-processing composition — para criar um estilo visual que evoca nostalgia enquanto se beneficia de hardware moderno. A chave do sucesso está no **escurecimento multiplicativo** que integra bordas naturalmente, no **depth bias** que elimina duplicação de linhas, e na configuração precisa de **NearestFilter** que mantém a integridade do pixel art.

As aplicações em produção demonstram versatilidade surpreendente: do 1-bit starkness de Obra Dinn ao blend de retro e moderno em Valheim, passando pelo HD-2D que une sprites clássicos com iluminação contemporânea. Para desenvolvedores Three.js, o exemplo oficial `webgl_postprocessing_pixel` oferece uma base sólida que pode ser estendida com dithering, quantização de cores, e efeitos CRT conforme as necessidades estéticas do projeto.