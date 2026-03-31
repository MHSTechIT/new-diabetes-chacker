/**
 * Validates an Indian mobile number.
 * Strips spaces, +91 country code, and special characters before checking.
 * Returns { valid: true } or { valid: false, reason: string }
 */
export function validatePhone(raw) {
  // Strip country code (+91 / 0091 / 091), spaces, dashes, dots, parens
  const cleaned = String(raw ?? '')
    .replace(/^\+?91/, '')
    .replace(/^0091/, '')
    .replace(/^091/, '')
    .replace(/[\s\-().]/g, '')
    .replace(/\D/g, '')

  if (cleaned.length !== 10) {
    return { valid: false, reason: 'Phone number must be exactly 10 digits.' }
  }

  if (!/^[6-9]/.test(cleaned)) {
    return { valid: false, reason: 'Phone number must start with 6, 7, 8, or 9.' }
  }

  // All digits the same — e.g. 9999999999
  if (/^(\d)\1{9}$/.test(cleaned)) {
    return { valid: false, reason: 'Phone number cannot have all identical digits.' }
  }

  // Sequential ascending or descending
  if (cleaned === '1234567890' || cleaned === '0987654321' || cleaned === '9876543210') {
    return { valid: false, reason: 'Phone number cannot be a sequential pattern.' }
  }

  // Any single digit appears 6 or more times (excessive repetition)
  for (let d = 0; d <= 9; d++) {
    if ((cleaned.match(new RegExp(String(d), 'g')) || []).length >= 6) {
      return { valid: false, reason: 'Phone number has too many repeating digits.' }
    }
  }

  return { valid: true }
}
