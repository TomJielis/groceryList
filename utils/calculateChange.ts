/**
 * Calculate the percentage change between two values
 * @param current - The current value
 * @param previous - The previous value to compare against
 * @returns Object with absolute change and percentage change
 */
export function calculateChange(current: number, previous: number): {
  absolute: number
  percentage: number | null
} {
  const absolute = current - previous
  let percentage: number | null = null

  if (previous === 0 && current === 0) {
    // Both 0: no change, show 0%
    percentage = 0
  } else if (previous === 0 && current > 0) {
    // Can't calculate percentage from 0, don't show percentage
    percentage = null
  } else if (previous > 0) {
    // Percentage change: ((current - previous) / previous) * 100
    // e.g. previous=9, current=9 => 0%
    // e.g. previous=1, current=12 => 1100%
    // e.g. previous=100, current=50 => -50%
    percentage = Math.round(((current - previous) / previous) * 1000) / 10
  }

  return { absolute, percentage }
}

