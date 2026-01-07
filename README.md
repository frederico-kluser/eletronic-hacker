<div align="center">
   <img width="1200" height="475" alt="BrowlineHUD" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Browline AR HUD · Three.js ⇄ Unity ready

This repository implements the architecture described in [docs/unity.md](docs/unity.md). Every rule in that document is treated as an architectural contract so that our TypeScript HUD can be migrated to Unity/C# without surprises.

## Quick start

- Install dependencies: `npm install`
- Start the simulation: `npm run dev`
- Build for production: `npm run build`

The build output is web-only for now, but all logic already follows the portability constraints.

## Architectural map

```
core/
   domain/    # ECS components, entities, systems (portable logic)
   data/      # Device specs + serialization-friendly models
   interfaces/# Ports (no platform imports)
   state/     # GameSimulation orchestrator
platform-threejs/
   adapters/  # Three.js/Web specific world + React hook
   renderers/ # Visual layer (current React HUD)
platform-unity/
   Core/      # C# mirrors of enums, data models, interfaces, systems
   Adapters/  # UnityGameWorldAdapter for MonoBehaviours or DOTS
```

- `core/**` never imports React, browser APIs, or anything Unity can’t mirror. Only TypeScript features that map 1:1 to C# are allowed (classes, enums, interfaces, generics, async/await).
- `platform-threejs/**` is the visual adapter. Unity-specific work now lives in `platform-unity/**`, which already contains the C# `UnityGameWorldAdapter` so DOTS/MonoBehaviour teams can plug in immediately.

## ECS + Hexagonal layering

1. **Entity-Component-System (bitECS)** inside `core/domain` mirrors Unity DOTS concepts (chunk-based components, data-first systems).
2. **Ports & adapters**: `GameSimulation` depends on `IGameWorld`, and we inject `ThreeJsWorldAdapter`. Unity will provide its own adapter that satisfies the same interface.
3. **Pure data snapshots** (`HudSnapshot`) flow to the renderers, so fibers, canvases, or future Unity `MonoBehaviour`s consume identical contracts.

## TypeScript coding rules for portability

- Use enums for modes, statuses, and directions (`HudMode`, `NetworkConnectionType`, `CardinalDirection`). Do **not** use string literal unions or conditional/mapped types.
- Prefer classes with explicit constructor arguments (`GameSimulation`, `DeviceSpecifications`). Avoid `any`, mixins, and decorators.
- Keep one exported class/interface per file. File names follow PascalCase to match the future C# file layout.
- Asynchronous work must use `Promise<T>` + `async/await` so we can map directly to `Task<T>`.
- Data objects (`DeviceDiagnosticsSnapshot`) are POCO-style: public fields only, no getters/setters, no Maps/Sets exposed across the boundary.

## Asset + tooling pipeline (Three.js ⇄ Unity)

1. **glTF/GLB is the single source of truth.** Follow the step-by-step checklist in [docs/gltf-pipeline.md](docs/gltf-pipeline.md) for authoring, exporting, compressing textures with KTX2, and validating imports on both runtimes.
2. **Textures**: compress with KTX2/Basis so the same GPU formats ship on web and native.
3. **Needle Engine** is the mandated Unity↔Three.js bridge. Unity scenes feed Needle’s exporter, which preserves components through custom glTF extensions consumed by the web runtime.
4. **Shaders**: stay on PBR whenever possible. Custom shaders must be rewritten (GLSL → HLSL via SPIRV-Cross/glslcc) and logged in [docs/shader-log.md](docs/shader-log.md).
5. **Physics and platform services** live behind interfaces. Never couple to Ammo.js/PhysX APIs directly inside `core/**`.

## Feature checklist for contributors

- [ ] ECS components/systems live in `core/domain`. Add a test double or Unity counterpart before merging.
- [ ] New gameplay logic works on top of `GameSimulation` and communicates through interfaces (`IGameWorld`, future ports).
- [ ] Rendering or input work belongs to `platform-threejs/**`. React/Canvas/WebXR specifics never leak into `core/**`.
- [ ] All data passed across the port boundary is serializable to JSON that Unity’s `JsonUtility` understands (public fields, no dictionaries, no top-level arrays).
- [ ] New assets, shaders, or physics behaviors include migration notes in `docs/*`.

## Porting constraints (non-negotiable)

| Area | Transferable | Requires rewrite |
|------|--------------|------------------|
| Business logic / ECS | ✅ Already portable | — |
| Assets & PBR materials | ✅ via glTF | — |
| Shaders | ⚠ Manual GLSL → HLSL rewrite | — |
| Physics | ⚠ Abstract via interfaces | Engine-specific code |
| DOM / CSS UI | — | ✅ Rebuild in Unity UI |

When in doubt, defer to [docs/unity.md](docs/unity.md). If a change conflicts with that document, update the doc *before* writing code.

## Next steps toward Unity

1. Integrate the C# `UnityGameWorldAdapter` into a sample Unity scene (MonoBehaviour + UI) to validate the contract against real input devices.
2. Expand the ECS layer (movement, sensors, mission logic) without touching React-specific code.
3. Automate the glTF/KTX2 pipeline via CI (run `gltf-validator`, `toktx`, and Needle exports) so regressions surface before release.

## Support scripts

- `npm run dev` – Vite dev server
- `npm run build` – Production build; also validates the ECS TypeScript surface

Document every additional workflow inside `docs/` so Unity engineers can rely on canonical guidance.
