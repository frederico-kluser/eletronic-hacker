# Platform Unity Adapter

This directory mirrors the TypeScript `platform-threejs` layer with C# equivalents so Unity engineers can plug the portable ECS logic into GameObjects, DOTS systems, or Needle Engine exports.

## Structure

```
platform-unity/
  Core/
    Domain/Components   # Enums that match TypeScript HudMode & PowerState
    Data/               # JsonUtility-friendly snapshots + specs
    Interfaces/         # `IGameWorldPort` contract (C# mirror of IGameWorld)
    Systems/            # DiagnosticsSystem logic
  Adapters/
    UnityGameWorldAdapter.cs
```

- `UnityGameWorldAdapter` implements `IGameWorldPort`. It keeps dictionaries for HUD mode, power state, and diagnostics snapshots, just like the Three.js adapter keeps component storage inside bitECS. Swap those dictionaries for DOTS components when integrating with Entities.
- `DiagnosticsSystem` copies the numerical rules from `core/domain/systems/DiagnosticsSystem.ts`. Randomness uses `UnityEngine.Random` so editor/runtime determinism matches TypeScript’s `Math.random` behavior.
- All data objects expose **public fields only** to stay compatible with `JsonUtility` and to match the serialization guidance in `docs/unity.md`.

## Usage

1. Instantiate `UnityGameWorldAdapter` inside a MonoBehaviour responsible for bridging UI and gameplay logic.
2. Share its instance with UI canvases, XR subsystems, or Needle Engine scripting runtime.
3. On `Update()`, call `UpdateDiagnostics(entityId, Time.deltaTime * 1000f)` and push the snapshot into your Unity visuals.
4. When porting ECS logic to DOTS, replace the dictionaries with real `IComponentData` structs but keep the same method signatures so the TypeScript `GameSimulation` contract remains valid.
