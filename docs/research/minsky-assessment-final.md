# Minsky Software: Comprehensive Technical Assessment

**Epic Bead**: mmt-1nk
**Date**: 2026-02-04
**Status**: Complete - Awaiting Human Review

## Document Index

This assessment synthesizes research across six investigation areas:

1. **Architecture Survey** → [minsky-architecture-survey.md](./minsky-architecture-survey.md)
2. **Godley Tables Deep Dive** → [godley-tables-deep-dive.md](./godley-tables-deep-dive.md)
3. **GUI Evaluation** → [minsky-gui-evaluation.md](./minsky-gui-evaluation.md)
4. **Technical Requirements** → [technical-requirements.md](./technical-requirements.md)
5. **Implementation Recommendations** → [implementation-recommendations.md](./implementation-recommendations.md)
6. **This Document** → Executive synthesis and decision framework

---

## Executive Summary

### Research Question

**Can we replicate Minsky's key capabilities (system dynamics, SFC accounting, Godley tables) in the MMT repository? What's the implementation approach?**

### Answer

**YES - Selective integration is feasible and recommended.**

Build web-based Godley tables and visual SFC modeling to enhance the MMT repository's educational mission. **DO NOT** attempt full Minsky replication (wrong strategic fit, excessive scope).

### Recommendation

**Implement Approach 2: Selective Integration**

- **Timeline**: 8-12 weeks for functional MVP
- **Scope**: Godley table editor + visual SFC canvas + enhanced simulator
- **ROI**: HIGH (unique web tool, perfect strategic alignment)
- **Risk**: LOW-MEDIUM (proven libraries, tight scope control)

### Key Findings

1. **Minsky Architecture**: C++ backend (60%) + JavaScript frontend (21%), Electron desktop, open-source, 7,528 commits
2. **Godley Tables**: Unique SFC feature using double-entry bookkeeping, ~Medium implementation complexity
3. **GUI Feasibility**: React + React Flow + D3 can replicate core visual modeling with simpler stack than Electron/Qt
4. **Technical Requirements**: 6 npm packages (~550 KB), all integrate cleanly with existing React 19 + Vite stack
5. **Strategic Alignment**: Selective integration advances MMT mission; full replication does not

---

## Part 1: What is Minsky?

### Overview

[Minsky](https://github.com/highperformancecoder/minsky) is an open-source system dynamics and Stock-Flow Consistent (SFC) modeling software developed by Prof. Steve Keen (economist) and Dr. Russell Standish (physicist/HPC expert).

**Named after**: Hyman Minsky (economist, financial instability hypothesis)

**Purpose**: Enable economists to build rigorous models that respect accounting identities and sectoral balances.

**Key Innovation**: **Godley Tables** - spreadsheet-like interface that enforces double-entry bookkeeping, automatically generating SFC-compliant differential equations.

### Technical Stack

| Component | Technology | Size | Purpose |
|-----------|-----------|------|---------|
| **Backend** | C++ | 60% | Computation engine, DAG solver |
| **Frontend** | JavaScript/TypeScript | 21% | UI (replaced TCL/Tk in 2024) |
| **Desktop Shell** | Electron | N/A | Cross-platform packaging |
| **Scripting** | Python (v3.12+) | N/A | Batch mode automation |
| **License** | GPL-3.0 | N/A | Open source |

**Repository Stats**: 7,528 commits, 351 GitHub stars, 17 releases (latest: v3.20.0)

### Core Features

1. **System Dynamics Modeling**
   - Visual canvas with node-wire paradigm
   - Mathematical operations (integrations, functions)
   - Real-time simulation with interactive parameters

2. **Stock-Flow Consistent (SFC) Accounting**
   - Enforces conservation laws (all flows sum to zero)
   - Sectoral balance tracking
   - Multi-sector financial flows

3. **Godley Tables** (Unique to Minsky)
   - Spreadsheet interface for SFC models
   - Double-entry bookkeeping validation
   - Automatic equation generation from tables
   - Multi-sector consistency checking ("wedge" feature)

4. **Advanced Capabilities**
   - Tensor operations (Ravel extension)
   - Symbolic differentiation
   - LaTeX equation export
   - Python scripting API
   - Monte Carlo / sensitivity analysis (limited)

### Design Philosophy

- **Transparency**: Relationships explicitly visible on canvas
- **Mathematical rigor**: Symbolic computation, not just numerical
- **Accessibility**: Free and open-source (rare in system dynamics)
- **Performance**: Built by HPC expert for efficiency

### Comparison with Peers

| Software | Price | Open Source | Godley Tables | Web-Based |
|----------|-------|-------------|---------------|-----------|
| **Minsky** | Free | ✅ Yes | ✅ **Unique** | ❌ No |
| Vensim | $$$$ | ❌ No | ❌ No | ❌ No |
| Stella | $$$$ | ❌ No | ❌ No | ❌ No |
| Simulink | $$$ | ❌ No | ❌ No | ❌ No |

**Minsky's Niche**: SFC modeling + open source + mathematical rigor

---

## Part 2: Godley Tables Explained

### Conceptual Foundation

**Named after**: Wynne Godley (1926-2010), British economist who pioneered Stock-Flow Consistent modeling.

**Core Principle**: Every financial asset is someone else's liability, and all sectoral balances must sum to zero.

**Accounting Identity**:
```
Government Balance + Private Domestic Balance + Foreign Balance = 0
```

### Table Structure

**Visual Representation**:
```
                 | Sector A | Sector B | Sector C | Row Sum
-----------------+----------+----------+----------+---------
Flow 1 (Wages)   | +100     | -100     | 0        | 0 ✓
Flow 2 (Taxes)   | -20      | 0        | +20      | 0 ✓
Flow 3 (Spending)| +50      | +50      | -100     | 0 ✓
```

**Key Rules**:
1. **Columns** = Stocks (balance sheet accounts)
2. **Rows** = Flows (financial transactions)
3. **Row Sum** = Must equal zero (double-entry)
4. **Column Sum** = Rate of change of that stock (dStock/dt)

### Data Structure (C++)

```cpp
class GodleyTable {
    vector<vector<string>> data;  // Cell values
    vector<AssetClass> m_assetClass;  // Asset, Liability, Equity
    bool doubleEntryCompliant;
};
```

### Validation Mechanisms

1. **Row Balance**: `Σ(row cells) = 0`
2. **Stock-Flow Integration**: `dS/dt = Σ(column flows)`
3. **Cross-Sector Consistency**: "Wedge" finds missing asset/liability pairs
4. **Accounting Identity**: `Assets = Liabilities + Equity`

### Algorithm: Table → Equations

**Process**:
1. Parse table structure (rows × columns)
2. For each column (stock), sum all row entries symbolically
3. Generate differential equation: `dS_j/dt = Σ_i (flow_ij)`
4. Apply sign conventions (liabilities/equity reversed)
5. Add to DAG for numerical solving

**Example**:
```
Table:
| Flow      | Deposits | Loans |
|-----------|----------|-------|
| Wages     | +W       | 0     |
| Debt Svc  | -D       | -D    |

Equations:
dDeposits/dt = +W - D
dLoans/dt = -D
```

### Implementation Complexity

| Aspect | Difficulty | Rationale |
|--------|-----------|-----------|
| 2D Grid UI | Medium-Low | Standard spreadsheet component |
| Expression Parsing | Medium | Use mathjs library |
| Row Validation | Low | Simple arithmetic sum check |
| Sign Convention | Medium | Asset/Liability rules |
| Equation Generation | Medium-High | Symbolic manipulation required |
| Multi-Sector Consistency | Medium | Global state tracking |

**Overall**: **MEDIUM** complexity, high value

---

## Part 3: GUI Architecture Options

### Minsky's Current Stack

**Electron Desktop**:
- ✅ Cross-platform (Windows, macOS, Linux)
- ✅ Modern JavaScript/TypeScript development
- ❌ Large bundle (~150 MB installer)
- ❌ High memory usage (~200-300 MB)
- ❌ Not web-deployable (requires separate build)

**C++ Backend via Node.js Addon**:
- ✅ High performance for numerical solving
- ✅ Leverages existing C++ codebase
- ❌ Complex build process
- ❌ Requires C++ expertise for contributions

### Web-Based Alternative (Recommended for MMT)

**React + React Flow + D3**:

| Feature | Minsky (Electron) | Web Alternative | Winner |
|---------|------------------|-----------------|--------|
| **Deployment** | Desktop installer | URL access | Web |
| **Installation** | Download + install | Instant | Web |
| **Updates** | Manual reinstall | Automatic | Web |
| **Mobile** | No | Yes (responsive) | Web |
| **Bundle Size** | ~150 MB | ~700 KB | Web |
| **Performance** | Excellent | Good | Minsky |
| **Offline Use** | Yes | PWA/cache | Minsky |
| **Native APIs** | Full access | Limited | Minsky |

**Verdict**: **Web wins for MMT use case** (education, accessibility, low barrier)

### Recommended Libraries

#### React Flow (Canvas System)

**Purpose**: Node-based UI framework

**Features**:
- Built-in drag/zoom/pan/select
- Custom nodes as React components
- Edge routing and validation
- Plugin ecosystem (Background, Minimap, Controls)

**Bundle**: ~90 KB
**License**: MIT
**Stars**: 11K+

#### D3.js (Force Layout)

**Purpose**: Optional auto-arrangement of nodes

**Features**:
- Force-directed graph layout
- Physics simulation
- Interactive behaviors (drag, zoom)

**Bundle**: ~50 KB (d3-force only)
**License**: BSD-3-Clause

**Integration**:
```jsx
import ReactFlow from 'reactflow';
import { forceSimulation, forceLink, forceManyBody } from 'd3-force';

// React Flow renders nodes, D3 calculates positions
```

#### Comparison with Desktop Frameworks

| Framework | Best For | Avoid If |
|-----------|---------|----------|
| **Electron** | Desktop app, native performance | Want web deployment, small bundle |
| **Qt (C++)** | Maximum performance, native feel | JavaScript team, web integration |
| **Web (React)** | Accessibility, rapid iteration, MMT mission | Need offline, heavy computation |

---

## Part 4: Technical Requirements

### Existing MMT Repository Stack

**Current** (package.json):
- `react@^19.2.0` - UI framework
- `vite@^7.2.4` - Build tool
- `@tailwindcss/vite@^4.1.17` - Styling
- `vitest@^3.0.7` - Testing
- `lucide-react@^0.554.0` - Icons

**Bundle Size**: ~150 KB (production build)

### Required Additions

| Package | Version | Size | Purpose |
|---------|---------|------|---------|
| `reactflow` | ^11.11.0 | 90 KB | Node-based canvas |
| `mathjs` | ^14.0.0 | 150 KB | Symbolic math, parsing |
| `ode-rk4` | ^2.0.0 | 5 KB | Numerical ODE solver |
| `recharts` | ^2.15.0 | 150 KB | Enhanced charting |
| `katex` + `react-katex` | ^0.16.0, ^3.0.0 | 100 KB | LaTeX rendering |
| `graphlib` | ^2.1.8 | 30 KB | DAG operations |
| **Total** | | **~525 KB** | |

**New Bundle Size**: ~675 KB (acceptable for modern web app)

### Integration Points

#### 1. Multi-Period Simulator Enhancement

**Current** (src/sfc/multiPeriod.js):
```javascript
// Discrete periods, simple accumulation
for (let t = 1; t <= numPeriods; t++) {
  R += nominalDeficit;
  nomGdp *= (1 + inflation);
}
```

**Enhanced** (optional continuous mode):
```javascript
import rk4 from 'ode-rk4';

const ode = (dydt, y, t) => {
  dydt[0] = nominalDeficit;  // dR/dt
  dydt[1] = inflation * nomGdp;  // d(GDP)/dt
};

const integrator = rk4([R, nomGdp], ode, t, dt);
```

**Backward Compatible**: Default to discrete mode, ODE optional

#### 2. SFC Ledger Validation

**Current**: Manual balance sheet tracking

**Enhanced**:
```javascript
import { matrix } from 'mathjs';

function validateSFC(balanceSheet) {
  const m = matrix(balanceSheet);
  const sums = multiply(m, ones(m.cols));
  return sums.every(s => Math.abs(s) < 1e-10);
}
```

#### 3. New Routes

```jsx
// App.jsx
<Routes>
  <Route path="/" element={<SFCOperationsLab />} />
  <Route path="/dynamics" element={<MultiPeriodSim />} />
  <Route path="/godley" element={<GodleyTableEditor />} />  {/* NEW */}
  <Route path="/modeler" element={<VisualModeler />} />     {/* NEW */}
  <Route path="/blog" element={<BlogPostDeficitChannel />} />
</Routes>
```

### Performance Considerations

**Canvas Rendering** (React Flow):
- 60 FPS: <100 nodes
- 30 FPS: <500 nodes
- Optimization needed: >500 nodes (virtualization)

**ODE Solving** (ode-rk4):
- ~1 ms per step (10 equations)
- Bottleneck: React re-rendering (debounce updates)

**Symbolic Math** (mathjs):
- Parse: ~0.1 ms per expression
- Evaluate: ~0.01 ms per call
- Negligible overhead

### Deployment

**GitHub Pages** (current): No changes required (all client-side)

**Alternative**: Vercel/Netlify
- Same static build
- Better CDN
- Optional serverless functions

---

## Part 5: Implementation Approaches

### Approach 1: Full Replication

**Scope**: Build complete Minsky clone in React

**Effort**: 6-9 months full-time

**ROI**: **LOW**
- ❌ Duplicates existing tool (Minsky works, is free, actively maintained)
- ❌ Massive scope (7,528 commits suggest hidden complexity)
- ❌ Poor strategic fit (generic system dynamics ≠ MMT education)
- ❌ High maintenance burden

**Verdict**: **NOT RECOMMENDED** - Engineering for engineering's sake

---

### Approach 2: Selective Integration ⭐ (RECOMMENDED)

**Scope**: Add Godley tables + visual SFC canvas to MMT repository

**Features**:
- Godley table editor (spreadsheet with validation)
- Visual SFC canvas (React Flow with custom nodes)
- Enhanced multi-period simulator (optional ODE mode)
- LaTeX equation display + professional charts

**Effort**: 8-12 weeks for MVP

**ROI**: **HIGH**
- ✅ Unique value: First web-based Godley table tool
- ✅ Perfect strategic fit: Enhances MMT education mission
- ✅ Reasonable timeline: MVP in 10 weeks
- ✅ Incremental: Ship, iterate based on feedback
- ✅ Low maintenance: Focused scope

**Timeline Breakdown**:
- Week 1: Documentation
- Weeks 2-4: Godley table editor
- Weeks 5-7: Visual SFC canvas
- Weeks 8-9: ODE solver integration
- Weeks 10-11: Enhanced visualization
- Week 12: Documentation + examples

**Success Criteria**:
- [ ] 3 example models functional
- [ ] Godley table validates correctly
- [ ] Simulation produces expected trajectories
- [ ] <1s load time, <800 KB bundle

**Risks**: LOW-MEDIUM
- Scope well-defined
- Proven libraries
- Incremental delivery allows course correction

**Mitigation**:
- Strict scope discipline (no feature creep)
- Benchmarking for performance
- Community feedback after MVP

**Verdict**: **STRONGLY RECOMMENDED**

---

### Approach 3: Documentation Only

**Scope**: Write "Using Minsky for MMT Models" tutorial, no code

**Effort**: 1-2 weeks

**ROI**: **LOW-MEDIUM**
- ✅ Minimal effort
- ✅ Zero risk
- ❌ Low value-add (just redirects to existing tool)
- ❌ Doesn't leverage web advantages
- ❌ No differentiation

**Verdict**: **Good fallback, poor primary approach**

**Use Case**: If Approach 2 stalls, pivot to this in 1 week

---

### Comparison Matrix

| Criterion | Full Replication | **Selective Integration** ⭐ | Documentation Only |
|-----------|------------------|--------------------------|-------------------|
| **Effort** | 6-9 months | **8-12 weeks (MVP)** | 1-2 weeks |
| **Value** | Medium | **HIGH** | Low |
| **Strategic Fit** | Poor | **Excellent** | Neutral |
| **Risk** | High | **Low-Medium** | None |
| **ROI** | Low | **HIGH** | Low-Medium |
| **Uniqueness** | Low (clone) | **HIGH (first web Godley)** | None |
| **Recommendation** | ❌ No | **✅ YES** | ⚠️ Fallback |

---

## Part 6: Strategic Analysis

### Why Approach 2 Aligns with MMT Repository Mission

**Current Mission** (README.md):
> Interactive tools and technical documentation exploring Modern Monetary Theory through Stock-Flow Consistent accounting.

**How Selective Integration Enhances This**:

1. **"Interactive tools"** ← Godley tables provide interactive SFC model building
2. **"Modern Monetary Theory"** ← Example models show MMT principles (deficit channel, sectoral balances)
3. **"Stock-Flow Consistent accounting"** ← Godley tables are THE tool for SFC rigor
4. **"Exploring"** ← Visual canvas enables experimentation and learning

**Competitive Advantage**:

| Tool | SFC Focus | Web-Based | MMT-Specific | Free | Interactive |
|------|-----------|-----------|--------------|------|-------------|
| **MMT Lab (enhanced)** | ✅ Yes | ✅ Yes | ✅ **Yes** | ✅ Yes | ✅ Yes |
| Minsky | ✅ Yes | ❌ No | ⚠️ Partial | ✅ Yes | ✅ Yes |
| Vensim | ⚠️ Limited | ❌ No | ❌ No | ❌ No | ✅ Yes |
| Stella | ⚠️ Limited | ❌ No | ❌ No | ❌ No | ✅ Yes |

**Unique Position**: Only web-based, MMT-focused, SFC-rigorous tool with interactive Godley tables.

### Why NOT Full Replication

**Wrong Strategic Fit**:
- Generic system dynamics ≠ MMT education
- Competing with Minsky (collaborative partner) instead of complementing
- Dilutes focus from core mission

**Wrong Resource Allocation**:
- 6-9 months for marginal differentiation
- Maintenance burden (track Minsky updates)
- Opportunity cost (what else could be built?)

**Wrong Problem**:
- Minsky already solves "desktop system dynamics"
- Problem is: "No web-based Godley tables for MMT education"

### Why NOT Documentation Only

**Missed Opportunity**:
- Web has unique advantages (accessibility, instant updates, mobile)
- MMT community needs educational tools
- SFC modeling barrier to entry still high

**Low Differentiation**:
- Just pointing to Minsky doesn't advance repository's mission
- Documentation alone doesn't create community engagement
- No technical contribution

---

## Part 7: Decision Framework

### Questions to Answer

#### Q1: Do we need Minsky features at all?

**Answer**: YES

**Rationale**:
- Godley tables are pedagogically powerful for teaching SFC accounting
- Visual modeling lowers barrier to entry for non-mathematicians
- Current multi-period simulator is limited to predefined scenarios
- SFC community expects Godley table support

#### Q2: Should we replicate Minsky fully or selectively?

**Answer**: SELECTIVELY

**Rationale**:
- Full replication: Wrong strategic fit, excessive scope
- Selective integration: Perfect alignment, manageable scope
- Focus on MMT-specific features, ignore generic system dynamics

#### Q3: Can we build this in 8-12 weeks?

**Answer**: YES (MVP)

**Evidence**:
- Phase 1 (Godley tables): 3 weeks - well-defined, medium complexity
- Phase 2 (Canvas): 3 weeks - React Flow handles heavy lifting
- Phase 3 (ODE): 2 weeks - ode-rk4 simple API, existing sim as reference
- Phase 4 (Viz): 2 weeks - Recharts + KaTeX integrations straightforward
- Phase 5 (Docs): 1 week - writing examples
- Buffer: 1 week for unexpected issues

**Risks Mitigated By**:
- Proven libraries (11K+ stars for React Flow)
- Small package additions (~525 KB known bundle sizes)
- Existing codebase provides patterns (multiPeriod.js)
- Incremental delivery (can stop after any phase if needed)

#### Q4: What's the minimum viable product?

**Answer**: Godley table editor + basic canvas + 1 example model

**Why This is Viable**:
- Demonstrates core value (web-based SFC modeling)
- Testable with community (solicit feedback)
- Foundation for iteration
- Still useful even if further development pauses

#### Q5: What if it doesn't work / takes too long?

**Answer**: Pivot to Approach 3 (documentation) after 6 weeks if behind schedule

**Decision Gate**: End of Phase 2 (Week 7)
- If Godley tables + canvas working: Proceed to Phases 3-5
- If major blockers: Stop, compile documentation, ship what exists
- Either way: Something shipped, not endless development

---

## Part 8: Recommended Decision & Next Steps

### Decision: Approve Approach 2 (Selective Integration)

**Commit To**:
- 8-12 week MVP timeline (Phases 1-5)
- Focused scope (Godley tables + visual SFC canvas + enhanced sim)
- Incremental delivery (review after each phase)
- Decision gate at Week 7 (continue or pivot to docs)

**Key Success Factors**:
1. **Discipline**: Strict adherence to MVP scope, "NO" to feature creep
2. **Quality**: Polish over features (3 great models > 10 mediocre)
3. **Documentation**: Make it learnable (user guide, examples, tooltips)
4. **Community**: Engage MMT/SFC community early (Twitter, Reddit, direct outreach)

### Immediate Next Steps (Week 1)

**Technical Setup**:
1. Update package.json with Phase 1 dependencies:
   ```bash
   npm install mathjs
   ```
2. Create directory structure:
   ```
   src/
   ├── godley/
   │   ├── GodleyTableEditor.jsx
   │   ├── GodleyTable.test.js
   │   └── validation.js
   └── modeler/   (Phase 2)
   ```
3. Create feature branch: `feature/godley-tables`
4. Write technical spec for GodleyTableEditor component

**Documentation**:
5. Create "Understanding Minsky" page (compile research summary)
6. Update README with "Coming Soon: Godley Tables" section

**Communication**:
7. Create GitHub Issue: "Add Godley Table Editor #[N]" linking to this research
8. (Optional) Tweet preview: "Building web-based Godley tables for MMT education"

### Phase 1 Kickoff (Week 2)

**Goal**: Functional Godley table editor at `/#/godley`

**Sprint Plan**:
- Day 1-2: Basic spreadsheet grid (add/remove rows/cols)
- Day 3-4: Expression validation with mathjs
- Day 5-6: Row sum validation + visual feedback (green/red)
- Day 7-8: Asset/Liability classification dropdowns
- Day 9-10: Multi-sector support + example 3-sector model
- Day 11-12: Unit tests + documentation
- Day 13-14: Polish + user testing

**Deliverable**: Working route `/#/godley` with documented example

### Success Metrics (End of MVP - Week 12)

**Quantitative**:
- [ ] 3 example models functional (gov spending, deficit channel, Keen instability)
- [ ] Godley table validates double-entry correctly (>95% accuracy)
- [ ] Simulation produces trajectories within 1% of expected
- [ ] Page load time <1 second (typical model)
- [ ] Production bundle <800 KB

**Qualitative**:
- [ ] Positive feedback from 3+ beta testers
- [ ] Featured in at least 1 blog post / tweet from MMT community
- [ ] "Easier to learn than Minsky" feedback
- [ ] Used in creating at least 1 new model (not example)

### Post-MVP Roadmap (v1.1+ - Months 4-6)

**Enhancement 1**: Model Templates (2-3 weeks)
- Pre-built: 3-sector MMT, Godley-Lavoie SIM, Keen instability
- Template wizard (guided model building)
- Community model sharing (GitHub)

**Enhancement 2**: Import/Export (2-3 weeks)
- Export to LaTeX (for papers)
- Import CSV data for parameters
- (Stretch) Export to Minsky .mky format (subset compatibility)

**Enhancement 3**: Advanced Analysis (4-6 weeks)
- Parameter sensitivity sweeps
- Monte Carlo simulation (stochastic shocks)
- Steady-state finder

**Enhancement 4**: Collaborative Editing (6-8 weeks)
- Real-time collaborative modeling (WebSockets)
- Comments and annotations
- Version control integration

### Risk Management Plan

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **Scope creep** | Medium | High | Strict "Out of Scope" doc, weekly reviews |
| **Performance issues** | Low | Medium | Benchmark at 100/500/1000 nodes, virtualization fallback |
| **Low adoption** | Medium | Medium | Early marketing (Twitter, Reddit), Steve Keen outreach |
| **Technical debt** | Low | High | >80% test coverage mandate, 20% refactoring time |
| **Behind schedule** | Medium | Medium | Decision gate Week 7 (pivot to docs if needed) |

---

## Part 9: Conclusion

### Research Summary

Over the course of 6 investigation beads, we analyzed:

1. **Minsky's architecture**: C++/JavaScript hybrid, Electron desktop, 7,528 commits, GPL-3.0
2. **Godley table implementation**: Double-entry spreadsheet, medium complexity, high educational value
3. **GUI alternatives**: React + React Flow superior to Electron for web-based educational tool
4. **Technical feasibility**: 6 proven npm packages, ~550 KB bundle increase, clean integration
5. **Strategic alignment**: Selective integration perfect fit for MMT mission; full replication poor fit
6. **Cost-benefit**: 8-12 week MVP feasible, HIGH ROI, unique market position

### Final Recommendation

**Approve Approach 2: Selective Integration**

**Why**:
- ✅ **High strategic value**: Advances MMT education mission uniquely
- ✅ **Feasible timeline**: 8-12 weeks for functional MVP
- ✅ **Manageable risk**: Proven libraries, tight scope, decision gates
- ✅ **Unique offering**: First web-based Godley table tool with MMT focus
- ✅ **Incremental**: Can ship phases independently, iterate based on feedback

**Commit**: 8-12 weeks of focused development, decision gate at Week 7

### What Makes This Work

**Clear Scope**:
- ✅ IN: Godley tables, visual SFC canvas, enhanced simulator
- ❌ OUT: Generic system dynamics, tensor operations, desktop packaging

**Proven Technology**:
- React Flow: 11K+ stars, production-ready
- mathjs: Mature symbolic computation
- ode-rk4: Standard RK4 implementation
- All integrate with existing Vite + React 19 stack

**Strategic Discipline**:
- Focus on MMT/SFC education (not generic modeling)
- Complement Minsky (not compete)
- Web-first (accessibility > performance)

**Risk Mitigation**:
- Incremental delivery (review after each phase)
- Decision gate Week 7 (continue or pivot to docs)
- Fallback plan (documentation) takes 1 week
- Buffer time built into estimates

### Questions for Human Review

Before proceeding, please confirm:

1. **Scope approval**: Is Approach 2 (Selective Integration) the right strategic choice?
2. **Timeline commitment**: Can we allocate 8-12 weeks for MVP development?
3. **Resource allocation**: Is this the highest-value use of development time?
4. **Success metrics**: Do the proposed metrics align with repository goals?
5. **Risk appetite**: Are the identified risks acceptable given mitigation strategies?

### Ready to Begin

All research complete. Technical path validated. Libraries identified. Implementation plan detailed.

**Awaiting approval to start Phase 0 (Documentation) + Phase 1 (Godley Tables).**

---

## Appendices

### Appendix A: Research Documents

1. [minsky-architecture-survey.md](./minsky-architecture-survey.md) - Technical stack, features, design philosophy
2. [godley-tables-deep-dive.md](./godley-tables-deep-dive.md) - Algorithms, data structures, validation mechanisms
3. [minsky-gui-evaluation.md](./minsky-gui-evaluation.md) - Electron vs web, React Flow vs D3, replication complexity
4. [technical-requirements.md](./technical-requirements.md) - npm packages, integration points, performance analysis
5. [implementation-recommendations.md](./implementation-recommendations.md) - 3 approaches compared, detailed MVP plan

### Appendix B: Key References

**Minsky Project**:
- [GitHub Repository](https://github.com/highperformancecoder/minsky)
- [SourceForge Page](https://sourceforge.net/projects/minsky/)
- [Godley Tables Manual](https://minsky.sourceforge.io/manual/Ravel/node220.html)

**Academic Foundations**:
- Godley, W. & Lavoie, M. (2007). *Monetary Economics*. Palgrave Macmillan.
- Tymoigne, E. ["The Minskyan System, Part III"](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=908614). Levy Institute WP 455.
- Steve Keen. ["Using system dynamics with Minsky to prove MMT"](https://profstevekeen.substack.com/p/using-system-dynamics-with-minsky)

**Technical Libraries**:
- [React Flow](https://reactflow.dev) - Node-based UI library
- [math.js](https://mathjs.org) - Symbolic mathematics
- [ode-rk4](https://github.com/scijs/ode-rk4) - Numerical ODE solver
- [Recharts](https://recharts.org) - React charting library
- [KaTeX](https://katex.org) - Fast LaTeX rendering

### Appendix C: Glossary

**DAG**: Directed Acyclic Graph - computation order representation
**Godley Table**: Spreadsheet enforcing double-entry bookkeeping for SFC models
**MMT**: Modern Monetary Theory - macroeconomic framework
**ODE**: Ordinary Differential Equation - mathematical model of dynamic systems
**RK4**: Runge-Kutta 4th order - numerical integration method
**SFC**: Stock-Flow Consistent - accounting framework ensuring sectoral balance
**System Dynamics**: Modeling methodology using stocks, flows, and feedback loops

---

**Epic Bead**: mmt-1nk ✓
**Status**: Complete - Ready for Human Review (mmt-1nk.8)
**Recommendation**: Approve Approach 2 (Selective Integration)
**Timeline**: 8-12 weeks for MVP
**Decision Required**: Proceed to implementation?
