import { describe, it, expect } from 'vitest'
import { validatePhone } from './validatePhone'

describe('validatePhone — Happy Path', () => {
  it('accepts a valid number starting with 9', () => {
    expect(validatePhone('9876543201').valid).toBe(true)
  })
  it('accepts a valid number starting with 8', () => {
    expect(validatePhone('8765432109').valid).toBe(true)
  })
  it('accepts a valid number starting with 7', () => {
    expect(validatePhone('7654321098').valid).toBe(true)
  })
  it('accepts a valid number starting with 6', () => {
    expect(validatePhone('6543210987').valid).toBe(true)
  })
  it('strips +91 country code and accepts valid number', () => {
    expect(validatePhone('+919876543201').valid).toBe(true)
  })
  it('strips spaces and accepts valid number', () => {
    expect(validatePhone('98765 43201').valid).toBe(true)
  })
  it('strips +91 with spaces and accepts valid number', () => {
    expect(validatePhone('+91 9876543201').valid).toBe(true)
  })
})

describe('validatePhone — Length Validation', () => {
  it('rejects number with fewer than 10 digits', () => {
    const result = validatePhone('98765432')
    expect(result.valid).toBe(false)
    expect(result.reason).toMatch(/10 digits/)
  })
  it('rejects number with more than 10 digits (extra stripped to 10, should check logic)', () => {
    // After stripping, input is exactly 10 — valid
    const result = validatePhone('98765432010')
    // The function slices via replace, 11 digits raw → still 11 digits, fails length
    expect(result.valid).toBe(false)
  })
  it('rejects empty string', () => {
    const result = validatePhone('')
    expect(result.valid).toBe(false)
    expect(result.reason).toMatch(/10 digits/)
  })
  it('rejects null input', () => {
    expect(validatePhone(null).valid).toBe(false)
  })
  it('rejects undefined input', () => {
    expect(validatePhone(undefined).valid).toBe(false)
  })
})

describe('validatePhone — Starting Digit', () => {
  it('rejects number starting with 5', () => {
    const result = validatePhone('5876543210')
    expect(result.valid).toBe(false)
    expect(result.reason).toMatch(/6, 7, 8, or 9/)
  })
  it('rejects number starting with 1', () => {
    expect(validatePhone('1234567890').valid).toBe(false)
  })
  it('rejects number starting with 0', () => {
    expect(validatePhone('0876543210').valid).toBe(false)
  })
})

describe('validatePhone — All Same Digits', () => {
  it('rejects 9999999999', () => {
    const result = validatePhone('9999999999')
    expect(result.valid).toBe(false)
    expect(result.reason).toMatch(/identical/)
  })
  it('rejects 8888888888', () => {
    expect(validatePhone('8888888888').valid).toBe(false)
  })
  it('rejects 7777777777', () => {
    expect(validatePhone('7777777777').valid).toBe(false)
  })
})

describe('validatePhone — Sequential Patterns', () => {
  it('rejects 9876543210', () => {
    const result = validatePhone('9876543210')
    expect(result.valid).toBe(false)
    expect(result.reason).toMatch(/sequential/)
  })
  it('rejects 1234567890', () => {
    const result = validatePhone('1234567890')
    expect(result.valid).toBe(false)
  })
  it('rejects 0987654321', () => {
    expect(validatePhone('0987654321').valid).toBe(false)
  })
})

describe('validatePhone — Excessive Repeating Digits', () => {
  it('rejects number with one digit repeated 6+ times (9111111111)', () => {
    // 9111111111 — digit 1 appears 9 times → excessive repeating
    const result = validatePhone('9111111111')
    expect(result.valid).toBe(false)
    expect(result.reason).toMatch(/repeating/)
  })
  it('does NOT strip bare 91 prefix from a valid 91xxxxxxxx number', () => {
    // Bug guard: 9123456789 must NOT be stripped to 23456789 (8 digits)
    // It starts with 9 → valid start digit, 10 digits, no pattern issues
    expect(validatePhone('9123456789').valid).toBe(true)
  })
  it('rejects 9999900000 — 9 appears 5 times, 0 appears 5 times — both under 6, should PASS', () => {
    expect(validatePhone('9999900000').valid).toBe(true)
  })
  it('rejects 9999990000 — 9 appears 6 times', () => {
    expect(validatePhone('9999990000').valid).toBe(false)
  })
})

describe('validatePhone — Country Code Stripping', () => {
  it('strips 0091 prefix', () => {
    expect(validatePhone('00919876543201').valid).toBe(true)
  })
  it('strips 091 prefix', () => {
    expect(validatePhone('0919876543201').valid).toBe(true)
  })
  it('strips dashes', () => {
    expect(validatePhone('98765-43201').valid).toBe(true)
  })
})
