# Minsky Software: Architecture and Core Capabilities Survey

**Research Bead**: mmt-1nk.1
**Date**: 2026-02-04
**Status**: Complete

## Executive Summary

[Minsky](https://github.com/highperformancecoder/minsky) is an open-source system dynamics and Stock-Flow Consistent (SFC) modeling software developed by Prof. Steve Keen and Dr. Russell Standish. It combines traditional system dynamics flowchart modeling with unique "Godley Tables" for double-entry bookkeeping, enabling rigorous monetary flow analysis.

**Key Finding**: Minsky is built with C++ backend (60.4% of codebase), transitioning to JavaScript/TypeScript frontend (21.5%), using Electron for desktop deployment. The architecture is undergoing modernization with Python scripting replacing legacy TCL.

## Technical Architecture

### Core Technology Stack

#### Backend/Engine
- **Primary Language**: C++ (60.4% of codebase)
- **Purpose**: High-performance computation engine, DAG (Directed Acyclic Graph) solver
- **Key Components**:
  - System dynamics solver
  - SFC accounting engine
  - Mathematical computation kernel (tensor support, symbolic differentiation)
  - REST service API for headless operation

#### Frontend
- **Current Architecture**: JavaScript/TypeScript (21.5% of codebase)
- **Framework Evolution**:
  - **Legacy**: TCL/Tk (6.8%, deprecated and being removed)
  - **Modern**: JavaScript with Electron desktop shell
  - **Future**: Browser-based version planned via JavaScript frontend
- **UI Framework**: Electron for cross-platform desktop application
- **Build Tools**: Node.js/npm, TypeScript compiler (tsc)

#### Scripting & Automation
- **Python Integration**: Available since March 2024
  - Linux: v3.0+
  - Windows/Mac: v3.12+
  - Enables "batch mode" for automated simulations
- **REST Service**: Enables headless operation and programmatic access
- **Legacy**: TCL scripting (deprecated, will be removed)

### Build System & Dependencies

- **Build Tool**: Makefile-based (`make -j4`)
- **Testing**: Jest for JavaScript, Doxygen for documentation
- **Packaging**: Electron-builder for distribution
- **Platforms**: Windows, macOS, Linux (via openSUSE build service)
- **Repository**: GPL-3.0 licensed, 7,528 commits, 351 GitHub stars

### Repository Structure

```
minsky/
├── model/          # Core C++ engine and mathematical models
├── engine/         # DAG solver and computation engine
├── gui-js/         # JavaScript/TypeScript frontend
├── schema/         # .mky file format definition
├── tests/          # Test suites
└── docs/           # Technical documentation
```

**Key Documentation**:
- `Architecture.md`: App and DAG engine overview
- `Compiling.md`: Development setup guide
- `Minsky Schema`: .mky file format specification
- Free online manual: ["Modelling with Minsky"](https://www.patreon.com/posts/free-online-with-61227722)

## Core Features

### 1. System Dynamics Modeling

Minsky provides standard system dynamics capabilities comparable to Simulink, Vensim, and Stella:

- **Visual Canvas**: Flowchart-based model definition
- **Mathematical Sophistication**:
  - Tensor mathematics support
  - LaTeX equation export
  - **Symbolic differentiation** (not just numerical)
  - Most "math-centric" interface in system dynamics space
- **Interactive Simulation**: Real-time parameter adjustment via sliders and arrow keys
- **Transparency**: Relationships explicitly modeled on canvas (not hidden in text boxes)

### 2. Stock-Flow Consistent (SFC) Modeling

Minsky enforces rigorous monetary flow accounting:

- **Accounting Identity**: All flows sum to zero (conservation law)
- **Sectoral Balances**: Multi-sector bookkeeping
- **Temporal Consistency**: Stock changes equal integrated flows

### 3. Godley Tables (Unique Feature)

**Named after**: Wynne Godley (Post-Keynesian economist)

**Purpose**: Generate SFC models using double-entry bookkeeping

**Mechanism**:
- Visual spreadsheet-like interface
- Automatic enforcement of accounting identities
- Each row represents a financial flow
- Columns represent economic sectors
- System ensures all entries balance (debits = credits)

**Innovation**: Bridges gap between economic theory and accounting rigor. This is what distinguishes Minsky from generic system dynamics tools.

### 4. Advanced Capabilities

- **Tensor Operations**: Multi-dimensional data structures for complex modeling
- **Equation Export**: LaTeX-formatted equations from visual models
- **Batch Processing**: Python scripting for parameter sweeps, sensitivity analysis
- **REST API**: Programmatic access for integration with other tools
- **Open Source**: GPL-3.0, full transparency and extensibility

## Design Philosophy

1. **Transparency**: Explicit visual representation of all relationships
2. **Mathematical Rigor**: Symbolic computation, not just numerical simulation
3. **Accessibility**: Open source and free (uncommon in system dynamics space)
4. **Performance**: Built by HPC expert (Dr. Russell Standish, PhD Physics)
5. **Interoperability**: REST API, Python scripting, documented file format

## Architecture Evolution Timeline

- **Legacy (pre-2024)**: TCL/Tk frontend, TCL scripting
- **2024 Transition**:
  - JavaScript frontend introduced
  - Python scripting added (March 2024+)
  - TCL marked for deprecation
- **Current (v3.20.0)**: Hybrid C++ backend + Electron JavaScript frontend
- **Future Vision**: Browser-based version (JavaScript frontend enables this)

## Academic Context

**Key Papers**:
- Tymoigne, E. ["The Minskyan System, Part III: System Dynamics Modeling of a Stock Flow-Consistent Minskyan Model"](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=908614) (Levy Economics Institute Working Paper 455)
- Steve Keen's Substack: ["Using system dynamics with Minsky to prove the core tenets of MMT"](https://profstevekeen.substack.com/p/using-system-dynamics-with-minsky)

**Recognition**: Listed by [System Dynamics Society](https://systemdynamics.org/tools/useful-open-source-tools/) as a useful open-source tool

## Repository Statistics

- **Commits**: 7,528
- **Stars**: 351
- **Forks**: 63
- **Releases**: 17 (latest: v3.20.0)
- **License**: GPL-3.0
- **Active Development**: Yes (as of 2026)

## Integration Points for MMT Repository

Based on this survey, potential integration areas with our React-based MMT repository:

1. **Godley Tables**: Could be replicated as React components with accounting validation
2. **Visual Modeling**: React Flow or D3.js could provide similar canvas-based interface
3. **SFC Validation**: Accounting identity checks could be implemented in JavaScript
4. **Python Backend**: Potential for shared computational backend if we add Python API
5. **File Format**: .mky schema could inform our data structures

## Next Steps (Subsequent Beads)

- **mmt-1nk.2**: Deep dive into Godley Table implementation (data structures, algorithms)
- **mmt-1nk.3**: Evaluate GUI architecture (Electron vs web, React alternatives)
- **mmt-1nk.4**: Catalog technical requirements for replication
- **mmt-1nk.5**: Cost-benefit analysis of implementation approaches

## Sources

- [GitHub: highperformancecoder/minsky](https://github.com/highperformancecoder/minsky)
- [Minsky SourceForge](https://sourceforge.net/projects/minsky/)
- [Prof Steve Keen: Free online manual Modelling with Minsky](https://www.patreon.com/posts/free-online-with-61227722)
- [Activist MMT Podcast: Steve Keen's Minsky modeling software](https://activistmmt.libsyn.com/episode-14922-steve-keens-minsky-modeling-software-and-why-its-important-for-mmters)
- [Bond Economics: Initial Comments On The Minsky Software Package](http://www.bondeconomics.com/2019/04/initial-comments-on-minsky-software.html)
- [Tymoigne: The Minskyan System, Part III (SSRN)](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=908614)
- [Steve Keen: Using system dynamics with Minsky to prove MMT](https://profstevekeen.substack.com/p/using-system-dynamics-with-minsky)
- [System Dynamics Society: Useful Open Source Tools](https://systemdynamics.org/tools/useful-open-source-tools/)

---

**Bead Completion**: mmt-1nk.1 ✓
**Evidence**: Comprehensive architecture survey documented
**Verification**: Human review (mmt-1nk.8)
