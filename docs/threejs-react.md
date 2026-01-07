# Guia definitivo: Three.js com React para desenvolvimento de jogos

O desenvolvimento de jogos 2D/3D com Three.js e React representa uma das abordagens mais poderosas para criar experiências interativas na web. Esta documentação fornece padrões prontos para produção, cobrindo desde a configuração inicial até sistemas complexos de sprites, otimização de desempenho e interfaces de usuário contidas.

**Versões compatíveis:** Three.js v0.182.0, @react-three/fiber v9.5.0, @react-three/drei v10.7.7, React 19 (ou R3F v8 para React 18).

---

## 1. Introdução e visão geral da arquitetura

O ecossistema React Three Fiber (R3F) transforma a biblioteca Three.js em componentes React declarativos, mantendo todo o poder do WebGL. A arquitetura fundamental consiste em três pilares: **Scene** (contêiner de objetos 3D), **Camera** (ponto de vista e projeção), e **Renderer** (conversão da cena 3D para canvas 2D via WebGL).

O R3F adiciona uma camada de abstração que permite usar JSX para descrever cenas 3D, integração nativa com hooks do React, e gerenciamento automático do ciclo de renderização através do hook `useFrame`. Para jogos, essa abordagem oferece vantagens significativas: componentização de entidades do jogo, reatividade para estados de UI, e integração facilitada com bibliotecas do ecossistema React.

A arquitetura recomendada separa claramente três domínios: **componentes 3D** (meshes, sprites, luzes), **lógica de jogo** (física, colisão, IA), e **interface do usuário** (HUD, menus, overlays). Essa separação permite otimizações específicas para cada camada e facilita a manutenção do código.

---

## 2. Instalação e configuração do projeto

### Dependências e instalação

```bash
# Criar projeto com Vite (recomendado)
npm create vite@latest meu-jogo -- --template react-ts
cd meu-jogo

# Instalar dependências principais
npm install three @react-three/fiber @react-three/drei

# Instalar tipos para TypeScript
npm install -D @types/three
```

| Pacote | Versão | Descrição |
|--------|--------|-----------|
| three | 0.182.0 | Biblioteca base WebGL |
| @react-three/fiber | 9.5.0 | Renderizador React para Three.js |
| @react-three/drei | 10.7.7 | Helpers e abstrações úteis |

### Estrutura de projeto recomendada

```
src/
├── components/
│   ├── canvas/           # Componentes 3D (meshes, sprites)
│   │   ├── Player.tsx
│   │   ├── Enemies.tsx
│   │   └── Environment.tsx
│   └── ui/               # Componentes HTML/CSS
│       ├── HUD.tsx
│       └── Menu.tsx
├── hooks/                # Hooks customizados
│   ├── useKeyboard.ts
│   └── useGameLoop.ts
├── stores/               # Gerenciamento de estado (Zustand)
│   └── gameStore.ts
├── systems/              # Sistemas do jogo (física, colisão)
├── types/                # Definições TypeScript
└── utils/                # Funções utilitárias
```

### Configuração TypeScript

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

O padrão de tipagem para componentes 3D no R3F v9 utiliza `ThreeElements`:

```typescript
import { ThreeElements } from '@react-three/fiber';
import { Mesh } from 'three';
import { useRef } from 'react';

// Tipagem correta para props de mesh
type BoxProps = ThreeElements['mesh'] & { velocidade?: number };

function Box(props: BoxProps) {
  // Usar non-null assertion para refs que serão atribuídas
  const meshRef = useRef<Mesh>(null!);
  return <mesh ref={meshRef} {...props} />;
}
```

### Otimização de build para produção

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei']
        }
      }
    }
  }
});
```

---

## 3. Conceitos fundamentais

### Scene Graph e hierarquia de objetos

O Three.js utiliza uma estrutura de árvore onde cada nó herda de `Object3D`. Transformações são relativas ao pai, seguindo a ordem **SRT** (Scale-Rotation-Translation):

```tsx
function HierarquiaExemplo() {
  return (
    // Grupo pai - todas as transformações afetam os filhos
    <group position={[0, 2, 0]} rotation={[0, Math.PI / 4, 0]}>
      {/* Mesh filho - posição relativa ao grupo */}
      <mesh position={[1, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </group>
  );
}
```

### Sistema de coordenadas

Three.js usa sistema **mão-direita** com **Y para cima**:
- **X**: direita (positivo) / esquerda (negativo)
- **Y**: cima (positivo) / baixo (negativo)
- **Z**: frente/tela (positivo) / fundo (negativo)

### Câmeras para jogos

**OrthographicCamera** para jogos 2D (sem perspectiva):

```tsx
import { Canvas } from '@react-three/fiber';

function Jogo2D() {
  return (
    <Canvas
      orthographic
      camera={{
        zoom: 50,
        position: [0, 0, 100],
        near: 0.1,
        far: 1000
      }}
    >
      <Cena2D />
    </Canvas>
  );
}
```

**PerspectiveCamera** para jogos 3D:

```tsx
<Canvas
  camera={{
    fov: 75,
    position: [0, 5, 10],
    near: 0.1,
    far: 1000
  }}
>
  <Cena3D />
</Canvas>
```

### Game loop com useFrame

O hook `useFrame` executa a cada frame renderizado, fornecendo acesso ao estado e delta time:

```tsx
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Mesh } from 'three';

function Jogador() {
  const meshRef = useRef<Mesh>(null!);

  useFrame((state, delta) => {
    // delta = tempo desde último frame (em segundos)
    // Usar delta para movimento independente de framerate
    meshRef.current.rotation.y += 1 * delta;
    
    // state contém: clock, camera, scene, gl, etc.
    const tempo = state.clock.getElapsedTime();
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}
```

---

## 4. Sistema de sprites

### Sprites básicos no R3F

Sprites são planos que sempre encaram a câmera (billboarding automático):

```tsx
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

function SpriteJogador({ posicao }: { posicao: [number, number, number] }) {
  // Carregar textura
  const textura = useLoader(THREE.TextureLoader, '/sprites/jogador.png');
  
  // Configurar para pixel art (desabilitar filtro)
  textura.minFilter = THREE.NearestFilter;
  textura.magFilter = THREE.NearestFilter;

  return (
    <sprite position={posicao} scale={[2, 2, 1]}>
      <spriteMaterial 
        map={textura} 
        transparent 
        alphaTest={0.5}
      />
    </sprite>
  );
}
```

### Sprite sheets e animação

Para animação frame-by-frame usando sprite sheets:

```tsx
import { useFrame, useLoader } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

interface SpriteAnimadoProps {
  spritesheet: string;
  colunas: number;
  linhas: number;
  fps?: number;
  posicao?: [number, number, number];
}

function SpriteAnimado({ 
  spritesheet, 
  colunas, 
  linhas, 
  fps = 12,
  posicao = [0, 0, 0] 
}: SpriteAnimadoProps) {
  const textura = useLoader(THREE.TextureLoader, spritesheet);
  const totalFrames = colunas * linhas;
  const frameAtual = useRef(0);
  const tempoAcumulado = useRef(0);

  // Configurar textura para sprite sheet
  useMemo(() => {
    textura.minFilter = THREE.NearestFilter;
    textura.magFilter = THREE.NearestFilter;
    textura.wrapS = THREE.ClampToEdgeWrapping;
    textura.wrapT = THREE.ClampToEdgeWrapping;
    // Definir tamanho de um frame
    textura.repeat.set(1 / colunas, 1 / linhas);
  }, [textura, colunas, linhas]);

  useFrame((_, delta) => {
    tempoAcumulado.current += delta;
    const intervaloFrame = 1 / fps;

    if (tempoAcumulado.current >= intervaloFrame) {
      tempoAcumulado.current = 0;
      frameAtual.current = (frameAtual.current + 1) % totalFrames;

      // Calcular posição UV do frame
      const coluna = frameAtual.current % colunas;
      const linha = Math.floor(frameAtual.current / colunas);

      // Atualizar offset da textura
      textura.offset.x = coluna / colunas;
      // Y invertido porque UV começa de baixo
      textura.offset.y = 1 - (linha + 1) / linhas;
    }
  });

  return (
    <sprite position={posicao} scale={[2, 2, 1]}>
      <spriteMaterial map={textura} transparent />
    </sprite>
  );
}
```

### Usando SpriteAnimator do drei

O @react-three/drei oferece componente pronto para animação:

```tsx
import { SpriteAnimator } from '@react-three/drei';

function PersonagemAnimado() {
  return (
    <SpriteAnimator
      position={[0, 0, 0]}
      autoPlay={true}
      loop={true}
      fps={12}
      numberOfFrames={8}
      textureImageURL="/sprites/personagem.png"
      textureDataURL="/sprites/personagem.json"
      onFrame={(info) => console.log('Frame:', info.currentFrame)}
      onEnd={() => console.log('Animação terminou')}
    />
  );
}
```

### Ordenação de profundidade para sprites

Em jogos 2D top-down, sprites mais baixos devem aparecer na frente:

```tsx
function SpriteOrdenado({ posicao }: { posicao: [number, number, number] }) {
  const spriteRef = useRef<THREE.Sprite>(null!);

  useFrame(() => {
    // Ordenar por posição Y (menor Y = maior renderOrder)
    spriteRef.current.renderOrder = -posicao[1];
  });

  return (
    <sprite ref={spriteRef} position={posicao}>
      <spriteMaterial map={textura} transparent />
    </sprite>
  );
}
```

---

## 5. Otimização de desempenho

### Configuração do renderer

```tsx
<Canvas
  gl={{
    antialias: false,              // Desabilitar para pixel art
    powerPreference: 'high-performance', // Usar GPU dedicada
    precision: 'mediump',          // Economiza em mobile
    stencil: false,                // Desabilitar se não usar máscaras
    depth: true,
    preserveDrawingBuffer: false,  // Manter false
    localClippingEnabled: true     // Para UI contida
  }}
  dpr={[1, 2]}  // Limitar pixel ratio
>
```

### Object pooling para sprites/projéteis

```typescript
// stores/poolStore.ts
import { create } from 'zustand';
import * as THREE from 'three';

interface Projetil {
  id: number;
  ativo: boolean;
  posicao: THREE.Vector3;
  velocidade: THREE.Vector3;
}

interface PoolState {
  projeteis: Projetil[];
  obterProjetil: () => Projetil | null;
  liberarProjetil: (id: number) => void;
}

export const usePoolStore = create<PoolState>((set, get) => {
  // Pré-alocar pool
  const poolInicial: Projetil[] = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    ativo: false,
    posicao: new THREE.Vector3(),
    velocidade: new THREE.Vector3()
  }));

  return {
    projeteis: poolInicial,
    
    obterProjetil: () => {
      const projetil = get().projeteis.find(p => !p.ativo);
      if (projetil) {
        projetil.ativo = true;
        projetil.posicao.set(0, 0, 0);
        projetil.velocidade.set(0, 0, 0);
      }
      return projetil ?? null;
    },
    
    liberarProjetil: (id) => {
      const projeteis = get().projeteis;
      const projetil = projeteis.find(p => p.id === id);
      if (projetil) {
        projetil.ativo = false;
      }
    }
  };
});
```

### InstancedMesh para muitos objetos similares

Para renderizar centenas ou milhares de objetos idênticos:

```tsx
import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface InstanciasProps {
  quantidade: number;
}

function Instancias({ quantidade }: InstanciasProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const temp = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    // Configurar posições iniciais
    for (let i = 0; i < quantidade; i++) {
      temp.position.set(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100
      );
      temp.updateMatrix();
      meshRef.current.setMatrixAt(i, temp.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [quantidade, temp]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, quantidade]}>
      <sphereGeometry args={[0.5, 8, 8]} />
      <meshStandardMaterial color="cyan" />
    </instancedMesh>
  );
}
```

### Evitando re-renders no React

**Regra de ouro:** Nunca use `useState` para dados que atualizam a cada frame.

```tsx
// ❌ ERRADO - causa 60 re-renders por segundo
function JogadorErrado() {
  const [posicao, setPosicao] = useState([0, 0, 0]);
  
  useFrame(() => {
    setPosicao([novoX, novoY, novoZ]); // Re-render!
  });
  
  return <mesh position={posicao} />;
}

// ✅ CORRETO - mutação direta via ref
function JogadorCorreto() {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame((_, delta) => {
    meshRef.current.position.x += velocidade * delta;
  });
  
  return <mesh ref={meshRef} />;
}
```

### Zustand para estado de alta frequência

```typescript
import { create } from 'zustand';

interface GameState {
  jogadorX: number;
  jogadorY: number;
  atualizarPosicao: (x: number, y: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  jogadorX: 0,
  jogadorY: 0,
  atualizarPosicao: (x, y) => set({ jogadorX: x, jogadorY: y })
}));

// No componente - usar getState() em useFrame
function Jogador() {
  const ref = useRef<THREE.Mesh>(null!);
  
  useFrame(() => {
    // Leitura direta sem causar re-render
    const { jogadorX, jogadorY } = useGameStore.getState();
    ref.current.position.set(jogadorX, jogadorY, 0);
  });
  
  return <mesh ref={ref} />;
}
```

### Renderização sob demanda

Para cenas estáticas ou jogos pausados:

```tsx
import { invalidate } from '@react-three/fiber';

// Renderizar apenas quando necessário
<Canvas frameloop="demand">
  <Cena />
</Canvas>

// Forçar render manualmente
function Controles() {
  const { invalidate } = useThree();
  
  return (
    <OrbitControls 
      onChange={() => invalidate()} // Renderiza quando câmera move
    />
  );
}
```

---

## 6. Sistemas de interface do usuário

### HTML overlay vs UI em cena

| Abordagem | Vantagens | Desvantagens |
|-----------|-----------|--------------|
| **HTML Overlay** | CSS completo, acessibilidade, fontes web | Sempre acima da cena 3D |
| **UI na Cena 3D** | Oclusão real, efeitos 3D | Texto complexo, sem CSS |

### Componente Html do drei

```tsx
import { Html } from '@react-three/drei';

function BarraDeVida({ vida, posicao }: { vida: number; posicao: [number, number, number] }) {
  return (
    <Html
      position={posicao}
      center
      distanceFactor={10}
      occlude
      style={{
        transition: 'all 0.2s',
        opacity: vida > 0 ? 1 : 0
      }}
    >
      <div className="barra-vida">
        <div 
          className="vida-atual"
          style={{ width: `${vida}%`, backgroundColor: vida > 30 ? 'green' : 'red' }}
        />
      </div>
    </Html>
  );
}
```

### UI contida com clipping planes

Para garantir que elementos não ultrapassem os limites do viewport:

```tsx
import { useThree } from '@react-three/fiber';
import { useMemo, useEffect } from 'react';
import * as THREE from 'three';

function UIContida() {
  const { gl, viewport } = useThree();

  // Habilitar clipping no renderer
  useEffect(() => {
    gl.localClippingEnabled = true;
  }, [gl]);

  // Definir planos de corte
  const planosClipping = useMemo(() => {
    const margem = 0.5;
    const metadeLargura = viewport.width / 2 - margem;
    const metadeAltura = viewport.height / 2 - margem;

    return [
      new THREE.Plane(new THREE.Vector3(1, 0, 0), metadeLargura),   // Esquerda
      new THREE.Plane(new THREE.Vector3(-1, 0, 0), metadeLargura),  // Direita
      new THREE.Plane(new THREE.Vector3(0, 1, 0), metadeAltura),    // Baixo
      new THREE.Plane(new THREE.Vector3(0, -1, 0), metadeAltura)    // Cima
    ];
  }, [viewport]);

  return (
    <mesh>
      <planeGeometry args={[10, 6]} />
      <meshBasicMaterial 
        color="blue"
        clippingPlanes={planosClipping}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
```

### Máscara com stencil buffer usando drei

```tsx
import { Mask, useMask } from '@react-three/drei';

function JanelaUI() {
  return (
    <>
      {/* Definir forma da máscara */}
      <Mask id={1}>
        <planeGeometry args={[4, 3]} />
      </Mask>

      {/* Conteúdo que respeita a máscara */}
      <ConteudoMascarado />
    </>
  );
}

function ConteudoMascarado() {
  // Aplicar stencil do mask id 1
  const stencil = useMask(1);

  return (
    <mesh position={[0, 0, 0.1]}>
      <planeGeometry args={[6, 5]} />
      <meshBasicMaterial color="red" {...stencil} />
    </mesh>
  );
}
```

### HUD com HTML fullscreen

```tsx
import { Html } from '@react-three/drei';

function HUD() {
  const { pontos, vida } = useGameStore();

  return (
    <Html fullscreen>
      <div className="hud">
        <div className="hud-topo">
          <span className="pontos">Pontos: {pontos}</span>
          <div className="vida-container">
            <div className="vida" style={{ width: `${vida}%` }} />
          </div>
        </div>
        
        <div className="hud-baixo">
          <div className="minimapa" />
          <div className="inventario" />
        </div>
      </div>
    </Html>
  );
}
```

### UI responsiva

```tsx
import { useThree } from '@react-three/fiber';
import { useMemo } from 'react';

function UIResponsiva({ children }: { children: React.ReactNode }) {
  const { viewport, size } = useThree();

  // Calcular escala baseada na largura da tela
  const escala = useMemo(() => {
    const larguraBase = 1920;
    return Math.min(size.width / larguraBase, 1);
  }, [size.width]);

  // Detectar orientação
  const isRetrato = size.width < size.height;

  return (
    <group scale={[escala, escala, 1]}>
      {children}
    </group>
  );
}
```

---

## 7. Tratamento de entrada

### Hook de teclado customizado

```typescript
// hooks/useKeyboard.ts
import { useEffect, useRef } from 'react';

export function useKeyboard() {
  const teclas = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      teclas.current[e.code] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      teclas.current[e.code] = false;
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return teclas.current;
}
```

### Movimento do jogador com teclado

```tsx
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Mesh } from 'three';
import { useKeyboard } from '../hooks/useKeyboard';

function Jogador() {
  const meshRef = useRef<Mesh>(null!);
  const teclas = useKeyboard();
  const velocidade = 5;

  useFrame((_, delta) => {
    const movimento = { x: 0, z: 0 };

    if (teclas['KeyW'] || teclas['ArrowUp']) movimento.z -= 1;
    if (teclas['KeyS'] || teclas['ArrowDown']) movimento.z += 1;
    if (teclas['KeyA'] || teclas['ArrowLeft']) movimento.x -= 1;
    if (teclas['KeyD'] || teclas['ArrowRight']) movimento.x += 1;

    // Normalizar diagonal
    const magnitude = Math.sqrt(movimento.x ** 2 + movimento.z ** 2);
    if (magnitude > 0) {
      movimento.x /= magnitude;
      movimento.z /= magnitude;
    }

    meshRef.current.position.x += movimento.x * velocidade * delta;
    meshRef.current.position.z += movimento.z * velocidade * delta;
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
}
```

### Eventos de mouse em objetos 3D

```tsx
function ObjetoInterativo() {
  const [hover, setHover] = useState(false);
  const [clicado, setClicado] = useState(false);

  return (
    <mesh
      onClick={(e) => {
        e.stopPropagation();
        setClicado(!clicado);
      }}
      onPointerEnter={(e) => {
        e.stopPropagation();
        setHover(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerLeave={() => {
        setHover(false);
        document.body.style.cursor = 'auto';
      }}
      scale={hover ? 1.2 : 1}
    >
      <sphereGeometry />
      <meshStandardMaterial color={clicado ? 'hotpink' : 'orange'} />
    </mesh>
  );
}
```

### Suporte a gamepad

```typescript
// hooks/useGamepad.ts
import { useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';

interface GamepadState {
  conectado: boolean;
  analogicoEsquerdo: { x: number; y: number };
  analogicoDireito: { x: number; y: number };
  botoes: boolean[];
}

export function useGamepad() {
  const estado = useRef<GamepadState>({
    conectado: false,
    analogicoEsquerdo: { x: 0, y: 0 },
    analogicoDireito: { x: 0, y: 0 },
    botoes: []
  });

  useFrame(() => {
    const gamepads = navigator.getGamepads();
    const gamepad = gamepads[0];

    if (gamepad) {
      estado.current.conectado = true;
      estado.current.analogicoEsquerdo = {
        x: gamepad.axes[0],
        y: gamepad.axes[1]
      };
      estado.current.analogicoDireito = {
        x: gamepad.axes[2],
        y: gamepad.axes[3]
      };
      estado.current.botoes = gamepad.buttons.map(b => b.pressed);
    } else {
      estado.current.conectado = false;
    }
  });

  const vibrar = useCallback((duracao: number, intensidade: number) => {
    const gamepad = navigator.getGamepads()[0];
    if (gamepad?.vibrationActuator) {
      gamepad.vibrationActuator.playEffect('dual-rumble', {
        startDelay: 0,
        duration: duracao,
        weakMagnitude: intensidade,
        strongMagnitude: intensidade
      });
    }
  }, []);

  return { estado: estado.current, vibrar };
}
```

---

## 8. Sistemas de jogo

### Detecção de colisão com AABB

```tsx
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

function SistemaColisao({ jogadorRef, obstaculos }: {
  jogadorRef: React.RefObject<THREE.Mesh>;
  obstaculos: React.RefObject<THREE.Mesh>[];
}) {
  const caixaJogador = useRef(new THREE.Box3());
  const caixaObstaculo = useRef(new THREE.Box3());

  useFrame(() => {
    if (!jogadorRef.current) return;

    // Atualizar bounding box do jogador
    caixaJogador.current.setFromObject(jogadorRef.current);

    // Verificar colisão com cada obstáculo
    for (const obstaculoRef of obstaculos) {
      if (!obstaculoRef.current) continue;

      caixaObstaculo.current.setFromObject(obstaculoRef.current);

      if (caixaJogador.current.intersectsBox(caixaObstaculo.current)) {
        console.log('Colisão detectada!');
        // Tratar colisão aqui
      }
    }
  });

  return null;
}
```

### Física com @react-three/rapier

```tsx
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import { Suspense } from 'react';

function CenaComFisica() {
  return (
    <Suspense fallback={null}>
      <Physics gravity={[0, -9.81, 0]} debug>
        {/* Corpo dinâmico - afetado pela gravidade */}
        <RigidBody 
          colliders="ball" 
          restitution={0.7}
          onCollisionEnter={({ manifold }) => {
            console.log('Colidiu em:', manifold.solverContactPoint(0));
          }}
        >
          <mesh position={[0, 5, 0]}>
            <sphereGeometry />
            <meshStandardMaterial color="red" />
          </mesh>
        </RigidBody>

        {/* Corpo fixo - chão */}
        <RigidBody type="fixed">
          <CuboidCollider args={[10, 0.5, 10]} position={[0, -1, 0]} />
          <mesh position={[0, -1, 0]}>
            <boxGeometry args={[20, 1, 20]} />
            <meshStandardMaterial color="green" />
          </mesh>
        </RigidBody>
      </Physics>
    </Suspense>
  );
}
```

### Áudio posicional

```tsx
import { useThree, useLoader } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function AudioPosicional({ url, posicao }: { 
  url: string; 
  posicao: [number, number, number] 
}) {
  const { camera } = useThree();
  const somRef = useRef<THREE.PositionalAudio>(null!);
  const listenerRef = useRef<THREE.AudioListener>();
  const buffer = useLoader(THREE.AudioLoader, url);

  useEffect(() => {
    // Criar listener e adicionar à câmera
    const listener = new THREE.AudioListener();
    listenerRef.current = listener;
    camera.add(listener);

    // Configurar áudio posicional
    const som = new THREE.PositionalAudio(listener);
    som.setBuffer(buffer);
    som.setRefDistance(1);
    som.setLoop(true);
    som.play();
    somRef.current = som;

    return () => {
      som.stop();
      camera.remove(listener);
    };
  }, [buffer, camera]);

  return (
    <group position={posicao}>
      <primitive object={somRef.current} />
      {/* Visual do emissor de som */}
      <mesh>
        <sphereGeometry args={[0.2]} />
        <meshBasicMaterial color="yellow" />
      </mesh>
    </group>
  );
}
```

### Sistema de partículas

```tsx
import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

interface ParticulasProps {
  quantidade: number;
  cor?: string;
}

function Particulas({ quantidade, cor = '#ff8888' }: ParticulasProps) {
  const pontosRef = useRef<THREE.Points>(null!);

  // Criar posições iniciais
  const posicoes = useMemo(() => {
    const arr = new Float32Array(quantidade * 3);
    for (let i = 0; i < quantidade * 3; i += 3) {
      arr[i] = (Math.random() - 0.5) * 10;     // x
      arr[i + 1] = Math.random() * 10;          // y
      arr[i + 2] = (Math.random() - 0.5) * 10; // z
    }
    return arr;
  }, [quantidade]);

  // Velocidades para animação
  const velocidades = useMemo(() => {
    return Array.from({ length: quantidade }, () => ({
      y: Math.random() * 2 + 1
    }));
  }, [quantidade]);

  useFrame((_, delta) => {
    const posArray = pontosRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < quantidade; i++) {
      const i3 = i * 3;
      
      // Mover para cima
      posArray[i3 + 1] -= velocidades[i].y * delta;

      // Resetar quando sair da tela
      if (posArray[i3 + 1] < -5) {
        posArray[i3 + 1] = 10;
      }
    }

    pontosRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pontosRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={quantidade}
          array={posicoes}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color={cor}
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
```

---

## 9. Padrões de integração React

### Arquitetura de componentes para jogos

```tsx
// App.tsx - Estrutura principal
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Physics } from '@react-three/rapier';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        camera={{ position: [0, 10, 10], fov: 60 }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={<TelaCarregamento />}>
          <Physics>
            <Iluminacao />
            <Ambiente />
            <Jogador />
            <Inimigos />
            <SistemaUI />
          </Physics>
        </Suspense>
      </Canvas>
      
      {/* UI HTML fora do Canvas */}
      <HUDOverlay />
    </div>
  );
}
```

### Gerenciamento de estado com Zustand

```typescript
// stores/gameStore.ts
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface EstadoJogo {
  // Estado do jogo
  fase: 'menu' | 'jogando' | 'pausado' | 'gameOver';
  pontuacao: number;
  vida: number;
  nivel: number;

  // Ações
  iniciarJogo: () => void;
  pausar: () => void;
  continuar: () => void;
  adicionarPontos: (pontos: number) => void;
  receberDano: (dano: number) => void;
  proximoNivel: () => void;
  reiniciar: () => void;
}

export const useGameStore = create<EstadoJogo>()(
  subscribeWithSelector((set, get) => ({
    fase: 'menu',
    pontuacao: 0,
    vida: 100,
    nivel: 1,

    iniciarJogo: () => set({ 
      fase: 'jogando', 
      pontuacao: 0, 
      vida: 100, 
      nivel: 1 
    }),

    pausar: () => set({ fase: 'pausado' }),
    
    continuar: () => set({ fase: 'jogando' }),

    adicionarPontos: (pontos) => set((s) => ({ 
      pontuacao: s.pontuacao + pontos 
    })),

    receberDano: (dano) => {
      const novaVida = Math.max(0, get().vida - dano);
      set({ vida: novaVida });
      if (novaVida <= 0) {
        set({ fase: 'gameOver' });
      }
    },

    proximoNivel: () => set((s) => ({ nivel: s.nivel + 1 })),

    reiniciar: () => set({ 
      fase: 'menu', 
      pontuacao: 0, 
      vida: 100, 
      nivel: 1 
    })
  }))
);

// Subscrever a mudanças específicas
useGameStore.subscribe(
  (state) => state.fase,
  (fase) => console.log('Fase mudou para:', fase)
);
```

### Referência de hooks R3F

```tsx
import { 
  useFrame, 
  useThree, 
  useLoader,
  useGraph
} from '@react-three/fiber';
import { useGLTF, useTexture, useAnimations } from '@react-three/drei';

function ExemploHooks() {
  // useThree - acesso ao contexto R3F
  const { 
    camera,      // Câmera ativa
    gl,          // WebGLRenderer
    scene,       // Cena principal
    size,        // Dimensões do canvas em pixels
    viewport,    // Dimensões em unidades do mundo
    clock,       // THREE.Clock
    invalidate,  // Forçar re-render (frameloop="demand")
    set          // Atualizar estado R3F
  } = useThree();

  // useFrame - game loop
  useFrame((state, delta, xrFrame) => {
    // state = mesmo que useThree()
    // delta = tempo desde último frame
    // xrFrame = frame XR (se em VR/AR)
  }, 0); // Segundo parâmetro = prioridade (-1 antes, 1 depois)

  // useLoader - carregar assets
  const textura = useLoader(THREE.TextureLoader, '/textura.png');
  const modelo = useLoader(GLTFLoader, '/modelo.glb');

  // drei helpers
  const gltf = useGLTF('/modelo.glb');
  const [mapa, normal] = useTexture(['/diffuse.jpg', '/normal.jpg']);

  return null;
}
```

---

## 10. Exemplo completo: jogo de sprites

```tsx
// Jogo2DCompleto.tsx
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Suspense, useRef, useEffect, useState, useMemo } from 'react';
import { create } from 'zustand';
import * as THREE from 'three';

// ==================== STORE ====================
interface JogoState {
  pontuacao: number;
  vidas: number;
  gameOver: boolean;
  adicionarPonto: () => void;
  perderVida: () => void;
  reiniciar: () => void;
}

const useJogoStore = create<JogoState>((set, get) => ({
  pontuacao: 0,
  vidas: 3,
  gameOver: false,
  adicionarPonto: () => set((s) => ({ pontuacao: s.pontuacao + 10 })),
  perderVida: () => {
    const novasVidas = get().vidas - 1;
    set({ vidas: novasVidas, gameOver: novasVidas <= 0 });
  },
  reiniciar: () => set({ pontuacao: 0, vidas: 3, gameOver: false })
}));

// ==================== HOOK TECLADO ====================
function useKeyboard() {
  const teclas = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const down = (e: KeyboardEvent) => { teclas.current[e.code] = true; };
    const up = (e: KeyboardEvent) => { teclas.current[e.code] = false; };
    
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  return teclas.current;
}

// ==================== JOGADOR ====================
function Jogador() {
  const spriteRef = useRef<THREE.Sprite>(null!);
  const teclas = useKeyboard();
  const { viewport } = useThree();
  const textura = useLoader(THREE.TextureLoader, '/sprites/nave.png');
  
  const velocidade = 8;
  const limiteX = viewport.width / 2 - 0.5;

  useMemo(() => {
    textura.minFilter = THREE.NearestFilter;
    textura.magFilter = THREE.NearestFilter;
  }, [textura]);

  useFrame((_, delta) => {
    let movimento = 0;
    if (teclas['KeyA'] || teclas['ArrowLeft']) movimento -= 1;
    if (teclas['KeyD'] || teclas['ArrowRight']) movimento += 1;

    spriteRef.current.position.x += movimento * velocidade * delta;
    spriteRef.current.position.x = THREE.MathUtils.clamp(
      spriteRef.current.position.x,
      -limiteX,
      limiteX
    );
  });

  return (
    <sprite ref={spriteRef} position={[0, -viewport.height / 2 + 1, 0]} scale={[1, 1, 1]}>
      <spriteMaterial map={textura} transparent />
    </sprite>
  );
}

// ==================== INIMIGOS ====================
function Inimigos() {
  const grupoRef = useRef<THREE.Group>(null!);
  const { viewport } = useThree();
  const textura = useLoader(THREE.TextureLoader, '/sprites/inimigo.png');
  const perderVida = useJogoStore((s) => s.perderVida);

  const [inimigos, setInimigos] = useState(() =>
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * viewport.width,
      y: viewport.height / 2 + Math.random() * 2,
      velocidade: 2 + Math.random() * 2
    }))
  );

  useMemo(() => {
    textura.minFilter = THREE.NearestFilter;
    textura.magFilter = THREE.NearestFilter;
  }, [textura]);

  useFrame((_, delta) => {
    setInimigos((atual) =>
      atual.map((inimigo) => {
        let novoY = inimigo.y - inimigo.velocidade * delta;

        // Resetar quando sair da tela
        if (novoY < -viewport.height / 2 - 1) {
          perderVida();
          return {
            ...inimigo,
            y: viewport.height / 2 + 1,
            x: (Math.random() - 0.5) * viewport.width
          };
        }

        return { ...inimigo, y: novoY };
      })
    );
  });

  return (
    <group ref={grupoRef}>
      {inimigos.map((inimigo) => (
        <sprite key={inimigo.id} position={[inimigo.x, inimigo.y, 0]} scale={[0.8, 0.8, 1]}>
          <spriteMaterial map={textura} transparent />
        </sprite>
      ))}
    </group>
  );
}

// ==================== HUD ====================
function HUD() {
  const pontuacao = useJogoStore((s) => s.pontuacao);
  const vidas = useJogoStore((s) => s.vidas);
  const gameOver = useJogoStore((s) => s.gameOver);
  const reiniciar = useJogoStore((s) => s.reiniciar);

  return (
    <Html fullscreen>
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        color: 'white',
        fontFamily: 'monospace',
        fontSize: 24
      }}>
        <div>Pontos: {pontuacao}</div>
        <div>Vidas: {'❤️'.repeat(vidas)}</div>
      </div>

      {gameOver && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: 'white'
        }}>
          <h1>Game Over</h1>
          <p>Pontuação Final: {pontuacao}</p>
          <button onClick={reiniciar} style={{
            padding: '10px 30px',
            fontSize: 20,
            cursor: 'pointer'
          }}>
            Jogar Novamente
          </button>
        </div>
      )}
    </Html>
  );
}

// ==================== CENA PRINCIPAL ====================
function Cena() {
  const gameOver = useJogoStore((s) => s.gameOver);

  return (
    <>
      {/* Fundo estrelado */}
      <color attach="background" args={['#0a0a2e']} />
      
      {!gameOver && (
        <>
          <Jogador />
          <Inimigos />
        </>
      )}
      
      <HUD />
    </>
  );
}

// ==================== APP ====================
export default function Jogo2DCompleto() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        orthographic
        camera={{
          zoom: 50,
          position: [0, 0, 100],
          near: 0.1,
          far: 1000
        }}
        gl={{
          antialias: false,
          powerPreference: 'high-performance'
        }}
      >
        <Suspense fallback={null}>
          <Cena />
        </Suspense>
      </Canvas>
    </div>
  );
}
```

---

## 11. Solução de problemas comuns

### Texturas borradas em pixel art

```tsx
// Sempre configurar filtros para pixel art
textura.minFilter = THREE.NearestFilter;
textura.magFilter = THREE.NearestFilter;

// No Canvas, desabilitar antialiasing
<Canvas gl={{ antialias: false }} />
```

### Vazamento de memória

```tsx
// Sempre limpar ao desmontar
useEffect(() => {
  return () => {
    geometria.dispose();
    material.dispose();
    textura.dispose();
  };
}, []);
```

### Sprite piscando (Z-fighting)

```tsx
// Usar renderOrder para sprites no mesmo plano
sprite1.renderOrder = 0;
sprite2.renderOrder = 1;

// Ou pequena diferença em Z
<sprite position={[0, 0, 0.001]} />
```

### Performance ruim com muitos objetos

```tsx
// Usar InstancedMesh para objetos similares
<instancedMesh args={[geometria, material, 1000]} />

// Ou pooling de objetos ao invés de criar/destruir
```

### useFrame não atualiza visual

```tsx
// Marcar atributos como needsUpdate
geometria.attributes.position.needsUpdate = true;
material.needsUpdate = true;
```

---

## 12. Recursos e próximos passos

### Documentação oficial

- **Three.js**: threejs.org/docs
- **React Three Fiber**: docs.pmnd.rs/react-three-fiber
- **Drei**: github.com/pmndrs/drei
- **Rapier Physics**: rapier.rs/docs

### Bibliotecas complementares recomendadas

| Biblioteca | Uso |
|------------|-----|
| @react-three/rapier | Física 3D de alta performance |
| @react-three/postprocessing | Efeitos de pós-processamento |
| zustand | Gerenciamento de estado |
| leva | Painel de debug/controles |
| stats.js | Monitor de FPS |

### Padrões avançados para explorar

O desenvolvimento de jogos com Three.js e React oferece profundidade significativa além do coberto nesta documentação. Considere explorar **shaders customizados** com GLSL para efeitos visuais únicos, **Entity-Component-System (ECS)** para jogos complexos com muitas entidades, **WebGPU** (suporte experimental no R3F v9) para performance de próxima geração, e **WebXR** para experiências de realidade virtual e aumentada.

A combinação de componentização React com o poder gráfico do Three.js cria uma base sólida tanto para protótipos rápidos quanto para jogos completos em produção. O ecossistema continua evoluindo rapidamente, com melhorias constantes em performance e novas abstrações que simplificam padrões complexos.