# Shader Conversion Log

Record every custom shader that requires GLSL ↔ HLSL rewrites. Duplicate the template below for each entry.

## Template

```
### Shader Name (e.g., ReticleScan)
- Source language/tool: GLSL / ShaderToy
- Target runtime: Unity HLSL (ShaderLab) / Three.js GLSL
- Export command: `glslcc --hlsl --out ReticleScan.hlsl ReticleScan.glsl`
- Manual fixes:
  - Replace `mix` with `lerp`
  - Flip V coordinate in sampling
  - Adjust precision qualifiers (`mediump` → default)
- Validation:
  - Web preview screenshot / Unity frame capture link
  - Notes on performance or artifacts
```

Keep entries chronological so future engineers can see which conversions shipped and which are pending.
