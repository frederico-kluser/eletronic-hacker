# Interfaces UI em Three.js: guia técnico para texto e containers

**Texto "vazando" de containers em Three.js acontece porque WebGL não possui overflow nativo** — cada mesh é renderizado independentemente, sem hierarquia pai-filho com clipping automático. A solução envolve usar clipping planes (`renderer.localClippingEnabled = true`), shaders com `clipRect`, ou bibliotecas especializadas como troika-three-text e three-mesh-ui que implementam essas técnicas internamente.

Este guia cobre desde a causa técnica fundamental até padrões de arquitetura avançados, com código funcional para vanilla Three.js e React Three Fiber.

---

## Por que WebGL não tem overflow: hidden

O modelo de renderização WebGL fundamentalmente difere de CSS/HTML. No DOM, `overflow: hidden` é nativo — elementos pai automaticamente recortam filhos que excedem seus limites. **WebGL renderiza triângulos diretamente em um framebuffer**, sem conceito de containers hierárquicos.

Três fatores técnicos causam o vazamento de texto:

1. **Ausência de clipping hierárquico**: cada mesh é rasterizado independentemente, sem awareness de "containers"
2. **Divergência entre bounds geométricos e visuais**: fontes SDF e kerning fazem os bounds visuais diferirem da geometria
3. **Profundidade uniforme**: elementos coplanares (texto sobre painéis) competem pelos mesmos valores no depth buffer

A solução requer implementação explícita de recorte via **clipping planes** (descarte de fragmentos em planos 3D), **shaders personalizados** (descarte pixel-a-pixel via `discard`), ou **stencil buffer** (máscaras arbitrárias por pixel).

---

## Métodos de renderização de texto comparados

| Método | Qualidade | Performance | Escalabilidade | Caso de Uso |
|--------|-----------|-------------|----------------|-------------|
| **troika-three-text** | Excelente (SDF) | Excelente | Perfeita | **Uso geral recomendado** |
| **CSS2DRenderer** | Nativa browser | Excelente | Perfeita | Labels e overlays |
| **Canvas Textures** | Média (bitmap) | Boa | Limitada | Sprites com texto |
| **TextGeometry** | Alta (3D) | Baixa | Fixa | Títulos 3D decorativos |
| **CSS3DRenderer** | Nativa browser | Boa | Perfeita | Painéis HTML em 3D |

### troika-three-text é a escolha padrão

Para **95% dos casos**, troika-three-text oferece a melhor combinação de qualidade, performance e facilidade. Usa Signed Distance Fields (SDF) gerados em web worker, permitindo texto nítido em qualquer escala com baixo overhead de GPU.

```javascript
import { Text } from 'troika-three-text';

const text = new Text();
text.text = 'Texto de exemplo com vazamento controlado';
text.fontSize = 0.1;
text.font = '/fonts/Roboto-Regular.woff';
text.color = 0xffffff;

// Configurações críticas para prevenir vazamento
text.maxWidth = 2;                    // Quebra de linha automática
text.whiteSpace = 'nowrap';           // OU sem quebra para clipRect funcionar
text.clipRect = [-1, -0.5, 1, 0.5];   // [minX, minY, maxX, maxY] - recorta pixels fora

// Ancoragem e alinhamento
text.anchorX = 'center';
text.anchorY = 'middle';
text.textAlign = 'center';

// Prevenir z-fighting
text.depthOffset = -0.001;

// Sync obrigatório após mudanças
text.sync(() => console.log('Texto renderizado'));

scene.add(text);
```

**Propriedades-chave para overflow**:
- `clipRect`: recorta via shader — fragmentos fora do retângulo são descartados
- `maxWidth`: define largura máxima antes da quebra de linha
- `whiteSpace: 'nowrap'`: desativa quebra, use com `clipRect` para simular `overflow: hidden`

### CSS2DRenderer para labels simples

Quando você precisa de texto HTML nativo posicionado em coordenadas 3D (annotations, tooltips), CSS2DRenderer é mais leve e suporta todas as fontes CSS:

```javascript
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

// Setup do renderer CSS (além do WebGLRenderer)
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.cssText = 'position:absolute;top:0;pointer-events:none';
document.body.appendChild(labelRenderer.domElement);

// Criar label
const labelDiv = document.createElement('div');
labelDiv.textContent = 'Label do objeto';
labelDiv.style.cssText = `
  color: white;
  font: 14px Arial;
  padding: 4px 8px;
  background: rgba(0,0,0,0.7);
  border-radius: 4px;
  overflow: hidden;           /* CSS nativo funciona aqui */
  text-overflow: ellipsis;
  max-width: 150px;
`;

const label = new CSS2DObject(labelDiv);
label.position.set(0, 1, 0);
label.center.set(0.5, 0);  // Ponto de ancoragem
targetMesh.add(label);

// Render loop deve incluir ambos renderers
function animate() {
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
  requestAnimationFrame(animate);
}
```

**Limitação**: elementos sempre renderizam sobre a cena 3D (não são ocluídos por objetos).

---

## Bibliotecas de UI com suporte a clipping

### three-mesh-ui para painéis VR/AR

A biblioteca padrão para interfaces em WebXR. Implementa layout flexbox-like com `hiddenOverflow` usando clipping planes.

```javascript
import * as ThreeMeshUI from 'three-mesh-ui';

// CRÍTICO: habilitar clipping no renderer
renderer.localClippingEnabled = true;

const container = new ThreeMeshUI.Block({
  width: 0.8,
  height: 0.4,
  padding: 0.05,
  fontFamily: '/fonts/Roboto-msdf.json',
  fontTexture: '/fonts/Roboto-msdf.png',
  
  // Propriedades de overflow
  hiddenOverflow: true,  // Ativa clipping planes nas bordas
  
  // Layout flexbox
  contentDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  
  backgroundColor: new THREE.Color(0x1a1a1a),
  backgroundOpacity: 0.9,
});

const text = new ThreeMeshUI.Text({
  content: 'Texto longo que será cortado nas bordas do container...',
  fontSize: 0.04,
  fontColor: new THREE.Color(0xffffff),
});

container.add(text);
scene.add(container);

// Update obrigatório no render loop
function animate() {
  ThreeMeshUI.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
```

**Erros comuns com three-mesh-ui**:
- ❌ Esquecer `renderer.localClippingEnabled = true` — hiddenOverflow não funciona
- ❌ Não chamar `ThreeMeshUI.update()` no loop — texto não aparece
- ❌ Usar `justifyContent: 'left'` em vez de `'start'` — causa erros NaN

### @pmndrs/uikit para UI moderna com scroll

A solução mais completa para UIs complexas, com layout Yoga flexbox e suporte nativo a scroll.

```javascript
import { Root, Container, Text, reversePainterSortStable } from '@pmndrs/uikit';

// Setup
renderer.localClippingEnabled = true;
renderer.setTransparentSort(reversePainterSortStable);

const root = new Root(camera, renderer, {
  width: 400,
  height: 300,
  flexDirection: 'column',
  padding: 16,
  backgroundColor: '#1a1a1a',
});
scene.add(root);

// Container scrollável
const scrollContainer = new Container({
  width: '100%',
  height: 200,
  overflow: 'scroll',      // 'scroll', 'hidden', ou 'visible'
  flexDirection: 'column',
  gap: 8,
  padding: 10,
  backgroundColor: '#333',
});
root.add(scrollContainer);

// Conteúdo que excede o container
for (let i = 0; i < 20; i++) {
  const item = new Container({
    width: '100%',
    padding: 8,
    backgroundColor: '#444',
  });
  item.add(new Text({ value: `Item ${i + 1}`, fontSize: 14, color: 'white' }));
  scrollContainer.add(item);
}

// Update no render loop
function animate() {
  root.update(0.016); // delta time
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
```

---

## Soluções para problemas específicos

### Problema 1: Texto vazando horizontalmente

**Causa**: texto sem limite de largura ou clipping.

**Solução com troika-three-text**:
```javascript
const text = new Text();
text.text = 'Texto muito longo que deveria ser cortado';
text.maxWidth = 2;           // Largura máxima
text.whiteSpace = 'nowrap';  // Sem quebra de linha
text.clipRect = [-1, -0.25, 1, 0.25]; // Recorte explícito
text.sync();
```

**Solução com three-mesh-ui**:
```javascript
renderer.localClippingEnabled = true; // OBRIGATÓRIO

const block = new ThreeMeshUI.Block({
  width: 2,
  height: 0.5,
  hiddenOverflow: true,
});
```

### Problema 2: Z-fighting entre texto e painel

**Causa**: texto e background ocupam mesma profundidade no depth buffer.

**Solução 1 - depthOffset (troika)**:
```javascript
text.depthOffset = -0.5; // Negativo = mais próximo da câmera
```

**Solução 2 - polygonOffset (materiais)**:
```javascript
// Painel (renderiza primeiro)
panelMaterial.polygonOffset = true;
panelMaterial.polygonOffsetFactor = 1;
panelMaterial.polygonOffsetUnits = 1;

// Texto (renderiza depois, ligeiramente à frente)
textMaterial.polygonOffset = true;
textMaterial.polygonOffsetFactor = -1;
textMaterial.polygonOffsetUnits = -1;
```

**Solução 3 - offset de posição Z**:
```javascript
textMesh.position.z = panelMesh.position.z + 0.001;
```

### Problema 3: Texto com escala inconsistente

**Causa**: UI em world-space escala com distância da câmera.

**Solução - escala compensada por distância**:
```javascript
function updateLabelScale(label, camera, targetScreenSize = 0.1) {
  const distance = camera.position.distanceTo(label.position);
  label.scale.setScalar(distance * targetScreenSize);
}

// No render loop
uiLabels.forEach(label => updateLabelScale(label, camera));
```

**Solução alternativa - sizeAttenuation para sprites**:
```javascript
const material = new THREE.SpriteMaterial({
  map: textTexture,
  sizeAttenuation: false // Tamanho fixo em pixels
});
```

### Problema 4: Texto desalinhado

**Causa**: origem padrão em canto inferior esquerdo, não no centro.

**Solução com troika**:
```javascript
text.anchorX = 'center'; // 'left', 'center', 'right'
text.anchorY = 'middle'; // 'top', 'middle', 'bottom', 'top-baseline', 'bottom-baseline'
text.textAlign = 'center'; // Para multi-linha
```

**Solução com TextGeometry**:
```javascript
geometry.computeBoundingBox();
geometry.center(); // Centraliza na origem

// OU manualmente
const offset = new THREE.Vector3();
geometry.boundingBox.getCenter(offset);
geometry.translate(-offset.x, -offset.y, -offset.z);
```

---

## Padrões para React Three Fiber

### Componente Text com @react-three/drei

O componente `Text` do drei encapsula troika-three-text:

```tsx
import { Text, Billboard } from '@react-three/drei';

function Label({ children, position }: { children: string; position: [number, number, number] }) {
  return (
    <Billboard position={position} follow lockX={false} lockY={false}>
      <Text
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={2}
        clipRect={[-1, -0.5, 1, 0.5]}
        depthOffset={-0.5}
      >
        {children}
        <meshBasicMaterial toneMapped={false} />
      </Text>
    </Billboard>
  );
}
```

### UI completa com @react-three/uikit

```tsx
import { Canvas } from '@react-three/fiber';
import { Fullscreen, Container, Text } from '@react-three/uikit';

function GameUI() {
  return (
    <Canvas gl={{ localClippingEnabled: true }}>
      <Fullscreen flexDirection="column" padding={20} gap={10}>
        <Container
          sizeX={300}
          sizeY={150}
          overflow="hidden"
          backgroundColor="rgba(0,0,0,0.8)"
          borderRadius={8}
          padding={12}
        >
          <Text fontSize={16} color="white">
            Texto que será cortado se exceder o container
          </Text>
        </Container>
        
        <Container
          sizeX={300}
          sizeY={200}
          overflow="scroll"
          backgroundColor="rgba(30,30,30,0.9)"
          borderRadius={8}
        >
          <Container flexDirection="column" gap={8} padding={10}>
            {Array.from({ length: 20 }, (_, i) => (
              <Text key={i} fontSize={14} color="white">
                Item scrollável {i + 1}
              </Text>
            ))}
          </Container>
        </Container>
      </Fullscreen>
    </Canvas>
  );
}
```

### Gerenciamento de estado com Zustand

```tsx
import { create } from 'zustand';

interface UIState {
  health: number;
  score: number;
  setHealth: (v: number) => void;
}

const useUIStore = create<UIState>((set) => ({
  health: 100,
  score: 0,
  setHealth: (health) => set({ health }),
}));

// Uso reativo (causa re-render)
function HealthBar() {
  const health = useUIStore(state => state.health);
  return <Container sizeX={health * 2} sizeY={20} backgroundColor="red" />;
}

// Uso não-reativo para animações (sem re-render)
function AnimatedMesh() {
  const ref = useRef<THREE.Mesh>(null!);
  
  useFrame(() => {
    const { health } = useUIStore.getState(); // Acesso direto
    ref.current.scale.x = health / 100;
  });
  
  return <mesh ref={ref}><boxGeometry /><meshBasicMaterial /></mesh>;
}
```

---

## Performance e draw calls

**Meta**: manter abaixo de **2.000 draw calls** para 60 FPS estáveis. Cada mesh com material diferente = 1 draw call.

### Monitoramento de draw calls

```javascript
// Exibir métricas em tempo real
function logPerformance() {
  const info = renderer.info;
  console.log(`
    Draw Calls: ${info.render.calls}
    Triangles: ${info.render.triangles}
    Geometries: ${info.memory.geometries}
    Textures: ${info.memory.textures}
  `);
}
```

### InstancedMesh para elementos repetidos

Quando você tem muitos elementos UI idênticos (ícones, marcadores):

```javascript
const geometry = new THREE.PlaneGeometry(0.5, 0.5);
const material = new THREE.MeshBasicMaterial({ map: iconTexture });
const instanced = new THREE.InstancedMesh(geometry, material, 100);

const matrix = new THREE.Matrix4();
items.forEach((item, i) => {
  matrix.setPosition(item.x, item.y, item.z);
  instanced.setMatrixAt(i, matrix);
});
instanced.instanceMatrix.needsUpdate = true;

scene.add(instanced); // 1 draw call para 100 elementos
```

### Preload de fontes troika

```javascript
import { preloadFont } from 'troika-three-text';

// Antes de renderizar
preloadFont({
  font: '/fonts/Roboto-Regular.woff',
  characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?'
}, () => {
  startApp(); // Fontes prontas, sem delay no primeiro render
});
```

---

## Checklist de melhores práticas

### Configuração inicial obrigatória
- [ ] `renderer.localClippingEnabled = true` quando usar clipping
- [ ] Preload de fontes antes do primeiro render
- [ ] Definir `maxWidth` ou `clipRect` para todo texto

### Prevenção de vazamento
- [ ] Usar `hiddenOverflow: true` em containers three-mesh-ui
- [ ] Definir `clipRect` em troika-three-text para overflow hidden
- [ ] Testar com strings longas durante desenvolvimento

### Prevenção de z-fighting
- [ ] Offset mínimo de `0.001` entre layers coplanares
- [ ] Usar `depthOffset` em troika ou `polygonOffset` em materiais
- [ ] Definir `renderOrder` para controle de ordem de renderização

### Performance
- [ ] Monitorar draw calls com `renderer.info.render.calls`
- [ ] Usar InstancedMesh para elementos repetidos
- [ ] Chamar `text.sync()` com batching (debounce múltiplas mudanças)
- [ ] Sempre chamar `.dispose()` ao remover geometrias/materiais/texturas

### Arquitetura React Three Fiber
- [ ] Habilitar `gl={{ localClippingEnabled: true }}` no Canvas
- [ ] Usar `visible={false}` em vez de renderização condicional
- [ ] Acessar store com `getState()` dentro de `useFrame` para evitar re-renders
- [ ] Mutatar refs em vez de setState para animações

---

## Troubleshooting rápido

| Sintoma | Diagnóstico | Solução |
|---------|-------------|---------|
| `hiddenOverflow` não funciona | `localClippingEnabled` desativado | `renderer.localClippingEnabled = true` |
| Texto não aparece (three-mesh-ui) | `update()` não chamado | Adicionar `ThreeMeshUI.update()` no loop |
| Texto borrado em troika | Font não carregada | Usar `onSync` callback ou preload |
| Z-fighting visível | Elementos coplanares | `depthOffset`, `polygonOffset` ou offset de posição |
| Texto desalinhado | Anchor incorreto | Configurar `anchorX`, `anchorY`, `textAlign` |
| Performance ruim | Muitos draw calls | Usar instancing, merge geometries, texture atlas |
| clipRect não funciona | `whiteSpace: 'normal'` | Usar `whiteSpace: 'nowrap'` para clipping horizontal |
| Scroll não funciona | Biblioteca errada | Usar @pmndrs/uikit para scroll nativo |

---

## Conclusão

A ausência de overflow nativo em WebGL exige abordagens explícitas: **troika-three-text** com `clipRect` para texto standalone, **three-mesh-ui** com `hiddenOverflow` para painéis VR/AR, ou **@pmndrs/uikit** para UIs complexas com scroll. A configuração `renderer.localClippingEnabled = true` é pré-requisito para qualquer solução baseada em clipping planes.

Para produção, combine preload de fontes, monitoramento de draw calls via `renderer.info`, e testes sistemáticos com strings longas. O padrão mais robusto é encapsular texto em containers com clipping definido explicitamente — nunca assuma que texto ficará dentro dos bounds esperados.