# Minsky GUI Architecture and Visualization Evaluation

**Research Bead**: mmt-1nk.3
**Date**: 2026-02-04
**Status**: Complete

## Executive Summary

Minsky employs a **canvas-based node-wire paradigm** similar to Simulink, Vensim, and Stella, where economic models are visually constructed by connecting nodes (operations, variables, Godley tables) via wires (data flows). The technical stack combines a **C++ computation engine** with an **Electron JavaScript/TypeScript frontend**, providing cross-platform desktop deployment.

**Key Finding**: Web-based alternatives (React Flow, D3.js) can replicate Minsky's core visual modeling capabilities with potentially simpler development/deployment at the cost of some performance. Replication complexity is **MEDIUM** for MVP, **MEDIUM-HIGH** for full feature parity.

## Minsky's GUI Architecture

### Technology Stack

**Desktop Framework**: [Electron](https://www.electronjs.org/)
- Chromium-based browser engine
- Node.js runtime for system integration
- Cross-platform: Windows, macOS, Linux

**Frontend**: JavaScript/TypeScript (`gui-js/` directory)
- TypeScript for type-safe UI development
- Modern JavaScript (replaced legacy TCL/Tk as of 2024)
- Renderer process architecture (Electron multi-process model)

**Backend**: C++ computation engine
- Native Node.js addon (`minskyRESTService.node`)
- Compiled to `.node` binary (N-API module)
- Exposed as JavaScript library for frontend consumption

**Architecture Pattern**: Hybrid C++/JavaScript
- C++ handles: Numerical computation, DAG solving, file I/O
- JavaScript handles: UI rendering, user interaction, layout

**Debug Capabilities**:
- Developer tools via `OPEN_DEV_TOOLS_IN_DEV_BUILD` flag
- TypeScript template literal types for logging
- Renderer process errors captured via `electronService`

### Source Code Organization

```
minsky/
├── gui-js/                # JavaScript/TypeScript frontend
│   ├── node-addons/      # minskyRESTService.node binary
│   ├── libs/shared/      # Shared constants, utilities
│   └── [UI components]
├── model/                # C++ backend (engine)
│   ├── godleyTable.h/.cc
│   ├── minsky.cc         # Main model functions
│   └── [DAG engine]
└── Architecture.md       # System overview
```

### Advantages of Electron Architecture

✅ **Cross-platform**: Single codebase for desktop deployment
✅ **Web technologies**: Familiar HTML/CSS/JavaScript stack
✅ **Rapid UI development**: React-like component patterns
✅ **Native performance**: C++ backend for computations
✅ **Modern tooling**: TypeScript, npm ecosystem, DevTools

### Disadvantages of Electron Architecture

❌ **Resource heavy**: Full Chromium instance per app (~150-300MB RAM overhead)
❌ **Distribution size**: 100+ MB installers due to bundled runtime
❌ **Startup time**: Slower than native Qt applications
❌ **Memory footprint**: Significantly higher than Qt/C++ equivalents
❌ **Web deployment complexity**: Electron not browser-compatible (requires separate web build)

## Visual Modeling Paradigm

### Canvas-Based Interface

Minsky follows the **flowchart modeling paradigm** used by Matlab Simulink, Vensim, and Stella:

**Core Elements**:
1. **Nodes**: Graphical blocks representing operations, variables, constants, Godley tables
2. **Wires**: Connections showing data flow between nodes
3. **Canvas**: Infinite 2D workspace with pan/zoom
4. **Layout**: User-controlled positioning (no auto-layout by default)

### Node Types

**Operation Nodes**:
- Mathematical operators: +, -, ×, ÷, ^, log, exp, sin, cos, etc.
- Integration operators: ∫ (stock accumulation)
- Time-dependent functions

**Variable Nodes**:
- Parameters (sliders, constants)
- State variables (stocks)
- Flow variables

**Godley Table Nodes**:
- Specialized icon representing SFC accounting table
- Double-click to open spreadsheet editor
- Visual indicator of table health (balanced/imbalanced)

**Special Nodes**:
- Graphs/plots (output visualization)
- Switches (conditional logic)
- Time node (simulation clock)

### Wire (Edge) Behavior

**Data Flow**:
- Unidirectional: Output → Input
- Typed: Scalar, vector, tensor (Ravel extension)
- Visual representation: Lines/curves connecting ports

**Port System**:
- Input ports: Left side of nodes
- Output ports: Right side of nodes
- Multiple connections allowed (fan-out, fan-in)

**Interaction**:
- Click-drag from output to input
- Automatic routing (with manual override)
- Wire deletion via selection + delete key

### Interactivity Features

**During Modeling**:
- Drag-drop nodes from palette
- Click-drag to connect
- Double-click for properties
- Right-click for context menus

**During Simulation**:
- Real-time parameter adjustment (sliders)
- Live plot updates
- Pause/resume/reset controls
- Step-through debugging

### Mathematical Transparency

**Unique Feature**: "Math-like" interface
- Equations displayed on canvas (not hidden in dialog boxes)
- LaTeX rendering of model equations
- Click to reveal underlying differential equations
- Visual correspondence between flowchart and math

## Comparison: System Dynamics Software GUIs

| Feature | Minsky | Vensim | Stella | Simulink | Minsky Advantage |
|---------|--------|--------|--------|----------|------------------|
| **Interface Style** | Canvas flowchart | Canvas flowchart | Canvas flowchart | Block diagram | Godley tables |
| **Ease of Use** | Medium | Medium-High | High (beginner-friendly) | Medium | Math-centric |
| **Godley Tables** | ✅ (unique) | ❌ | ❌ | ❌ | **Only Minsky** |
| **Built-in UI Builder** | ❌ | ❌ (addon) | ✅ | ❌ | Disadvantage |
| **Animation** | ❌ | ❌ | ✅ | ✅ | Disadvantage |
| **Monte Carlo** | ✅ | ✅ | ✅ | ✅ | Standard |
| **Causal Tracing** | ❌ | ✅ (Synthesim) | ❌ | ❌ | Disadvantage |
| **Multi-model** | ❌ | ❌ | ✅ | ✅ | Disadvantage |
| **Open Source** | ✅ | ❌ | ❌ | ❌ | **Only Minsky** |
| **Price** | Free | $$ | $$$ | $$$ | **Only Free** |
| **LaTeX Export** | ✅ | ❌ | ❌ | ❌ | Unique |
| **Symbolic Math** | ✅ (tensor) | ❌ | ❌ | Limited | Unique |

**Minsky's Niche**: SFC modeling + open source + mathematical rigor

## Web-Based Alternatives

### Option 1: React Flow

**Overview**: [React Flow](https://reactflow.dev/) is an MIT-licensed library for node-based UIs in React.

**Core Capabilities**:
- Built-in interactivity: drag, zoom, pan, multi-select
- Custom nodes as React components
- Edge labels and decorators
- Plugin ecosystem: Background, Minimap, Controls, NodeToolbar
- Keyboard accessibility (arrow keys)
- Connection validation, cycle prevention
- Real-time collaborative editing support

**Customization**:
- Fully custom nodes using any React component
- Styling via Tailwind CSS or plain CSS
- Custom edge types and handles
- EdgeLabelRenderer for complex labels

**Performance**:
- Handles large graphs with optimization
- React rendering efficiency
- No specific benchmarks provided (likely <1000 nodes performant)

**Use Cases**:
- Workflow builders (Stripe, Zapier)
- No-code platforms
- Chatbot builders
- ML interfaces
- Musical synthesizers

**Suitability for Minsky Clone**: ⭐⭐⭐⭐½
- ✅ Perfect for node-wire paradigm
- ✅ Custom nodes (Godley tables, operations)
- ✅ Interactive parameter widgets
- ✅ Modern React ecosystem
- ⚠️ No built-in physics simulation (need d3-force integration)
- ⚠️ Not math-specific (need custom rendering)

### Option 2: D3.js

**Overview**: [D3.js](https://d3js.org/) is a low-level library for bespoke data visualization with unparalleled flexibility.

**Core Capabilities**:
- **Selections & Transitions**: DOM manipulation, smooth animations
- **Scales & Axes**: Data→visual encoding
- **Shapes**: Arcs, curves, lines, geometric primitives
- **Layouts**: Force-directed graphs, trees, treemaps, Voronoi
- **d3-force**: Dedicated physics simulation module

**Interaction Features**:
- d3-brush: Selection brushing
- d3-drag: Node dragging
- d3-zoom: Pan and zoom
- d3-dispatch: Custom events

**Performance**:
- **SVG default**: Full DOM with event handling
- **Canvas compatible**: Can render to Canvas for performance
- **Hybrid approach**: SVG for UI, Canvas for heavy rendering
- No virtual DOM overhead (direct manipulation)

**Force-Directed Graphs**:
- Center force, collide force, link force, many-body force
- Real-time physics simulation
- Customizable parameters (charge, gravity, link strength)
- Optimal for network/node visualizations

**Suitability for Minsky Clone**: ⭐⭐⭐⭐
- ✅ Excellent for node-graph visualizations
- ✅ Force-directed layout (optional auto-arrange)
- ✅ Full control over rendering
- ✅ Physics simulation built-in
- ⚠️ Lower-level than React Flow (more code required)
- ⚠️ No built-in component abstraction (build from scratch)

### Option 3: React + D3 Hybrid

**Approach**: Combine React components (nodes, UI) with D3 (layout, interactions)

**Architecture**:
```
React: Component structure, state management
D3: Force layout, drag behavior, zoom transforms
```

**Best Practices**:
- React owns the DOM (render nodes as divs/SVG)
- D3 calculates positions and transformations
- Avoid DOM conflicts (let React render, D3 calculate)

**Advantages**:
- ✅ React component benefits (reusability, state)
- ✅ D3 layout algorithms (force-directed)
- ✅ Best of both worlds

**Challenges**:
- ⚠️ Integration complexity (who owns the DOM?)
- ⚠️ Performance tuning needed for large graphs
- ⚠️ Potential double-rendering issues

**Suitability for Minsky Clone**: ⭐⭐⭐⭐⭐
- ✅ Ideal balance of structure and flexibility
- ✅ Custom nodes as React components
- ✅ D3 physics for automatic layout
- ✅ Composable architecture

### Option 4: Canvas-Based (Custom)

**Approach**: Direct Canvas API drawing (no SVG DOM)

**Advantages**:
- ✅ Highest performance (1000+ nodes)
- ✅ No DOM overhead
- ✅ Full rendering control

**Disadvantages**:
- ❌ No built-in event handling (must implement hit detection)
- ❌ No accessibility (screen readers, keyboard nav)
- ❌ Complex interaction logic (click/drag/select)
- ❌ No CSS styling (manual drawing)

**Suitability for Minsky Clone**: ⭐⭐½
- Only for extreme performance requirements
- Not recommended for MVP (premature optimization)

## Qt vs Electron: Desktop Framework Comparison

| Criterion | Qt (C++) | Electron (JS) | Winner |
|-----------|----------|---------------|--------|
| **Performance** | Native speed, low memory | Chromium overhead, high memory | Qt |
| **Bundle Size** | 10-20 MB | 100-150 MB | Qt |
| **Startup Time** | <1s | 2-5s | Qt |
| **Memory** | 20-50 MB | 150-300 MB | Qt |
| **Development Speed** | Slower (C++) | Faster (JS/TypeScript) | Electron |
| **Web Expertise** | Requires C++ skills | Leverages JS ecosystem | Electron |
| **Cross-platform** | ✅ (compile per platform) | ✅ (bundle per platform) | Tie |
| **UI Consistency** | Native look/feel | Chromium rendering | Qt |
| **Debugging** | GDB, Qt Creator | Chrome DevTools | Electron |
| **Package Manager** | Conan, vcpkg | npm (vast ecosystem) | Electron |
| **Community** | Moderate | Large (web devs) | Electron |
| **Cost** | GPL or commercial license | MIT (free) | Electron |

**Verdict for Minsky Clone**:
- **Qt**: Better for standalone app, performance-critical, native feel
- **Electron**: Better for rapid dev, web team, easier deployment

**For MMT Repository (already React-based)**:
- 🏆 **Pure web (no Electron)**: Deploy directly in browser
- React + D3/React Flow fits existing stack
- No desktop installer needed
- Lower barrier to adoption

## Replication Complexity Assessment

### Core Canvas/Node System

**Difficulty**: Medium

**Required Components**:
1. **Canvas container**: Scrollable, zoomable, pannable surface
2. **Node rendering**: SVG/HTML elements with draggable behavior
3. **Edge rendering**: SVG paths connecting nodes
4. **Selection system**: Click, drag-select, multi-select
5. **Event handling**: Mouse, keyboard, touch

**Implementation Path (React Flow)**:
```typescript
import ReactFlow, {
  Node, Edge, Controls, Background
} from 'reactflow';

// Define custom node types
const nodeTypes = {
  operation: OperationNode,
  variable: VariableNode,
  godley: GodleyTableNode,
};

// Render
<ReactFlow
  nodes={nodes}
  edges={edges}
  nodeTypes={nodeTypes}
  onNodesChange={onNodesChange}
  onEdgesChange={onEdgesChange}
>
  <Background />
  <Controls />
</ReactFlow>
```

**Estimated Effort**: 2-3 weeks for functional MVP

### Custom Nodes (Operations, Variables)

**Difficulty**: Medium-Low

**Requirements**:
- Render math symbols (use MathJax or KaTeX)
- Input/output ports
- Parameter editors (inline or modal)
- Visual feedback (hover, selection)

**React Flow Custom Node Example**:
```tsx
const OperationNode = ({ data }) => {
  return (
    <div className="operation-node">
      <Handle type="target" position="left" />
      <div className="operation-symbol">{data.symbol}</div>
      <Handle type="source" position="right" />
    </div>
  );
};
```

**Estimated Effort**: 1-2 weeks for basic node types

### Godley Table Integration

**Difficulty**: Medium

**Challenge**: Embed spreadsheet editor in canvas node

**Approach**:
- Node shows table preview (small icon)
- Double-click opens modal with full Godley editor
- Modal contains editable table from mmt-1nk.2 research
- Validation errors shown in modal and on node icon

**Estimated Effort**: 2-3 weeks (assuming Godley table editor built separately)

### Wiring/Connection System

**Difficulty**: Medium-Low

**React Flow Handles**:
- Built-in connection logic
- Validation callbacks
- Custom edge rendering
- Animated flows (optional)

**Configuration**:
```tsx
const onConnect = (params) => {
  // Validate connection (type checking)
  if (isValidConnection(params.source, params.target)) {
    setEdges((eds) => addEdge(params, eds));
  }
};
```

**Estimated Effort**: 1 week

### Simulation Integration

**Difficulty**: Medium-High

**Requirements**:
- Convert canvas graph to computation DAG
- Numerical solver (Euler, RK4)
- Real-time parameter updates
- Plot rendering (reuse existing charting components)

**Approach**:
- Traverse React Flow graph to extract nodes/edges
- Build dependency DAG
- Topological sort for evaluation order
- Integration loop with state updates

**Estimated Effort**: 3-4 weeks

### Total Replication Estimate

**MVP (Basic Canvas + Nodes + Wiring)**:
- React Flow integration: 2-3 weeks
- Custom nodes: 1-2 weeks
- Godley table integration: 2-3 weeks
- Simulation hookup: 3-4 weeks
- **Total: 8-12 weeks**

**Full Feature Parity**:
- + LaTeX rendering: 1 week
- + Tensor support: 2-3 weeks
- + Advanced editing: 2 weeks
- + Export/import: 1 week
- + Optimization: 2 weeks
- **Total: 16-21 weeks**

## Web Deployment Advantages

### Browser-Based Benefits

✅ **No Installation**: Users access via URL, no download
✅ **Instant Updates**: Push changes live, no reinstall
✅ **Cross-Platform**: Works on any modern browser (desktop, tablet)
✅ **Easier Distribution**: Share link vs distribute installer
✅ **Lower Barrier**: No admin rights needed for install
✅ **Mobile Potential**: Responsive design for tablets

### Trade-Offs vs Desktop

⚠️ **Performance**: Slightly slower than native (usually negligible)
⚠️ **Offline Access**: Requires PWA or caching strategies
⚠️ **File System**: Limited access (use File API or cloud storage)
⚠️ **Large Models**: Browser memory limits (~2GB per tab)

## Recommendations

### For MMT Repository

**Recommended Approach**: React + React Flow + D3

**Rationale**:
1. **Already React-based**: Fits existing architecture
2. **Browser deployment**: No Electron needed
3. **React Flow**: Handles 80% of canvas/node logic
4. **D3 force layout**: Optional auto-arrangement
5. **Incremental**: Build canvas modeling separate from existing multi-period work

**Implementation Path**:
```
Phase 1: React Flow canvas with basic nodes
Phase 2: Godley table editor integration
Phase 3: Connect to existing solver
Phase 4: Import/export models
Phase 5: Advanced features (LaTeX, optimization)
```

### When to Consider Electron

**Use Electron if**:
- Need offline desktop app
- Require native file system access
- Want desktop installer for distribution
- Performance is critical (native backend needed)

**Hybrid Approach**:
- Build web version first (React + React Flow)
- Wrap in Electron later if desktop needed
- Share 95% of codebase

### When to Use Qt/C++

**Use Qt if**:
- Building standalone tool (not web integration)
- Performance paramount (real-time, large scale)
- Team has C++ expertise
- Want native look/feel

**Not Recommended for MMT Repository**: Doesn't fit existing stack

## Technical References

### Minsky Architecture
- [GitHub: highperformancecoder/minsky](https://github.com/highperformancecoder/minsky)
- [Minsky SourceForge](https://sourceforge.net/projects/minsky/)
- [Electron Process Model](https://www.electronjs.org/docs/latest/tutorial/process-model)
- [Advanced Electron.js Architecture](https://blog.logrocket.com/advanced-electron-js-architecture/)

### React Flow
- [React Flow Official Site](https://reactflow.dev)
- [React Flow Examples](https://medium.com/react-digital-garden/react-flow-examples-2cbb0bab4404)
- [Awesome Node-Based UIs (GitHub)](https://github.com/xyflow/awesome-node-based-uis)

### D3.js
- [D3 by Observable](https://d3js.org/)
- [D3.js in React: 8-step Manual](https://www.griddynamics.com/blog/using-d3-js-with-react-js)
- [React + D3.js + Canvas Challenges](https://medium.com/synthesio-engineering/react-d3-js-canvas-challenges-for-a-visual-representation-of-an-infrastructure-ff241a1e4cc6)
- [On D3, React, and Flux](https://medium.com/@sxywu/on-d3-react-and-a-little-bit-of-flux-88a226f328f3)

### Framework Comparisons
- [Qt vs Electron Comparison](https://stackshare.io/stackups/electron-vs-qt)
- [Electron vs Qt for Modern UI](https://softwarelogic.co/en/blog/is-electronjs-better-than-qt-for-modern-ui-development)
- [Why I Moved from Qt to Electron](https://dev.to/dasun/why-i-moved-from-qt-to-plain-c-and-electron-5blc)
- [Comparing Desktop Frameworks](https://medium.com/@maxel333/comparing-desktop-application-development-frameworks-electron-flutter-tauri-react-native-and-fd2712765377)

### System Dynamics Software
- [Wikipedia: Comparison of System Dynamics Software](https://en.wikipedia.org/wiki/Comparison_of_system_dynamics_software)
- [ResearchGate: Vensim vs Stella Comparison](https://www.researchgate.net/post/For_system_dynamics_modelling_which_is_a_better_software_stella_or_Vensim)
- [GoldSim: Comparison to System Dynamics Programs](https://www.goldsim.com/Web/Products/GoldSim/Comparison/SystemDynamics/)
- [Vensim Software](https://vensim.com/software/)

## Next Steps (Subsequent Beads)

- **mmt-1nk.4**: Technical requirements catalog (libraries, numerical solvers, integration points)
- **mmt-1nk.5**: Implementation recommendations with cost-benefit analysis
- **mmt-1nk.6**: Compile comprehensive assessment document

---

**Bead Completion**: mmt-1nk.3 ✓
**Evidence**: Comprehensive GUI architecture evaluation with web alternatives analysis
**Verification**: Human review (mmt-1nk.8)
