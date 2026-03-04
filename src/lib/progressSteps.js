/**
 * Progress bar: first question to last question (gender → habits).
 * Used by all question pages to show fill width from 0% to 100%.
 */
export const QUESTION_FLOW_PATHS = [
  '/',
  '/age-selection',
  '/gestational-diabetes',
  '/weight-height',
  '/family-history',
  '/hip-size',
  '/physical-activity',
  '/junk-food-frequency',
  '/outside-food-frequency',
  '/carbohydrate-type',
  '/sugary-beverages',
  '/sleep-duration',
  '/snoring',
  '/weight-gain',
  '/stress-level',
  '/medical-conditions',
  '/symptoms',
  '/habits',
]

export const TOTAL_QUESTION_STEPS = QUESTION_FLOW_PATHS.length

/**
 * @param {string} pathname - e.g. location.pathname
 * @returns {number} 0–100 progress percent for the progress bar fill
 */
export function getProgressPercent(pathname) {
  const step = QUESTION_FLOW_PATHS.indexOf(pathname)
  if (step === -1) {
    if (pathname === '/next-step' || pathname === '/result') return 100
    return 0
  }
  return Math.round(((step + 1) / TOTAL_QUESTION_STEPS) * 100)
}
