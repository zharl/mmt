export const DEFAULT_INFLATION_FLOOR = 0.01;

export function runMultiPeriodSimulation(config) {
  const {
    numPeriods,
    initialGdp,
    initialDebt,
    initialReserves,
    initialBondsHh,
    primaryBalance,
    interestRate,
    inflationElasticity,
    inflationFloor = DEFAULT_INFLATION_FLOOR,
  } = config;

  const Bh = initialBondsHh;
  const Bf = Math.max(0, initialDebt - initialReserves - Bh);

  let R = initialReserves;
  let nomGdp = initialGdp;

  const results = [
    {
      period: 0,
      R,
      Bh,
      Bf,
      totalDebt: R + Bh + Bf,
      nomGdp,
      debtGdpRatio: (R + Bh + Bf) / nomGdp,
      interestPayments: 0,
      nominalDeficit: 0,
      inflation: 0,
      realDeficit: 0,
    },
  ];

  for (let t = 1; t <= numPeriods; t++) {
    const totalDebtPrev = R + Bh + Bf;
    const interestPayments = interestRate * (R + Bh);
    const nominalDeficit = primaryBalance + interestPayments;
    const inflation = Math.max(inflationFloor, inflationElasticity * (nominalDeficit / nomGdp));
    const realDeficit = nominalDeficit - inflation * totalDebtPrev;

    R += nominalDeficit;
    nomGdp *= (1 + inflation);

    const totalDebt = R + Bh + Bf;

    results.push({
      period: t,
      R,
      Bh,
      Bf,
      totalDebt,
      nomGdp,
      debtGdpRatio: totalDebt / nomGdp,
      interestPayments,
      nominalDeficit,
      inflation,
      realDeficit,
    });
  }

  return results;
}

