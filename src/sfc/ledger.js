export const DEFAULT_TGA_TARGET = 200;

export function computeDerived(stocks) {
  const bankAssets = stocks.loans + stocks.reserves;
  const bankEquity = bankAssets - stocks.deposits;

  const householdAssets = stocks.deposits + stocks.bondsHouseholds;
  const householdNetWorth = householdAssets - stocks.loans;

  const treasuryAssets = stocks.tga;
  const treasuryLiabilities = stocks.bondsHouseholds + stocks.bondsCb;
  const treasuryNetWorth = treasuryAssets - treasuryLiabilities;

  const cbAssets = stocks.bondsCb;
  const cbLiabilities = stocks.reserves + stocks.tga;
  const cbEquity = cbAssets - cbLiabilities;

  const publicNetWorth = treasuryNetWorth + cbEquity;
  const privateNfw = stocks.reserves + stocks.bondsHouseholds;
  const identityGap = privateNfw + publicNetWorth;

  return {
    bankAssets,
    bankEquity,
    householdAssets,
    householdNetWorth,
    publicNetWorth,
    treasuryNetWorth,
    cbEquity,
    privateNfw,
    identityGap,
  };
}

export function previewFiscal({ stocks, fiscalSpend, taxes, tgaTarget = DEFAULT_TGA_TARGET }) {
  const depositsAfterSpend = stocks.deposits + fiscalSpend;
  const reservesAfterSpend = stocks.reserves + fiscalSpend;
  const tax = Math.min(taxes, depositsAfterSpend, reservesAfterSpend);
  const depositsAfterTax = depositsAfterSpend - tax;
  const reservesAfterTax = reservesAfterSpend - tax;
  const tgaAfter = stocks.tga - fiscalSpend + tax;
  const gap = tgaTarget - tgaAfter;

  let autoIssue = 0;
  let autoRedeem = 0;

  if (gap > 0) {
    autoIssue = Math.min(gap, depositsAfterTax, reservesAfterTax);
  } else if (gap < 0) {
    autoRedeem = Math.min(-gap, stocks.bondsHouseholds);
  }

  return {
    tax,
    tgaAfter,
    autoIssue,
    autoRedeem,
  };
}

export function applyBankCredit(stocks, bankCredit) {
  let delta = bankCredit;

  if (delta < 0) {
    const maxRepay = Math.min(stocks.loans, stocks.deposits);
    delta = Math.max(delta, -maxRepay);
  }

  return {
    deltaApplied: delta,
    stocks: {
      ...stocks,
      loans: stocks.loans + delta,
      deposits: stocks.deposits + delta,
    },
  };
}

export function applyFiscal(stocks, { fiscalSpend, taxes }, { tgaTarget = DEFAULT_TGA_TARGET } = {}) {
  let deposits = stocks.deposits + fiscalSpend;
  let reserves = stocks.reserves + fiscalSpend;
  const maxTax = Math.min(deposits, reserves);
  const tax = Math.min(taxes, maxTax);
  deposits -= tax;
  reserves -= tax;

  let tga = stocks.tga - fiscalSpend + tax;
  let bondsHouseholds = stocks.bondsHouseholds;
  const gap = tgaTarget - tga;
  let autoIssue = 0;
  let autoRedeem = 0;

  if (gap > 0) {
    autoIssue = Math.min(gap, deposits, reserves);
    deposits -= autoIssue;
    reserves -= autoIssue;
    tga += autoIssue;
    bondsHouseholds += autoIssue;
  } else if (gap < 0) {
    autoRedeem = Math.min(-gap, bondsHouseholds);
    deposits += autoRedeem;
    reserves += autoRedeem;
    tga -= autoRedeem;
    bondsHouseholds -= autoRedeem;
  }

  return {
    taxApplied: tax,
    autoIssue,
    autoRedeem,
    stocks: {
      ...stocks,
      deposits,
      reserves,
      tga,
      bondsHouseholds,
    },
  };
}

export function applyBondIssuance(stocks, bondIssuance) {
  const amount = Math.min(bondIssuance, stocks.deposits, stocks.reserves);

  return {
    amountApplied: amount,
    stocks: {
      ...stocks,
      bondsHouseholds: stocks.bondsHouseholds + amount,
      deposits: stocks.deposits - amount,
      reserves: stocks.reserves - amount,
      tga: stocks.tga + amount,
    },
  };
}

export function applyQeSwap(stocks, qeSwap) {
  const amount = Math.min(qeSwap, stocks.bondsHouseholds);

  return {
    amountApplied: amount,
    stocks: {
      ...stocks,
      bondsHouseholds: stocks.bondsHouseholds - amount,
      bondsCb: stocks.bondsCb + amount,
      deposits: stocks.deposits + amount,
      reserves: stocks.reserves + amount,
    },
  };
}

export function applyQtSwap(stocks, qtSwap) {
  const amount = Math.min(qtSwap, stocks.bondsCb, stocks.deposits, stocks.reserves);

  return {
    amountApplied: amount,
    stocks: {
      ...stocks,
      bondsHouseholds: stocks.bondsHouseholds + amount,
      bondsCb: stocks.bondsCb - amount,
      deposits: stocks.deposits - amount,
      reserves: stocks.reserves - amount,
    },
  };
}

