/**
 * English and Tamil translations for the Diabetes Risk Assessment app.
 * Keys are dot-separated (e.g. intro.title). Use t('intro.title') in components.
 */

const en = {
  // Language switcher
  language: 'Language',
  english: 'English',
  tamil: 'Tamil',

  // Intro page
  intro: {
    title: 'Diabetes Risk Assessment',
    description: 'This assessment is a screening tool only and does not replace a medical diagnosis. Results are based on self-reported information.',
    startButton: 'Start Assessment →',
  },

  // Common
  common: {
    next: 'NEXT',
    back: 'Back',
    result: 'RESULT',
    cancel: 'Cancel',
    yes: 'Yes',
    no: 'No',
    notSure: 'Not sure',
  },

  // Confirm modal (App)
  confirm: {
    startOver: 'Do you want to start the test from the beginning?',
    backToStart: 'Do you need to start from the beginning?',
  },

  // Gender selection
  gender: {
    heading: "What's your gender?",
    subtext: 'Let us know you better',
    male: 'Male',
    female: 'Female',
  },

  // Age selection
  age: {
    title: 'Please choose your age',
    below25: 'Below 25',
    age26_30: 'Age 26 - 30',
    age30_35: 'Age 30 - 35',
    age35_40: 'Age 35 - 40',
    age40_45: 'Age 40 - 45',
    age45_50: 'Age 45 - 50',
    above50: 'Above 50',
  },

  // Gestational diabetes
  gestational: {
    title: 'History of gestational diabetes during pregnancy?',
    notApplicable: 'Not applicable',
  },

  // Weight & height
  weightHeight: {
    title: 'Let us know you better',
    subtitle: 'Help us personalise your diabetes management plan',
    weight: 'Weight',
    height: 'Height',
    bmi: 'BMI',
    kg: 'kg',
    lbs: 'lbs',
    cm: 'cm',
    ft: 'ft',
  },

  // Family history
  familyHistory: {
    title: 'Do you have a family history of diabetes?',
    none: 'No, nobody in my family has it.',
    notSure: "I'm not sure about my family history.",
    siblings: 'Yes, my brother or sister has it.',
    oneParent: 'Yes, one of my parents has it.',
    bothParents: 'Yes, both my parents have it.',
  },

  // Hip size
  hipSize: {
    title: 'Hip size at navel level?',
    maleLess90: 'Less than 90 cm',
    male90_100: '90–100 cm',
    maleMore100: 'More than 100 cm',
    femaleLess80: 'Less than 80 cm',
    female80_90: '80–90 cm',
    femaleMore90: 'More than 90 cm',
  },

  // Physical activity
  physicalActivity: {
    title: 'What is your daily physical activity level?',
    vigorous: 'Physically active job or regular exercise',
    moderate: '30 minutes walking daily',
    light: 'Light movement (household work / short walking)',
    sedentary: 'Mostly sitting (desk job / minimal movement)',
  },

  // Junk food
  junkFood: {
    title: 'How often do you consume junk food?',
    rarely: 'Rarely',
    weekly1_2: '1–2 times per week',
    weekly3_4: '3–4 times per week',
    weekly5plus: '5 or more times/week',
  },

  // Outside food
  outsideFood: {
    title: 'How often do you eat outside food (restaurant/takeaway)?',
  },

  // Carbohydrate type
  carbohydrate: {
    title: 'What type of carbohydrates do you mostly consume?',
    complex: 'Mostly complex (millets, brown rice, whole grains)',
    mixed: 'Mixed',
    refined: 'Mostly refined (white rice, maida, bakery items)',
  },

  // Sugary beverages
  sugaryBeverages: {
    title: 'Do you consume sugary beverages daily? (tea, coffee or drinks)',
  },

  // Sleep duration
  sleepDuration: {
    title: 'How many hours do you sleep daily?',
    hours7_8: '7–8 hours',
    more8: 'More than 8 hours',
    hours6_7: '6–7 hours',
    less6: 'Less than 6 hours',
  },

  // Snoring
  snoring: {
    title: 'Do you snore regularly?',
  },

  // Weight gain
  weightGain: {
    title: 'Have you had sudden weight gain in the last 1 year?',
  },

  // Stress level
  stressLevel: {
    title: 'What is your stress level?',
    low: 'Low',
    moderate: 'Moderate',
    high: 'High',
  },

  // Medical conditions
  medicalConditions: {
    title: 'Select any conditions you have?',
    hypertension: 'Hypertension (High BP)',
    highCholesterol: 'High cholesterol',
    pcos: 'PCOS',
    thyroidDisorder: 'Thyroid disorder',
    fattyLiver: 'Fatty liver',
    heartDisease: 'Heart disease',
    kidneyDisease: 'Kidney disease',
    none: 'None',
  },

  // Symptoms
  symptoms: {
    title: 'Are you experiencing any of these symptoms?',
    frequentUrination: 'Frequent urination',
    excessiveThirst: 'Excessive thirst',
    increasedHunger: 'Increased hunger',
    fatigue: 'Fatigue',
    blurredVision: 'Blurred vision',
    slowWoundHealing: 'Slow wound healing',
    tinglingNumbness: 'Tingling or numbness in hands/feet',
    darkPatches: 'Dark patches around neck (acanthosis nigricans)',
    noneAbove: 'None of the above',
  },

  // Habits
  habits: {
    title: 'Do you have any of these habits?',
    smoking: 'Smoking',
    alcohol: 'Alcohol',
    tobaccoChewing: 'Tobacco chewing',
    none: 'None',
    modalTitle: 'Almost there!',
    modalSubtitle: 'Enter your details to view your result.',
    nameLabel: 'NAME',
    phoneLabel: 'PHONE NUMBER',
    namePlaceholder: 'Your full name',
    phonePlaceholder: 'e.g. 9876543210',
    phoneHint: 'Enter exactly 10 digits',
    viewResult: 'View my result',
  },

  // Result loader
  resultLoader: {
    calculating: 'Calculating your result…',
  },

  // Result page (main strings)
  resultPage: {
    lowRisk: 'You are unlikely to be Diabetic',
    lowModerate: 'Low chance of developing diabetes',
    moderate: 'You may be Pre-Diabetic',
    moderateHigh: 'You are likely Diabetic',
    high: 'You are likely Diabetic — act now',
    lowRiskBadge: 'LOW RISK',
    lowModerateBadge: 'LOW TO MODERATE',
    moderateBadge: 'MODERATE RISK',
    moderateHighBadge: 'MODERATE TO HIGH',
    highRiskBadge: 'HIGH RISK',
    maintainWeight: 'Maintain healthy weight',
    stayActive: 'Stay active',
    eatBalanced: 'Eat balanced diet',
    reduceCarbs: 'Reduce refined carbs and sugary drinks',
    addWalking: 'Add 30 minutes daily walking',
    bloodTest6mo: 'Get a blood sugar test within 6 months',
    seeDoctor: 'See a doctor',
    hba1c: 'HbA1c and fasting glucose',
    lifestyleChanges: 'Lifestyle changes',
    seeDoctorSoon: 'See doctor soon',
    fullBloodPanel: 'Full blood panel',
    strictLifestyle: 'Strict lifestyle changes',
    seeDoctorNow: 'See doctor immediately',
    bloodTests: 'Blood tests',
    followAdvice: 'Follow medical advice',
    yourResult: 'Your Result',
    visualAndResult: 'Visual and result',
    yourReportSummary: 'Your report summary',
    accuracyNote: 'This result is 50–60% accurate. Based on your answers only.',
    bookBloodTestCta: 'To get 100% Result book today for blood test',
    whatToDoNext: 'What to do next',
    contributionFactor: 'Contribution factor',
    probability: 'Probability',
    noFactorsNote: 'No very high risk contributing factors in this range. Result is based on your overall profile.',
    retest: 'Retest',
    share: 'Share',
    retestConfirmMessage: 'Start the assessment again from the beginning? Your current result will be cleared.',
    retestConfirmYes: 'Yes, retest',
    loadingText: 'your result is loading......',
    analyzingReport: 'Analyzing your report…',
    summaryHigh: 'Your risk is high. Please see a doctor as soon as possible.',
    summaryLowPrefix: 'Your risk is low. Factors like ',
    summaryLowSuffix: ' may contribute. Keep up healthy habits.',
    summaryLowModeratePrefix: 'You have a low but present risk. Factors like ',
    summaryLowModerateSuffix: ' are contributing. Targeted lifestyle changes can keep this risk from growing.',
    summaryModeratePrefix: 'Notable factors: ',
    summaryModerateSuffix: '. A check-up is recommended.',
    summaryModerateHighPrefix: 'Several factors (e.g. ',
    summaryModerateHighSuffix: ') suggest elevated risk. Please consult a healthcare provider.',
    summaryHighMultiPrefix: 'Multiple risk factors including ',
    summaryHighMultiSuffix: ' indicate high risk. See a doctor as soon as possible.',
    summaryNoFactorsLow: 'Your responses suggest a low diabetes risk. Keep up healthy habits.',
    summaryNoFactorsLowModerate: 'You have a low but present risk. Targeted lifestyle changes can keep this risk from growing.',
    summaryNoFactorsModerate: 'Your risk is moderate. We recommend speaking with a doctor.',
    summaryNoFactorsModerateHigh: 'Your risk is elevated. Please consult a healthcare provider.',
    goBack: 'Go back',
    watchRiskLevel: 'Watch: Your risk level',
  },
}

const ta = {
  language: 'மொழி',
  english: 'English',
  tamil: 'தமிழ்',

  intro: {
    title: 'நீரிழிவு அபாய மதிப்பீடு',
    description: 'இந்த மதிப்பீடு திரையிடல் கருவி மட்டுமே; மருத்துவ நோய் நிர்ணயத்தை மாற்றாது. முடிவுகள் சுய-அறிக்கை தகவல்களின் அடிப்படையில் உள்ளன.',
    startButton: 'மதிப்பீட்டைத் தொடங்கு →',
  },

  common: {
    next: 'அடுத்தது',
    back: 'பின்செல்',
    result: 'முடிவு',
    cancel: 'ரத்து',
    yes: 'ஆம்',
    no: 'இல்லை',
    notSure: 'உறுதியில்லை',
  },

  confirm: {
    startOver: 'சோதனையை முதலிலிருந்து தொடங்க விரும்புகிறீர்களா?',
    backToStart: 'முதலிலிருந்து தொடங்க வேண்டுமா?',
  },

  gender: {
    heading: 'உங்கள் பாலினம் என்ன?',
    subtext: 'உங்களை நன்றாக அறிந்து கொள்ளுங்கள்',
    male: 'ஆண்',
    female: 'பெண்',
  },

  age: {
    title: 'தயவுசெய்து உங்கள் வயதைத் தேர்ந்தெடுக்கவும்',
    below25: '25க்கு கீழ்',
    age26_30: 'வயது 26 - 30',
    age30_35: 'வயது 30 - 35',
    age35_40: 'வயது 35 - 40',
    age40_45: 'வயது 40 - 45',
    age45_50: 'வயது 45 - 50',
    above50: '50க்கு மேல்',
  },

  gestational: {
    title: 'கர்ப்ப காலத்தில் கர்ப்ப நீரிழிவு வரலாறு உண்டா?',
    notApplicable: 'பொருந்தாது',
  },

  weightHeight: {
    title: 'உங்களை நன்றாக அறிந்து கொள்ளுங்கள்',
    subtitle: 'உங்கள் நீரிழிவு மேலாண்மை திட்டத்தை தனிப்பயனாக்க உதவுங்கள்',
    weight: 'எடை',
    height: 'உயரம்',
    bmi: 'பிஎம்ஐ',
    kg: 'கி.கி',
    lbs: 'லிப்',
    cm: 'செ.மீ',
    ft: 'அடி',
  },

  familyHistory: {
    title: 'உங்கள் குடும்பத்தில் நீரிழிவு வரலாறு உள்ளதா?',
    none: 'இல்லை, எங்கள் குடும்பத்தில் யாருக்கும் இல்லை.',
    notSure: 'எங்கள் குடும்ப வரலாறு பற்றி உறுதியாக தெரியவில்லை.',
    siblings: 'ஆம், என் சகோதரன் அல்லது சகோதரிக்கு உள்ளது.',
    oneParent: 'ஆம், என் பெற்றோரில் ஒருவருக்கு உள்ளது.',
    bothParents: 'ஆம், இருவர் பெற்றோருக்கும் உள்ளது.',
  },

  hipSize: {
    title: 'நாபி மட்டத்தில் இடுப்பு அளவு?',
    maleLess90: '90 செ.மீக்கு குறைவு',
    male90_100: '90–100 செ.மீ',
    maleMore100: '100 செ.மீக்கு மேல்',
    femaleLess80: '80 செ.மீக்கு குறைவு',
    female80_90: '80–90 செ.மீ',
    femaleMore90: '90 செ.மீக்கு மேல்',
  },

  physicalActivity: {
    title: 'உங்கள் தினசரி உடல் செயல்பாட்டு நிலை என்ன?',
    vigorous: 'உடல் உழைப்பு வேலை அல்லது வழக்கமான உடற்பயிற்சி',
    moderate: 'தினமும் 30 நிமிடம் நடைபயிற்சி',
    light: 'இலகுவான இயக்கம் (வீட்டு வேலை / குறுகிய நடை)',
    sedentary: 'பெரும்பாலும் உட்கார்ந்து (மேசை வேலை / குறைந்த இயக்கம்)',
  },

  junkFood: {
    title: 'எத்தனை முறை ஜங்க் உணவு சாப்பிடுகிறீர்கள்?',
    rarely: 'அரிதாக',
    weekly1_2: 'வாரத்திற்கு 1–2 முறை',
    weekly3_4: 'வாரத்திற்கு 3–4 முறை',
    weekly5plus: 'வாரத்திற்கு 5 அல்லது அதற்கு மேல்',
  },

  outsideFood: {
    title: 'வெளி உணவு (உணவகம்/எடுத்துச் செல்ல) எத்தனை முறை சாப்பிடுகிறீர்கள்?',
  },

  carbohydrate: {
    title: 'பெரும்பாலும் எந்த வகை கார்போஹைட்ரேட்டுகளை சாப்பிடுகிறீர்கள்?',
    complex: 'பெரும்பாலும் சிக்கலான (தினை, கோதுமை அரிசி, முழு தானியங்கள்)',
    mixed: 'கலப்பு',
    refined: 'பெரும்பாலும் சுத்திகரிக்கப்பட்ட (வெள்ளை அரிசி, மைதா, பேக்கரி)',
  },

  sugaryBeverages: {
    title: 'தினமும் சர்க்கரை பானங்கள் (தேநீர், காபி அல்லது பானங்கள்) சாப்பிடுகிறீர்களா?',
  },

  sleepDuration: {
    title: 'தினமும் எத்தனை மணி நேரம் தூங்குகிறீர்கள்?',
    hours7_8: '7–8 மணி',
    more8: '8 மணிக்கு மேல்',
    hours6_7: '6–7 மணி',
    less6: '6 மணிக்கு குறைவு',
  },

  snoring: {
    title: 'வழக்கமாக குறட்டை விடுகிறீர்களா?',
  },

  weightGain: {
    title: 'கடந்த 1 வருடத்தில் திடீர் எடை அதிகரிப்பு ஏற்பட்டதா?',
  },

  stressLevel: {
    title: 'உங்கள் மன அழுத்த நிலை என்ன?',
    low: 'குறைவு',
    moderate: 'மிதமான',
    high: 'அதிகம்',
  },

  medicalConditions: {
    title: 'உங்களுக்கு உள்ள நிலைமைகளைத் தேர்ந்தெடுக்கவும்?',
    hypertension: 'உயர் இரத்த அழுத்தம்',
    highCholesterol: 'உயர் கொழுப்பு',
    pcos: 'பிசிஓஎஸ்',
    thyroidDisorder: 'தைராய்டு சீர்கேடு',
    fattyLiver: 'கொழுப்பு கல்லீரல்',
    heartDisease: 'இதய நோய்',
    kidneyDisease: 'சிறுநீரக நோய்',
    none: 'எதுவும் இல்லை',
  },

  symptoms: {
    title: 'இந்த அறிகுறிகளில் ஏதேனும் அனுபவிக்கிறீர்களா?',
    frequentUrination: 'அடிக்கடி சிறுநீர் கழித்தல்',
    excessiveThirst: 'அதிக தாகம்',
    increasedHunger: 'அதிக பசி',
    fatigue: 'சோர்வு',
    blurredVision: 'மங்கலான பார்வை',
    slowWoundHealing: 'காயம் மெதுவாக ஆறுதல்',
    tinglingNumbness: 'கைகள்/கால்களில் சிலிர்ப்பு அல்லது மரப்பு',
    darkPatches: 'கழுத்தைச் சுற்றி இருண்ட படைகள்',
    noneAbove: 'மேலுள்ள எதுவும் இல்லை',
  },

  habits: {
    title: 'இந்த பழக்கங்களில் ஏதேனும் உள்ளதா?',
    smoking: 'புகைப்பழக்கம்',
    alcohol: 'மது',
    tobaccoChewing: 'புகையிலை மெல்லுதல்',
    none: 'எதுவும் இல்லை',
    modalTitle: 'கிட்டத்தட்ட முடிந்துவிட்டது!',
    modalSubtitle: 'முடிவைப் பார்க்க உங்கள் விவரங்களை உள்ளிடவும்.',
    nameLabel: 'பெயர்',
    phoneLabel: 'தொலைபேசி எண்',
    namePlaceholder: 'உங்கள் முழுப் பெயர்',
    phonePlaceholder: 'எ.கா. 9876543210',
    phoneHint: 'சரியாக 10 இலக்கங்கள் உள்ளிடவும்',
    viewResult: 'என் முடிவைப் பார்',
  },

  resultLoader: {
    calculating: 'உங்கள் முடிவைக் கணக்கிடுகிறது…',
  },

  resultPage: {
    lowRisk: 'நீரிழிவு இருக்க வாய்ப்பு குறைவு',
    lowModerate: 'நீரிழிவு வர வாய்ப்பு குறைவு',
    moderate: 'நீங்கள் முன்-நீரிழிவு இருக்கலாம்',
    moderateHigh: 'நீரிழிவு இருக்க வாய்ப்பு அதிகம்',
    high: 'நீரிழிவு இருக்க வாய்ப்பு அதிகம் — உடனடியாக நடவடிக்கை எடுங்கள்',
    lowRiskBadge: 'குறைந்த அபாயம்',
    lowModerateBadge: 'குறைந்து முதல் மிதமான',
    moderateBadge: 'மிதமான அபாயம்',
    moderateHighBadge: 'மிதமானது முதல் அதிகம்',
    highRiskBadge: 'அதிக அபாயம்',
    maintainWeight: 'ஆரோக்கிய எடையை பராமரிக்கவும்',
    stayActive: 'சுறுசுறுப்பாக இருங்கள்',
    eatBalanced: 'சமச்சீர் உணவு சாப்பிடுங்கள்',
    reduceCarbs: 'சுத்திகரிக்கப்பட்ட கார்போஹைட்ரேட்டுகள் மற்றும் சர்க்கரை பானங்களை குறைக்கவும்',
    addWalking: 'தினமும் 30 நிமிடம் நடைபயிற்சி சேர்க்கவும்',
    bloodTest6mo: '6 மாதங்களுக்குள் இரத்த சர்க்கரை சோதனை செய்யுங்கள்',
    seeDoctor: 'மருத்துவரைப் பாருங்கள்',
    hba1c: 'HbA1c மற்றும் fasting குளுக்கோஸ்',
    lifestyleChanges: 'வாழ்க்கை முறை மாற்றங்கள்',
    seeDoctorSoon: 'விரைவில் மருத்துவரைப் பாருங்கள்',
    fullBloodPanel: 'முழு இரத்த பேனல்',
    strictLifestyle: 'கடுமையான வாழ்க்கை முறை மாற்றங்கள்',
    seeDoctorNow: 'உடனடியாக மருத்துவரைப் பாருங்கள்',
    bloodTests: 'இரத்த சோதனைகள்',
    followAdvice: 'மருத்துவ ஆலோசனையைப் பின்பற்றுங்கள்',
    yourResult: 'உங்கள் முடிவு',
    visualAndResult: 'காட்சி மற்றும் முடிவு',
    yourReportSummary: 'உங்கள் அறிக்கை சுருக்கம்',
    accuracyNote: 'இந்த முடிவு 50–60% துல்லியமானது. உங்கள் பதில்களின் அடிப்படையில் மட்டுமே.',
    bookBloodTestCta: '100% முடிவுக்கு இன்றே இரத்த சோதனை புத்தகம் செய்யுங்கள்',
    whatToDoNext: 'அடுத்து என்ன செய்வது',
    contributionFactor: 'பங்களிப்பு காரணி',
    probability: 'நிகழ்தகவு',
    noFactorsNote: 'இந்த வரம்பில் மிக அதிக அபாய பங்களிப்பு காரணிகள் இல்லை. முடிவு உங்கள் ஒட்டுமொத்த சுயவிவரத்தின் அடிப்படையில் உள்ளது.',
    retest: 'மறுசோதனை',
    share: 'பகிர்',
    retestConfirmMessage: 'முதலிலிருந்து மதிப்பீட்டை மீண்டும் தொடங்குவீர்களா? உங்கள் தற்போதைய முடிவு அழிக்கப்படும்.',
    retestConfirmYes: 'ஆம், மறுசோதனை',
    loadingText: 'உங்கள் முடிவு ஏற்றுக் கொள்ளப்படுகிறது......',
    analyzingReport: 'உங்கள் அறிக்கையை பகுப்பாய்வு செய்கிறது…',
    summaryHigh: 'உங்கள் அபாயம் அதிகம். தயவுசெய்து விரைவில் மருத்துவரைப் பாருங்கள்.',
    summaryLowPrefix: 'உங்கள் அபாயம் குறைவு. ',
    summaryLowSuffix: ' போன்ற காரணிகள் பங்களிக்கக்கூடும். ஆரோக்கியமான பழக்கங்களை பராமரிக்கவும்.',
    summaryLowModeratePrefix: 'உங்களுக்கு குறைந்த ஆனால் இருக்கும் அபாயம் உள்ளது. ',
    summaryLowModerateSuffix: ' பங்களிக்கின்றன. இலக்கு வாழ்க்கை முறை மாற்றங்கள் இந்த அபாயத்தை வளராமல் இருக்க செய்யும்.',
    summaryModeratePrefix: 'குறிப்பிடத்தக்க காரணிகள்: ',
    summaryModerateSuffix: '. சோதனை பரிந்துரைக்கப்படுகிறது.',
    summaryModerateHighPrefix: 'பல காரணிகள் (எ.கா. ',
    summaryModerateHighSuffix: ') அதிகரித்த அபாயத்தைக் குறிக்கின்றன. தயவுசெய்து சுகாதார சேவை வழங்குநரைக் கலந்தாலோசிக்கவும்.',
    summaryHighMultiPrefix: 'பல அபாய காரணிகள் உட்பட ',
    summaryHighMultiSuffix: ' அதிக அபாயத்தைக் குறிக்கிறது. விரைவில் மருத்துவரைப் பாருங்கள்.',
    summaryNoFactorsLow: 'உங்கள் பதில்கள் குறைந்த நீரிழிவு அபாயத்தைக் குறிக்கின்றன. ஆரோக்கியமான பழக்கங்களை பராமரிக்கவும்.',
    summaryNoFactorsLowModerate: 'உங்களுக்கு குறைந்த ஆனால் இருக்கும் அபாயம் உள்ளது. இலக்கு வாழ்க்கை முறை மாற்றங்கள் இந்த அபாயத்தை வளராமல் இருக்க செய்யும்.',
    summaryNoFactorsModerate: 'உங்கள் அபாயம் மிதமானது. மருத்துவருடன் பேச பரிந்துரைக்கிறோம்.',
    summaryNoFactorsModerateHigh: 'உங்கள் அபாயம் அதிகரித்துள்ளது. தயவுசெய்து சுகாதார சேவை வழங்குநரைக் கலந்தாலோசிக்கவும்.',
    goBack: 'பின்செல்',
    watchRiskLevel: 'பார்க்க: உங்கள் அபாய நிலை',
  },
}

function getNested(obj, path) {
  const keys = path.split('.')
  let current = obj
  for (const key of keys) {
    if (current == null) return undefined
    current = current[key]
  }
  return current
}

export const translations = { en, ta }

export function getTranslation(lang, key) {
  const val = getNested(translations[lang] || en, key)
  return val != null ? val : getNested(en, key) || key
}
