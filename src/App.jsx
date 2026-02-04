import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import {
  Landmark,
  Banknote,
  Building2,
  Users,
  ArrowLeftRight,
  Scale,
  Radar,
  ShieldCheck,
  RefreshCw,
  Activity,
  CircleDollarSign,
  BadgeDollarSign,
  BookOpen,
  FileText,
  Home,
  TrendingUp
} from 'lucide-react';
import MultiPeriodSim from './MultiPeriodSim';
import {
  DEFAULT_TGA_TARGET,
  applyBankCredit as applyBankCreditOp,
  applyBondIssuance as applyBondIssuanceOp,
  applyFiscal as applyFiscalOp,
  applyQeSwap as applyQeSwapOp,
  applyQtSwap as applyQtSwapOp,
  computeDerived,
  previewFiscal
} from './sfc/ledger';

const INITIAL_STOCKS = {
  deposits: 4000,
  loans: 3500,
  reserves: 800,
  bondsHouseholds: 2600,
  bondsCb: 500,
  tga: 200
};

const TGA_TARGET = DEFAULT_TGA_TARGET;
const BASE_URL = import.meta.env.BASE_URL || '/';
const TECHNICAL_PDF_URL = `${BASE_URL}docs/sfc-monetary-operations.pdf`;
const TECHNICAL_TEX_URL = `${BASE_URL}docs/sfc-monetary-operations.tex`;

const formatBillions = (value) => {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs >= 1000) {
    return `${sign}$${(abs / 1000).toFixed(2)}T`;
  }
  return `${sign}$${abs.toFixed(0)}B`;
};

const formatSigned = (value) => (value >= 0 ? `+${formatBillions(value)}` : formatBillions(value));

const normalizeHashPath = (hash) => {
  const raw = (hash || '').replace(/^#/, '');
  if (!raw) return '/';
  return raw.startsWith('/') ? raw : `/${raw}`;
};

const useHashPath = () => {
  const [path, setPath] = useState(() => normalizeHashPath(window.location.hash));

  useEffect(() => {
    const onChange = () => setPath(normalizeHashPath(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return path;
};

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

const NumberField = ({ label, value, onChange, min, max, step = 10, suffix = 'B', hint }) => (
  <label className="space-y-2">
    <span className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">{label}</span>
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(parseFloat(event.target.value) || 0)}
        className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
      />
      <span className="text-xs font-semibold text-slate-500">{suffix}</span>
    </div>
    {hint && <span className="text-xs text-slate-500">{hint}</span>}
  </label>
);

const ControlCard = ({ title, icon: Icon, subtitle, children, actionLabel, onAction }) => (
  <div className="card-surface">
    <div className="flex items-center justify-between gap-4">
      <SectionTitle icon={Icon} title={title} subtitle={subtitle} />
      <button
        type="button"
        onClick={onAction}
        className="rounded-full border border-slate-200 bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-100 shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:shadow-xl"
      >
        {actionLabel}
      </button>
    </div>
    <div className="mt-5 grid gap-4">
      {children}
    </div>
  </div>
);

const BalanceSheetCard = ({ title, icon: Icon, tone, assets, liabilities, equityLabel, equityValue }) => {
  const assetsTotal = assets.reduce((sum, item) => sum + item.value, 0);
  const liabilitiesTotal = liabilities.reduce((sum, item) => sum + item.value, 0);
  const rightTotal = liabilitiesTotal + equityValue;
  const balanced = Math.abs(assetsTotal - rightTotal) < 0.01;
  const equityAbs = Math.abs(equityValue);
  const leverage = equityAbs > 0 ? assetsTotal / equityAbs : null;
  const equityRatio = assetsTotal > 0 ? equityValue / assetsTotal : null;

  return (
    <div className="card-surface flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className={`h-10 w-10 rounded-2xl ${tone} text-white flex items-center justify-center shadow-lg shadow-slate-900/10`}>
          <Icon size={18} />
        </div>
        <span className={`text-xs uppercase tracking-[0.25em] font-semibold ${balanced ? 'text-emerald-600' : 'text-rose-600'}`}>
          {balanced ? 'Balanced' : 'Check'}
        </span>
      </div>
      <div>
        <h3 className="font-display text-lg text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500 mt-1">Double-entry snapshot</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Assets</p>
          {assets.map((item) => (
            <div key={item.label} className="flex items-center justify-between text-sm">
              <span className="text-slate-600">{item.label}</span>
              <span className="font-semibold text-slate-900">{formatBillions(item.value)}</span>
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-sm font-semibold text-slate-900">
            <span>Total</span>
            <span>{formatBillions(assetsTotal)}</span>
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Liabilities</p>
          {liabilities.map((item) => (
            <div key={item.label} className="flex items-center justify-between text-sm">
              <span className="text-slate-600">{item.label}</span>
              <span className="font-semibold text-slate-900">{formatBillions(item.value)}</span>
            </div>
          ))}
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">{equityLabel}</span>
            <span className={`font-semibold ${equityValue >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {formatBillions(equityValue)}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-sm font-semibold text-slate-900">
            <span>Total</span>
            <span>{formatBillions(rightTotal)}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2">
          <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">Leverage</p>
          <p className="text-sm font-semibold text-slate-900">
            {leverage === null ? 'n/a' : `${leverage.toFixed(2)}x`}
          </p>
          <p className="text-[10px] text-slate-500">Assets / |Equity|</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2">
          <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">Equity Ratio</p>
          <p className={`text-sm font-semibold ${equityRatio >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {equityRatio === null ? 'n/a' : `${(equityRatio * 100).toFixed(1)}%`}
          </p>
          <p className="text-[10px] text-slate-500">Equity / Assets</p>
        </div>
      </div>
    </div>
  );
};

function SFCMonetaryLab() {
  const [stocks, setStocks] = useState(INITIAL_STOCKS);
  const [inputs, setInputs] = useState({
    bankCredit: 200,
    fiscalSpend: 250,
    taxes: 160,
    bondIssuance: 120,
    qeSwap: 100
  });
  const [lastAction, setLastAction] = useState('Ready. Post a flow to update all four balance sheets.');

  const maxBondIssuance = Math.min(inputs.bondIssuance, stocks.deposits, stocks.reserves);
  const maxQeSwap = Math.min(inputs.qeSwap, stocks.bondsHouseholds);
  const maxQtSwap = Math.min(inputs.qeSwap, stocks.bondsCb, stocks.deposits, stocks.reserves);

  const fiscalPreview = useMemo(() => {
    return previewFiscal({
      stocks,
      fiscalSpend: inputs.fiscalSpend,
      taxes: inputs.taxes,
      tgaTarget: TGA_TARGET,
    });
  }, [stocks, inputs]);

  const derived = useMemo(() => {
    return computeDerived(stocks);
  }, [stocks]);

  const applyBankCredit = () => {
    const { stocks: nextStocks, deltaApplied } = applyBankCreditOp(stocks, inputs.bankCredit);
    setStocks(nextStocks);
    setLastAction(`Horizontal money: net bank credit ${formatSigned(deltaApplied)} posted.`);
  };

  const applyFiscal = () => {
    const { stocks: nextStocks, taxApplied, autoIssue, autoRedeem } = applyFiscalOp(
      stocks,
      { fiscalSpend: inputs.fiscalSpend, taxes: inputs.taxes },
      { tgaTarget: TGA_TARGET }
    );
    setStocks(nextStocks);
    const autoNote = autoIssue > 0
      ? ` Auto-issue ${formatBillions(autoIssue)} to target TGA.`
      : autoRedeem > 0
        ? ` Auto-redeem ${formatBillions(autoRedeem)} to target TGA.`
        : ' TGA already at target.';
    setLastAction(`Vertical money: spending ${formatBillions(inputs.fiscalSpend)} | taxes ${formatBillions(taxApplied)}.${autoNote}`);
  };

  const applyBondIssuance = () => {
    const { stocks: nextStocks, amountApplied } = applyBondIssuanceOp(stocks, inputs.bondIssuance);
    setStocks(nextStocks);
    setLastAction(`Bond immunization: reserves swapped into bonds ${formatBillions(amountApplied)}.`);
  };

  const applyQeSwap = () => {
    const { stocks: nextStocks, amountApplied } = applyQeSwapOp(stocks, inputs.qeSwap);
    setStocks(nextStocks);
    setLastAction(`QE asset swap: bonds swapped into reserves ${formatBillions(amountApplied)}.`);
  };

  const applyQtSwap = () => {
    const { stocks: nextStocks, amountApplied } = applyQtSwapOp(stocks, inputs.qeSwap);
    setStocks(nextStocks);
    setLastAction(`QT asset swap: reserves swapped into bonds ${formatBillions(amountApplied)}.`);
  };

  const resetAll = () => {
    setStocks(INITIAL_STOCKS);
    setInputs({
      bankCredit: 200,
      fiscalSpend: 250,
      taxes: 160,
      bondIssuance: 120,
      qeSwap: 100
    });
    setLastAction('Reset to the baseline SFC positions.');
  };

  return (
    <>
      <header className="flex flex-col gap-4">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Scale: $1,000B = $1T</p>
        <div className="flex flex-col gap-3">
            <h1 className="font-display text-3xl md:text-4xl text-slate-900">
              Refuting Loanable Funds with Stock-Flow Consistent Balance Sheets
            </h1>
            <p className="max-w-3xl text-sm text-slate-600">
              Interactive macro ledger inspired by Wynne Godley, Warren Mosler, and Steve Keen. Every operation
              posts double-entry updates to Treasury, the Federal Reserve, banks, and households
              balance sheets in real time.
            </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="stat-chip">
              <CircleDollarSign size={16} />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Private NFW</p>
                <p className="text-lg font-semibold text-slate-900">{formatBillions(derived.privateNfw)}</p>
              </div>
            </div>
            <div className="stat-chip">
              <Building2 size={16} />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Bank Equity</p>
                <p className="text-lg font-semibold text-slate-900">{formatBillions(derived.bankEquity)}</p>
              </div>
            </div>
            <div className="stat-chip">
              <Users size={16} />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Household Net Worth</p>
                <p className="text-lg font-semibold text-slate-900">{formatBillions(derived.householdNetWorth)}</p>
              </div>
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-4 flex flex-col gap-6">
          <div className="card-surface">
            <SectionTitle icon={Radar} title="Transaction Console" subtitle="Post flows in $B and observe the balance sheets." />
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-900 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-amber-100">
              <span>Last Entry</span>
              <button onClick={resetAll} className="flex items-center gap-2 rounded-full bg-amber-100/10 px-3 py-1 text-[10px] font-semibold text-amber-100">
                <RefreshCw size={12} />
                Reset
              </button>
            </div>
            <p className="mt-3 text-sm text-slate-600">{lastAction}</p>
          </div>

            <ControlCard
              title="Horizontal Money"
              subtitle="Endogenous bank lending creates matching deposits."
              icon={Banknote}
              actionLabel="Post Loan"
              onAction={applyBankCredit}
            >
              <NumberField
                label="Net Bank Credit (Loan - Repayment)"
                value={inputs.bankCredit}
                min={-500}
                max={500}
                step={10}
                onChange={(value) => setInputs((prev) => ({ ...prev, bankCredit: value }))}
                hint="Positive adds loans + deposits. Negative retires both."
              />
            </ControlCard>

            <ControlCard
              title="Vertical Money"
              subtitle="Fiscal spending/taxing injects or drains net financial assets."
              icon={Landmark}
              actionLabel="Post Fiscal"
              onAction={applyFiscal}
            >
              <NumberField
                label="Treasury Spending"
                value={inputs.fiscalSpend}
                min={0}
                max={1500}
                step={10}
                onChange={(value) => setInputs((prev) => ({ ...prev, fiscalSpend: value }))}
                hint="Adds reserves + deposits."
              />
              <NumberField
                label="Taxes"
                value={inputs.taxes}
                min={0}
                max={1500}
                step={10}
                onChange={(value) => setInputs((prev) => ({ ...prev, taxes: value }))}
                hint={`Max drain today: ${formatBillions(Math.min(stocks.deposits + inputs.fiscalSpend, stocks.reserves + inputs.fiscalSpend))}.`}
              />
              <div className="rounded-2xl border border-slate-200 bg-white/70 p-3 text-xs text-slate-600">
                <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">Auto-Issue Rule</p>
                <p className="mt-2">Target TGA: {formatBillions(TGA_TARGET)}.</p>
                <p className="mt-1">
                  Projected TGA after fiscal: {formatBillions(fiscalPreview.tgaAfter)}.
                  {fiscalPreview.autoIssue > 0 && ` Auto-issue ${formatBillions(fiscalPreview.autoIssue)}.`}
                  {fiscalPreview.autoRedeem > 0 && ` Auto-redeem ${formatBillions(fiscalPreview.autoRedeem)}.`}
                  {fiscalPreview.autoIssue === 0 && fiscalPreview.autoRedeem === 0 && ' No action needed.'}
                </p>
              </div>
            </ControlCard>

            <ControlCard
              title="Monetary Operations"
              subtitle="Asset swaps reprice portfolios without changing net wealth."
              icon={ArrowLeftRight}
              actionLabel="Immunize"
              onAction={applyBondIssuance}
            >
              <NumberField
                label="Bond Immunization (Drain Reserves)"
                value={inputs.bondIssuance}
                min={0}
                max={1500}
                step={10}
                onChange={(value) => setInputs((prev) => ({ ...prev, bondIssuance: value }))}
                hint={`Max issuance today: ${formatBillions(Math.min(stocks.deposits, stocks.reserves))}. Applied: ${formatBillions(maxBondIssuance)}.`}
              />
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <span>Run QE/QT asset swaps below.</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={applyQeSwap}
                    type="button"
                    disabled={maxQeSwap <= 0}
                    className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${
                      maxQeSwap <= 0
                        ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100'
                    }`}
                  >
                    QE
                  </button>
                  <button
                    onClick={applyQtSwap}
                    type="button"
                    disabled={maxQtSwap <= 0}
                    className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${
                      maxQtSwap <= 0
                        ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                    }`}
                  >
                    QT
                  </button>
                </div>
              </div>
              <NumberField
                label="QE / QT Amount (Bonds ↔ Reserves)"
                value={inputs.qeSwap}
                min={0}
                max={1500}
                step={10}
                onChange={(value) => setInputs((prev) => ({ ...prev, qeSwap: value }))}
                hint={`Max QE: ${formatBillions(stocks.bondsHouseholds)} | Max QT: ${formatBillions(stocks.bondsCb)}.`}
              />
            </ControlCard>

            <div className="card-surface">
              <SectionTitle icon={Scale} title="Sectoral Balance Tracker" subtitle="Private net financial wealth offsets the public balance." />
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between rounded-2xl bg-white/70 px-4 py-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Private NFW</p>
                    <p className="text-lg font-semibold text-emerald-600">{formatBillions(derived.privateNfw)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Public Balance (Treasury + Fed)</p>
                    <p className="text-lg font-semibold text-rose-600">{formatBillions(derived.publicNetWorth)}</p>
                  </div>
                </div>
                <div className="flex h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full w-1/2 bg-gradient-to-r from-emerald-400 to-emerald-600" />
                  <div className="h-full w-1/2 bg-gradient-to-r from-rose-400 to-rose-500" />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Identity check</span>
                  <span className={`font-semibold ${Math.abs(derived.identityGap) < 0.01 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {formatBillions(derived.identityGap)}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Loanable funds treats savings as the funding constraint. SFC shows credit creates deposits, while
                  fiscal deficits create the net financial assets the private sector holds.
                </p>
              </div>
            </div>
        </div>

        <div className="xl:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BalanceSheetCard
              title="U.S. Treasury"
              icon={Landmark}
              tone="bg-slate-900"
              assets={[{ label: 'Treasury General Account', value: stocks.tga }]}
              liabilities={[
                { label: 'Treasury Bonds Outstanding', value: stocks.bondsHouseholds + stocks.bondsCb }
              ]}
              equityLabel="Treasury Net Worth"
              equityValue={derived.treasuryNetWorth}
            />

              <BalanceSheetCard
                title="Central Bank (Fed)"
                icon={Banknote}
                tone="bg-indigo-600"
                assets={[{ label: 'Treasury Bonds (Fed)', value: stocks.bondsCb }]}
                liabilities={[
                  { label: 'Bank Reserves', value: stocks.reserves },
                  { label: 'Treasury Account', value: stocks.tga }
                ]}
                equityLabel="Fed Capital"
                equityValue={derived.cbEquity}
              />

              <BalanceSheetCard
                title="Banking System"
                icon={Building2}
                tone="bg-emerald-600"
                assets={[
                  { label: 'Loans', value: stocks.loans },
                  { label: 'Reserves', value: stocks.reserves }
                ]}
                liabilities={[{ label: 'Deposits', value: stocks.deposits }]}
                equityLabel="Bank Equity"
                equityValue={derived.bankEquity}
              />

              <BalanceSheetCard
                title="Households"
                icon={Users}
                tone="bg-amber-500"
                assets={[
                  { label: 'Deposits', value: stocks.deposits },
                  { label: 'Treasury Bonds', value: stocks.bondsHouseholds }
                ]}
                liabilities={[{ label: 'Bank Loans', value: stocks.loans }]}
                equityLabel="Household Net Worth"
                equityValue={derived.householdNetWorth}
              />
            </div>

            <div className="card-surface">
              <SectionTitle icon={ShieldCheck} title="SFC Mechanics" subtitle="Why the loanable funds constraint dissolves." />
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4">
                  <Activity size={18} className="text-emerald-600" />
                  <p>Bank lending expands both assets and liabilities. Deposits are created simultaneously with loans.</p>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4">
                  <CircleDollarSign size={18} className="text-amber-600" />
                  <p>Fiscal deficits add net financial assets to the private sector. Taxes reverse the flow.</p>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4">
                  <ArrowLeftRight size={18} className="text-slate-600" />
                  <p>QE and bond sales are portfolio swaps. They rearrange asset composition without changing net wealth.</p>
                </div>
              </div>
            </div>

            <div className="card-surface">
              <SectionTitle icon={BadgeDollarSign} title="Balance Sheet Integrity" subtitle="All four sheets update together." />
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-500">
                <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Key Identity</p>
                  <p className="mt-2 text-sm text-slate-600">Private Net Financial Wealth = -Public Sector Net Worth (Treasury + Fed)</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{formatBillions(derived.privateNfw)} = {formatBillions(derived.publicNetWorth)}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Operational Notes</p>
                  <p className="mt-2 text-sm text-slate-600">
                    All instruments are scaled to U.S. macro aggregates. Use the controls to trace each operation across
                    Treasury, the Federal Reserve, banks, and households without relying on a loanable funds story.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
    </>
  );
}

const NavPill = ({ href, icon: Icon, label, active }) => (
  <a
    href={href}
    className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.25em] transition ${
      active
        ? 'border-slate-900 bg-slate-900 text-amber-100 shadow-lg shadow-slate-900/20'
        : 'border-slate-200 bg-white/70 text-slate-700 hover:bg-white'
    }`}
  >
    <Icon size={14} />
    {label}
  </a>
);

const TopBar = ({ active }) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <a
      href="#/"
      className="inline-flex items-center gap-2 self-start rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-amber-100 shadow-lg shadow-slate-900/20"
    >
      <BadgeDollarSign size={14} />
      MMT Lab
    </a>
    <nav className="flex flex-wrap items-center gap-2">
      <NavPill href="#/" icon={Home} label="Lab" active={active === 'lab'} />
      <NavPill href="#/dynamics" icon={TrendingUp} label="Dynamics" active={active === 'dynamics'} />
      <NavPill href="#/docs" icon={FileText} label="Docs" active={active === 'docs'} />
      <NavPill href="#/blog" icon={BookOpen} label="Blog" active={active === 'blog'} />
    </nav>
  </div>
);

const SiteFrame = ({ children }) => (
  <div className="relative min-h-screen bg-amber-50 text-slate-900">
    <div className="absolute inset-0 bg-grid opacity-40" />
    <div className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-gradient-to-br from-amber-200 via-orange-100 to-transparent blur-3xl opacity-80 animate-float-slow" />
    <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-gradient-to-tr from-emerald-200 via-teal-100 to-transparent blur-3xl opacity-70 animate-float-slower" />

    <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10">
      {children}
    </div>
  </div>
);

const DocsPage = () => (
  <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
    <div className="card-surface lg:col-span-4">
      <h1 className="font-display text-3xl text-slate-900">Technical Docs</h1>
      <p className="mt-3 text-sm text-slate-600">
        The accounting note behind the simulator, including the sectoral balance identity and the mechanics of
        bank credit, fiscal operations, bond issuance, and QE/QT.
      </p>
      <div className="mt-6 grid gap-2">
        <a
          href={TECHNICAL_PDF_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-100 shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          Open PDF
        </a>
        <a
          href={TECHNICAL_TEX_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-800 transition hover:bg-white"
        >
          View LaTeX Source
        </a>
        <p className="text-xs text-slate-500">
          Tip: the simulator uses the same variable names: deposits ($D$), loans ($L$), reserves ($R$), Treasuries
          held by households ($B_H$), Treasuries held by the central bank ($B_F$), and the Treasury General Account
          ($\TGA$).
        </p>
      </div>
    </div>

    <div className="card-surface lg:col-span-8">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Preview</p>
        <a href={TECHNICAL_PDF_URL} target="_blank" rel="noreferrer" className="text-xs font-semibold text-slate-700 underline">
          Open in new tab
        </a>
      </div>
      <iframe
        title="SFC Monetary Operations (PDF)"
        src={TECHNICAL_PDF_URL}
        className="mt-4 h-[72vh] w-full rounded-2xl border border-slate-200 bg-white"
        loading="lazy"
      />
    </div>
  </div>
);

const BLOG_POSTS = [
  {
    slug: 'sfc-monetary-operations',
    title: 'Money as Bookkeeping: An SFC Tour of Loans, Deficits, Bonds, and QE',
    excerpt: 'A plain-English companion to the balance-sheet lab and the technical note.',
  },
];

const BlogIndexPage = () => (
  <div className="grid gap-6">
    <div className="card-surface max-w-3xl">
      <h1 className="font-display text-3xl text-slate-900">Blog</h1>
      <p className="mt-3 text-sm text-slate-600">
        Short, readable explainers that connect the simulator's buttons to balance-sheet mechanics.
      </p>
    </div>

    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {BLOG_POSTS.map((post) => (
        <a
          key={post.slug}
          href={`#/blog/${post.slug}`}
          className="card-surface transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          <h2 className="font-display text-xl text-slate-900">{post.title}</h2>
          <p className="mt-2 text-sm text-slate-600">{post.excerpt}</p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Read</p>
        </a>
      ))}
    </div>
  </div>
);

const BlogPostSfcMonetaryOperations = () => (
  <article className="mx-auto w-full max-w-3xl card-surface">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <a href="#/blog" className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-600 underline">
        Back to blog
      </a>
      <a href={TECHNICAL_PDF_URL} target="_blank" rel="noreferrer" className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-600 underline">
        Technical PDF
      </a>
    </div>

    <h1 className="mt-4 font-display text-3xl text-slate-900">Money as Bookkeeping</h1>
    <p className="mt-2 text-sm text-slate-600">
      A Stock-Flow Consistent (SFC) tour of what changes when banks lend, the Treasury spends, bonds are issued,
      and the central bank does QE/QT.
    </p>

    <h2 className="mt-8 font-display text-xl text-slate-900">TL;DR</h2>
    <ul className="mt-3 list-disc pl-5 text-sm text-slate-700 space-y-2">
      <li>Bank loans create deposits at the same time. That grows balance sheets, but does not create private net financial assets.</li>
      <li>Fiscal deficits create private net financial assets (reserves and/or Treasuries).</li>
      <li>Bond issuance and QE/QT are portfolio swaps: they change the mix (reserves vs Treasuries), not private net financial assets.</li>
    </ul>

    <h2 className="mt-8 font-display text-xl text-slate-900">The Four Balance Sheets</h2>
    <p className="mt-3 text-sm text-slate-600">
      The simulator consolidates the world into four sectors: households, banks, the central bank, and the Treasury.
      The trick is to track the same instruments across all sectors at once.
    </p>

    <h2 className="mt-8 font-display text-xl text-slate-900">One Identity Worth Memorizing</h2>
    <p className="mt-3 text-sm text-slate-600">
      In this toy model, private net financial assets are simply reserves plus Treasuries held outside government:
    </p>
    <pre className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white/70 p-4 text-xs text-slate-800">
{`Private NFA = R + B_H`}
    </pre>
    <p className="mt-3 text-sm text-slate-600">
      Everything else (loans vs deposits inside the private sector) nets to zero when you consolidate banks and households.
    </p>

    <h2 className="mt-8 font-display text-xl text-slate-900">What Happens When</h2>

    <h3 className="mt-5 font-display text-lg text-slate-900">1) A Bank Makes a Loan</h3>
    <p className="mt-2 text-sm text-slate-600">
      A bank loan creates a matching deposit. Loans and deposits rise together. That means private net financial assets do not change:
      it is an intra-private-sector swap.
    </p>

    <h3 className="mt-5 font-display text-lg text-slate-900">2) The Treasury Spends</h3>
    <p className="mt-2 text-sm text-slate-600">
      Treasury spending credits deposits and reserves and debits the Treasury's account at the central bank. Reserves are a public liability
      held by the private sector, so private net financial assets rise.
    </p>

    <h3 className="mt-5 font-display text-lg text-slate-900">3) Taxes Are Paid</h3>
    <p className="mt-2 text-sm text-slate-600">
      Taxes reverse the spending flow: deposits and reserves fall, and the Treasury's account rises. Private net financial assets fall.
    </p>

    <h3 className="mt-5 font-display text-lg text-slate-900">4) Bonds Are Issued</h3>
    <p className="mt-2 text-sm text-slate-600">
      Bond issuance (in the simulator's simplified mechanics) swaps reserves/deposits for Treasuries. One public liability goes down (reserves),
      another goes up (Treasuries held by households). Net: no change in private net financial assets.
    </p>

    <h3 className="mt-5 font-display text-lg text-slate-900">5) QE (and QT)</h3>
    <p className="mt-2 text-sm text-slate-600">
      QE swaps Treasuries held by households into reserves (via banks). QT reverses the swap. Either way, the private sector's net financial
      assets stay the same, even though the composition changes.
    </p>

    <h2 className="mt-8 font-display text-xl text-slate-900">Try It</h2>
    <p className="mt-3 text-sm text-slate-600">
      Use the lab buttons, then watch the identity tracker. If private net financial wealth and the consolidated public balance stop
      offsetting each other, the bookkeeping broke.
    </p>

    <div className="mt-8 flex flex-wrap items-center gap-3">
      <a
        href="#/"
        className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-100 shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:shadow-xl"
      >
        Back to Lab
      </a>
      <a
        href={TECHNICAL_PDF_URL}
        target="_blank"
        rel="noreferrer"
        className="rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-800 transition hover:bg-white"
      >
        Open Technical PDF
      </a>
    </div>
  </article>
);

const NotFoundPage = () => (
  <div className="card-surface max-w-3xl">
    <h1 className="font-display text-3xl text-slate-900">Not Found</h1>
    <p className="mt-3 text-sm text-slate-600">
      That page does not exist. Try the lab, docs, or blog from the navigation.
    </p>
  </div>
);

export default function App() {
  const path = useHashPath();
  const section = path.startsWith('/docs') ? 'docs'
    : path.startsWith('/blog') ? 'blog'
    : path.startsWith('/dynamics') ? 'dynamics'
    : 'lab';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);

  let content = null;
  if (section === 'docs') {
    content = <DocsPage />;
  } else if (section === 'dynamics') {
    content = <MultiPeriodSim />;
  } else if (section === 'blog') {
    const slug = path.startsWith('/blog/') ? path.slice('/blog/'.length) : '';
    if (!slug) {
      content = <BlogIndexPage />;
    } else if (slug === 'sfc-monetary-operations') {
      content = <BlogPostSfcMonetaryOperations />;
    } else {
      content = <NotFoundPage />;
    }
  } else {
    content = <SFCMonetaryLab />;
  }

  return (
    <SiteFrame>
      <TopBar active={section} />
      {content}
    </SiteFrame>
  );
}
