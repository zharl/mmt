---
name: molecule
description: Molecular work orchestration. Transform intent into git-backed, verifiable bead DAGs using reusable YAML formulas, execute via a Ralph-style loop with optional safe parallelism, run mandatory simplification, and open a PR. Beads are the source of truth; GitHub Issues are an optional projection.
allowed-tools: Bash(bd:*), Bash(gh:*), Bash(git:*), Bash(claude:*), Read, Write, Edit, Glob, Skill
---

# Molecule

Molecule orchestrates complex workflows by instantiating reusable templates ("molecules") into executable bead graphs and running them to completion.

Named after Steve Yegge's *molecules*: durable, templated chains of atomic beads for reliable agent execution.

---

## Critical Principles

### 1) Beads are the primitive

All work lives in the local beads system (`bd`):

* **Beads**: atomic, verifiable tasks (2–3 sentences max)
* **Epic bead**: root bead that owns a molecule instance
* **Dependencies**: DAG for ordering and safe parallelism
* **Persistence**: git-backed state in `.beads/`

### 2) GitHub Issues are a projection

GitHub Issues are optional but recommended for substantive work and stakeholder visibility.

* Enabled by default unless `--no-gh` is set
* Checklists and DAG are synced deterministically from bead IDs
* PR body links with `Closes #X` when enabled

`--no-gh` disables GitHub Issue creation and syncing. It does **not** imply privacy.

### 3) Reliability first

Execution defaults to sequential and boring on purpose. Parallelism is opt-in and conservative.

### 4) Verification is non-negotiable

A bead is not complete until its litmus check passes and evidence is recorded.

---

## Usage

```bash
/molecule                                  # Clarify → template → instantiate → confirm → execute
/molecule bd-xxxx                          # Execute or resume an epic bead
/molecule bd-xxxx --parallel               # Enable safe parallelism (opt-in)
/molecule bd-xxxx --no-gh                  # Disable GitHub Issue projection
/molecule --template quant-strategy "VIX contango signal"
/molecule --template tech-doc-latex "Tax-aware optimizer notes"
```

---

## Core Primitives

* **Bead**: smallest unit of work with a verifiable pass/fail
* **Epic bead**: root bead for a molecule instance
* **Molecule formula**: reusable YAML template defining beads, checks, dependencies
* **Evidence**: logs, artifacts, PDFs, test output proving correctness

---

## Templates

| Category | Template | Phases |
|----------|----------|--------|
| Code/Feature | `feature-code` | schema → backend → tests → integration → docs → simplify → PR |
| Quant/Strategy | `quant-strategy` | pre-flight → signal → implement → backtest → sensitivity → OOS → docs → simplify → PR |
| Communication | `communication-batch` | context → drafts → tone → content → brevity → approve → send |
| Refactor | `refactor` | analyze → simplify → dead-code → tests → readability → PR |
| Documentation | `tech-doc-latex` | outline → draft → proofs → figures → review → compile → PR |

---

## Litmus Taxonomy (Compiler-Pass Model)

Each bead declares exactly one verification type:

| Type        | Meaning                                   |
| ----------- | ----------------------------------------- |
| `query`     | Structure exists (files, schema, keys)    |
| `test`      | Code compiles, tests pass                 |
| `content`   | Correct information and structure         |
| `tone`      | Appropriate voice and audience            |
| `tearsheet` | Performance thresholds met                |
| `visual`    | Rendered output correct (charts, PDF, UI) |
| `human`     | Manual approval gate                      |

Autonomous beads must provide an executable `check` command.

---

## Molecule Formulas (YAML)

Formulas live in `.beads/formulas/`.

### Canonical Formula Schema

```yaml
schema_version: 1
template: feature-code
defaults:
  create_github_issue: true
beads:
  - key: US-1
    title: Add status enum to schema
    description: Add status column with enum values and migration. Ensure backfill defaults for existing rows.
    verification_type: test
    check: pytest -q tests/test_schema.py
    depends_on: []
    parallel_ok: false
    paths:
      - db/migrations/**
      - app/models/**
```

Notes:

* `key` is stable within the template instance
* Instantiated bead IDs (`bd-xxxx`) are authoritative
* `paths` and `parallel_ok` gate safe parallelism

---

## Repository Layout

```
.beads/
  epics/
    bd-<epic-id>/
      meta.json
      beads/
        bd-<child-id>.json
      evidence/
        bd-<id>/
          check.log
          artifacts/**
      notes/
        handoff.md
  formulas/
    feature-code.yaml
    quant-strategy.yaml
    communication-batch.yaml
    refactor.yaml
    tech-doc-latex.yaml
```

---

## Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                          /molecule                          │
│                                                             │
│ Phase 0: TRIAGE (optional)                                  │
│   bd ready                                                   │
│   ↓                                                         │
│   Select next epic bead                                     │
│                                                             │
│ Phase 1: INSTANTIATION                                      │
│   Capture intent                                            │
│   Ask 5 clarifying questions                                │
│   Select template                                           │
│   Instantiate epic + child beads                            │
│   Persist to .beads/                                        │
│   Optionally project to GitHub Issue                        │
│   STOP → await confirmation                                 │
│                                                             │
│ Phase 2: EXECUTION LOOP                                     │
│   Create branch: molecule/{epic}-{title}                    │
│   For each ready bead:                                      │
│     bd prime → claim → implement → check → commit → close   │
│     sync → rebase → push                                    │
│   Human beads pause loop                                    │
│   Optional safe parallelism                                 │
│                                                             │
│ Phase 3: QUALITY                                            │
│   Mandatory simplification                                  │
│   Re-run checks                                             │
│                                                             │
│ Phase 4: PR                                                 │
│   gh pr create (checklist + DAG + evidence)                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Clarification (Fresh Mode)

If no epic bead is supplied, ask **exactly five** questions:

1. **Category**: Code/Feature, Quant/Strategy, Communication, Refactor, Documentation
2. **Scope**: Core only, Core + key extras, Full-featured
3. **Success Signal**: Tests pass, Tearsheet thresholds, Automated checks, Human approval, Custom
4. **Visibility**: Local only (`--no-gh`) or GitHub Issue with checkboxes + DAG
5. **Execution Mode**: Sequential (default) or Parallel

Execution begins only after explicit user approval.

---

## Execution Contract (Per Bead)

1. `bd prime`
2. `bd update <id> --status in_progress`
3. Implement changes
4. Run check until it passes
5. Save evidence
6. Commit with bead ID
7. `bd close <id>` → `bd sync` → `git pull --rebase` → `git push`

---

## Quality Gate (Mandatory)

Before any PR:

* Simplify logic
* Remove dead code
* Improve naming
* Re-run all checks

No PR without this step.

---

## Deterministic GitHub Projection

Checklist lines must include bead IDs:

```
- [ ] **bd-a1b2**: Add status enum
- [x] **bd-c3d4**: Write migration
```

Bead IDs are authoritative. Titles may change.

---

## Anti-Patterns

* Beads larger than 2–3 sentences
* Vague checks
* Skipping simplification
* Parallelism without tests
* Ending a session before `git push`

---

## Resume Mode

With `bd-xxxx`:

1. Load `.beads/epics/bd-xxxx/meta.json`
2. Find first incomplete bead
3. Continue execution loop
4. Sync GitHub Issue (if enabled)
