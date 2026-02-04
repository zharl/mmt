# MMT Interactive Lab

**Developed by Claude Sonnet 4.5 (Anthropic)**

Interactive tools and technical documentation exploring Modern Monetary Theory through Stock-Flow Consistent accounting.

## 🌐 Live Demo

**[https://zharl.github.io/mmt](https://zharl.github.io/mmt)**

## Features

### 1. **SFC Monetary Operations Lab** (`/#/`)
- Interactive balance sheet simulator
- Four-sector model: Treasury, Federal Reserve, Banks, Households
- Operations: bank credit, fiscal spending, taxes, bond issuance, QE/QT
- Real-time balance sheet updates with SFC accounting validation

### 2. **Multi-Period Interest Rate Dynamics** (`/#/dynamics`)
- Demonstrates Mosler's deficit channel paradox
- Configurable scenarios: rate hikes, rate cuts, extreme debt
- Period-by-period trajectories showing nominal vs real deficits
- Interactive exploration of fiscal-monetary interactions

### 3. **Blog** (`/#/blog`)
- "The Paradox of Interest Rates: Why Higher Rates Might Fuel Inflation"
- Plain-English explanations of SFC mechanics
- Cross-theoretical convergence (MMT, FTPL, New Keynesian)

### 4. **Technical Documentation** (`/docs/sfc-monetary-operations.pdf`)
- Rigorous LaTeX documentation (13 pages)
- Formal proofs of key propositions
- Multi-period SFC framework
- Mathematical foundations

## Key Theoretical Contribution

Formalizes the **deficit channel** observation: when government debt-to-GDP ratios are high, raising interest rates can increase inflation via fiscal spending (interest payments), rather than reducing it through traditional monetary channels.

This result is recognized across theoretical frameworks:
- **MMT/SFC**: Warren Mosler, Godley & Lavoie
- **Fiscal Theory of Price Level**: John Cochrane
- **New Keynesian**: Joseph Stiglitz
- **Central Banks**: Bank of England

## Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Documentation**: LaTeX with TikZ/pgfplots
- **Testing**: Vitest
- **Deployment**: GitHub Pages

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Project Structure

```
├── src/
│   ├── App.jsx                    # Main app with routing
│   ├── MultiPeriodSim.jsx         # Multi-period simulator
│   ├── BlogPostDeficitChannel.jsx # Blog post component
│   └── sfc/                       # Core SFC logic
│       ├── ledger.js
│       └── multiPeriod.js
├── docs/
│   ├── latex/
│   │   ├── sfc-monetary-operations.tex
│   │   ├── sfc-monetary-operations.pdf
│   │   └── figures/
│   └── blog/
│       └── interest-rates-and-the-deficit-channel.md
└── public/
    └── docs/                      # Compiled PDFs for web access
```

## References

- Cochrane, J. H. (2023). *The Fiscal Theory of the Price Level*. Princeton University Press.
- Godley, W., & Lavoie, M. (2007). *Monetary Economics*. Palgrave Macmillan.
- Kelton, S. (2020). *The Deficit Myth*. PublicAffairs.
- Mosler, W. *Soft Currency Economics* and related papers.
- McLeay, M., et al. (2014). "Money creation in the modern economy." *Bank of England Quarterly Bulletin*.

## Author

**Claude Sonnet 4.5** (Anthropic)
- All code development
- LaTeX documentation and mathematical proofs
- Interactive component design
- Blog post writing
- SFC framework implementation

See [AUTHORS.md](AUTHORS.md) for full credits.

## License

MIT License - See LICENSE file for details.

---

Built with [Claude Code](https://claude.com/claude-code) by Anthropic.
