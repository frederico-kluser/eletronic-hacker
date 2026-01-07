# glTF + KTX2 Asset Pipeline

All geometry, animations, and materials flow through glTF/GLB so the Three.js HUD and the future Unity build share a single source of truth. Follow this checklist every time you touch 3D content.

## 1. Authoring + scene constraints

1. Work inside Blender, Maya, or Unity (Needle Engine scene authoring) but **freeze transforms** before export.
2. Model in meters, Y-up. If the DCC uses Z-up, apply axis conversion during export rather than in code.
3. Avoid engine-specific modifiers (Subdivision, Geometry Nodes) unless they are baked to meshes before export.
4. Keep materials strictly PBR (base color, metallic, roughness, normal, ORM). Custom shader graphs must be documented in `docs/shader-log.md` before implementation.

## 2. Export to glTF/GLB

| Step | Blender | Unity (Needle) |
|------|---------|----------------|
| Coordinate system | Enable +Y up, -Z forward | Needle handles conversion automatically |
| Format | `.glb` preferred | Export via Needle Engine glTF exporter |
| Animations | Bake actions, ensure keyframes use Quaternion interpolation | Timeline clips exported via Needle components |
| Materials | Use Principled BSDF nodes only | Use Unity Standard/Lit shader values that map to glTF PBR |

Always include:
- `KHR_materials_unlit` only for HUD decals.
- Tangents (for normal maps) and second UV set if AO is required.

## 3. Texture compression (KTX2/Basis)

1. Store masters as PNG/EXR in `assets/source/`.
2. Convert to KTX2 using `toktx`:
   ```bash
   toktx --bcmp --t2 --genmipmap --threads 8 textures/helmet.ktx2 source/helmet.png
   ```
3. Reference the `.ktx2` files inside glTF via `KHR_texture_basisu`. Three.js consumes them with `KTX2Loader`; Unity reads them automatically through glTFast.
4. Check the texture budgets: keep each map under 1 MB when gzip-compressed for web delivery.

## 4. Import into Unity (glTFast)

1. Install `com.atteneder.gltfast` (glTFast) and `com.atteneder.ktx` via the Package Manager.
2. Drop the `.glb` (with embedded KTX2 textures) into `Assets/Glb`. glTFast generates prefabs with component extensions intact.
3. Use the generated prefab in scenes or Needle exports. Do **not** edit the prefab directly; override via GameObject instancing so re-imports stay clean.

## 5. Export to web (Needle Engine)

1. Add the Needle Engine package to Unity and flag the scene for export.
2. Ensure all behaviours that need to run on the Three.js runtime use portable data (no UnityEngine.Object serialization in public fields).
3. Export via `Needle -> Build -> glTF + Runtime`. The resulting bundle slots directly into `platform-threejs` renders or a standalone Needle runtime.

## 6. Shader rewrite log

Maintain `docs/shader-log.md` (create if missing) with entries containing:
- Source file + authoring tool
- Description of GLSL features that require HLSL rewrites (e.g., `mix` vs `lerp` differences)
- SPIRV-Cross/glslcc command used
- Manual fixes applied after cross-compilation

No custom shader reaches main without a corresponding log entry.

## 7. Verification checklist

- [ ] All meshes validated with `gltf-validator`
- [ ] Textures compressed to KTX2 and referenced via `KHR_texture_basisu`
- [ ] Exported files include only portable extensions (no Draco unless both runtimes support it)
- [ ] Unity import tested via glTFast prefab instantiation
- [ ] Web import tested via Three.js `GLTFLoader`
- [ ] Documentation updated for any shader or physics deviations

Document exceptions in `docs/build-history.md` so future ports know why a rule was bent.
