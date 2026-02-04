# Implementation Recommendations and Cost-Benefit Analysis

**Research Bead**: mmt-1nk.5
**Date**: 2026-02-04
**Status**: Complete

## Executive Summary

Based on comprehensive research of Minsky's architecture (beads 1-4), **Approach 2: Selective Integration** is strongly recommended. This approach adds Godley tables and visual canvas capabilities to the existing MMT repository while avoiding unnecessary complexity of full Minsky replication.

**Recommended Timeline**: 8-12 weeks for functional MVP, 16-20 weeks for polished v1.0

**Expected Value**: HIGH - Unique combination of web accessibility, SFC rigor, and interactive visualization

## Three Approaches

### Approach 1: Full Replication

**Goal**: Build complete Minsky-equivalent tool in React

#### Scope

Replicate all Minsky features:
- ✅ Canvas-based visual modeling (React Flow)
- ✅ Full node types library (operations, functions, integrations)
- ✅ Godley tables with SFC validation
- ✅ Tensor/Ravel support (multi-dimensional arrays)
- ✅ ODE solver with adaptive stepping
- ✅ LaTeX equation export
- ✅ Model import/export (.mky compatibility)
- ✅ Advanced features: optimization, Monte Carlo, sensitivity analysis
- ✅ Desktop packaging (Electron) + web version

#### Effort Estimate

**Development Time**: 6-9 months (1 developer, full-time)

**Breakdown**:
- Canvas system + node library: 6 weeks
- Godley tables: 4 weeks
- ODE solver integration: 4 weeks
- Tensor operations (Ravel): 6 weeks
- Advanced analysis tools: 8 weeks
- Import/export + compatibility: 4 weeks
- Electron packaging: 3 weeks
- Testing + documentation: 4 weeks
- Polish + bug fixes: 5 weeks

**Dependencies**: reactflow, mathjs, ode-rk4, odex, katex, electron, file parsers

**Bundle Size**: ~2-3 MB (with Electron: 100+ MB installer)

#### Cost-Benefit Analysis

**Pros**:
- ✅ Feature-complete alternative to Minsky
- ✅ Web-native (better accessibility than C++/Qt)
- ✅ Modern tech stack (easier contributor onboarding)
- ✅ Potential for mobile/tablet support
- ✅ Could attract system dynamics community

**Cons**:
- ❌ Massive scope creep vs MMT repository goals
- ❌ 6-9 months before usable product
- ❌ Duplicates effort (Minsky already exists and works)
- ❌ Maintenance burden (keep pace with Minsky development)
- ❌ Dilutes focus from MMT-specific use cases
- ❌ Tensor/Ravel likely overkill for MMT work
- ❌ No competitive advantage over established tools (Vensim, Stella)

**Risks**:
- **HIGH**: Scope too large for single maintainer
- **HIGH**: Minsky's 7,528 commits suggest hidden complexity
- **MEDIUM**: Feature parity difficult (Minsky has 17 releases of refinement)
- **MEDIUM**: Community may prefer Minsky Desktop over web clone

**ROI**: **LOW**
- Effort: Very high (6-9 months)
- Value: Marginal (Minsky exists, is free, actively maintained)
- Strategic fit: Poor (not aligned with MMT repository mission)

#### Recommendation

**NOT RECOMMENDED**

**Rationale**: Building a full Minsky clone is engineering for engineering's sake. The system dynamics community already has excellent tools (Minsky, Vensim, Stella). The MMT repository's value proposition is **Modern Monetary Theory education + interactive SFC accounting**, not generic system dynamics modeling.

---

### Approach 2: Selective Integration (RECOMMENDED)

**Goal**: Add high-value Minsky features that directly enhance MMT/SFC work

#### Scope

**Core Features** (MVP):
1. **Godley Table Editor**
   - Spreadsheet-style interface
   - Real-time row validation (sum to zero)
   - Asset/Liability classification
   - Multi-sector support (Government, Households, Banks, Firms)

2. **Visual SFC Canvas**
   - Drag-drop balance sheet components
   - Connect flows between sectors
   - Visual feedback on accounting consistency
   - Export to equations (for documentation)

3. **Enhanced Multi-Period Simulator**
   - Optional continuous-time ODE mode
   - Visual parameter controls (sliders)
   - Live charts (Recharts integration)
   - LaTeX equation display

**Optional Enhancements** (v1.1+):
- Force-directed auto-layout (D3 force simulation)
- Model templates (3-sector MMT base, Keen's financial instability, etc.)
- Export scenarios for LaTeX papers
- Import data from Minsky .mky files (subset)

**Explicitly OUT OF SCOPE**:
- ❌ Generic system dynamics (stay focused on monetary/SFC)
- ❌ Tensor operations (not needed for MMT)
- ❌ Full Minsky compatibility
- ❌ Desktop packaging (web-only for simplicity)

#### Effort Estimate

**Development Time**: 8-12 weeks (MVP), 16-20 weeks (v1.0)

**Breakdown (MVP)**:
- Godley Table Editor component: 3 weeks
- Visual SFC Canvas (React Flow): 3 weeks
- ODE solver integration: 2 weeks
- Enhanced charts + LaTeX rendering: 2 weeks
- Testing + documentation: 2 weeks

**Breakdown (v1.0 additions)**:
- Multi-sector canvas interactions: 2 weeks
- Model templates: 2 weeks
- Export/import: 2 weeks
- Polish + examples: 2 weeks

**Dependencies**: reactflow (~90 KB), mathjs (~150 KB), ode-rk4 (~5 KB), recharts (~150 KB), katex (~100 KB)

**Bundle Size**: ~700 KB total (existing 150 KB + 550 KB additions)

#### Cost-Benefit Analysis

**Pros**:
- ✅ **HIGH strategic alignment**: Enhances MMT education mission
- ✅ **Focused scope**: Only features that serve SFC/MMT use cases
- ✅ **Reasonable timeline**: MVP in 8-12 weeks
- ✅ **Unique value**: First web-based Godley table tool
- ✅ **Incremental**: Can ship MVP, iterate based on feedback
- ✅ **Leverage existing work**: Builds on current multi-period sim
- ✅ **No competition**: Complements (not competes with) Minsky
- ✅ **Low maintenance**: Smaller surface area than full replication

**Cons**:
- ⚠️ **Not feature-complete**: Can't replace Minsky for advanced use cases
- ⚠️ **Learning curve**: Users must learn both tools (Minsky + MMT lab)
- ⚠️ **Bundle size**: +550 KB (acceptable but notable)

**Risks**:
- **LOW**: Scope well-defined, proven libraries
- **LOW**: Incremental approach allows course correction
- **MEDIUM**: User demand uncertain (mitigate: ship MVP, gather feedback)

**ROI**: **HIGH**
- Effort: Moderate (8-12 weeks MVP)
- Value: High (unique web-based Godley tables + SFC focus)
- Strategic fit: Excellent (core MMT repository mission)

#### Recommendation

**STRONGLY RECOMMENDED**

**Rationale**: This approach threads the needle between ambition and pragmatism. It adds genuinely useful features (Godley tables, visual SFC modeling) that enhance the repository's educational mission without ballooning scope. The ~10 week MVP timeline is achievable and testable.

**Key Success Factors**:
1. **Tight scope discipline**: Resist feature creep, stay SFC-focused
2. **Incremental delivery**: Ship MVP, iterate based on actual usage
3. **Documentation**: Clear examples showing how to build MMT models
4. **Integration**: Seamless with existing multi-period simulator

---

### Approach 3: Inspiration & Documentation Only

**Goal**: Document Minsky's relationship to MMT work without code additions

#### Scope

**Deliverables**:
1. **Research Report** (this document + synthesis)
   - Minsky architecture overview
   - Godley table algorithms
   - Comparison with MMT repository

2. **Tutorial**: "Using Minsky for MMT Models"
   - Step-by-step guide
   - Example: 3-sector government spending model in Minsky
   - How to export results for MMT repository

3. **Documentation Page** (/#/minsky-integration)
   - Explains complementary relationship
   - Links to Minsky downloads
   - Guides users on when to use which tool

4. **Optional**: Script to convert MMT multi-period results → Minsky import format

#### Effort Estimate

**Development Time**: 1-2 weeks

**Breakdown**:
- Compile research into user-facing document: 3 days
- Write Minsky tutorial with MMT examples: 4 days
- Create documentation page: 1 day
- (Optional) Export script: 2 days

**Dependencies**: None (pure documentation)

**Bundle Size**: 0 KB (no code changes)

#### Cost-Benefit Analysis

**Pros**:
- ✅ **Minimal effort**: 1-2 weeks total
- ✅ **No technical risk**: Pure documentation
- ✅ **No maintenance burden**: Static content
- ✅ **Zero performance impact**: No bundle size increase
- ✅ **Fast delivery**: Can ship immediately

**Cons**:
- ❌ **LOW value-add**: Just points users elsewhere
- ❌ **Missed opportunity**: Doesn't leverage web advantages
- ❌ **Friction**: Users must install Minsky separately
- ❌ **Desktop-only**: Minsky not available on mobile/tablet
- ❌ **No differentiation**: Doesn't advance repository uniqueness

**Risks**:
- **NONE**: Documentation-only has no technical risk

**ROI**: **LOW-MEDIUM**
- Effort: Minimal (1-2 weeks)
- Value: Low (mostly redirects users to existing tool)
- Strategic fit: Neutral (doesn't harm, doesn't advance)

#### Recommendation

**NOT RECOMMENDED AS PRIMARY APPROACH**

**Rationale**: While low-effort, this approach is a punt. The MMT repository has an opportunity to be **the definitive web-based SFC/MMT modeling tool**. Documentation-only squanders that potential.

**HOWEVER**: This approach makes an excellent **fallback** if Approach 2 stalls or proves too complex. It also serves as a good **interim deliverable** while building Approach 2 (ship docs first, then features).

**Hybrid Strategy**: Document Minsky now, start Approach 2 in parallel.

---

## Comparative Matrix

| Criterion | Full Replication | Selective Integration ★ | Documentation Only |
|-----------|------------------|------------------------|-------------------|
| **Effort** | 6-9 months | 8-12 weeks (MVP) | 1-2 weeks |
| **Value** | Medium | HIGH | Low |
| **Strategic Fit** | Poor | Excellent | Neutral |
| **Risk** | High | Low-Medium | None |
| **ROI** | Low | HIGH | Low-Medium |
| **Maintenance** | High | Medium | Low |
| **Uniqueness** | Low (clone) | HIGH (first web Godley) | None |
| **Recommendation** | ❌ No | ✅ **YES** | ⚠️ Fallback |

---

## Detailed Recommendation: Approach 2 Implementation Plan

### Phase 0: Documentation (Week 1)

**Goal**: Establish baseline knowledge while planning development

**Deliverables**:
- Synthesize research beads 1-4 into user-facing docs
- Create "Understanding Minsky" page on site
- Document SFC accounting principles

**Effort**: 1 week
**Dependencies**: None (this research already complete)

### Phase 1: Godley Table Editor (Weeks 2-4)

**Goal**: Standalone Godley table component with full validation

**Tasks**:
1. Create `GodleyTableEditor.jsx` component
2. Implement spreadsheet grid (editable cells)
3. Add mathjs expression validation
4. Row sum validation (real-time feedback)
5. Asset/Liability classification dropdowns
6. Multi-column support (sectors)
7. Unit tests (vitest)
8. Documentation + example

**Technical Details**:
```jsx
// GodleyTableEditor.jsx
import { useState } from 'react';
import { parse } from 'mathjs';

export default function GodleyTableEditor({
  initialRows = 3,
  initialCols = 4,
  onTableChange
}) {
  const [table, setTable] = useState(/* initial state */);
  const [assetClasses, setAssetClasses] = useState(['Asset', 'Liability', 'Equity']);

  function validateRow(row) {
    const sum = row.slice(1).reduce((acc, cell) => {
      try {
        return acc + parse(cell).evaluate();
      } catch {
        return acc;
      }
    }, 0);
    return Math.abs(sum) < 1e-10;
  }

  function updateCell(rowIdx, colIdx, value) {
    const newTable = [...table];
    newTable[rowIdx][colIdx] = value;
    setTable(newTable);
    onTableChange?.(newTable);
  }

  return (
    <div className="godley-table-editor">
      {/* Render table with validation styling */}
    </div>
  );
}
```

**Success Criteria**:
- [ ] User can add/remove rows and columns
- [ ] Real-time validation shows green/red row indicators
- [ ] Can export table as JSON
- [ ] Example 3-sector model provided
- [ ] Documentation explains double-entry bookkeeping

**Deliverable**: Working Godley editor accessible via new route `/#/godley`

### Phase 2: Visual SFC Canvas (Weeks 5-7)

**Goal**: React Flow canvas with basic nodes and Godley table integration

**Tasks**:
1. Install and configure React Flow
2. Create custom node types:
   - VariableNode (stocks, flows, parameters)
   - OperationNode (+, -, ×, ÷)
   - GodleyNode (links to table editor)
3. Implement connection system (wires)
4. Add palette (drag-drop new nodes)
5. Pan/zoom/select functionality (React Flow built-in)
6. Double-click Godley node → open table modal
7. Unit tests for node connections
8. Example SFC model

**Technical Details**:
```jsx
// VisualModeler.jsx
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';

const nodeTypes = {
  variable: VariableNode,
  operation: OperationNode,
  godley: GodleyNode,
};

export default function VisualModeler() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedGodley, setSelectedGodley] = useState(null);

  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));
  }, []);

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>

      {selectedGodley && (
        <Modal onClose={() => setSelectedGodley(null)}>
          <GodleyTableEditor
            initialData={selectedGodley.data.table}
            onTableChange={(table) => updateGodleyNode(selectedGodley.id, table)}
          />
        </Modal>
      )}
    </>
  );
}
```

**Success Criteria**:
- [ ] User can drag nodes onto canvas
- [ ] Connections create wires between nodes
- [ ] Godley node opens table editor on double-click
- [ ] Model saves/loads as JSON
- [ ] Example 3-sector MMT model provided

**Deliverable**: Visual modeler at `/#/modeler` with working Godley tables

### Phase 3: ODE Solver Integration (Weeks 8-9)

**Goal**: Convert canvas graph to differential equations and simulate

**Tasks**:
1. Implement graph-to-ODE converter
2. Topological sort for evaluation order (graphlib)
3. Integrate ode-rk4 solver
4. Connect solver to multi-period sim backend
5. Add simulation controls (play/pause/reset)
6. Real-time parameter sliders
7. Unit tests for ODE generation
8. Validation against existing multi-period results

**Technical Details**:
```javascript
// graphToODE.js
import { Graph, alg } from 'graphlib';
import rk4 from 'ode-rk4';

export function buildODESystem(nodes, edges) {
  // Build dependency graph
  const g = new Graph();
  nodes.forEach(n => g.setNode(n.id, n));
  edges.forEach(e => g.setEdge(e.source, e.target));

  // Topological sort
  const evalOrder = alg.topsort(g);

  // Generate derivative function
  return function(dydt, y, t) {
    const state = {};
    // Evaluate nodes in order
    evalOrder.forEach(nodeId => {
      const node = g.node(nodeId);
      state[nodeId] = evaluateNode(node, state, y, t);
    });
    // Extract stock derivatives
    extractDerivatives(dydt, state, nodes);
  };
}

export function simulate(odeSystem, initialState, tEnd, dt) {
  let y = [...initialState];
  let t = 0;
  const integrator = rk4(y, odeSystem, t, dt);

  const results = [{ t: 0, y: [...y] }];
  while (t < tEnd) {
    integrator(y, t);
    t += dt;
    results.push({ t, y: [...y] });
  }
  return results;
}
```

**Success Criteria**:
- [ ] Canvas graph converts to valid ODE system
- [ ] Simulation produces correct trajectories
- [ ] Results match existing multi-period sim (discrete case)
- [ ] Parameters adjustable during simulation
- [ ] Real-time chart updates

**Deliverable**: Functional end-to-end simulation from visual model

### Phase 4: Enhanced Visualization (Weeks 10-11)

**Goal**: Professional charts and equation display

**Tasks**:
1. Add Recharts integration
2. Multiple plot types (line, bar, area)
3. LaTeX equation display (KaTeX)
4. Generate equations from canvas graph
5. Export charts as SVG/PNG
6. Responsive design (mobile/tablet)
7. Accessibility improvements (ARIA labels)
8. Polish UI/UX

**Technical Details**:
```jsx
// ResultsViewer.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function ResultsViewer({ simulationData, equations }) {
  return (
    <div className="results-viewer">
      <section className="equations">
        <h2>Model Equations</h2>
        {equations.map((eq, i) => (
          <BlockMath key={i} math={eq} />
        ))}
      </section>

      <section className="charts">
        <h2>Simulation Results</h2>
        <LineChart width={800} height={400} data={simulationData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="t" label="Time" />
          <YAxis label="Value" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="debt" stroke="#8884d8" />
          <Line type="monotone" dataKey="gdp" stroke="#82ca9d" />
        </LineChart>
      </section>
    </div>
  );
}
```

**Success Criteria**:
- [ ] Professional-looking charts
- [ ] LaTeX equations render correctly
- [ ] Responsive on mobile/tablet
- [ ] Export functionality works
- [ ] Accessible (keyboard navigation, screen readers)

**Deliverable**: Polished results display with equations and charts

### Phase 5: Documentation & Examples (Week 12)

**Goal**: Enable users to build their own models

**Tasks**:
1. Write user guide
2. Create 3 example models:
   - Basic government spending (3-sector)
   - Deficit channel analysis (replicates existing work)
   - Keen's financial instability (Minsky-inspired)
3. Video walkthrough (optional)
4. API documentation
5. Contribution guide
6. Update README

**Deliverables**:
- User guide at `/#/docs/user-guide`
- Example models loadable from UI
- Clear API docs for developers

---

## Post-MVP Roadmap (v1.1+)

### Enhancement 1: Model Templates

**Value**: Lower barrier to entry

**Features**:
- Pre-built models: 3-sector MMT, Keen instability, Godley-Lavoie SIM
- Template wizard (guided model building)
- Community model sharing (GitHub)

**Effort**: 2-3 weeks

### Enhancement 2: Import/Export

**Value**: Interoperability with other tools

**Features**:
- Export to Minsky .mky format (subset)
- Export to LaTeX (for papers)
- Import CSV data for parameters

**Effort**: 2-3 weeks

### Enhancement 3: Advanced Analysis

**Value**: Research-grade features

**Features**:
- Parameter sensitivity (sweep parameters)
- Monte Carlo simulation (stochastic shocks)
- Steady-state finder

**Effort**: 4-6 weeks

### Enhancement 4: Collaborative Editing

**Value**: Team research

**Features**:
- Real-time collaborative modeling (WebSockets)
- Version control integration (Git)
- Comments and annotations

**Effort**: 6-8 weeks

---

## Success Metrics

### Quantitative

**MVP Success** (8-12 weeks):
- [ ] 3 example models functional
- [ ] Godley table validates double-entry correctly
- [ ] Simulation produces expected trajectories
- [ ] <1s load time for typical model
- [ ] Bundle size <800 KB

**v1.0 Success** (16-20 weeks):
- [ ] 10+ example models
- [ ] 50+ GitHub stars (community interest)
- [ ] Featured in MMT community blogs/tweets
- [ ] Used in at least 1 academic paper/presentation

### Qualitative

**User Feedback**:
- "Easier to learn than Minsky"
- "Finally, a web-based Godley table tool"
- "Great for teaching SFC accounting"

**Impact**:
- Cited in SFC/MMT papers
- Recommended by economists (Keen, Mosler, Kelton followers)
- Used in university economics courses

---

## Risk Mitigation Strategies

### Risk 1: Scope Creep

**Mitigation**:
- **Discipline**: Strict adherence to MVP scope
- **Documentation**: Write "Out of Scope" section prominently
- **User feedback**: Only add features users actually request

### Risk 2: Performance Issues

**Mitigation**:
- **Benchmarking**: Test with 100, 500, 1000 node models early
- **Optimization**: Implement virtualization if needed
- **Fallback**: Canvas rendering mode for large models

### Risk 3: Low User Adoption

**Mitigation**:
- **Marketing**: Announce on Twitter, Reddit r/mmt_economics, r/badeconomics
- **Outreach**: Email to Steve Keen, Warren Mosler (solicit feedback)
- **Examples**: Compelling models that show unique value

### Risk 4: Technical Debt

**Mitigation**:
- **Testing**: Maintain >80% test coverage
- **Documentation**: Code comments and API docs mandatory
- **Refactoring**: Allocate 20% of time to code health

---

## Final Recommendation

### Primary Path: Approach 2 (Selective Integration)

**Commit to**:
- 8-12 week MVP timeline
- Focused scope (Godley tables + visual SFC canvas)
- Incremental delivery (ship Phase 1, gather feedback)
- Strategic alignment (MMT/SFC education mission)

**Key Success Factors**:
1. **Discipline**: No feature creep
2. **Quality**: Polish over features
3. **Documentation**: Make it learnable
4. **Community**: Engage MMT/SFC community early

**Expected Outcome**: Unique, valuable tool that enhances MMT repository's educational mission without overextending resources.

### Fallback: Approach 3 (Documentation)

**If** Approach 2 stalls (technical issues, time constraints, low demand):
- Pivot to documentation-only
- Takes 1-2 weeks
- Zero risk

**Deliverables**: "Using Minsky for MMT Models" guide, integration documentation

---

## Next Steps (Immediate)

### After Approval

**Week 1 Actions**:
1. Update package.json with Phase 1 dependencies (mathjs)
2. Create `src/godley/` directory for Godley components
3. Write technical spec for GodleyTableEditor component
4. Set up feature branch: `feature/godley-tables`
5. Begin Phase 1 implementation

**Stakeholder Communication**:
- Update README with "Coming Soon" section
- Create GitHub Issue: "Add Godley Table Editor" (link to this research)
- Tweet from @YourHandle: "Building web-based Godley tables for MMT education"

---

**Bead Completion**: mmt-1nk.5 ✓
**Evidence**: Comprehensive cost-benefit analysis of 3 approaches with detailed implementation plan
**Verification**: Human review (mmt-1nk.8)
