/**
 * Diabetes risk scoring: maps user_profiles answers to total score (0–100)
 * and risk level, with riskyFactors for the result page.
 */

export function scoreToLevel(score) {
  if (score <= 30) return 'LOW'
  if (score <= 55) return 'LOW_MODERATE'
  if (score <= 75) return 'MODERATE'
  if (score <= 90) return 'MODERATE_HIGH'
  return 'HIGH'
}

export function bmiPoints(bmi) {
  if (bmi == null || isNaN(bmi)) return 0
  if (bmi < 18.5) return 0
  if (bmi <= 22.9) return 0
  if (bmi <= 27.4) return 5
  if (bmi <= 32.4) return 10
  return 13
}

function bmiBandLabel(bmi) {
  if (bmi == null || isNaN(bmi)) return null
  if (bmi < 18.5) return 'BMI under 18.5'
  if (bmi <= 22.9) return 'BMI 18.5–22.9'
  if (bmi <= 27.4) return 'BMI 23–27.4'
  if (bmi <= 32.4) return 'BMI 27.5–32.4'
  return 'BMI over 32.4'
}

const AGE_POINTS = {
  below25: 0,
  '26-30': 1,
  '30-35': 1,
  '35-40': 2,
  '40-45': 2,
  '45-50': 3,
  above50: 4,
}

const AGE_LABELS = {
  below25: null,
  '26-30': 'Age 25–34',
  '30-35': 'Age 25–34',
  '35-40': 'Age 35–44',
  '40-45': 'Age 35–44',
  '45-50': 'Age 45–54',
  above50: 'Age 55+',
}

const FAMILY_POINTS = { none: 0, 'not-sure': 2, siblings: 4, 'one-parent': 6, 'both-parents': 8 }
const FAMILY_LABELS = {
  none: null,
  'not-sure': 'Family history not sure',
  siblings: 'Siblings with diabetes',
  'one-parent': 'One parent with diabetes',
  'both-parents': 'Both parents with diabetes',
}

const HIP_POINTS_MALE = { less90: 0, '90-100': 3, more100: 5 }
const HIP_POINTS_FEMALE = { less80: 0, '80-90': 3, more90: 5 }
const HIP_LABELS_MALE = { less90: null, '90-100': 'Hip size 90–100 cm', more100: 'Hip size over 100 cm' }
const HIP_LABELS_FEMALE = { less80: null, '80-90': 'Hip size 80–90 cm', more90: 'Hip size over 90 cm' }

const ACTIVITY_POINTS = { vigorous: 0, moderate: 2, light: 4, sedentary: 6 }
const ACTIVITY_LABELS = {
  vigorous: null,
  moderate: '30 min walking daily',
  light: 'Light movement',
  sedentary: 'Mostly sitting',
}

const CONDITION_POINTS = {
  hypertension: 3,
  pcos: 3,
  'high-cholesterol': 2,
  'thyroid-disorder': 2,
  'fatty-liver': 2,
  'heart-disease': 3,
  'kidney-disease': 3,
}
const CONDITION_LABELS = {
  hypertension: 'Hypertension (High BP)',
  pcos: 'PCOS',
  'high-cholesterol': 'High cholesterol',
  'thyroid-disorder': 'Thyroid disorder',
  'fatty-liver': 'Fatty liver',
  'heart-disease': 'Heart disease',
  'kidney-disease': 'Kidney disease',
}

const SYMPTOM_POINTS = 3
const SYMPTOM_LABELS = {
  'frequent-urination': 'Frequent urination',
  'excessive-thirst': 'Excessive thirst',
  'increased-hunger': 'Increased hunger',
  fatigue: 'Fatigue',
  'blurred-vision': 'Blurred vision',
  'slow-wound-healing': 'Slow wound healing',
  'tingling-numbness': 'Tingling or numbness',
  'dark-patches': 'Dark patches around neck',
}

const JUNK_POINTS = { rarely: 0, weekly1_2: 1, weekly3_4: 2, weekly5plus: 3 }
const SUGARY_POINTS = { no: 0, yes: 3 }

const HABIT_POINTS = 2
const HABIT_LABELS = { smoking: 'Smoking', alcohol: 'Alcohol', 'tobacco-chewing': 'Tobacco chewing' }

const SLEEP_POINTS = { '7-8': 0, more8: 0, '6-7': 2, less6: 4 }
const SLEEP_LABELS = { '7-8': null, more8: null, '6-7': 'Sleep 6–7 hours', less6: 'Sleep under 6 hours' }

const WEIGHT_GAIN_POINTS = { no: 0, yes: 3 }
const STRESS_POINTS = { low: 0, moderate: 2, high: 4 }
const STRESS_LABELS = { low: null, moderate: 'Moderate stress', high: 'High stress' }

const GESTATIONAL_POINTS = { not_applicable: 0, no: 0, yes: 3 }

const PROBABILITY_BY_LEVEL = {
  LOW: '1% – 5%',
  LOW_MODERATE: '5% – 15%',
  MODERATE: '15% – 30%',
  MODERATE_HIGH: '30% – 50%',
  HIGH: '50%+',
}

function addFactor(factors, factor, points, category, timeline = '') {
  if (points > 0 && factor) {
    factors.push({ factor, points, category, timeline })
  }
}

/**
 * @param {Record<string, any>} answers - user_profiles row (age_range, weight_kg, height_cm, etc.)
 * @returns {{ totalScore: number, riskLevel: string, riskyFactors: Array<{factor, points, category, timeline}>, probabilityRangeText: string, bmi?: number }}
 */
export function calculateRisk(answers) {
  const factors = []
  let total = 0

  if (!answers) {
    return {
      totalScore: 0,
      riskLevel: 'LOW',
      riskyFactors: [],
      probabilityRangeText: PROBABILITY_BY_LEVEL.LOW,
    }
  }

  const gender = answers.gender === 'female' ? 'female' : 'male'

  // Q1 Age
  const ageRange = answers.age_range
  const agePts = AGE_POINTS[ageRange] ?? 0
  total += agePts
  addFactor(factors, AGE_LABELS[ageRange], agePts, 'Age')

  // Q3 Family
  const family = answers.family_history
  const familyPts = FAMILY_POINTS[family] ?? 0
  total += familyPts
  addFactor(factors, FAMILY_LABELS[family], familyPts, 'Family history')

  // Q4/Q5 BMI
  const weightKg = answers.weight_kg != null ? Number(answers.weight_kg) : null
  const heightCm = answers.height_cm != null ? Number(answers.height_cm) : null
  const bmi = heightCm && weightKg && heightCm > 0
    ? Math.round((weightKg / ((heightCm / 100) ** 2)) * 10) / 10
    : null
  const bmiPts = bmiPoints(bmi)
  total += bmiPts
  const bmiLabel = bmiBandLabel(bmi)
  addFactor(factors, bmiLabel, bmiPts, 'BMI')

  // Q6 Hip
  const hip = answers.hip_size
  const hipPts = gender === 'female'
    ? (HIP_POINTS_FEMALE[hip] ?? 0)
    : (HIP_POINTS_MALE[hip] ?? 0)
  total += hipPts
  const hipLabel = gender === 'female' ? (HIP_LABELS_FEMALE[hip] ?? null) : (HIP_LABELS_MALE[hip] ?? null)
  addFactor(factors, hipLabel, hipPts, 'Waist/Hip')

  // Q7 Activity
  const activity = answers.physical_activity_level
  const activityPts = ACTIVITY_POINTS[activity] ?? 0
  total += activityPts
  addFactor(factors, ACTIVITY_LABELS[activity], activityPts, 'Activity')

  // Q8 Conditions (cap 14)
  const conditionsStr = answers.medical_conditions || ''
  const conditionsList = conditionsStr.split(',').filter(Boolean).filter((c) => c !== 'none')
  let conditionsPts = 0
  for (const c of conditionsList) {
    const pt = CONDITION_POINTS[c] ?? 0
    conditionsPts += pt
    addFactor(factors, CONDITION_LABELS[c] ?? c, pt, 'Medical history')
  }
  total += Math.min(conditionsPts, 14)

  // Q9 Symptoms (cap 16, 3 pts each)
  const symptomsStr = answers.symptoms || ''
  const symptomsList = symptomsStr.split(',').filter(Boolean).filter((s) => s !== 'none')
  const symptomsPts = symptomsList.length * SYMPTOM_POINTS
  for (const s of symptomsList) {
    addFactor(factors, SYMPTOM_LABELS[s] ?? s, SYMPTOM_POINTS, 'Symptoms')
  }
  total += Math.min(symptomsPts, 16)

  // Q10 Junk / outside food (combined)
  const junkPts = JUNK_POINTS[answers.junk_food_frequency] ?? 0
  total += junkPts
  if (junkPts > 0) addFactor(factors, 'Junk/outside food frequency', junkPts, 'Diet')

  // Q11 Sugary drinks
  const sugaryPts = SUGARY_POINTS[answers.sugary_beverages] ?? 0
  total += sugaryPts
  if (sugaryPts > 0) addFactor(factors, 'Sugary beverages', sugaryPts, 'Diet')

  // Q14 Habits (cap 5)
  const habitsStr = answers.habits || ''
  const habitsList = habitsStr.split(',').filter(Boolean).filter((h) => h !== 'none')
  const habitsPts = Math.min(habitsList.length * HABIT_POINTS, 5)
  total += habitsPts
  for (const h of habitsList) {
    if (HABIT_LABELS[h]) addFactor(factors, HABIT_LABELS[h], HABIT_POINTS, 'Habits')
  }

  // Q15 Sleep
  const sleepPts = SLEEP_POINTS[answers.sleep_duration] ?? 0
  total += sleepPts
  addFactor(factors, SLEEP_LABELS[answers.sleep_duration], sleepPts, 'Sleep')

  // Q16 Weight gain
  const wgPts = WEIGHT_GAIN_POINTS[answers.weight_gain] ?? 0
  total += wgPts
  if (wgPts > 0) addFactor(factors, 'Weight gain in last year', wgPts, 'Lifestyle')

  // Q18 Stress
  const stressPts = STRESS_POINTS[answers.stress_level] ?? 0
  total += stressPts
  addFactor(factors, STRESS_LABELS[answers.stress_level], stressPts, 'Lifestyle')

  // Q19 Gestational (female only)
  const gestPts = gender === 'female' ? (GESTATIONAL_POINTS[answers.gestational_diabetes] ?? 0) : 0
  total += gestPts
  if (gestPts > 0) addFactor(factors, 'History of gestational diabetes', gestPts, 'Gestational')

  total = Math.min(100, Math.round(total))

  let riskLevel = scoreToLevel(total)

  // Overrides
  if (riskLevel === 'LOW' && conditionsList.some((c) => c === 'pcos' || c === 'hypertension')) {
    riskLevel = 'LOW_MODERATE'
  }
  if (symptomsList.length >= 3 && (riskLevel === 'LOW' || riskLevel === 'LOW_MODERATE')) {
    riskLevel = 'MODERATE'
  }

  const probabilityRangeText = PROBABILITY_BY_LEVEL[riskLevel] || PROBABILITY_BY_LEVEL.LOW

  return {
    totalScore: total,
    riskLevel,
    riskyFactors: factors,
    probabilityRangeText,
    bmi: bmi ?? undefined,
  }
}
