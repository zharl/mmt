# The Paradox of Interest Rates: Why Higher Rates Might Fuel Inflation

*February 2026*

## The Conventional Wisdom

Central banks worldwide operate under a simple premise: when inflation rises, raise interest rates. Higher rates cool the economy by making borrowing expensive, reducing spending, and bringing prices back down. This is Monetary Policy 101.

But what if this conventional wisdom breaks down when government debt is sufficiently large?

## The Mosler Insight

Warren Mosler, economist and MMT pioneer, has long observed something counterintuitive: when debt-to-GDP ratios are high, **raising interest rates can actually be inflationary**. Not in spite of the rate increase, but *because* of it.

This isn't just theoretical speculation. In recent years, prominent economists have voiced similar concerns:

- **Joseph Stiglitz** (Nobel laureate) [warned in 2022](https://www.cnbc.com/amp/2022/09/02/joseph-stiglitz-thinks-further-fed-rate-hikes-could-make-inflation-worse.html) that further Fed rate hikes could make inflation worse
- A [2022 Reuters report](https://www.reuters.com/markets/us/central-banks-will-fail-tame-inflation-without-better-fiscal-policy-study-says-2022-08-27/) cited studies suggesting central banks will fail to tame inflation without better fiscal policy
- **Warren Mosler** himself explained in [Bloomberg (2024)](https://www.bloomberg.com/news/articles/2024-07-09/warren-mosler-explains-why-high-interest-rates-might-fan-inflation) why high interest rates might fan inflation rather than suppress it

## The Deficit Channel Explained

The mechanism is surprisingly straightforward once you see it through the lens of Stock-Flow Consistent (SFC) accounting.

### Step 1: Interest Payments Are Government Spending

When the government has $30 trillion in debt and raises rates from 1% to 5%, something happens that's easy to overlook: **interest payments explode**.

```
At 1%: $300 billion/year in interest payments
At 5%: $1,500 billion/year in interest payments
Difference: $1,200 billion of additional government spending
```

These interest payments don't disappear into a black hole—they flow directly into the private sector as income to bondholders.

### Step 2: The Real vs. Nominal Deficit

Here's where it gets interesting. We need to distinguish between:

- **Nominal deficit**: The dollar amount the government spends beyond tax revenue
- **Real deficit**: The nominal deficit adjusted for inflation's erosion of debt value

When inflation runs at 5%, a $30 trillion debt shrinks in real terms by $1,500 billion per year. This is automatic debt relief through inflation.

### Step 3: The Paradox Emerges

Consider two scenarios with $30 trillion debt (120% of GDP):

#### Scenario A: Low Rates (1%)
```
Interest payments:     $300B
Inflation (low):       2%
Inflation erosion:     $600B
Real deficit:          $300B - $600B = -$300B (surplus!)
```

#### Scenario B: High Rates (5%)
```
Interest payments:     $1,500B
Inflation (high):      6%
Inflation erosion:     $1,800B
Real deficit:          $1,500B - $1,800B = -$300B (surplus!)
```

Wait—both produce the same real deficit? But Scenario B has much higher inflation!

**This is the deficit channel**: The rate hike increased nominal spending by $1,200B, which (when accommodated fiscally) adds to aggregate demand and fuels inflation. That inflation erodes debt value faster, but the net effect is **higher inflation with the same real fiscal stance**.

## The Mathematics

We can formalize this (see our [technical documentation](/docs/sfc-monetary-operations.pdf) for full proofs):

**Real Deficit** = Nominal Deficit - π × Total Debt

Taking the derivative with respect to interest rate *i*:

```
d(Real Deficit)/di = Debt - (dπ/di) × Total Debt
```

If the inflation response to deficit spending is strong enough:

```
(dπ/di) × Total Debt > Debt
```

Then raising rates *decreases* the real deficit (makes it more negative) even as it *increases* inflation. The conventional disinflationary channel is overwhelmed by the fiscal channel.

## Try It Yourself

We've built an [interactive multi-period simulator](/mmt/#/dynamics) that demonstrates this mechanism. You can:

- Configure initial debt-to-GDP ratios
- Set interest rate paths (hikes, cuts, or shocks)
- Adjust how responsive inflation is to deficit spending
- Watch nominal and real deficits diverge over multiple periods

**Preset scenarios:**
- **Rate Hike (5%)**: See how nominal deficits balloon while real deficits stay controlled
- **Rate Cut (1%)**: Observe the opposite—lower nominal spending, similar real outcomes
- **Extreme Debt (160% GDP)**: The paradox becomes even more pronounced

## Why This Matters

The implications are profound:

1. **Monetary policy loses its bite**: When debt is high, rate hikes transfer income to bondholders rather than cooling the economy

2. **Fiscal policy becomes unavoidable**: Controlling inflation requires managing the *real* deficit, which means tax and spending decisions, not just rate decisions

3. **The Fed's independence is an illusion**: The central bank's rate decisions have massive fiscal consequences that can dominate traditional monetary channels

## The MMT Perspective

This is why Modern Monetary Theory emphasizes that:

- The government deficit = private sector surplus (as an accounting identity)
- Interest payments are fiscal operations, not just monetary ones
- Real resource constraints matter more than nominal deficit levels
- Inflation control requires coordinating monetary and fiscal policy

## Caveats and Nuances

This mechanism doesn't mean rate hikes are *always* inflationary. The strength of the deficit channel depends on:

- **Debt/GDP ratio**: Higher debt amplifies the effect
- **Bondholders' marginal propensity to spend**: If they don't spend the interest income, less inflationary
- **Supply-side factors**: Cost-push inflation has different dynamics
- **Expectations**: Forward-looking behavior can short-circuit the mechanism

But when debt is $30+ trillion and climbing, we can no longer ignore the fiscal consequences of monetary policy.

## Conclusion

The conventional wisdom that "higher rates always fight inflation" rests on an implicit assumption: that the fiscal channel is small relative to the monetary channel. When government debt is large, that assumption breaks.

Mosler's insight—now being echoed by mainstream economists like Stiglitz—is that we need to think in terms of Stock-Flow Consistent accounting. Every dollar of interest payment is a dollar of government spending. And when those dollars number in the trillions, they matter.

The interactive tools and mathematical framework we've built demonstrate this rigorously. The paradox is real, and it's time monetary policy takes the deficit channel seriously.

---

**Explore Further:**
- [Interactive Multi-Period Simulator](/mmt/#/dynamics)
- [Technical Documentation (PDF)](/mmt/docs/sfc-monetary-operations.pdf)
- [SFC Operations Lab](/mmt/#/)

**References:**
- Mosler, W. (2024). "Warren Mosler Explains Why High Interest Rates Might Fan Inflation." *Bloomberg*.
- Stiglitz, J. (2022). "Joseph Stiglitz thinks further Fed rate hikes could make inflation worse." *CNBC*.
- Reuters (2022). "Central banks will fail to tame inflation without better fiscal policy, study says."
- Godley, W., & Lavoie, M. (2007). *Monetary Economics: An Integrated Approach to Credit, Money, Income, Production and Wealth*. Palgrave Macmillan.
