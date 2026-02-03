import React, { useState } from 'react';
import { TrendingUp, Play, RotateCcw, Activity } from 'lucide-react';

const formatBillions = (value) => {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs >= 1000) {
    return `${sign}$${(abs / 1000).toFixed(2)}T`;
  }
  return `${sign}$${abs.toFixed(0)}B`;
};

const formatPercent = (value) => `${(value * 100).toFixed(1)}%`;

const SectionTitle = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-start gap-3">
    <div className="h-10 w-10 rounded-2xl bg-slate-900 text-amber-100 flex items-center justify-center shadow-lg shadow-slate-900/20">
      <Icon size={18} />
    </div>
    <div>
      <h2 className="font-display text-xl text-slate-900">{title}</h2>
      {subtitle && <p className="text-xs text-slate-600 mt-1">{subtitle}</p>}
    </div>
  </div>
);

const NumberField = ({ label, value, onChange, min, max, step = 1, suffix = '', hint }) => (
  <label className="space-y-2">
    <span className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">{label}</span>
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
      />
      <span className="text-xs font-semibold text-slate-500">{suffix}</span>
    </div>
    {hint && <span className="text-xs text-slate-500">{hint}</span>}
  </label>
);

const ScenarioButton = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
      active
        ? 'bg-slate-900 text-amber-100 shadow-lg'
        : 'border border-slate-200 bg-white/70 text-slate-700 hover:bg-white'
    }`}
  >
    {label}
  </button>
);

export default function MultiPeriodSim() {
  const [config, setConfig] = useState({
    numPeriods: 10,
    initialGdp: 25000,
    initialDebt: 30000,
    initialReserves: 3000,
    initialBondsHh: 20000,
    primaryBalance: 0,
    interestRate: 0.05,
    inflationElasticity: 0.5
  });

  const [scenario, setScenario] = useState('hike');
  const [simResults, setSimResults] = useState(null);

  const runSimulation = () => {
    const { numPeriods, initialGdp, initialDebt, initialReserves, initialBondsHh, primaryBalance, interestRate, inflationElasticity } = config;

    const results = [];
    let R = initialReserves;
    let Bh = initialBondsHh;
    let Bf = initialDebt - R - Bh;
    let nomGdp = initialGdp;

    for (let t = 0; t <= numPeriods; t++) {
      const totalDebt = R + Bh + Bf;
      const debtGdpRatio = totalDebt / nomGdp;

      // Interest payments
      const interestPayments = interestRate * (R + Bh);

      // Nominal deficit = primary balance + interest
      const nominalDeficit = primaryBalance + interestPayments;

      // Inflation depends on nominal deficit (simple linear model)
      const inflation = Math.max(0.01, inflationElasticity * (nominalDeficit / nomGdp));

      // Real deficit = nominal deficit - inflation erosion of debt
      const realDeficit = nominalDeficit - inflation * totalDebt;

      // Update stocks
      R += nominalDeficit;
      nomGdp *= (1 + inflation);

      results.push({
        period: t,
        R,
        Bh,
        Bf,
        totalDebt,
        nomGdp,
        debtGdpRatio,
        interestPayments,
        nominalDeficit,
        inflation,
        realDeficit
      });
    }

    setSimResults(results);
  };

  const applyScenario = (scenarioName) => {
    setScenario(scenarioName);
    if (scenarioName === 'hike') {
      setConfig(c => ({ ...c, interestRate: 0.05, inflationElasticity: 0.5 }));
    } else if (scenarioName === 'cut') {
      setConfig(c => ({ ...c, interestRate: 0.01, inflationElasticity: 0.5 }));
    } else if (scenarioName === 'extreme') {
      setConfig(c => ({ ...c, interestRate: 0.07, inflationElasticity: 0.6, initialDebt: 40000 }));
    }
  };

  const reset = () => {
    setConfig({
      numPeriods: 10,
      initialGdp: 25000,
      initialDebt: 30000,
      initialReserves: 3000,
      initialBondsHh: 20000,
      primaryBalance: 0,
      interestRate: 0.05,
      inflationElasticity: 0.5
    });
    setSimResults(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="card-surface">
        <SectionTitle
          icon={TrendingUp}
          title="Multi-Period Interest Rate Dynamics"
          subtitle="Mosler's deficit channel: When debt/GDP is high, rate hikes can be inflationary"
        />
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">The Paradox:</p>
          <p className="mt-2">
            When government debt is large relative to GDP, raising interest rates increases the nominal fiscal deficit
            (via higher interest payments). If this spending is accommodated, it can <em>increase</em> inflation rather than
            reduce it. Meanwhile, the inflation erodes real debt value faster than the nominal deficit grows, producing a
            <em>lower</em> real deficit.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card-surface">
          <SectionTitle icon={Activity} title="Scenario Presets" />
          <div className="mt-4 flex flex-wrap gap-3">
            <ScenarioButton label="Rate Hike (5%)" active={scenario === 'hike'} onClick={() => applyScenario('hike')} />
            <ScenarioButton label="Rate Cut (1%)" active={scenario === 'cut'} onClick={() => applyScenario('cut')} />
            <ScenarioButton label="Extreme Debt" active={scenario === 'extreme'} onClick={() => applyScenario('extreme')} />
          </div>
        </div>

        <div className="card-surface">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Controls</h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={runSimulation}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-lg transition hover:-translate-y-0.5"
              >
                <Play size={14} />
                Run
              </button>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 transition hover:bg-slate-50"
              >
                <RotateCcw size={14} />
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card-surface">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Initial Conditions</h3>
          <div className="space-y-4">
            <NumberField
              label="Periods"
              value={config.numPeriods}
              onChange={(v) => setConfig(c => ({ ...c, numPeriods: v }))}
              min={5}
              max={20}
              step={1}
            />
            <NumberField
              label="Initial GDP"
              value={config.initialGdp}
              onChange={(v) => setConfig(c => ({ ...c, initialGdp: v }))}
              min={10000}
              max={50000}
              step={1000}
              suffix="B"
            />
            <NumberField
              label="Initial Debt"
              value={config.initialDebt}
              onChange={(v) => setConfig(c => ({ ...c, initialDebt: v }))}
              min={10000}
              max={60000}
              step={1000}
              suffix="B"
              hint={`Debt/GDP: ${((config.initialDebt / config.initialGdp) * 100).toFixed(0)}%`}
            />
          </div>
        </div>

        <div className="card-surface">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Policy Parameters</h3>
          <div className="space-y-4">
            <NumberField
              label="Interest Rate"
              value={config.interestRate}
              onChange={(v) => setConfig(c => ({ ...c, interestRate: v }))}
              min={0}
              max={0.10}
              step={0.005}
              hint={formatPercent(config.interestRate)}
            />
            <NumberField
              label="Primary Balance"
              value={config.primaryBalance}
              onChange={(v) => setConfig(c => ({ ...c, primaryBalance: v }))}
              min={-1000}
              max={1000}
              step={50}
              suffix="B"
              hint="G - T (excluding interest)"
            />
            <NumberField
              label="Inflation Elasticity"
              value={config.inflationElasticity}
              onChange={(v) => setConfig(c => ({ ...c, inflationElasticity: v }))}
              min={0.1}
              max={1.0}
              step={0.1}
              hint="How deficit affects inflation"
            />
          </div>
        </div>

        <div className="card-surface">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Debt Composition</h3>
          <div className="space-y-4">
            <NumberField
              label="Reserves"
              value={config.initialReserves}
              onChange={(v) => setConfig(c => ({ ...c, initialReserves: v }))}
              min={0}
              max={20000}
              step={500}
              suffix="B"
            />
            <NumberField
              label="Bonds (Households)"
              value={config.initialBondsHh}
              onChange={(v) => setConfig(c => ({ ...c, initialBondsHh: v }))}
              min={0}
              max={40000}
              step={1000}
              suffix="B"
            />
            <div className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2">
              <p className="text-xs text-slate-500">Bonds (Fed)</p>
              <p className="text-sm font-semibold text-slate-900">
                {formatBillions(config.initialDebt - config.initialReserves - config.initialBondsHh)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {simResults && (
        <div className="card-surface">
          <SectionTitle icon={TrendingUp} title="Simulation Results" subtitle="Period-by-period trajectories" />

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Period</th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-700">Interest</th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-700">Nom. Deficit</th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-700">Inflation</th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-700">Real Deficit</th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-700">Debt/GDP</th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-700">Nom. GDP</th>
                </tr>
              </thead>
              <tbody>
                {simResults.map((row) => (
                  <tr key={row.period} className="border-b border-slate-100 hover:bg-white/50">
                    <td className="px-3 py-2 font-semibold text-slate-900">{row.period}</td>
                    <td className="px-3 py-2 text-right text-slate-600">{formatBillions(row.interestPayments)}</td>
                    <td className="px-3 py-2 text-right font-semibold text-rose-600">{formatBillions(row.nominalDeficit)}</td>
                    <td className="px-3 py-2 text-right text-amber-600">{formatPercent(row.inflation)}</td>
                    <td className={`px-3 py-2 text-right font-semibold ${row.realDeficit < 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {formatBillions(row.realDeficit)}
                    </td>
                    <td className="px-3 py-2 text-right text-slate-600">{formatPercent(row.debtGdpRatio)}</td>
                    <td className="px-3 py-2 text-right text-slate-600">{formatBillions(row.nomGdp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Final Nominal Deficit</p>
              <p className="mt-2 text-2xl font-bold text-rose-600">
                {formatBillions(simResults[simResults.length - 1].nominalDeficit)}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Final Real Deficit</p>
              <p className={`mt-2 text-2xl font-bold ${simResults[simResults.length - 1].realDeficit < 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {formatBillions(simResults[simResults.length - 1].realDeficit)}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Final Inflation</p>
              <p className="mt-2 text-2xl font-bold text-amber-600">
                {formatPercent(simResults[simResults.length - 1].inflation)}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-slate-700">
            <p className="font-semibold text-emerald-900">Key Insight:</p>
            <p className="mt-2">
              Notice how the nominal deficit is {formatBillions(simResults[simResults.length - 1].nominalDeficit)}
              {' '}but the real deficit is {formatBillions(simResults[simResults.length - 1].realDeficit)}.
              The {formatPercent(simResults[simResults.length - 1].inflation)} inflation erodes the real value of debt
              faster than interest payments add to it. This is Mosler's deficit channel in action.
            </p>
          </div>
        </div>
      )}

      <div className="card-surface">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">References</h3>
        <div className="space-y-2 text-xs text-slate-600">
          <p>
            <a href="https://www.bloomberg.com/news/articles/2024-07-09/warren-mosler-explains-why-high-interest-rates-might-fan-inflation"
               className="text-amber-600 hover:underline" target="_blank" rel="noopener noreferrer">
              Warren Mosler Explains Why High Interest Rates Might Fan Inflation (Bloomberg, 2024)
            </a>
          </p>
          <p>
            <a href="https://www.cnbc.com/amp/2022/09/02/joseph-stiglitz-thinks-further-fed-rate-hikes-could-make-inflation-worse.html"
               className="text-amber-600 hover:underline" target="_blank" rel="noopener noreferrer">
              Joseph Stiglitz thinks further Fed rate hikes could make inflation worse (CNBC, 2022)
            </a>
          </p>
          <p>
            <a href="https://www.reuters.com/markets/us/central-banks-will-fail-tame-inflation-without-better-fiscal-policy-study-says-2022-08-27/"
               className="text-amber-600 hover:underline" target="_blank" rel="noopener noreferrer">
              Central banks will fail to tame inflation without better fiscal policy (Reuters, 2022)
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
