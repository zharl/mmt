# Technical Requirements and Dependencies

**Research Bead**: mmt-1nk.4
**Date**: 2026-02-04
**Status**: Complete

## Executive Summary

This document catalogs the technical requirements for implementing Minsky-inspired features in the MMT repository. The existing stack (React 19, Vite, Tailwind CSS) provides a strong foundation. **Key additions**: React Flow (canvas), mathjs (symbolic computation), ode-rk4 (numerical solving), recharts (enhanced plotting), and KaTeX (LaTeX rendering).

**Integration Complexity**: **MEDIUM** - Most requirements are satisfied by well-maintained npm packages that integrate cleanly with React.

## Current MMT Repository Stack

### Existing Dependencies (package.json:14-32)

**Production**:
- `react@^19.2.0` - UI framework
- `react-dom@^19.2.0` - DOM rendering
- `lucide-react@^0.554.0` - Icon library

**Development**:
- `vite@^7.2.4` - Build tool and dev server
- `@tailwindcss/vite@^4.1.17` - CSS framework
- `eslint@^9.39.1` - Linting
- `vitest@^3.0.7` - Testing framework

### Existing Architecture (README.md:46-88)

**Current Capabilities**:
1. **SFC Monetary Operations Lab**: Interactive balance sheet simulator
2. **Multi-Period Dynamics** (`src/sfc/multiPeriod.js`): Discrete-time simulation with simple Euler-like iteration
3. **LaTeX Documentation**: Professional PDF generation via external toolchain

**Computation Engine** (`src/sfc/multiPeriod.js:1-67`):
```javascript
// Current approach: Discrete period-by-period simulation
for (let t = 1; t <= numPeriods; t++) {
  const interestPayments = interestRate * (R + Bh);
  const nominalDeficit = primaryBalance + interestPayments;
  const inflation = Math.max(inflationFloor, inflationElasticity * (nominalDeficit / nomGdp));
  const realDeficit = nominalDeficit - inflation * totalDebtPrev;

  R += nominalDeficit;  // Simple accumulation (Euler-like)
  nomGdp *= (1 + inflation);
}
```

**Strengths**:
- Clean, readable code
- Purpose-built for specific SFC scenarios
- No external numerical libraries needed

**Limitations for Minsky-Style Modeling**:
- No continuous-time ODEs (only discrete periods)
- No symbolic expression handling
- No general system dynamics framework
- No visual canvas for model construction

## Required Additions for Minsky Features

### 1. Visual Canvas System

#### React Flow (RECOMMENDED)

**Package**: [`reactflow`](https://reactflow.dev)
**Version**: ^11.11.0 (latest stable)
**License**: MIT
**Bundle Size**: ~90 KB gzipped

**Why React Flow**:
- ✅ Purpose-built for node-based UIs
- ✅ Built-in drag/zoom/pan/select
- ✅ Custom nodes as React components
- ✅ Edge routing and connection validation
- ✅ Plugin ecosystem (Background, Minimap, Controls)
- ✅ TypeScript support
- ✅ Active development (11K+ GitHub stars)

**Installation**:
```bash
npm install reactflow
```

**Core Features**:
- Node dragging and positioning
- Edge connections with validation
- Multi-selection (Shift+click)
- Pan (click-drag canvas)
- Zoom (scroll wheel)
- Keyboard navigation (arrow keys)
- Touch support (mobile/tablet)

**Custom Node Types**:
```jsx
import ReactFlow, { Handle } from 'reactflow';

const OperationNode = ({ data }) => (
  <div className="operation-node">
    <Handle type="target" position="left" />
    <div className="symbol">{data.operator}</div>
    <Handle type="source" position="right" />
  </div>
);

const nodeTypes = {
  operation: OperationNode,
  variable: VariableNode,
  godley: GodleyTableNode,
};
```

**Integration with Existing Stack**:
- ✅ Works seamlessly with React 19
- ✅ Compatible with Tailwind CSS (use `className`)
- ✅ Vite builds without issues
- ✅ Vitest testable (mock ReactFlow components)

### 2. Numerical ODE Solvers

#### Primary: ode-rk4 (Fourth Order Runge-Kutta)

**Package**: [`ode-rk4`](https://github.com/scijs/ode-rk4)
**Version**: ^2.0.0
**License**: MIT
**Bundle Size**: ~5 KB

**Why RK4**:
- ✅ Standard system dynamics solver
- ✅ Fourth-order accuracy (better than Euler)
- ✅ Stable for most economic models
- ✅ Simple API

**Installation**:
```bash
npm install ode-rk4
```

**Usage Example**:
```javascript
import rk4 from 'ode-rk4';

// Define system: dY/dt = f(t, Y)
function derivativeFunction(dydt, y, t) {
  // Example: Logistic growth
  const r = 0.1;  // growth rate
  const K = 100;  // carrying capacity
  dydt[0] = r * y[0] * (1 - y[0] / K);
}

// Initial conditions
let y = [10];  // Y(0) = 10
let t = 0;
const dt = 0.1;

// Integrate one step
const integrator = rk4(y, derivativeFunction, t, dt);
integrator(y, t);  // Updates y in-place
```

**Integration with Minsky Canvas**:
```javascript
// Convert node graph to ODE system
function graphToODE(nodes, edges) {
  return function(dydt, y, t) {
    // Traverse nodes in topological order
    // Evaluate each operation
    // Accumulate flows into stocks
  };
}
```

#### Alternative: odex (Adaptive Step Size)

**Package**: [`odex`](https://www.npmjs.com/package/odex)
**Method**: Bulirsch-Stoer
**Use Case**: Stiff systems or high accuracy requirements

**When to Use**:
- Complex multi-timescale systems
- Need adaptive step sizing
- Stringent accuracy requirements

**API**:
```javascript
import { Solver } from 'odex';

const solver = new Solver(numEquations);
solver.denseOutput = true;

solver.solve(
  (t, y) => [/* derivatives */],
  t0, y0,
  t1,
  solver.grid(dt, (t, y) => {
    // Solution at each step
  })
);
```

**Recommendation**: Start with `ode-rk4` (simpler), upgrade to `odex` if needed.

### 3. Symbolic Mathematics

#### Math.js (RECOMMENDED)

**Package**: [`mathjs`](https://mathjs.org)
**Version**: ^14.0.0
**License**: Apache-2.0
**Bundle Size**: ~500 KB (full), ~150 KB (custom build)

**Why Math.js**:
- ✅ Expression parsing and evaluation
- ✅ Symbolic simplification and derivatives
- ✅ Matrix/vector operations (for SFC matrices)
- ✅ Extensive function library
- ✅ Tree-shakeable (import only what you need)

**Installation**:
```bash
npm install mathjs
```

**Core Capabilities**:

**1. Expression Parsing**:
```javascript
import { parse, compile } from 'mathjs';

const expr = parse('0.8 * GDP + 100');
const code = expr.compile();
const result = code.evaluate({ GDP: 1000 });  // 900
```

**2. Symbolic Derivatives**:
```javascript
import { derivative } from 'mathjs';

const f = 'x^2 + 2*x + 1';
const df = derivative(f, 'x');  // Parsed tree: 2*x + 2
```

**3. Simplification**:
```javascript
import { simplify } from 'mathjs';

const expr = parse('2*x + 3*x');
const simplified = simplify(expr);  // 5*x
```

**4. Matrix Operations** (for SFC accounting):
```javascript
import { matrix, multiply, transpose } from 'mathjs';

const balanceSheet = matrix([
  [100, -100],  // Deposits: HH asset, Bank liability
  [50, -50],    // Loans: Bank asset, Firm liability
]);

const sectorSums = multiply(balanceSheet, [1, 1]);  // Should equal [0, 0]
```

**Use in Godley Tables**:
```javascript
// Validate row sums
function validateGodleyRow(row) {
  const expr = row.join(' + ');  // "100 + (-50) + (-50)"
  const parsed = parse(expr);
  const result = parsed.evaluate();
  return Math.abs(result) < 1e-10;  // Check ≈ 0
}
```

#### Alternative: Nerdamer

**Package**: [`nerdamer`](https://nerdamer.com)
**License**: MIT
**Bundle Size**: ~200 KB

**Advantages**:
- More advanced symbolic capabilities (integration, factors, partial fractions)
- Smaller bundle than mathjs

**Disadvantages**:
- Less active development
- Smaller community
- API less intuitive

**When to Use**: Only if you need advanced symbolic features (integration, factorization) that mathjs doesn't provide.

### 4. Enhanced Charting

#### Recharts (RECOMMENDED)

**Package**: [`recharts`](https://recharts.org)
**Version**: ^2.15.0
**License**: MIT
**Bundle Size**: ~150 KB
**GitHub Stars**: 24.8K

**Why Recharts**:
- ✅ Built on D3.js (consistent with React Flow)
- ✅ Declarative React API
- ✅ Responsive charts
- ✅ Rich tooltip and legend support
- ✅ Animations out-of-the-box
- ✅ Good performance for moderate datasets (<10K points)

**Installation**:
```bash
npm install recharts
```

**Usage Example**:
```jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

<LineChart width={600} height={300} data={simulationResults}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="period" label="Time" />
  <YAxis label="Debt/GDP Ratio" />
  <Tooltip />
  <Legend />
  <Line type="monotone" dataKey="debtGdpRatio" stroke="#8884d8" />
  <Line type="monotone" dataKey="inflation" stroke="#82ca9d" />
</LineChart>
```

**Integration with Multi-Period Sim**:
- Current code returns array of period results (multiPeriod.js:22-62)
- Recharts consumes arrays directly
- Minimal refactoring needed

**Alternative: react-chartjs-2**

**Package**: `react-chartjs-2`
**Rendering**: Canvas (vs Recharts' SVG)
**Use Case**: Extremely large datasets (>10K points)

**Trade-off**: Canvas rendering is faster but less accessible (no DOM elements).

### 5. LaTeX Rendering

#### KaTeX (RECOMMENDED)

**Package**: [`katex`](https://katex.org) + [`react-katex`](https://www.npmjs.com/package/react-katex)
**Version**: ^0.16.0 (KaTeX), ^3.0.0 (react-katex)
**License**: MIT
**Bundle Size**: ~100 KB (including fonts)

**Why KaTeX**:
- ✅ Fastest LaTeX renderer (~10x faster than MathJax 2)
- ✅ Synchronous rendering (no reflow)
- ✅ Smaller bundle than MathJax
- ✅ No external dependencies
- ✅ React integration via react-katex

**Installation**:
```bash
npm install katex react-katex
```

**Usage**:
```jsx
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

<div>
  <InlineMath math="\\frac{dY}{dt} = r \\cdot Y" />

  <BlockMath math="\\int_0^T \\frac{dS}{dt} dt = S(T) - S(0)" />
</div>
```

**Dynamic Equation Generation**:
```javascript
// Generate LaTeX from node graph
function generateEquationLatex(stockNode, inflowNodes, outflowNodes) {
  const inflows = inflowNodes.map(n => n.label).join(' + ');
  const outflows = outflowNodes.map(n => n.label).join(' + ');
  return `\\frac{d${stockNode.label}}{dt} = ${inflows} - (${outflows})`;
}
```

**Alternative: MathJax 3**

**Package**: `react-mathjax3`
**Version**: ^3.0.0

**Advantages**:
- Broader LaTeX command support
- Multiple input formats (TeX, MathML, AsciiMath)
- Better accessibility (ARIA)

**Disadvantages**:
- Larger bundle (~300 KB)
- Slower rendering
- Requires configuration

**Recommendation**: KaTeX for MVP, MathJax if advanced LaTeX features needed.

### 6. Utility Libraries

#### DAG Utilities

**Package**: [`graphlib`](https://www.npmjs.com/package/graphlib)
**Version**: ^2.1.8
**License**: MIT
**Bundle Size**: ~30 KB

**Purpose**:
- Directed acyclic graph operations
- Topological sorting (evaluation order)
- Cycle detection

**Usage**:
```javascript
import { Graph, alg } from 'graphlib';

const g = new Graph();
g.setNode('stock1', { type: 'stock' });
g.setNode('flow1', { type: 'flow' });
g.setEdge('flow1', 'stock1');

// Topological sort for evaluation order
const order = alg.topsort(g);

// Detect cycles (invalid in system dynamics)
const cycles = alg.findCycles(g);
if (cycles.length > 0) {
  throw new Error('Circular dependency detected');
}
```

#### Expression Validation

**Package**: Built-in with mathjs

**Usage**:
```javascript
import { parse } from 'mathjs';

function validateExpression(expr, allowedVars) {
  try {
    const parsed = parse(expr);
    const symbols = parsed.filter(node => node.isSymbolNode);
    const invalid = symbols.filter(s => !allowedVars.includes(s.name));
    return { valid: invalid.length === 0, invalidSymbols: invalid };
  } catch (e) {
    return { valid: false, error: e.message };
  }
}
```

## Complete Package Additions

### Required (MVP)

```json
{
  "dependencies": {
    "reactflow": "^11.11.0",
    "mathjs": "^14.0.0",
    "ode-rk4": "^2.0.0",
    "recharts": "^2.15.0",
    "katex": "^0.16.0",
    "react-katex": "^3.0.0",
    "graphlib": "^2.1.8"
  }
}
```

**Total Bundle Size**: ~900 KB gzipped (reasonable for web app)

### Optional (Enhanced Features)

```json
{
  "dependencies": {
    "odex": "^2.1.0",          // Advanced ODE solver
    "nerdamer": "^1.1.9",      // Advanced symbolic math
    "d3-force": "^3.0.0"       // Force-directed layout
  }
}
```

## Integration Points with Existing Codebase

### 1. Multi-Period Simulator Enhancement

**Current**: Discrete periods, simple accumulation (multiPeriod.js:38-62)

**Enhancement**: Optional continuous-time mode

```javascript
// Add optional solver parameter
export function runMultiPeriodSimulation(config) {
  const { solver = 'discrete', ...rest } = config;

  if (solver === 'discrete') {
    // Existing implementation
    return runDiscreteSim(rest);
  } else if (solver === 'ode') {
    // New continuous-time implementation
    return runContinuousSim(rest);
  }
}

function runContinuousSim(config) {
  // Define ODE system
  const ode = (dydt, y, t) => {
    const [R, nomGdp] = y;
    const interestPayments = config.interestRate * R;
    const nominalDeficit = config.primaryBalance + interestPayments;
    const inflation = config.inflationElasticity * (nominalDeficit / nomGdp);

    dydt[0] = nominalDeficit;  // dR/dt
    dydt[1] = inflation * nomGdp;  // d(nomGdp)/dt
  };

  // Integrate using RK4
  let y = [config.initialReserves, config.initialGdp];
  let t = 0;
  const dt = 1.0;  // One period per step
  const integrator = rk4(y, ode, t, dt);

  const results = [];
  for (let period = 0; period <= config.numPeriods; period++) {
    results.push({ period, R: y[0], nomGdp: y[1], /* ... */ });
    integrator(y, t);
    t += dt;
  }

  return results;
}
```

**Backward Compatibility**: Default to 'discrete' mode, existing code unchanged.

### 2. SFC Ledger Integration

**Current**: Balance sheet operations (src/sfc/ledger.js)

**Enhancement**: Validate using mathjs matrix operations

```javascript
import { matrix, multiply } from 'mathjs';

export function validateSFCConsistency(balanceSheet) {
  // Balance sheet: rows = accounts, cols = sectors
  const m = matrix(balanceSheet);

  // Sum across sectors: should be zero for all accounts
  const accountSums = multiply(m, Array(m.size()[1]).fill(1));

  // Check all close to zero
  return accountSums.every(sum => Math.abs(sum) < 1e-10);
}
```

### 3. Canvas Integration with Existing UI

**Approach**: Add new route for visual modeler

```jsx
// App.jsx enhancement
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import VisualModeler from './VisualModeler';

function App() {
  return (
    <Routes>
      <Route path="/" element={<SFCOperationsLab />} />
      <Route path="/dynamics" element={<MultiPeriodSim />} />
      <Route path="/modeler" element={<VisualModeler />} />  {/* NEW */}
      <Route path="/blog" element={<BlogPostDeficitChannel />} />
    </Routes>
  );
}
```

**VisualModeler Component**:
```jsx
import ReactFlow from 'reactflow';
import 'reactflow/dist/style.css';

export default function VisualModeler() {
  return (
    <div style={{ height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      />
    </div>
  );
}
```

### 4. Godley Table Editor

**Approach**: Standalone component, callable from canvas or directly

```jsx
// GodleyTableEditor.jsx
import { useState } from 'react';
import { parse } from 'mathjs';

export default function GodleyTableEditor({ initialData }) {
  const [table, setTable] = useState(initialData);

  function validateRow(row) {
    const expr = row.slice(1).join(' + ');  // Skip label column
    try {
      const result = parse(expr).evaluate();
      return Math.abs(result) < 1e-10;
    } catch {
      return false;
    }
  }

  return (
    <table className="godley-table">
      {table.map((row, i) => (
        <tr key={i} className={validateRow(row) ? 'valid' : 'invalid'}>
          {row.map((cell, j) => (
            <td key={j}>
              <input
                value={cell}
                onChange={(e) => updateCell(i, j, e.target.value)}
              />
            </td>
          ))}
        </tr>
      ))}
    </table>
  );
}
```

## Development Workflow Enhancements

### Testing Strategy

**Unit Tests** (Vitest):
```javascript
// ode-solver.test.js
import { describe, it, expect } from 'vitest';
import rk4 from 'ode-rk4';

describe('ODE Solver', () => {
  it('should integrate simple exponential growth', () => {
    const ode = (dydt, y, t) => { dydt[0] = 0.1 * y[0]; };
    let y = [1];
    const integrator = rk4(y, ode, 0, 0.1);

    integrator(y, 0);
    expect(y[0]).toBeCloseTo(1.01005, 4);
  });
});
```

**Integration Tests**:
```javascript
// visual-modeler.test.jsx
import { render, screen } from '@testing-library/react';
import VisualModeler from './VisualModeler';

it('renders canvas with nodes', () => {
  render(<VisualModeler initialNodes={testNodes} />);
  expect(screen.getByText('Stock 1')).toBeInTheDocument();
});
```

### Build Configuration

**Vite Config**: No changes needed (all libraries Vite-compatible)

**Code Splitting** (optional, for performance):
```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-flow': ['reactflow'],
          'math': ['mathjs', 'ode-rk4'],
          'charts': ['recharts'],
        },
      },
    },
  },
};
```

## Performance Considerations

### Bundle Size Analysis

| Library | Size (gzipped) | Necessity | Tree-Shakeable |
|---------|----------------|-----------|----------------|
| reactflow | 90 KB | Required | Partial |
| mathjs | 150 KB (custom) | Required | Yes |
| ode-rk4 | 5 KB | Required | N/A |
| recharts | 150 KB | Optional | Partial |
| katex | 100 KB | Optional | No |
| graphlib | 30 KB | Required | No |
| **Total** | **~525 KB** | | |

**Current Bundle** (production build): ~150 KB
**With Additions**: ~675 KB
**Still Reasonable**: Yes (typical web apps: 500-1500 KB)

### Runtime Performance

**Canvas Rendering** (React Flow):
- 60 FPS for <100 nodes
- 30 FPS for <500 nodes
- Optimization needed for >500 nodes (virtualization)

**ODE Solving** (ode-rk4):
- ~1ms per step for system with 10 equations
- Bottleneck: Not computation, but React re-rendering
- Solution: Debounce UI updates (update every 10 steps)

**Symbolic Math** (mathjs):
- Parse: ~0.1ms per expression
- Evaluate: ~0.01ms per call
- Negligible overhead for typical use

## Deployment Considerations

### GitHub Pages (Current)

**No Changes Required**:
- All libraries client-side
- No server-side dependencies
- Static build via Vite

**Build Process**:
```bash
npm run build  # Creates dist/
# Deploy dist/ to GitHub Pages
```

### Alternative: Vercel/Netlify

**Advantages**:
- Serverless functions (if backend needed later)
- Automatic deploys from Git
- Better CDN
- Free tier sufficient

**No code changes needed** - same static build.

## Recommended Implementation Order

### Phase 1: Canvas Foundation (2-3 weeks)
1. Add reactflow dependency
2. Create VisualModeler component with route
3. Implement basic node types (operation, variable)
4. Wire connections and validation

### Phase 2: Computation Engine (2-3 weeks)
5. Add ode-rk4 and mathjs
6. Implement graph-to-ODE conversion
7. Connect solver to existing multi-period sim
8. Add real-time parameter updates

### Phase 3: Godley Tables (2-3 weeks)
9. Build GodleyTableEditor component
10. Implement row validation (mathjs)
11. Create Godley node type for canvas
12. Integrate with SFC ledger

### Phase 4: Enhanced Visualization (1-2 weeks)
13. Add recharts for live plots
14. Add katex for equation display
15. Export/import model files (JSON)

### Phase 5: Polish (1-2 weeks)
16. Optimization and testing
17. Documentation
18. Example models/templates

**Total Estimated Time**: 8-12 weeks

## Risk Assessment

### Low Risk

✅ **Package Stability**: All recommended libraries are mature and well-maintained
✅ **React Compatibility**: No version conflicts with React 19
✅ **Build System**: Vite handles all dependencies without issues
✅ **Bundle Size**: Acceptable for modern web apps

### Medium Risk

⚠️ **Performance**: May need optimization for large models (>200 nodes)
- **Mitigation**: Implement virtualization, debouncing, Canvas fallback

⚠️ **Browser Compatibility**: Requires modern browsers (ES2020+)
- **Mitigation**: Already acceptable trade-off for GitHub Pages deployment

### Low-Medium Risk

⚠️ **Learning Curve**: Team needs to learn React Flow and system dynamics concepts
- **Mitigation**: Excellent documentation, large community, incremental development

## Technical References

### Numerical Solving
- [Numerical Integration - Solving ODEs in JS](https://jurasic.dev/ode/)
- [Exploring Differential Equations with JavaScript](https://scribbler.live/2024/05/11/Differential-Equations-JavaScript.html)
- [GitHub: scijs/ode-rk4](https://github.com/scijs/ode-rk4)
- [npm: odex](https://www.npmjs.com/package/odex)

### Symbolic Mathematics
- [mathjs: Algebra Documentation](https://mathjs.org/docs/expressions/algebra.html)
- [Symbolic Computation in JavaScript with Math.js](https://blog.klipse.tech/javascript/2020/09/10/symbolic-computation-math-js.html)
- [GitHub: josdejong/mathjs](https://github.com/josdejong/mathjs)
- [Nerdamer | Symbolic Math for Javascript](https://nerdamer.com/)
- [GitHub: davidedc/Algebrite](https://github.com/davidedc/Algebrite)

### React Charting
- [Top React Chart Libraries 2026](https://aglowiditsolutions.com/blog/react-chart-libraries/)
- [Best React Chart Libraries 2025](https://blog.logrocket.com/best-react-chart-libraries-2025/)
- [Recharts vs Victory Comparison](https://stackshare.io/stackups/recharts-vs-victory)
- [8 Best React Chart Libraries 2025](https://embeddable.com/blog/react-chart-libraries)

### LaTeX Rendering
- [Rendering LaTeX in React Websites](https://medium.com/@adwait.purao/rendering-latex-in-react-websites-7bba0fb4bb97)
- [KaTeX vs. MathJax Battle](https://biggo.com/news/202511040733_KaTeX_MathJax_Web_Rendering_Comparison)
- [KaTeX Official Site](https://katex.org/)
- [KaTeX and MathJax Comparison Demo](https://www.intmath.com/cg5/katex-mathjax-comparison.php)

### Visual Canvas
- [React Flow Official Site](https://reactflow.dev)
- [GitHub: xyflow/awesome-node-based-uis](https://github.com/xyflow/awesome-node-based-uis)

## Next Steps (Subsequent Beads)

- **mmt-1nk.5**: Implementation recommendations with cost-benefit analysis (3 approaches)
- **mmt-1nk.6**: Compile comprehensive assessment document
- **mmt-1nk.8**: Human review and approval

---

**Bead Completion**: mmt-1nk.4 ✓
**Evidence**: Complete technical requirements catalog with specific library recommendations and integration strategy
**Verification**: Human review (mmt-1nk.8)
