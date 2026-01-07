# Óculos AR em Three.js

Este documento descreve a nova implementação totalmente 3D dos óculos inteligentes, construída com **Three.js**, **@react-three/fiber** e **@react-three/drei**. O objetivo é explicar como a cena está estruturada, onde ficam os principais componentes e como personalizar o HUD e o frame.

## Visão geral de arquitetura

1. **Simulação** – `useGameSimulation()` continua gerenciando o estado do dispositivo (modo HUD, energia e diagnóstico dinâmico). Nenhuma lógica de jogo foi perdida durante a migração.
2. **Cena 3D** – `platform-threejs/scenes/SmartGlassesCanvas.tsx` cria o `<Canvas>` do R3F, configura câmera, iluminação, sombras e injeta o rig dos óculos.
3. **Rig** – `SmartGlassesRig` monta a armação, ponte e hastes com `RoundedBox`, além de aplicar um leve flotter (`<Float>`) para dar vida ao objeto.
4. **Lentes** – Cada lente é um `LensHUD`: combina uma placa de vidro semitransparente com um HUD projetado via `CanvasTexture`, garantindo que o wallpaper (RealityBackdrop) permaneça visível atrás da geometria.

```
App.tsx
 └─ SmartGlassesCanvas
     └─ SmartGlassesRig
         ├─ FrameSide (esq.)
         ├─ FrameSide (dir.)
         ├─ Bridge + Temple
         └─ LensHUD (esq./dir.)
```

## LensHUD em detalhes

- **CanvasTexture** – Cada lente gera um canvas 640×400 px. O desenho 2D reaproveita os dados da simulação (CPU, memória, rede, clima) para textos e animações.
- **Modos** – `HudMode` controla a paleta e o retículo:
  - `System`: retículo circular com eixos estendidos.
  - `Navigation`: seta/rota e indicação de destino.
  - `Analysis`: moldura com scanline animada e aviso "SEARCHING...".
- **Transparência real** – O `meshPhysicalMaterial` da placa de vidro utiliza `transmission` e `opacity` baixas. O HUD fica em um plano levemente deslocado (`hudOffset`) usando `meshBasicMaterial` para não depender de iluminação.

### Ajustes comuns

| Quer alterar... | Vá para | Dica |
|-----------------|--------|------|
| Tamanho da lente | `LENS_SIZE` em `SmartGlassesRig.tsx` | Mantenha proporcional ao frame para evitar clipping |
| Cores do HUD | `renderHud()` em `LensHUD.tsx` | Troque `baseColor` e `dimColor` por outra paleta |
| Animação da armação | `<Float>` em `SmartGlassesRig.tsx` | Ajuste `speed`, `rotationIntensity` e `floatingRange` |
| Iluminação geral | `SmartGlassesCanvas.tsx` | Adicione/edite `directionalLight`, `Environment`, etc. |

## Interação com o restante do app

- `App.tsx` mantém os botões físicos (Power + modos HUD). Eles atualizam a simulação, que por sua vez re-renderiza o Canvas automaticamente.
- `RealityBackdrop` continua como layer inferior, aplicando blur e gradiente que aparecem através das lentes.
- O modo OFF simplesmente evita desenhar o HUD e exibe "OFFLINE" dentro do canvas.

## Como executar

```bash
npm install
npm run dev
```

Abra `http://localhost:5173` e utilize os controles inferiores para ligar/desligar e alternar modos. O Three.js ocupa a tela inteira; se precisar depurar, use o inspetor do R3F (`React DevTools` + sobreposição) ou habilite helpers adicionais no Canvas.

## Próximos passos sugeridos

- Integrar pós-processamento (`@react-three/postprocessing`) para bloom sutil nas lentes.
- Adicionar gestos/head-tracking caso a simulação passe a fornecer pose do usuário.
- Exportar o rig para WebXR (basta ativar `Canvas` com prop `shadows` e `gl.xr.enabled = true`).
