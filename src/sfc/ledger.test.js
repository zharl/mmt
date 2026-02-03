import { describe, expect, it } from 'vitest';

import {
  DEFAULT_TGA_TARGET,
  applyBankCredit,
  applyBondIssuance,
  applyFiscal,
  applyQeSwap,
  applyQtSwap,
  computeDerived,
} from './ledger';

const INITIAL_STOCKS = Object.freeze({
  deposits: 4000,
  loans: 3500,
  reserves: 800,
  bondsHouseholds: 2600,
  bondsCb: 500,
  tga: 200,
});

const expectAccountingIdentities = (stocks) => {
  const derived = computeDerived(stocks);

  expect(derived.privateNfw).toBeCloseTo(stocks.reserves + stocks.bondsHouseholds, 10);
  expect(derived.publicNetWorth).toBeCloseTo(derived.treasuryNetWorth + derived.cbEquity, 10);
  expect(derived.identityGap).toBeCloseTo(0, 10);

  const systemNetWorth = derived.householdNetWorth + derived.bankEquity + derived.treasuryNetWorth + derived.cbEquity;
  expect(systemNetWorth).toBeCloseTo(0, 10);
};

describe('SFC ledger operations (mirrors theory doc)', () => {
  it('reconciles the sectoral balance identity', () => {
    expectAccountingIdentities(INITIAL_STOCKS);
  });

  it('bank credit expands loans and deposits with no NFA change', () => {
    const { stocks: next } = applyBankCredit(INITIAL_STOCKS, 200);

    expect(next).toEqual({
      ...INITIAL_STOCKS,
      loans: 3700,
      deposits: 4200,
    });

    expectAccountingIdentities(next);
  });

  it('loan repayment is clamped by outstanding loans and deposits', () => {
    const { deltaApplied, stocks: next } = applyBankCredit(INITIAL_STOCKS, -10_000);

    expect(deltaApplied).toBe(-3500);
    expect(next.loans).toBe(0);
    expect(next.deposits).toBe(500);
    expectAccountingIdentities(next);
  });

  it('fiscal operation changes NFA by (G - T) while TGA targeting only swaps composition', () => {
    const { taxApplied, autoIssue, autoRedeem, stocks: next } = applyFiscal(
      INITIAL_STOCKS,
      { fiscalSpend: 250, taxes: 160 },
      { tgaTarget: DEFAULT_TGA_TARGET }
    );

    expect(taxApplied).toBe(160);
    expect(autoIssue).toBe(90);
    expect(autoRedeem).toBe(0);

    expect(next).toEqual({
      ...INITIAL_STOCKS,
      bondsHouseholds: 2690,
    });

    const derived0 = computeDerived(INITIAL_STOCKS);
    const derived1 = computeDerived(next);
    expect(derived1.privateNfw - derived0.privateNfw).toBe(90);
    expectAccountingIdentities(next);
  });

  it('fiscal surplus triggers auto-redemption (TGA targeting) without changing the NFA effect of taxes', () => {
    const { taxApplied, autoIssue, autoRedeem, stocks: next } = applyFiscal(
      INITIAL_STOCKS,
      { fiscalSpend: 0, taxes: 100 },
      { tgaTarget: DEFAULT_TGA_TARGET }
    );

    expect(taxApplied).toBe(100);
    expect(autoIssue).toBe(0);
    expect(autoRedeem).toBe(100);

    expect(next.deposits).toBe(4000);
    expect(next.reserves).toBe(800);
    expect(next.tga).toBe(200);
    expect(next.bondsHouseholds).toBe(2500);

    const derived0 = computeDerived(INITIAL_STOCKS);
    const derived1 = computeDerived(next);
    expect(derived1.privateNfw - derived0.privateNfw).toBe(-100);
    expectAccountingIdentities(next);
  });

  it('bond issuance drains reserves/deposits and swaps into household Treasuries (NFA unchanged)', () => {
    const { amountApplied, stocks: next } = applyBondIssuance(INITIAL_STOCKS, 120);

    expect(amountApplied).toBe(120);
    expect(next).toEqual({
      ...INITIAL_STOCKS,
      bondsHouseholds: 2720,
      deposits: 3880,
      reserves: 680,
      tga: 320,
    });

    const derived0 = computeDerived(INITIAL_STOCKS);
    const derived1 = computeDerived(next);
    expect(derived1.privateNfw).toBeCloseTo(derived0.privateNfw, 10);
    expectAccountingIdentities(next);
  });

  it('QE swaps household bonds into deposits/reserves (NFA unchanged)', () => {
    const { amountApplied, stocks: next } = applyQeSwap(INITIAL_STOCKS, 100);

    expect(amountApplied).toBe(100);
    expect(next).toEqual({
      ...INITIAL_STOCKS,
      bondsHouseholds: 2500,
      bondsCb: 600,
      deposits: 4100,
      reserves: 900,
    });

    const derived0 = computeDerived(INITIAL_STOCKS);
    const derived1 = computeDerived(next);
    expect(derived1.privateNfw).toBeCloseTo(derived0.privateNfw, 10);
    expectAccountingIdentities(next);
  });

  it('QT reverses QE (NFA unchanged)', () => {
    const { amountApplied, stocks: next } = applyQtSwap(INITIAL_STOCKS, 100);

    expect(amountApplied).toBe(100);
    expect(next).toEqual({
      ...INITIAL_STOCKS,
      bondsHouseholds: 2700,
      bondsCb: 400,
      deposits: 3900,
      reserves: 700,
    });

    const derived0 = computeDerived(INITIAL_STOCKS);
    const derived1 = computeDerived(next);
    expect(derived1.privateNfw).toBeCloseTo(derived0.privateNfw, 10);
    expectAccountingIdentities(next);
  });
});

