# Three.js + TypeScript Architecture for Unity Portability

**Architecting for cross-platform 3D development between web and native requires accepting a fundamental truth: code migration is impractical, but architectural patterns and assets transfer well.** The most successful approach separates platform-agnostic business logic from rendering through clean abstraction layers, uses glTF as the universal asset interchange format, and designs TypeScript code with C#-compatible patterns from day one. Direct porting of shader code, physics implementations, and Unity-specific features like Prefabs is not viable—plan for strategic rewrites in those areas.

The community strongly recommends **Needle Engine** as the primary bridge for Unity↔Three.js workflows, with **Entity-Component-System (ECS)** patterns providing the most portable architectural foundation. No production-ready TypeScript-to-C# transpilers exist; instead, leverage the languages' shared heritage (both designed by Anders Hejlsberg) by avoiding TypeScript-specific constructs that lack C# equivalents.

---

## Part 1: Conceptual mapping between Three.js and Unity

Understanding the precise equivalences—and their subtle differences—between Three.js and Unity forms the foundation for portable architecture. While the core 3D concepts map reasonably well, the implementation details diverge significantly.

### Scene graph and object hierarchy

| Three.js | Unity | Critical Nuance |
|----------|-------|-----------------|
| `Object3D` | `GameObject` | Three.js Object3D is the base class for all scene objects; Unity uses component-based architecture |
| `Scene` | `Scene` | Three.js Scene inherits from Object3D; Unity Scene is a separate container concept |
| `Group` | Empty `GameObject` | Both used for logical organization |
| `.position` (Vector3) | `Transform.position` | Direct equivalent |
| `.rotation` (Euler) | `Transform.rotation` (Quaternion) | **Three.js defaults to Euler; Unity uses Quaternion internally** |
| `.quaternion` | `Transform.rotation` | Direct quaternion access available in both |
| `Mesh` | `MeshFilter` + `MeshRenderer` | **Unity separates geometry from rendering**—design components accordingly |

### Materials and rendering

The **PBR material workflow** provides the cleanest mapping. `MeshStandardMaterial` in Three.js maps directly to Unity's Standard Shader (Built-in RP) or Lit shader (URP/HDRP). Both use metallic-roughness models with nearly identical parameters: albedo/base color, normal maps, metallic, roughness (Unity uses **Smoothness = 1 - Roughness**), and ambient occlusion.

Custom shaders present the largest portability barrier. Three.js uses **GLSL** while Unity requires **HLSL** wrapped in ShaderLab. Function names differ (`mix()` vs `lerp()`, `texture2D()` vs `tex2D()`), built-in variables have different naming conventions, and precision qualifiers behave differently. **Plan for shader rewrites—automated conversion tools like glslcc and SPIRV-Cross help but require manual adjustment.**

### Coordinate system transformation

Three.js uses a **right-handed** coordinate system (Y-up, +Z toward viewer) while Unity uses **left-handed** (Y-up, +Z away from viewer). This requires systematic conversion:

```
// Position conversion
Unity.position.x = ThreeJS.position.x
Unity.position.y = ThreeJS.position.y
Unity.position.z = -ThreeJS.position.z  // Negate Z

// Rotation conversion (Euler angles)
Unity.rotation.x = -ThreeJS.rotation.x
Unity.rotation.y = -ThreeJS.rotation.y
Unity.rotation.z = ThreeJS.rotation.z
```

This affects all asset imports, baked data, and animation keyframes. Using **glTF as the interchange format handles this conversion automatically** during import/export.

---

## Part 2: Recommended architecture for portability

The architecture that transfers best between Three.js and Unity combines **Entity-Component-System (ECS)** for game logic with **hexagonal architecture** for platform isolation. This approach emerged from both theoretical analysis and community practice.

### Layered architecture pattern

```
┌─────────────────────────────────────────────────────┐
│              VISUAL LAYER (Platform-Specific)       │
│    Three.js Object3D / Unity GameObject+Renderer    │
├─────────────────────────────────────────────────────┤
│              GAME LOGIC LAYER (Portable)            │
│   ┌─────────────────────────────────────────────┐   │
│   │  Visual Game Logic: State Machines, AI      │   │
│   │  Pure Game Logic: Rules, Calculations       │   │
│   └─────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────┤
│              DATA LAYER (Portable)                  │
│       Network clients, Persistence, APIs            │
└─────────────────────────────────────────────────────┘
```

The key principle: **objects in one layer only depend on objects in the layer directly below**. Visual layer handles rendering—no business logic. Game logic layer is platform-agnostic and reusable. This separation means only the visual layer needs rewriting during migration.

### Recommended ECS libraries for Three.js

| Library | Best For | Unity Mapping |
|---------|----------|---------------|
| **bitECS** | Data-oriented, high performance | Maps closely to Unity DOTS—uses TypedArrays similar to NativeArrays |
| **Miniplex** | Developer ergonomics, React integration | Maps to traditional MonoBehaviour composition patterns |
| **Koota** | Trait-based composition, pmndrs ecosystem | Modern alternative with React Three Fiber bindings |

**If targeting Unity DOTS specifically**, use bitECS—its data-oriented design with TypedArrays translates conceptually to Unity's chunk-based memory model. **For traditional MonoBehaviour-style development**, Miniplex provides cleaner mapping with its object-oriented API.

### Recommended folder structure

```
project/
├── core/                      # Platform-agnostic (TypeScript → C#)
│   ├── domain/                # Business logic, rules
│   │   ├── entities/          # Game entities (Player, Enemy)
│   │   ├── components/        # ECS components (Position, Health)
│   │   └── systems/           # ECS systems (MovementSystem)
│   ├── state/                 # State machines, game state
│   ├── interfaces/            # Port interfaces for adapters
│   └── data/                  # Data models, serialization
├── platform-threejs/          # Three.js specific
│   ├── adapters/              # Implements core interfaces
│   ├── renderers/             # Visual components
│   └── input/                 # Web input handling
└── platform-unity/            # Unity specific (C#)
    ├── Adapters/              # Implements core interfaces
    ├── MonoBehaviours/        # Unity components
    └── Input/                 # Unity input handling
```

This structure mirrors Unity's Assets folder organization while maintaining clear separation between portable and platform-specific code. **Confidence: HIGH**—this pattern appears consistently in community recommendations and Chickensoft's documented game architecture.

### Interface-based abstraction example

```typescript
// PORT: Platform-agnostic interface (in core/interfaces/)
interface IGameWorld {
  addEntity(entity: Entity): void;
  removeEntity(id: string): void;
  getEntitiesByComponent<T>(component: string): T[];
}

// ADAPTER: Three.js implementation
class ThreeJsWorldAdapter implements IGameWorld {
  private scene: THREE.Scene;
  // Implementation using Three.js API
}

// Core game logic depends only on interface
class GameSimulation {
  constructor(private world: IGameWorld) {}
  
  update(deltaTime: number): void {
    // Platform-agnostic game logic
  }
}
```

The same interface gets implemented in C# for Unity. Core `GameSimulation` logic transfers with minimal modification.

---

## Part 3: TypeScript patterns for C# portability

TypeScript and C# share remarkable compatibility because both were designed by Anders Hejlsberg at Microsoft. This makes migration significantly more tractable than with other language pairs—but only if you avoid TypeScript-specific constructs.

### Patterns with direct C# equivalents

**Classes, interfaces, and generics** transfer nearly unchanged:

```typescript
// TypeScript
interface IDatabase<T> {
  insert(item: T): Promise<void>;
  get(id: string): Promise<T>;
}

class AccountManager {
  private _database: IDatabase<Account>;
  
  constructor(database: IDatabase<Account>) {
    this._database = database;
  }
  
  async createAccount(type: AccountType, name: string): Promise<void> {
    // Implementation
  }
}
```

```csharp
// C# equivalent
interface IDatabase<T> {
  Task Insert(T item);
  Task<T> Get(string id);
}

class AccountManager {
  private IDatabase<Account> _database;
  
  public AccountManager(IDatabase<Account> database) {
    _database = database;
  }
  
  public async Task CreateAccount(AccountType type, string name) {
    // Implementation
  }
}
```

**Async patterns map cleanly**: `Promise<T>` → `Task<T>`, `async/await` → `async/await`, `Promise.all()` → `Task.WhenAll()`.

**Array methods have LINQ equivalents**: `.filter()` → `.Where()`, `.map()` → `.Select()`, `.find()` → `.FirstOrDefault()`, `.reduce()` → `.Aggregate()`.

### Patterns to strictly avoid

| TypeScript Feature | Why Problematic | Alternative |
|-------------------|-----------------|-------------|
| **Union types** (`string \| number`) | No C# equivalent | Use method overloading or wrapper classes |
| **Mapped types** (`Partial<T>`, `Readonly<T>`) | No C# equivalent | Define explicit interfaces |
| **Conditional types** | No C# equivalent | Use generics with constraints |
| **String literal types** (`'north' \| 'south'`) | No C# equivalent | Use enums |
| **`any` type** | Loses type safety, no C# equivalent | Use proper typing or generics |
| **Index signatures** | Limited C# support | Use `Dictionary<TKey, TValue>` |
| **Heavy functional patterns** | OOP translates better | Keep OOP-focused |

### Naming conventions for compatibility

| Element | Convention | Example |
|---------|------------|---------|
| Classes | PascalCase | `PlayerController` |
| Interfaces | PascalCase with "I" prefix | `IObserver`, `IDatabase` |
| Methods | PascalCase | `CreateAccount()` |
| Public properties | PascalCase | `PlayerHealth` |
| Private fields | camelCase with underscore | `_privateField` |
| Files | PascalCase, one class per file | `PlayerController.ts` |

**Use enums instead of string unions**—both languages support identical enum syntax. **Confidence: HIGH**—language comparison is well-documented.

### Serialization for Unity compatibility

Design data classes to work with Unity's `JsonUtility`:

```typescript
// TypeScript - designed for Unity JsonUtility compatibility
class PlayerData {
  public name: string = "";
  public score: number = 0;
  public level: number = 1;
  public inventory: string[] = [];
}
```

Key constraints: use **public fields** (not getters/setters), no dictionaries or top-level arrays, no null handling for value types.

---

## Part 4: Asset and tooling pipeline

**glTF/GLB is the universal interchange format**—this emerged as the strongest consensus across all research sources. Both Three.js and Unity have mature support, and the format handles coordinate system conversion automatically.

### glTF workflow tooling

| Platform | Import | Export |
|----------|--------|--------|
| **Three.js** | GLTFLoader (native) | GLTFExporter (native) |
| **Unity** | **glTFast** (Unity-maintained, production-ready) | **UnityGLTF** (Khronos Group, more features) |

**Recommendation**: Use glTFast for Unity import (better performance, Burst/Jobs optimized) and UnityGLTF for export (more features, extension support). Both packages can coexist in the same project.

### Texture format compatibility

| Format | Three.js | Unity | Recommendation |
|--------|----------|-------|----------------|
| PNG/JPG | Native | Native | Universal but uncompressed |
| **KTX2 (Basis)** | KTX2Loader | glTFast support | **Best cross-platform compressed format** |
| DDS | DDSLoader | Native | DirectX-specific |
| EXR | EXRLoader | Native | HDR/lightmaps |

KTX2 with Basis Universal compression provides GPU-compressed textures that work on both platforms—critical for performance on web where bandwidth matters.

### Shader conversion pipeline

No fully automated solution exists. For custom shaders:

1. **Use PBR materials when possible**—glTF's PBR extensions provide cross-platform material definitions
2. **For custom shaders**, use **SPIRV-Cross** toolchain: GLSL → SPIR-V → HLSL
3. **Manual review required**—function names, UV coordinates (GLSL Y=0 at top, HLSL at bottom), and precision qualifiers all need adjustment

| Tool | Direction | Use Case |
|------|-----------|----------|
| **glslcc** | GLSL → HLSL/MSL/GLES | CLI cross-compilation |
| **SPIRV-Cross** | SPIR-V → any target | Khronos library, most flexible |
| **ShaderMan** | ShaderToy → Unity | Automatic but limited |

**Confidence: MEDIUM**—shader conversion tools exist but require significant manual work.

### Needle Engine for Unity→Three.js workflows

**Needle Engine is the most mature bridge** between Unity and Three.js, actively maintained and well-documented:

- Uses Unity Editor for scene authoring
- Exports to glTF with custom extensions (`NEEDLE_components`, `NEEDLE_persistent_assets`)
- Three.js-based web runtime with Unity-like component system
- **Does NOT compile C# to WebAssembly**—instead translates component data and structure

Component mapping from Needle Engine docs:

| Unity Type | Needle Engine Type |
|------------|-------------------|
| UnityEvent | EventList |
| GameObject | Object3D |
| Transform | Object3D (combined) |
| Color | RGBAColor |

This is the **recommended path for teams with Unity expertise** wanting Three.js web deployment.

---

## Part 5: Community insights and real-world experience

### The traffic flows Unity→web, not the reverse

A striking finding: **documented Three.js→Unity migrations are essentially non-existent**. Community discussions reveal developers almost exclusively face the opposite challenge—bringing Unity content to the web.

From Three.js Discourse (March 2023): *"Unless you are targeting other platforms you won't get anything from Unity that can't be done with ThreeJS, cause at the end of the day they both have to deal with the same Browser/Javascript limitations"* —@Fennec

From r/webgl: *"Long time Unity dev now full stack dev. I tried using Unity for web projects and it just isn't well suited for it... The biggest downside was that this didn't work at all on mobile."*

### Bundle size realities

| Platform | Minimum Viable Bundle |
|----------|----------------------|
| **Three.js** | ~1.16MB (core library), <200KB possible with tree-shaking |
| **Unity WebGL** | ~15-17MB (WASM + data) |

Unity WebGL builds consistently measure **10-15x larger** than equivalent Three.js implementations. Mobile browser support for Unity WebGL remains problematic; Three.js works well.

### Community-validated recommendations

Strong consensus emerged on several points:

- **Use glTF as single source of truth** for assets
- **Keep business logic in web-native TypeScript**—don't try to compile C# to web
- **Unity serves as scene authoring tool** when using Needle Engine
- **Avoid code porting**—no successful C#→JavaScript or TypeScript→C# transpilation projects exist for this use case
- **UN3 (Unity-to-Three.js exporter) developer explicitly recommends Needle Engine instead**: *"DO NOT USE IT, USE NEEDLE (I am not sponsored)"*

### Where opinions diverge

The community disagrees on:

- Whether React Three Fiber scales for complex applications vs. vanilla Three.js
- Whether Unity WebGL is improving enough to compete (Unity claims yes; community skeptical)
- The value of Vue/React integration with Three.js for production applications

**Confidence: HIGH** for consensus points; documented in multiple independent sources.

---

## Part 6: Fundamental limitations and honest assessment

### What cannot be ported

**Shader code**: GLSL and HLSL are fundamentally different languages. Syntax differs (`vec3` vs `float3`), function names differ (`mix` vs `lerp`), and built-in variables have different naming. Automated tools help but manual rewriting is required for any non-trivial shader. **Plan for complete shader rewrites.**

**Physics implementations**: Three.js uses external libraries (cannon.js, ammo.js, rapier) while Unity has integrated PhysX. APIs differ completely—collision layers, constraint systems, physics materials, and continuous collision detection all work differently. Basic rigid body concepts translate; specific implementations do not.

**Platform-specific features**:
- Unity Prefabs, AssetBundles, Addressables have no Three.js equivalent
- Unity Timeline/Cinemachine → must use tween libraries (GSAP, Tween.js)
- Unity NavMesh → third-party pathfinding libraries
- Three.js CSS3DRenderer, DOM integration → not available in Unity
- WebXR API → Unity XR SDK (completely different API)

**Performance characteristics**: WebGL has higher draw call overhead (~2x native), no native multithreading, limited SIMD support, and browser-imposed memory limits. **Code optimized for one platform may perform poorly on the other**—optimization strategies differ fundamentally.

### When porting isn't worth the effort

**Rebuild instead when**:

1. **Heavy custom shader dependency**—requires complete rewrite anyway
2. **DOM-integrated UI**—HTML/CSS UI alongside Three.js canvas has no Unity equivalent
3. **WebXR-specific features**—APIs differ too much
4. **Specific physics library features**—cannon.js/ammo.js code won't transfer
5. **Lightweight web requirement**—if you need <1MB deployment, Unity WebGL is unsuitable
6. **SEO/accessibility requirements**—native web content serves these better

**Port when**:

1. **Asset-heavy projects**—3D models, textures, animations transfer well via glTF
2. **Standard PBR materials**—MeshStandardMaterial → Standard Shader maps cleanly
3. **Simple scene structures**—basic scene graphs map well
4. **Targeting multiple native platforms**—Unity excels here

**Honest assessment**: If your Three.js project is production-ready and performant on web, porting to Unity provides value only if you need native platform deployment (mobile apps, desktop, consoles). The reverse is also true—Unity projects port to web, but web-first development in Three.js is typically more efficient for browser-only deployment.

---

## Part 7: Actionable checklist for portable architecture

### Day-one architectural decisions

- [ ] **Adopt ECS pattern** using bitECS (for DOTS target) or Miniplex (for MonoBehaviour target)
- [ ] **Create abstraction layer** between game logic and rendering using interface-based ports/adapters
- [ ] **Establish folder structure** mirroring Unity's Assets organization
- [ ] **Define naming conventions** following C# style (PascalCase methods, I-prefixed interfaces)
- [ ] **Choose glTF as primary asset format** for all 3D models and scenes

### TypeScript coding standards

- [ ] Use classes with explicit types—avoid `any`
- [ ] Use interfaces extensively with "I" prefix
- [ ] Use enums instead of string literal unions
- [ ] Avoid union types, mapped types, conditional types
- [ ] Keep data classes as simple POCOs (public fields, no complex getters)
- [ ] Use async/await with Promise<T> (maps to Task<T>)
- [ ] One public class per file, filename matches class name

### Asset pipeline setup

- [ ] Configure Three.js project with GLTFLoader and GLTFExporter
- [ ] Install glTFast in Unity for import, UnityGLTF for export
- [ ] Use KTX2/Basis Universal for compressed textures
- [ ] Standardize on PBR materials (MeshStandardMaterial ↔ Standard Shader)
- [ ] Store material parameters in glTF extensions, not code

### Documentation requirements

- [ ] Document which code is platform-agnostic vs platform-specific
- [ ] Maintain mapping table of Three.js concepts to Unity equivalents
- [ ] Record shader conversion notes for any custom shaders
- [ ] Track physics behavior assumptions that may differ per platform

### If using Needle Engine for Unity→Web

- [ ] Install Needle Engine Unity package
- [ ] Author scenes in Unity Editor
- [ ] Write components in TypeScript mirroring C# patterns
- [ ] Export via Needle's glTF pipeline

---

## Confidence levels summary

| Recommendation | Confidence | Rationale |
|----------------|------------|-----------|
| Use glTF as interchange format | **HIGH** | Universal consensus, industry standard |
| ECS architecture for portability | **HIGH** | Documented patterns, multiple implementations |
| TypeScript↔C# pattern compatibility | **HIGH** | Same language designer, well-documented |
| Needle Engine as primary bridge | **HIGH** | Active development, community-recommended |
| Shader conversion requires manual work | **HIGH** | Fundamental language differences |
| No viable code transpilation exists | **HIGH** | No successful projects found |
| Folder structure recommendations | **MEDIUM** | Best practices, but alternatives exist |
| Physics abstraction feasibility | **MEDIUM** | Basic concepts transfer; implementations differ |
| Build size comparisons | **HIGH** | Verified across multiple sources |
| Migration time estimates | **LOW** | No documented migration case studies with timing |

The architectural approach outlined here optimizes for the practical reality: **assets port, patterns port, but code requires strategic rewriting**. Design your Three.js project with this understanding, and the eventual Unity migration becomes a matter of implementing adapters and rewriting platform-specific code—not starting from scratch.