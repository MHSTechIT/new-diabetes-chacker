/**
 * Preloads all images used in the app to ensure smooth transitions
 * Call this on app initialization
 */

// AgeSelection images - Men
import menDefault from '../assets/men/men.png'
import men26_30 from '../assets/men/m_26-30.png'
import men30_35 from '../assets/men/m_30-35.png'
import men35_40 from '../assets/men/m_35-40.png'
import men40_45 from '../assets/men/m_40-45.png'
import men45_50 from '../assets/men/m_45-50.png'
import menAbove50 from '../assets/men/above_50.png'

// AgeSelection images - Women
import womenDefault from '../assets/women/women.png'
import women26_30 from '../assets/women/w_26-30.png'
import women30_35 from '../assets/women/w_30-35.png'
import women35_40 from '../assets/women/w_35-40.png'
import women40_45 from '../assets/women/w_40-45.png'
import women45_50 from '../assets/women/w_45-50.png'
import womenAbove50 from '../assets/women/above_50.png'

// HipSize images - Men
import maleLess90 from '../assets/hip-size/male_less90.png'
import male90_100 from '../assets/hip-size/male_90_100.png'
import maleMore100 from '../assets/hip-size/male_more100.png'

// HipSize images - Women
import femaleLess80 from '../assets/hip-size/female_less80.png'
import female80_90 from '../assets/hip-size/female_80_90.png'
import femaleMore90 from '../assets/hip-size/female_more90.png'

// PhysicalActivityLevel images - Vigorous
import vigorousMale from '../assets/physical-activity/vigorous_male.png'
import vigorousFemale from '../assets/physical-activity/vigorous_female.png'

// PhysicalActivityLevel images - Moderate
import moderateMale from '../assets/physical-activity/moderate_male.png'
import moderateFemale from '../assets/physical-activity/moderate_female.png'

// PhysicalActivityLevel images - Light
import lightMale from '../assets/physical-activity/light_male.png'
import lightFemale from '../assets/physical-activity/light_female.png'

// PhysicalActivityLevel images - Sedentary
import sedentaryMale from '../assets/physical-activity/sedentary_male.png'
import sedentaryFemale from '../assets/physical-activity/sedentary_female.png'

// JunkFoodFrequency images
import junkFoodMale from '../assets/junk-food/junk_food_male.png'
import junkFoodFemale from '../assets/junk-food/junk_food_female.png'

// OutsideFoodFrequency images
import outsideFoodMale from '../assets/outside-food/outside_food_male.png'
import outsideFoodFemale from '../assets/outside-food/outside_food_female.png'

// CarbohydrateType images
import complexImg from '../assets/carbohydrate-type/complex.png'
import mixedImg from '../assets/carbohydrate-type/mixed.png'
import refinedImg from '../assets/carbohydrate-type/refined.png'

// SugaryBeverages images
import sugaryBeveragesImg from '../assets/sugary-beverages/sugary_beverages.png'

// SleepDuration images
import sleepDurationMaleImg from '../assets/sleep-duration/sleep_duration_male.png'
import sleepDurationFemaleImg from '../assets/sleep-duration/sleep_duration_female.png'

// WeightGain images
import weightGainMaleImg from '../assets/weight-gain/weight_gain_male.png'
import weightGainFemaleImg from '../assets/weight-gain/weight_gain_female.png'

// StressLevel images
import lowMaleImg from '../assets/stress-level/low_male.png'
import lowFemaleImg from '../assets/stress-level/low_female.png'
import moderateMaleImg from '../assets/stress-level/moderate_male.png'
import moderateFemaleImg from '../assets/stress-level/moderate_female.png'
import highMaleImg from '../assets/stress-level/high_male.png'
import highFemaleImg from '../assets/stress-level/high_female.png'

// GenderSelection images (landing page)
import genderMaleImg from '../assets/men.png'
import genderFemaleImg from '../assets/women.png'

// FamilyHistory images
import siblingsImg from '../assets/family/siblings.png'
import motherImg from '../assets/family/mother.png'
import fatherImg from '../assets/family/father.png'

// All images array for preloading
const allImages = [
  // Men
  menDefault,
  men26_30,
  men30_35,
  men35_40,
  men40_45,
  men45_50,
  menAbove50,
  // Women
  womenDefault,
  women26_30,
  women30_35,
  women35_40,
  women40_45,
  women45_50,
  womenAbove50,
  // Hip Size - Men
  maleLess90,
  male90_100,
  maleMore100,
  // Hip Size - Women
  femaleLess80,
  female80_90,
  femaleMore90,
  // Physical Activity - Vigorous
  vigorousMale,
  vigorousFemale,
  // Physical Activity - Moderate
  moderateMale,
  moderateFemale,
  // Physical Activity - Light
  lightMale,
  lightFemale,
  // Physical Activity - Sedentary
  sedentaryMale,
  sedentaryFemale,
  // Junk Food Frequency
  junkFoodMale,
  junkFoodFemale,
  // Outside Food Frequency
  outsideFoodMale,
  outsideFoodFemale,
  // Carbohydrate Type
  complexImg,
  mixedImg,
  refinedImg,
  // Sugary Beverages
  sugaryBeveragesImg,
  // Sleep Duration
  sleepDurationMaleImg,
  sleepDurationFemaleImg,
  // Weight Gain
  weightGainMaleImg,
  weightGainFemaleImg,
  // Stress Level
  lowMaleImg,
  lowFemaleImg,
  moderateMaleImg,
  moderateFemaleImg,
  highMaleImg,
  highFemaleImg,
  // GenderSelection
  genderMaleImg,
  genderFemaleImg,
  // FamilyHistory
  siblingsImg,
  motherImg,
  fatherImg,
]

/**
 * Preloads all images for the app
 * Returns a promise that resolves when all images are loaded
 */
export const preloadAllImages = () => {
  const promises = allImages.map((imageSrc) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = resolve
      img.onerror = resolve // resolve even on error to not block app
      img.src = imageSrc
    })
  })

  return Promise.all(promises)
}
