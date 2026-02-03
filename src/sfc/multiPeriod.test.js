import { describe, expect, it } from 'vitest';

import { runMultiPeriodSimulation } from './multiPeriod';

describe('multi-period simulation (matches theory doc arithmetic)', () => {
  it('matches the paper defaults and keeps internal accounting consistent period-by-period', () => {
    const config = {
      numPeriods: 2,
      initialGdp: 25_000,
      initialDebt: 30_000,
      initialReserves: 3_000,
      initialBondsHh: 20_000,
      primaryBalance: 0,
      interestRate: 0.05,
      inflationElasticity: 0.5,
    };

    const results = runMultiPeriodSimulation(config);
    expect(results).toHaveLength(3);

    expect(results[0]).toMatchObject({
      period: 0,
      R: 3000,
      Bh: 20000,
      Bf: 7000,
      totalDebt: 30000,
      nomGdp: 25000,
      debtGdpRatio: 1.2,
      interestPayments: 0,
      nominalDeficit: 0,
      inflation: 0,
      realDeficit: 0,
    });

    // Period 1 (interest on R^0 + B_H^0).
    expect(results[1].interestPayments).toBeCloseTo(1150, 10);
    expect(results[1].nominalDeficit).toBeCloseTo(1150, 10);
    expect(results[1].inflation).toBeCloseTo(0.023, 10);
    expect(results[1].realDeficit).toBeCloseTo(460, 9);

    expect(results[1].R).toBeCloseTo(4150, 10);
    expect(results[1].nomGdp).toBeCloseTo(25_575, 10);
    expect(results[1].totalDebt).toBeCloseTo(31_150, 10);
    expect(results[1].debtGdpRatio).toBeCloseTo(31_150 / 25_575, 10);

    // Consistency checks for each t >= 1.
    for (let t = 1; t < results.length; t++) {
      const prev = results[t - 1];
      const row = results[t];

      expect(row.totalDebt).toBeCloseTo(row.R + row.Bh + row.Bf, 12);
      expect(row.debtGdpRatio).toBeCloseTo(row.totalDebt / row.nomGdp, 12);

      const expectedInterest = config.interestRate * (prev.R + prev.Bh);
      expect(row.interestPayments).toBeCloseTo(expectedInterest, 12);

      expect(row.nominalDeficit).toBeCloseTo(config.primaryBalance + row.interestPayments, 12);

      const expectedInflation = Math.max(0.01, config.inflationElasticity * (row.nominalDeficit / prev.nomGdp));
      expect(row.inflation).toBeCloseTo(expectedInflation, 12);

      const expectedRealDeficit = row.nominalDeficit - row.inflation * prev.totalDebt;
      expect(row.realDeficit).toBeCloseTo(expectedRealDeficit, 12);

      expect(row.R).toBeCloseTo(prev.R + row.nominalDeficit, 12);
      expect(row.nomGdp).toBeCloseTo(prev.nomGdp * (1 + row.inflation), 12);
    }
  });
});

