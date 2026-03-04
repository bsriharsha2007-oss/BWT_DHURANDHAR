/**
 * Financial Simulation Engine
 * Calculates yearly projections based on growth scenarios and inflation.
 */

export const calculateProjection = (income, expenses, savings, goal, years, emi) => {
  const netMonthlySavings = income - expenses - emi;
  const inflationRate = 0.06;
  
  const scenarios = {
    safe: { rate: 0.05 },
    balanced: { rate: 0.10 },
    aggressive: { rate: 0.18 }
  };

  const results = {
    years: Array.from({ length: years + 1 }, (_, i) => i),
    safe: [],
    balanced: [],
    aggressive: [],
    goalLine: Array(years + 1).fill(goal)
  };

  // Initial values at year 0
  results.safe.push(savings);
  results.balanced.push(savings);
  results.aggressive.push(savings);

  for (let year = 1; year <= years; year++) {
    Object.keys(scenarios).forEach(key => {
      const rate = scenarios[key].rate;
      const prevValue = results[key][year - 1];
      
      // Annual contribution (net monthly savings * 12)
      const annualContribution = netMonthlySavings * 12;
      
      // Growth formula: (Previous Value * (1 + rate)) + Annual Contribution
      // Then adjust for inflation: Value / (1 + inflationRate)
      // We apply inflation adjustment to the total value to see "today's purchasing power"
      const newValue = (prevValue * (1 + rate)) + annualContribution;
      
      // Discount by inflation to get "real" value in today's terms
      const inflationAdjustedValue = newValue / (1 + inflationRate);
      
      results[key].push(Math.round(inflationAdjustedValue));
    });
  }

  return results;
};

export const calculateHealthScore = (income, expenses) => {
  if (income <= 0) return 0;
  const savingsRate = (income - expenses) / income;

  if (expenses > income) return 30;
  if (savingsRate > 0.40) return 90;
  if (savingsRate >= 0.20) return 70;
  return 50;
};
