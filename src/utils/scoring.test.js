import { describe, it, expect } from 'vitest'
import { scoreToLevel, bmiPoints, calculateRisk } from './scoring'

// ── scoreToLevel ──────────────────────────────────────────────────────
describe('scoreToLevel', () => {
  it('returns LOW for score 0',   () => expect(scoreToLevel(0)).toBe('LOW'))
  it('returns LOW for score 30',  () => expect(scoreToLevel(30)).toBe('LOW'))
  it('returns LOW_MODERATE for score 31', () => expect(scoreToLevel(31)).toBe('LOW_MODERATE'))
  it('returns LOW_MODERATE for score 55', () => expect(scoreToLevel(55)).toBe('LOW_MODERATE'))
  it('returns MODERATE for score 56',     () => expect(scoreToLevel(56)).toBe('MODERATE'))
  it('returns MODERATE for score 75',     () => expect(scoreToLevel(75)).toBe('MODERATE'))
  it('returns MODERATE_HIGH for score 76',() => expect(scoreToLevel(76)).toBe('MODERATE_HIGH'))
  it('returns MODERATE_HIGH for score 90',() => expect(scoreToLevel(90)).toBe('MODERATE_HIGH'))
  it('returns HIGH for score 91',         () => expect(scoreToLevel(91)).toBe('HIGH'))
  it('returns HIGH for score 100',        () => expect(scoreToLevel(100)).toBe('HIGH'))
})

// ── bmiPoints ─────────────────────────────────────────────────────────
describe('bmiPoints', () => {
  it('returns 0 for null BMI',       () => expect(bmiPoints(null)).toBe(0))
  it('returns 0 for NaN BMI',        () => expect(bmiPoints(NaN)).toBe(0))
  it('returns 0 for underweight (17)', () => expect(bmiPoints(17)).toBe(0))
  it('returns 0 for normal BMI (22)', () => expect(bmiPoints(22)).toBe(0))
  it('returns 5 for overweight (25)', () => expect(bmiPoints(25)).toBe(5))
  it('returns 5 for BMI 27.4',        () => expect(bmiPoints(27.4)).toBe(5))
  it('returns 10 for obese (30)',      () => expect(bmiPoints(30)).toBe(10))
  it('returns 13 for severely obese (35)', () => expect(bmiPoints(35)).toBe(13))
})

// ── calculateRisk — null / empty inputs ───────────────────────────────
describe('calculateRisk — null/empty guard', () => {
  it('returns LOW with score 0 for null answers', () => {
    const r = calculateRisk(null)
    expect(r.riskLevel).toBe('LOW')
    expect(r.totalScore).toBe(0)
    expect(r.riskyFactors).toHaveLength(0)
  })
  it('returns LOW with score 0 for empty object', () => {
    const r = calculateRisk({})
    expect(r.riskLevel).toBe('LOW')
    expect(r.totalScore).toBe(0)
  })
})

// ── calculateRisk — healthy profile ──────────────────────────────────
describe('calculateRisk — healthy profile', () => {
  const healthy = {
    gender: 'male',
    age_range: 'below25',
    family_history: 'none',
    weight_kg: 65,
    height_cm: 175,
    hip_size: 'less90',
    physical_activity_level: 'vigorous',
    medical_conditions: 'none',
    symptoms: 'none',
    junk_food_frequency: 'rarely',
    sugary_beverages: 'no',
    habits: 'none',
    sleep_duration: '7-8',
    weight_gain: 'no',
    stress_level: 'low',
    gestational_diabetes: 'not_applicable',
  }
  it('gives LOW risk for a healthy profile', () => {
    expect(calculateRisk(healthy).riskLevel).toBe('LOW')
  })
  it('gives zero risky factors for a healthy profile', () => {
    expect(calculateRisk(healthy).riskyFactors).toHaveLength(0)
  })
  it('score is at most 30 for healthy profile', () => {
    expect(calculateRisk(healthy).totalScore).toBeLessThanOrEqual(30)
  })
  it('returns a probabilityRangeText', () => {
    expect(calculateRisk(healthy).probabilityRangeText).toBe('1% – 5%')
  })
})

// ── calculateRisk — high risk profile ────────────────────────────────
describe('calculateRisk — high risk profile', () => {
  // female, above50, both-parents, obese BMI, all conditions capped,
  // 6 symptoms (hits cap), gestational diabetes → score = 91 → HIGH
  const highRisk = {
    gender: 'female',
    age_range: 'above50',
    family_history: 'both-parents',
    weight_kg: 100,
    height_cm: 165,
    hip_size: 'more90',
    physical_activity_level: 'sedentary',
    medical_conditions: 'hypertension,pcos,heart-disease,kidney-disease,high-cholesterol',
    symptoms: 'frequent-urination,excessive-thirst,increased-hunger,fatigue,blurred-vision,slow-wound-healing',
    junk_food_frequency: 'weekly5plus',
    sugary_beverages: 'yes',
    habits: 'smoking,alcohol,tobacco-chewing',
    sleep_duration: 'less6',
    weight_gain: 'yes',
    stress_level: 'high',
    gestational_diabetes: 'yes',
  }
  it('gives HIGH risk for worst-case profile', () => {
    expect(calculateRisk(highRisk).riskLevel).toBe('HIGH')
  })
  it('score is capped at 100', () => {
    expect(calculateRisk(highRisk).totalScore).toBeLessThanOrEqual(100)
  })
  it('has multiple risky factors', () => {
    expect(calculateRisk(highRisk).riskyFactors.length).toBeGreaterThan(5)
  })
  it('probability is 50%+ for HIGH', () => {
    expect(calculateRisk(highRisk).probabilityRangeText).toBe('50%+')
  })
})

// ── calculateRisk — override rules ───────────────────────────────────
describe('calculateRisk — risk override rules', () => {
  it('upgrades LOW to LOW_MODERATE when user has hypertension', () => {
    const r = calculateRisk({
      gender: 'female',
      age_range: 'below25',
      family_history: 'none',
      weight_kg: 55,
      height_cm: 160,
      medical_conditions: 'hypertension',
      symptoms: 'none',
    })
    expect(r.riskLevel).toBe('LOW_MODERATE')
  })

  it('upgrades LOW to LOW_MODERATE when user has PCOS', () => {
    const r = calculateRisk({
      gender: 'female',
      age_range: 'below25',
      family_history: 'none',
      weight_kg: 55,
      height_cm: 160,
      medical_conditions: 'pcos',
      symptoms: 'none',
    })
    expect(r.riskLevel).toBe('LOW_MODERATE')
  })

  it('upgrades LOW to MODERATE when 3+ symptoms present', () => {
    const r = calculateRisk({
      gender: 'male',
      age_range: 'below25',
      family_history: 'none',
      weight_kg: 65,
      height_cm: 175,
      medical_conditions: 'none',
      symptoms: 'frequent-urination,excessive-thirst,fatigue',
    })
    expect(r.riskLevel).toBe('MODERATE')
  })
})

// ── calculateRisk — BMI calculation ──────────────────────────────────
describe('calculateRisk — BMI calculation', () => {
  it('calculates BMI correctly from weight/height', () => {
    const r = calculateRisk({ gender: 'male', weight_kg: 81, height_cm: 180 })
    // BMI = 81 / (1.80^2) = 81 / 3.24 = 25.0
    expect(r.bmi).toBeCloseTo(25.0, 0)
  })
  it('returns undefined bmi when height is missing', () => {
    const r = calculateRisk({ gender: 'male', weight_kg: 70 })
    expect(r.bmi).toBeUndefined()
  })
})
