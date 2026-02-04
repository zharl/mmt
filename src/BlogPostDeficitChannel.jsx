import React from 'react';
import { TrendingUp, ExternalLink, BarChart3 } from 'lucide-react';

const SectionTitle = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-start gap-3">
    <div className="h-10 w-10 rounded-2xl bg-slate-900 text-amber-100 flex items-center justify-center shadow-lg shadow-slate-900/20">
      <Icon size={18} />
    </div>
    <div>
      <h2 className="font-display text-2xl text-slate-900">{title}</h2>
      {subtitle && <p className="text-sm text-slate-600 mt-1">{subtitle}</p>}
    </div>
  </div>
);

const Callout = ({ type = 'info', children }) => {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-900',
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-900'
  };

  return (
    <div className={`rounded-2xl border-2 p-4 ${styles[type]}`}>
      {children}
    </div>
  );
};

const CodeBlock = ({ children }) => (
  <pre className="rounded-xl bg-slate-900 p-4 text-xs text-amber-100 overflow-x-auto">
    <code>{children}</code>
  </pre>
);

export default function BlogPostDeficitChannel() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="card-surface">
        <h1 className="font-display text-4xl text-slate-900 mb-2">
          The Paradox of Interest Rates: Why Higher Rates Might Fuel Inflation
        </h1>
        <p className="text-sm text-slate-500">February 2026</p>
      </div>

      <div className="card-surface prose prose-slate max-w-none">
        <h2 className="font-display text-2xl text-slate-900 mb-4">The Conventional Wisdom</h2>
        <p className="text-slate-700 leading-relaxed">
          Central banks worldwide operate under a simple premise: when inflation rises, raise interest rates.
          Higher rates cool the economy by making borrowing expensive, reducing spending, and bringing prices back down.
          This is Monetary Policy 101.
        </p>
        <p className="text-slate-700 leading-relaxed">
          But what if this conventional wisdom breaks down when government debt is sufficiently large?
        </p>
      </div>

      <div className="card-surface">
        <SectionTitle
          icon={TrendingUp}
          title="The Mosler Insight"
        />
        <div className="mt-4 space-y-4 text-slate-700">
          <p className="leading-relaxed">
            Warren Mosler, economist and MMT pioneer, has long observed something counterintuitive: when debt-to-GDP
            ratios are high, <strong>raising interest rates can actually be inflationary</strong>. Not in spite of
            the rate increase, but <em>because</em> of it.
          </p>

          <p className="leading-relaxed">
            This isn't just theoretical speculation. In recent years, prominent economists have voiced similar concerns:
          </p>

          <ul className="space-y-2 ml-6 list-disc">
            <li>
              <a href="https://www.cnbc.com/amp/2022/09/02/joseph-stiglitz-thinks-further-fed-rate-hikes-could-make-inflation-worse.html"
                 target="_blank" rel="noopener noreferrer"
                 className="text-amber-600 hover:underline inline-flex items-center gap-1">
                Joseph Stiglitz (Nobel laureate) warned in 2022 <ExternalLink size={14} />
              </a> that further Fed rate hikes could make inflation worse
            </li>
            <li>
              <a href="https://www.reuters.com/markets/us/central-banks-will-fail-tame-inflation-without-better-fiscal-policy-study-says-2022-08-27/"
                 target="_blank" rel="noopener noreferrer"
                 className="text-amber-600 hover:underline inline-flex items-center gap-1">
                A 2022 Reuters report <ExternalLink size={14} />
              </a> cited studies suggesting central banks will fail to tame inflation without better fiscal policy
            </li>
            <li>
              <a href="https://www.bloomberg.com/news/articles/2024-07-09/warren-mosler-explains-why-high-interest-rates-might-fan-inflation"
                 target="_blank" rel="noopener noreferrer"
                 className="text-amber-600 hover:underline inline-flex items-center gap-1">
                Warren Mosler himself explained in Bloomberg (2024) <ExternalLink size={14} />
              </a> why high interest rates might fan inflation rather than suppress it
            </li>
          </ul>
        </div>
      </div>

      <div className="card-surface">
        <h2 className="font-display text-2xl text-slate-900 mb-4">The Deficit Channel Explained</h2>

        <div className="space-y-6 text-slate-700">
          <div>
            <h3 className="font-semibold text-lg text-slate-900 mb-2">Step 1: Interest Payments Are Government Spending</h3>
            <p className="leading-relaxed">
              When the government has $30 trillion in debt and raises rates from 1% to 5%, something happens
              that's easy to overlook: <strong>interest payments explode</strong>.
            </p>
          </div>

          <CodeBlock>{`At 1%: $300 billion/year in interest payments
At 5%: $1,500 billion/year in interest payments
Difference: $1,200 billion of additional government spending`}</CodeBlock>

          <p className="leading-relaxed">
            These interest payments don't disappear into a black hole—they flow directly into the private sector
            as income to bondholders.
          </p>

          <div>
            <h3 className="font-semibold text-lg text-slate-900 mb-2">Step 2: The Real vs. Nominal Deficit</h3>
            <p className="leading-relaxed">
              Here's where it gets interesting. We need to distinguish between:
            </p>
            <ul className="ml-6 list-disc space-y-1">
              <li><strong>Nominal deficit</strong>: The dollar amount the government spends beyond tax revenue</li>
              <li><strong>Real deficit</strong>: The nominal deficit adjusted for inflation's erosion of debt value</li>
            </ul>
            <p className="leading-relaxed mt-3">
              When inflation runs at 5%, a $30 trillion debt shrinks in real terms by $1,500 billion per year.
              This is automatic debt relief through inflation.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-slate-900 mb-2">Step 3: The Paradox Emerges</h3>
            <p className="leading-relaxed mb-3">
              Consider two scenarios with $30 trillion debt (120% of GDP):
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <Callout type="info">
                <h4 className="font-semibold mb-2">Scenario A: Low Rates (1%)</h4>
                <pre className="text-xs">
{`Interest payments:     $300B
Inflation (low):       2%
Inflation erosion:     $600B
Real deficit:          -$300B (surplus!)`}
                </pre>
              </Callout>

              <Callout type="warning">
                <h4 className="font-semibold mb-2">Scenario B: High Rates (5%)</h4>
                <pre className="text-xs">
{`Interest payments:     $1,500B
Inflation (high):      6%
Inflation erosion:     $1,800B
Real deficit:          -$300B (surplus!)`}
                </pre>
              </Callout>
            </div>

            <p className="leading-relaxed mt-4">
              Wait—both produce the same real deficit? But Scenario B has much higher inflation!
            </p>
            <Callout type="success">
              <p className="font-semibold">This is the deficit channel:</p>
              <p className="mt-2">
                The rate hike increased nominal spending by $1,200B, which (when accommodated fiscally) adds to
                aggregate demand and fuels inflation. That inflation erodes debt value faster, but the net effect
                is <strong>higher inflation with the same real fiscal stance</strong>.
              </p>
            </Callout>
          </div>
        </div>
      </div>

      <div className="card-surface">
        <h2 className="font-display text-2xl text-slate-900 mb-4">The Mathematics</h2>
        <p className="text-slate-700 leading-relaxed mb-4">
          We can formalize this (see our{' '}
          <a href={`${import.meta.env.BASE_URL || '/'}docs/sfc-monetary-operations.pdf`}
             target="_blank" rel="noopener noreferrer"
             className="text-amber-600 hover:underline">
            technical documentation
          </a>{' '}
          for full proofs):
        </p>

        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-3">
          <p className="text-sm text-slate-700">
            <strong>Real Deficit</strong> = Nominal Deficit − π × Total Debt
          </p>
          <p className="text-sm text-slate-700">
            Taking the derivative with respect to interest rate <em>i</em>:
          </p>
          <CodeBlock>{`d(Real Deficit)/di = Debt - (dπ/di) × Total Debt`}</CodeBlock>
          <p className="text-sm text-slate-700">
            If the inflation response to deficit spending is strong enough:
          </p>
          <CodeBlock>{`(dπ/di) × Total Debt > Debt`}</CodeBlock>
          <p className="text-sm text-slate-700">
            Then raising rates <em>decreases</em> the real deficit (makes it more negative) even as it{' '}
            <em>increases</em> inflation. The conventional disinflationary channel is overwhelmed by the fiscal channel.
          </p>
        </div>
      </div>

      <div className="card-surface bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 size={32} className="text-amber-600" />
          <div>
            <h2 className="font-display text-2xl text-slate-900">Try It Yourself</h2>
            <p className="text-sm text-slate-600">Interactive multi-period simulator</p>
          </div>
        </div>

        <p className="text-slate-700 leading-relaxed mb-4">
          We've built an interactive multi-period simulator that demonstrates this mechanism. You can:
        </p>

        <ul className="ml-6 list-disc space-y-1 text-slate-700 mb-4">
          <li>Configure initial debt-to-GDP ratios</li>
          <li>Set interest rate paths (hikes, cuts, or shocks)</li>
          <li>Adjust how responsive inflation is to deficit spending</li>
          <li>Watch nominal and real deficits diverge over multiple periods</li>
        </ul>

        <a
          href="#/dynamics"
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-amber-100 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          <BarChart3 size={18} />
          Launch Simulator
        </a>

        <div className="mt-4 pt-4 border-t border-amber-200">
          <p className="text-sm font-semibold text-slate-900 mb-2">Preset scenarios:</p>
          <ul className="ml-6 list-disc space-y-1 text-sm text-slate-700">
            <li><strong>Rate Hike (5%)</strong>: See how nominal deficits balloon while real deficits stay controlled</li>
            <li><strong>Rate Cut (1%)</strong>: Observe the opposite—lower nominal spending, similar real outcomes</li>
            <li><strong>Extreme Debt (160% GDP)</strong>: The paradox becomes even more pronounced</li>
          </ul>
        </div>
      </div>

      <div className="card-surface">
        <h2 className="font-display text-2xl text-slate-900 mb-4">Why This Matters</h2>
        <div className="space-y-4 text-slate-700">
          <p className="leading-relaxed">The implications are profound:</p>
          <ol className="ml-6 list-decimal space-y-2">
            <li>
              <strong>Monetary policy loses its bite</strong>: When debt is high, rate hikes transfer income
              to bondholders rather than cooling the economy
            </li>
            <li>
              <strong>Fiscal policy becomes unavoidable</strong>: Controlling inflation requires managing the{' '}
              <em>real</em> deficit, which means tax and spending decisions, not just rate decisions
            </li>
            <li>
              <strong>The Fed's independence is an illusion</strong>: The central bank's rate decisions have
              massive fiscal consequences that can dominate traditional monetary channels
            </li>
          </ol>
        </div>
      </div>

      <div className="card-surface">
        <h2 className="font-display text-2xl text-slate-900 mb-4">The MMT Perspective</h2>
        <p className="text-slate-700 leading-relaxed mb-3">
          This is why Modern Monetary Theory emphasizes that:
        </p>
        <ul className="ml-6 list-disc space-y-2 text-slate-700">
          <li>The government deficit = private sector surplus (as an accounting identity)</li>
          <li>Interest payments are fiscal operations, not just monetary ones</li>
          <li>Real resource constraints matter more than nominal deficit levels</li>
          <li>Inflation control requires coordinating monetary and fiscal policy</li>
        </ul>

        <Callout type="info">
          <p className="text-sm mb-2">
            <strong>Note:</strong> The accounting principles underlying this analysis aren't just MMT theory—they're
            acknowledged by mainstream institutions.
          </p>
          <p className="text-sm">
            The Bank of England's{' '}
            <a href="https://www.bankofengland.co.uk/-/media/boe/files/quarterly-bulletin/2014/money-creation-in-the-modern-economy.pdf"
               target="_blank" rel="noopener noreferrer"
               className="text-blue-700 hover:underline inline-flex items-center gap-1">
              2014 Quarterly Bulletin <ExternalLink size={12} />
            </a>{' '}
            explicitly confirmed that banks create deposits when they lend, not the other way around—validating
            the endogenous money view central to Stock-Flow Consistent accounting.
          </p>
        </Callout>
      </div>

      <div className="card-surface">
        <h2 className="font-display text-2xl text-slate-900 mb-4">Caveats and Nuances</h2>
        <p className="text-slate-700 leading-relaxed mb-3">
          This mechanism doesn't mean rate hikes are <em>always</em> inflationary.
          The strength of the deficit channel depends on:
        </p>
        <ul className="ml-6 list-disc space-y-2 text-slate-700">
          <li><strong>Debt/GDP ratio</strong>: Higher debt amplifies the effect</li>
          <li><strong>Bondholders' marginal propensity to spend</strong>: If they don't spend the interest income, less inflationary</li>
          <li><strong>Supply-side factors</strong>: Cost-push inflation has different dynamics</li>
          <li><strong>Expectations</strong>: Forward-looking behavior can short-circuit the mechanism</li>
        </ul>
        <p className="text-slate-700 leading-relaxed mt-4">
          But when debt is $30+ trillion and climbing, we can no longer ignore the fiscal consequences of monetary policy.
        </p>
      </div>

      <div className="card-surface">
        <h2 className="font-display text-2xl text-slate-900 mb-4">Conclusion</h2>
        <p className="text-slate-700 leading-relaxed mb-4">
          The conventional wisdom that "higher rates always fight inflation" rests on an implicit assumption:
          that the fiscal channel is small relative to the monetary channel. When government debt is large,
          that assumption breaks.
        </p>
        <p className="text-slate-700 leading-relaxed mb-4">
          Mosler's insight—now being echoed by mainstream economists like Stiglitz—is that we need to think
          in terms of Stock-Flow Consistent accounting. Every dollar of interest payment is a dollar of
          government spending. And when those dollars number in the trillions, they matter.
        </p>
        <p className="text-slate-700 leading-relaxed">
          The interactive tools and mathematical framework we've built demonstrate this rigorously.
          The paradox is real, and it's time monetary policy takes the deficit channel seriously.
        </p>
      </div>

      <div className="card-surface bg-slate-50">
        <h3 className="font-semibold text-slate-900 mb-3">Explore Further</h3>
        <div className="space-y-2">
          <a href="#/dynamics" className="block text-amber-600 hover:underline">
            → Interactive Multi-Period Simulator
          </a>
          <a href={`${import.meta.env.BASE_URL || '/'}docs/sfc-monetary-operations.pdf`}
             target="_blank" rel="noopener noreferrer"
             className="block text-amber-600 hover:underline">
            → Technical Documentation (PDF)
          </a>
          <a href="#/" className="block text-amber-600 hover:underline">
            → SFC Operations Lab
          </a>
        </div>
      </div>

      <div className="card-surface text-xs text-slate-600">
        <h4 className="font-semibold text-slate-700 mb-2">References</h4>
        <ul className="space-y-1">
          <li>Mosler, W. (2024). "Warren Mosler Explains Why High Interest Rates Might Fan Inflation." <em>Bloomberg</em>.</li>
          <li>Stiglitz, J. (2022). "Joseph Stiglitz thinks further Fed rate hikes could make inflation worse." <em>CNBC</em>.</li>
          <li>Reuters (2022). "Central banks will fail to tame inflation without better fiscal policy, study says."</li>
          <li>McLeay, M., Radia, A., & Thomas, R. (2014). "Money creation in the modern economy." <em>Bank of England Quarterly Bulletin</em>, Q1 2014.</li>
          <li>Godley, W., & Lavoie, M. (2007). <em>Monetary Economics: An Integrated Approach to Credit, Money, Income, Production and Wealth</em>. Palgrave Macmillan.</li>
        </ul>
      </div>
    </div>
  );
}
