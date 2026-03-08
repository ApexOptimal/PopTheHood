/**
 * Maintenance Health Score Calculator
 * Computes a 0-100 health score based on vehicle maintenance status.
 */

import { calculateOilLife } from './oilLife';

/**
 * Calculate full health score for a vehicle with complete data.
 * @param {Object} vehicle - Full vehicle object with maintenance records
 * @returns {{ score: number, color: string, grade: string, factors: Array }}
 */
export function calculateHealthScore(vehicle) {
  if (!vehicle) {
    return { score: 0, color: '#909090', grade: '?', factors: [] };
  }

  let score = 100;
  const factors = [];

  // Factor 1: Oil life (0-30 points deducted)
  const oilLife = calculateOilLife(vehicle);
  if (oilLife.percentage !== null) {
    if (oilLife.percentage < 15) {
      score -= 30;
      factors.push({ label: 'Oil change overdue', severity: 'critical', deduction: 30 });
    } else if (oilLife.percentage < 50) {
      score -= 15;
      factors.push({ label: 'Oil change approaching', severity: 'warning', deduction: 15 });
    }
  }

  // Factor 2: Check engine light (20 points)
  if (vehicle.hasCheckEngineLight) {
    score -= 20;
    factors.push({ label: 'Check engine light on', severity: 'critical', deduction: 20 });
  }

  // Factor 3: Open recalls (5 points each, max 15)
  const recallCount = vehicle.recalls?.filter(r => !vehicle.completedRecalls?.includes(r.NHTSACampaignNumber))?.length || 0;
  if (recallCount > 0) {
    const deduction = Math.min(15, recallCount * 5);
    score -= deduction;
    factors.push({ label: `${recallCount} open recall${recallCount > 1 ? 's' : ''}`, severity: 'warning', deduction });
  }

  // Factor 4: Mileage staleness (0-10 points)
  if (vehicle.mileageLastUpdated) {
    const daysSince = (Date.now() - new Date(vehicle.mileageLastUpdated)) / (1000 * 60 * 60 * 24);
    if (daysSince > 60) {
      const deduction = Math.min(10, Math.floor(daysSince / 30));
      score -= deduction;
      factors.push({ label: 'Mileage data stale', severity: 'info', deduction });
    }
  }

  score = Math.max(0, Math.min(100, score));

  return {
    score,
    grade: score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D',
    color: getScoreColor(score),
    factors,
  };
}

/**
 * Simplified health score for onboarding (limited data available).
 * @param {{ mileage: number, estimatedLastOilChange: string, hasCheckEngineLight: boolean, recallCount: number }}
 * @returns {{ score: number, color: string, factors: Array }}
 */
export function calculateOnboardingHealthScore({ mileage, estimatedLastOilChange, hasCheckEngineLight, recallCount = 0 }) {
  let score = 100;
  const factors = [];

  // Oil change estimate
  if (estimatedLastOilChange === '6plus') {
    score -= 30;
    factors.push({ label: 'Oil change likely overdue', severity: 'critical', deduction: 30 });
  } else if (estimatedLastOilChange === '3-6months') {
    score -= 10;
    factors.push({ label: 'Oil change may be approaching', severity: 'warning', deduction: 10 });
  }

  // Check engine light
  if (hasCheckEngineLight) {
    score -= 20;
    factors.push({ label: 'Check engine light active', severity: 'critical', deduction: 20 });
  }

  // Recalls
  if (recallCount > 0) {
    const deduction = Math.min(15, recallCount * 5);
    score -= deduction;
    factors.push({ label: `${recallCount} open recall${recallCount > 1 ? 's' : ''}`, severity: 'warning', deduction });
  }

  // High mileage context (not a deduction, informational)
  if (mileage > 100000) {
    factors.push({ label: 'High-mileage vehicle — more frequent checks recommended', severity: 'info', deduction: 0 });
  }

  score = Math.max(0, Math.min(100, score));

  return {
    score,
    color: getScoreColor(score),
    factors,
  };
}

/**
 * Map oil change timing answer to approximate ISO date.
 */
export function mapOilChangeAnswer(answer) {
  const now = new Date();
  switch (answer) {
    case 'recent':
      now.setDate(now.getDate() - 42); // ~6 weeks ago
      return now.toISOString();
    case '3-6months':
      now.setMonth(now.getMonth() - 4);
      return now.toISOString();
    case '6plus':
      now.setMonth(now.getMonth() - 9);
      return now.toISOString();
    default:
      return null;
  }
}

/**
 * Estimate mileage at last oil change based on the user's answer and current mileage.
 * Uses ~15,000 miles/year (~1,250/month) as a reasonable average.
 */
export function estimateOilChangeMileage(answer, currentMileage) {
  const mileage = parseInt(currentMileage) || 0;
  switch (answer) {
    case 'recent':
      return Math.max(0, mileage - 2000);   // ~6 weeks of driving
    case '3-6months':
      return Math.max(0, mileage - 5000);   // ~4 months of driving
    case '6plus':
      return Math.max(0, mileage - 11000);  // ~9 months of driving
    default:
      return null;
  }
}

function getScoreColor(score) {
  if (score >= 80) return '#00aa66';
  if (score >= 50) return '#ff8800';
  return '#ff4444';
}
