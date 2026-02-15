/**
 * Calculate the percentage difference between two values
 * Uses difference formula: ((current - previous) / previous) * 100
 * e.g. previous=4, current=1 => -75% (75% less)
 * e.g. previous=1, current=4 => +300% (300% more)
 * e.g. previous=10, current=10 => 0% (no change)
 * @param current - The current value
 * @param previous - The previous value to compare against
 * @returns Object with percentage difference and status flags
 */
export function calculateChange(current: number, previous: number): {
  percentage: number | null
  isPositive: boolean
  isNegative: boolean
  isZero: boolean
} {
  let percentage: number | null = null

  if (previous === 0 && current === 0) {
    // Both 0: no change, show 0%
    percentage = 0
  } else if (previous === 0 && current > 0) {
    // Can't calculate percentage from 0, don't show percentage
    percentage = null
  } else if (previous > 0) {
    // Percentage difference: ((current - previous) / previous) * 100
    percentage = Math.round(((current - previous) / previous) * 1000) / 10
  }

  const isPositive = percentage !== null && percentage > 0
  const isNegative = percentage !== null && percentage < 0
  const isZero = percentage === null || percentage === 0

  return { percentage, isPositive, isNegative, isZero }
}

