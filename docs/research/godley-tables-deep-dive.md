# Godley Tables and SFC Accounting: Deep Dive

**Research Bead**: mmt-1nk.2
**Date**: 2026-02-04
**Status**: Complete

## Executive Summary

Godley Tables are Minsky's unique implementation of double-entry bookkeeping for Stock-Flow Consistent (SFC) modeling. They automatically enforce accounting identities by converting spreadsheet-like tables into systems of differential equations where stocks and flows remain mathematically consistent.

**Key Innovation**: Godley Tables bridge the gap between intuitive accounting representation (balance sheets) and rigorous computational modeling (ODE systems), making it impossible to create models that violate accounting conservation laws.

## Conceptual Foundation

### Wynne Godley's SFC Framework

Named after British economist **Wynne Godley** (1926-2010), SFC modeling enforces accounting coherence through rigorous stock-flow integration.

**Core Principle**: Every financial asset is someone else's liability, and all sectoral balances must sum to zero.

**Accounting Identity**:
```
Government Balance + Private Domestic Balance + Foreign Balance = 0
```

**Key Publications**:
- Godley, W. & Lavoie, M. (2007). *Monetary Economics: An Integrated Approach to Credit, Money, Income, Production and Wealth*. Palgrave MacMillan.
- Godley successfully predicted the 2008 financial crisis using SFC sectoral analysis.

### Stock-Flow Consistency Requirements

SFC models must satisfy:

1. **Stock Consistency**: Sum of all assets = Sum of all liabilities across all sectors
2. **Flow Consistency**: Change in stocks = Integrated flows over time period
3. **Sectoral Balance**: One sector's surplus = Another sector's deficit
4. **Budget Constraints**: Each sector respects intertemporal budget constraint

**Mathematical Expression**:
```
dStock_i/dt = Σ(inflows_i) - Σ(outflows_i)
```

Where every flow must have both a source and destination.

## Godley Table Data Structures

### C++ Implementation (Minsky)

**Source File**: [`model/godleyTable.h`](https://github.com/highperformancecoder/minsky/blob/master/model/godleyTable.h)

**Primary Data Structure**:
```cpp
class GodleyTable : public GodleyAssetClass {
    typedef std::vector<std::vector<string>> Data;
    Data data;  // Row-major storage of cell values
    vector<AssetClass> m_assetClass;  // Column classifications
    std::string title;
    bool doubleEntryCompliant;
};
```

### Table Organization

**Columns** = **Stocks** (Balance Sheet Accounts)
- Each column represents an asset, liability, or equity account
- Column header = Account name (e.g., "Bank Deposits", "Loans", "Net Worth")
- Symbolic sum of column = Rate of change of that stock (dStock/dt)

**Rows** = **Flows** (Financial Transactions)
- Each row represents a transaction or economic flow
- Row label = Transaction description (e.g., "Consumption", "Investment", "Interest Payment")
- Entries show how transaction affects each account
- **Validation Rule**: Row sum must equal zero (double-entry enforcement)

**Cell Value** = Flow magnitude with sign
- Positive (+): Debit (increases assets, decreases liabilities)
- Negative (-): Credit (decreases assets, increases liabilities)
- Alternative notation: CR/DR (Credit/Debit) via options menu

### Asset Classification System

Three asset classes for each column:

1. **Asset**: Resources owned (positive balance = good)
   - Examples: Cash, Bonds, Capital

2. **Liability**: Obligations owed (negative balance = owed)
   - Examples: Loans, Deposits (for banks)

3. **Equity**: Net worth (residual)
   - Calculated as: Assets - Liabilities
   - Ensures fundamental accounting identity: `Assets = Liabilities + Equity`

**Sign Convention Reversal**:
```cpp
bool signConventionReversed(int col) {
    // Liability and equity columns reverse signs
    // under double-entry compliance mode
    return (m_assetClass[col] == liability ||
            m_assetClass[col] == equity) &&
           doubleEntryCompliant;
}
```

## Validation and Enforcement Mechanisms

### 1. Row Balance Validation

**Rule**: Every row must sum to zero.

**Rationale**: Double-entry bookkeeping requires each transaction to be recorded twice:
- Once as a debit (source)
- Once as a credit (destination)

**Implementation**: Minsky automatically checks row sums and flags violations.

**Example**: Consumption transaction
```
| Flow         | Household Deposits | Firm Deposits | Goods (Real) |
|--------------|-------------------|---------------|--------------|
| Consumption  | -100              | +100          | 0            |
| Sum          |         -100 + 100 + 0 = 0 ✓                     |
```

### 2. Stock-Flow Integration

**Rule**: Change in stock = Time integral of associated flows

**Equation Generation**:
For column `j` representing stock `S_j`:
```
dS_j/dt = Σ_i (flow_ij)
```

Where `flow_ij` is the entry in row `i`, column `j`.

**Minsky Mechanism**: Tables are converted to ODEs automatically
- Parser traverses each column
- Sums all row entries symbolically
- Generates differential equation for stock dynamics

### 3. Multi-Sectoral Consistency (The "Wedge")

**Challenge**: One entity's asset must be another's liability.

**Minsky Solution**: "Wedge" feature identifies orphaned accounts
- Scans all Godley tables in model
- Finds assets without corresponding liability entries (and vice versa)
- Highlights missing accounts needed for cross-sector consistency

**Example**:
- Household has "Bank Deposits" (Asset)
- Bank must have "Deposits" (Liability)
- If Bank table missing "Deposits" column, wedge flags inconsistency

### 4. Accounting Identity Enforcement

**Fundamental Identity**: `Assets = Liabilities + Equity`

**Method**: `balanceEquity(int col)`
- Automatically inserts residual values into equity column
- Ensures identity holds at all times
- Prevents model specification errors

## Algorithm: Table-to-Equation Conversion

**Process**: Godley Table → System of ODEs

### Step 1: Parse Table Structure
```
Input: GodleyTable with m rows, n columns
Output: Set of stock variables {S_1, S_2, ..., S_n}
```

### Step 2: Generate Differential Equations
For each column `j` (representing stock `S_j`):
```python
def generate_ode(column_j):
    equation = f"dS_{j}/dt = "
    terms = []
    for row_i in range(1, num_rows):  # Skip header
        cell_value = table.cell(row_i, column_j)
        if cell_value != "":
            sign = "+" if not signConventionReversed(j) else "-"
            terms.append(f"{sign} ({cell_value})")
    equation += " ".join(terms)
    return equation
```

### Step 3: Symbolic Processing
- Replace cell contents with symbolic expressions
- Handle parameter references and function calls
- Apply sign convention reversals for liabilities/equity

### Step 4: Add to DAG
- Insert equations into Minsky's computation graph
- Create dependency edges between stocks and flows
- Enable numerical integration during simulation

### Example Conversion

**Godley Table** (Household Sector):
```
| Flow            | Deposits (Asset) | Net Worth (Equity) |
|-----------------|------------------|-------------------|
| Initial         | 100              | 100               |
| Wage Income     | +W               | +W                |
| Consumption     | -C               | -C                |
```

**Generated Equations**:
```
dDeposits/dt = +W - C
dNetWorth/dt = +W - C
```

With sign convention for equity applied.

## Standard SFC Matrices

SFC models use two primary matrix representations:

### 1. Balance Sheet Matrix

**Structure**: Sectors as columns, accounts as rows

**Example** (Godley & Lavoie 2007):
```
                 | Households | Firms | Banks | Government | Σ
-----------------+------------+-------+-------+------------+---
Cash             | +H_h       |       | -H_b  | +H_g       | 0
Deposits         | +M         |       | -M    |            | 0
Loans            |            | -L    | +L    |            | 0
Bonds            | +B_h       |       | +B_b  | -B         | 0
Equity           | +E         | -E    |       |            | 0
Capital (Real)   |            | +K    |       |            | +K
-----------------+------------+-------+-------+------------+---
Net Worth        | +V         | 0     | 0     | +NW_g      | +V + NW_g + K
```

**Properties**:
- Each row sums to zero (financial accounts) or to real value (physical accounts)
- Each column sums to sectoral net worth

### 2. Transaction Flow Matrix

**Structure**: Sectors as columns, flows as rows

**Example**:
```
                    | Households | Firms | Banks | Government | Σ
--------------------+------------+-------+-------+------------+---
Consumption         | -C         | +C    |       |            | 0
Investment          |            | -I    |       |            | -I
Wages               | +W         | -W    |       |            | 0
Taxes               | -T         |       |       | +T         | 0
Interest on Loans   |            | -r*L  | +r*L  |            | 0
Change in Deposits  | -ΔM        |       | +ΔM   |            | 0
--------------------+------------+-------+-------+------------+---
```

**Properties**:
- Each row sums to zero (pure financial flows) or to change in real stocks
- Captures all intersectoral transactions

### 3. Full Integration Matrix

**Combines**: Balance sheet + transaction flow
- Shows both stock positions and flow changes
- Reconciles opening stocks → flows → closing stocks
- Ensures: `Stock(t+1) = Stock(t) + Σ(flows)`

## UI Patterns and User Interaction

### Table Editing Interface

**Spreadsheet Paradigm**: Familiar Excel-like interface
- Click cells to edit
- Tab to move between cells
- Enter/Return to confirm

**Column Management**:
- `insertCol()` / `deleteCol()`: Add/remove accounts
- Each column assigned asset class via dropdown
- Header row contains stock variable names

**Row Management**:
- `insertRow()` / `deleteRow()`: Add/remove flows
- First column contains flow descriptions
- Auto-validation on row entry

### Real-Time Validation Feedback

**Visual Indicators**:
- ✓ Green checkmark: Row balances correctly
- ✗ Red cross: Row imbalance detected
- ⚠ Yellow warning: Missing cross-sector accounts (wedge)

**Error Messages**:
- "Row sum non-zero: Transaction incomplete"
- "Asset without liability: Check other sectors"
- "Equity imbalance: Accounting identity violated"

### Parameter Integration

**Dynamic Parameters**: Cell contents can reference:
- Constants: `100`, `0.05`
- Variables: `GDP`, `r` (interest rate)
- Expressions: `0.8 * GDP`, `r * Loans`

**Connection to Canvas**: Variables in table link to:
- Input widgets (sliders, constants)
- Other operations in flowchart
- Results from other Godley tables

## Implementation Complexity Assessment

### Core Algorithms

**Difficulty: Medium**

**Required Components**:
1. **2D Data Structure**: `Array<Array<string>>` or equivalent
2. **Parser**: Convert cell expressions to AST
3. **Symbolic Differentiator**: Generate dStock/dt equations
4. **Constraint Validator**: Check row sums, asset/liability matching
5. **Sign Convention Handler**: Apply accounting rules

### Validation Logic

**Difficulty: Medium-Low**

**Row Balance Check** (straightforward):
```javascript
function validateRow(row) {
    let sum = row.slice(1).reduce((acc, cell) => {
        return acc + parseFloat(evaluateExpression(cell));
    }, 0);
    return Math.abs(sum) < EPSILON;
}
```

**Cross-Sector Consistency** (more complex):
- Requires global model state
- Must track all tables and their accounts
- Match asset→liability pairs across sectors

### UI Implementation

**Difficulty: Medium**

**React Approach**:
- Component: `<GodleyTable>` with `<EditableCell>` children
- State management: Redux or Context for table data
- Validation hooks: Real-time checking on cell blur/change
- Styling: CSS Grid or library like react-data-grid

**Challenges**:
- Formula parsing and evaluation
- Real-time validation feedback
- Copy/paste support
- Undo/redo for table edits

### Equation Generation

**Difficulty: Medium-High**

**Symbolic Math Requirements**:
- Expression tree construction
- Symbolic addition/subtraction
- Variable substitution
- Simplification (optional but helpful)

**JavaScript Libraries**:
- `mathjs`: Symbolic computation
- `algebrite`: Computer algebra system
- Custom AST builder

## Replication Feasibility for MMT Repository

### High Feasibility Components

✅ **Table Data Structure**: Standard 2D array
✅ **Row Balance Validation**: Simple arithmetic check
✅ **UI Rendering**: React + CSS Grid
✅ **Basic Formula Parsing**: Use mathjs library

### Medium Feasibility Components

⚠️ **Symbolic ODE Generation**: Requires expression tree manipulation
⚠️ **Multi-Table Consistency**: Global state management
⚠️ **Sign Convention Logic**: Accounting rules complexity
⚠️ **Interactive Parameter Links**: Canvas integration needed

### Lower Priority / High Complexity

❌ **Full Symbolic Differentiation**: Overkill for most use cases
❌ **LaTeX Export**: Nice-to-have, not essential
❌ **Tensor Support**: Not needed for basic SFC models

## Recommended Implementation Approach

### Phase 1: Core Table (MVP)
1. React component with editable cells
2. Row/column add/delete
3. Simple expression evaluation (constants + variables)
4. Row balance validation

### Phase 2: Multi-Sector
1. Multiple table support
2. Asset/Liability pairing validation
3. Cross-sector consistency checks
4. Error highlighting

### Phase 3: Equation Integration
1. Generate dStock/dt equations
2. Integration with multi-period solver
3. Visual feedback on canvas
4. Parameter widgets connected to cells

### Phase 4: Advanced Features
1. Symbolic simplification
2. Export to other formats
3. Preset templates (3-sector model, etc.)
4. Guided model building wizard

## Key Insights for Implementation

### 1. Validation is Paramount
The enforced accounting constraints are what make Godley tables valuable. Without validation, it's just a spreadsheet.

### 2. Start Simple
Basic double-entry validation (row sums = 0) provides 80% of value with 20% of complexity.

### 3. Visual Feedback Critical
Users need immediate indication when they violate accounting rules. Red/green cells are essential.

### 4. Integration > Replication
Rather than full Minsky replication, focus on features that enhance existing multi-period dynamics work.

### 5. Web Advantage
React-based implementation could be simpler than Minsky's C++/Electron stack for certain use cases.

## Technical References

### Minsky Source Code
- [godleyTable.h](https://github.com/highperformancecoder/minsky/blob/master/model/godleyTable.h) - Core data structure
- [godleyTableWindow.h](https://github.com/highperformancecoder/minsky/blob/master/model/godleyTableWindow.h) - GUI components
- [Architecture.md](https://github.com/highperformancecoder/minsky/blob/master/Architecture.md) - System overview
- [minsky.cc](https://github.com/highperformancecoder/minsky/blob/master/model/minsky.cc) - Main model functions

### Academic Resources
- [Godley Tables Manual](https://minsky.sourceforge.io/manual/Ravel/node220.html)
- [Wikipedia: Stock-flow consistent model](https://en.wikipedia.org/wiki/Stock-flow_consistent_model)
- [Wikipedia: Sectoral balances](https://en.wikipedia.org/wiki/Sectoral_balances)
- [Wynne Godley and Sectoral Balance Equation](https://medium.com/@oscar.sr/wynne-godley-and-the-sectoral-balance-equation-a-formula-for-economic-clarity-cb7dd576bf0d)
- [Levy Economics Institute WP 891: Stock-flow Consistent Macroeconomic Models Survey](https://www.levyinstitute.org/pubs/wp_891.pdf)
- [sfc-models.net](https://sfc-models.net/) - SFC modeling resources
- [sfctools Python package](https://www.theoj.org/joss-papers/joss.04980/10.21105.joss.04980.pdf)

### Related Discussions
- [Minsky SourceForge Feature #20: SFC matrices export](https://sourceforge.net/p/minsky/features/20/)
- [Minsky Bug #58: Godley Table Double Entry Asset class](https://sourceforge.net/p/minsky/tickets/58/)
- [DIY Macroeconomic Model Simulation](https://macrosimulation.org/an_sfc_model)

## Next Steps (Subsequent Beads)

- **mmt-1nk.3**: GUI architecture evaluation (Electron vs web technologies)
- **mmt-1nk.4**: Technical requirements catalog (libraries, algorithms, solvers)
- **mmt-1nk.5**: Implementation approach recommendations with cost-benefit

---

**Bead Completion**: mmt-1nk.2 ✓
**Evidence**: Comprehensive analysis of Godley table implementation, data structures, algorithms, and validation mechanisms
**Verification**: Human review (mmt-1nk.8)
