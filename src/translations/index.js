/**
 * English and Tamil translations for the Diabetes Risk Assessment app.
 * Keys are dot-separated (e.g. intro.title). Use t('intro.title') in components.
 */

const en = {
  // Language switcher
  language: 'Language',
  selectYourLanguage: 'Select your language',
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

  // Junk food (combined with outside food)
  junkFood: {
    title: 'How often do you eat junk or outside food?',
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

  // Weight gain/loss
  weightGain: {
    title: 'Have you noticed any recent changes in your weight (gain or loss)?',
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
    ageLabel: 'AGE',
    locationLabel: 'LOCATION',
    namePlaceholder: 'Your full name',
    phonePlaceholder: 'e.g. 9876543210',
    phoneHint: 'Enter exactly 10 digits',
    agePlaceholder: 'e.g. 35',
    locationPlaceholder: 'e.g. Chennai, Tamil Nadu',
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
    bloodTestCta299: 'Get your 100% report on blood test for ₹299/-',
    goBack: 'Go back',
    watchRiskLevel: 'Watch: Your risk level',

    // Simple explanation by risk level
    explanationLow: 'Your blood sugar levels are within a healthy range. Maintain your current lifestyle to stay healthy.',
    explanationLowModerate: 'Your blood sugar levels are slightly higher than normal. This is an early warning stage, but it can be reversed with simple lifestyle changes.',
    explanationModerate: 'Your blood sugar levels are slightly higher than normal. This is an early warning stage, but it can be reversed with simple lifestyle changes.',
    explanationModerateHigh: 'Your blood sugar levels are high. This indicates diabetes risk, and it is important to take action and consult a healthcare professional.',
    explanationHigh: 'Your blood sugar levels are high. This indicates diabetes risk, and it is important to take action and consult a healthcare professional.',

    // Emotional message by risk level
    emotionalLow: 'Great job! Keep maintaining your healthy habits.',
    emotionalLowModerate: 'Good news! You can still reverse this with simple changes. Start small, stay consistent.',
    emotionalModerate: 'Good news! You can still reverse this with simple changes. Start small, stay consistent.',
    emotionalModerateHigh: 'Take action now — small steps lead to big improvements. You are not alone in this.',
    emotionalHigh: 'Take action now — small steps lead to big improvements. You are not alone in this.',

    // 3 universal action steps
    actionStepsTitle: 'What you should do now',
    actionStep1: 'Reduce sugar, refined foods, and packaged snacks',
    actionStep2: 'Walk for 10–15 minutes after every meal',
    actionStep3: 'Sleep on time (before 11 PM) and avoid late-night eating',

    // Food guidance
    foodGuidanceTitle: 'Food Guide',
    foodEatMoreLabel: 'Eat more',
    foodEatMoreItems: 'Vegetables, protein, traditional foods',
    foodAvoidLabel: 'Avoid',
    foodAvoidItems: 'Sugary drinks, bakery items, packaged snacks',

    // Daily tip
    dailyTipLabel: 'Did you know?',

    // CTA buttons
    checkAgainLater: 'Check Again Later',
    talkToExpert: 'Talk to Expert',
    callBooked: '✅ Call Booked',
    bloodTestBooked: '✅ Test Booked',

    // Disclaimer
    disclaimer: 'This is not a medical diagnosis. Consult a doctor for confirmation.',
  },

  // Book Home Test page
  bookHomeTest: {
    pageTitle: 'Book Home Test',
    doorstepTag: 'DOORSTEP COLLECTION',
    introTitle: 'When should we come?',
    introDesc: 'Sample collected at home. Report in 24 hours.',
    featurePanel: 'HbA1c + FBS Panel',
    featurePanelSub: 'Auto-selected based on your risk',
    featureReport: 'Report in 24 hours',
    featureReportSub: 'Certified lab partner',
    featureHome: 'Home collection',
    featureHomeSub: 'No need to visit a lab',
    formTitle: 'Personal & Appointment Details',
    labelName: 'FULL NAME',
    placeholderName: 'Full name',
    labelMobile: 'MOBILE',
    labelAddress: 'ADDRESS',
    placeholderAddress: 'Enter full address...',
    labelPincode: 'PINCODE',
    placeholderPincode: 'e.g. 600001',
    labelDate: 'PREFERRED DATE',
    labelTimeSlot: 'TIME SLOT',
    slotMorning: 'Morning',
    slotAfternoon: 'Afternoon',
    slotEvening: 'Evening',
    panelName: 'HbA1c + Fasting Blood Sugar Panel',
    panelSub: 'Auto-selected based on your risk score',
    submit: 'Submit booking',
    submitting: 'Saving…',
    errorFill: 'Please fill all fields. Mobile must be 10 digits.',
    successTitle: 'Booking request saved',
    successText: "We'll contact you at +91 {mobile} to confirm your doorstep collection.",
    backToResult: 'Back to result',
  },

  // Expert Call Modal
  expertCall: {
    title: 'Schedule a Call',
    subtitle: 'Choose a date and time for your expert consultation',
    timeHeading: 'Select time (10 AM – 5 PM)',
    confirmSchedule: 'Confirm Schedule',
    confirmHeading: 'Confirm Your Booking',
    labelDate: 'Date',
    labelTime: 'Time',
    labelName: 'Name',
    labelPhone: 'Phone',
    confirmNote: 'Our expert will call you at the scheduled time.',
    change: 'Change',
    bookCall: 'Book Call',
    booking: 'Booking your call…',
    successHeading: 'Call Scheduled!',
    successText: 'Your expert call is booked for',
    successAt: 'at',
    successNote: 'Our expert will call you on your registered number.',
    done: 'Done',
    tryAgain: 'Try Again',
  },
}

const ta = {
  language: 'மொழி',
  selectYourLanguage: 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்',
  english: 'English',
  tamil: 'தமிழ்',

  intro: {
    title: 'சர்க்கரை நோய் அபாய மதிப்பீடு',
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
    title: 'கர்ப்ப காலத்தில் சர்க்கரை நோய் வரலாறு உண்டா?',
    notApplicable: 'பொருந்தாது',
  },

  weightHeight: {
    title: 'உங்களை நன்றாக அறிந்து கொள்ளுங்கள்',
    subtitle: 'உங்கள் சர்க்கரை நோய் மேலாண்மை திட்டத்தை தனிப்பயனாக்க உதவுங்கள்',
    weight: 'எடை',
    height: 'உயரம்',
    bmi: 'பிஎம்ஐ',
    kg: 'கி.கி',
    lbs: 'லிப்',
    cm: 'செ.மீ',
    ft: 'அடி',
  },

  familyHistory: {
    title: 'உங்கள் குடும்பத்தில் சர்க்கரை நோய் வரலாறு உள்ளதா?',
    none: 'இல்லை, எங்கள் குடும்பத்தில் யாருக்கும் இல்லை.',
    notSure: 'எங்கள் குடும்ப வரலாறு பற்றி உறுதியாக தெரியவில்லை.',
    siblings: 'ஆம், என் சகோதரன் அல்லது சகோதரிக்கு உள்ளது.',
    oneParent: 'ஆம், என் பெற்றோரில் ஒருவருக்கு உள்ளது.',
    bothParents: 'ஆம், பெற்றோர் இருவருக்கும் உள்ளது.',
  },

  hipSize: {
    title: 'தொப்புள் பகுதியில் இடுப்பு அளவு?',
    maleLess90: '90 செ.மீக்கு குறைவு',
    male90_100: '90–100 செ.மீ',
    maleMore100: '100 செ.மீக்கு மேல்',
    femaleLess80: '80 செ.மீக்கு குறைவு',
    female80_90: '80–90 செ.மீ',
    femaleMore90: '90 செ.மீக்கு மேல்',
  },

  physicalActivity: {
    title: 'உங்கள் தினசரி உடல் செயல்பாட்டு நிலை என்ன?',
    vigorous: 'உடல் உழைப்பு அதிகமான வேலை அல்லது வழக்கமான உடற்பயிற்சி',
    moderate: 'தினமும் 30 நிமிடம் நடைபயிற்சி',
    light: 'இலகுவான இயக்கம் (வீட்டு வேலை / குறுகிய நடை)',
    sedentary: 'பெரும்பாலும் உட்கார்ந்து (மேசை வேலை / குறைந்த இயக்கம்)',
  },

  junkFood: {
    title: 'எத்தனை முறை ஜங்க் அல்லது வெளி உணவு சாப்பிடுகிறீர்கள்?',
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
    title: 'சமீபத்தில் உங்கள் எடையில் ஏதேனும் மாற்றம் (அதிகரிப்பு அல்லது குறைப்பு) ஏற்பட்டதா?',
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
    highCholesterol: 'கொலஸ்ட்ரால்',
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
    ageLabel: 'வயது',
    locationLabel: 'இருப்பிடம்',
    namePlaceholder: 'உங்கள் முழுப் பெயர்',
    phonePlaceholder: 'எ.கா. 9876543210',
    phoneHint: 'சரியாக 10 இலக்கங்கள் உள்ளிடவும்',
    agePlaceholder: 'எ.கா. 35',
    locationPlaceholder: 'எ.கா. சென்னை, தமிழ்நாடு',
    viewResult: 'என் முடிவைப் பார்',
  },

  resultLoader: {
    calculating: 'உங்கள் முடிவைக் கணக்கிடுகிறது…',
  },

  resultPage: {
    lowRisk: 'சர்க்கரை நோய் இருக்க வாய்ப்பு குறைவு',
    lowModerate: 'சர்க்கரை நோய் வர வாய்ப்பு குறைவு',
    moderate: 'நீங்கள் முன் சர்க்கரை நோய் நிலையில் இருக்கலாம்',
    moderateHigh: 'சர்க்கரை நோய் இருக்க வாய்ப்பு அதிகம்',
    high: 'சர்க்கரை நோய் இருக்க வாய்ப்பு அதிகம் — உடனடியாக நடவடிக்கை எடுங்கள்',
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
    hba1c: 'HbA1c மற்றும் fasting குளுக்கோஸ் சோதனை செய்யுங்கள்',
    lifestyleChanges: 'வாழ்க்கை முறை மாற்றங்கள்',
    seeDoctorSoon: 'விரைவில் மருத்துவரைப் பாருங்கள்',
    fullBloodPanel: 'முழு இரத்த பேனல் எடுக்கவும்',
    strictLifestyle: 'கடுமையான வாழ்க்கை முறை மாற்றங்கள் பின்பற்றவும்',
    seeDoctorNow: 'உடனடியாக மருத்துவரைப் பாருங்கள்',
    bloodTests: 'இரத்த சோதனைகள் செய்யவும்',
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
    summaryModerateHighSuffix: ') அதிகரித்த அபாயத்தைக் குறிக்கின்றன. தயவுசெய்து ஆரோக்கிய ஆலோசகரைக் கலந்தாலோசிக்கவும்.',
    summaryHighMultiPrefix: 'பல அபாய காரணிகள் உட்பட ',
    summaryHighMultiSuffix: ' அதிக அபாயத்தைக் குறிக்கிறது. விரைவில் மருத்துவரைப் பாருங்கள்.',
    summaryNoFactorsLow: 'உங்கள் பதில்கள் குறைந்த சர்க்கரை நோய் அபாயத்தைக் குறிக்கின்றன. ஆரோக்கியமான பழக்கங்களை பராமரிக்கவும்.',
    summaryNoFactorsLowModerate: 'உங்களுக்கு குறைந்த ஆனால் இருக்கும் அபாயம் உள்ளது. இலக்கு வாழ்க்கை முறை மாற்றங்கள் இந்த அபாயத்தை வளராமல் இருக்க செய்யும்.',
    summaryNoFactorsModerate: 'உங்கள் அபாயம் மிதமானது. மருத்துவருடன் பேச பரிந்துரைக்கிறோம்.',
    summaryNoFactorsModerateHigh: 'உங்கள் அபாயம் அதிகரித்துள்ளது. தயவுசெய்து ஆரோக்கிய ஆலோசகரைக் கலந்தாலோசிக்கவும்.',
    bloodTestCta299: 'இரத்த சோதனையில் 100% அறிக்கை பெறுங்கள் ₹299/-க்கு',
    goBack: 'பின்செல்',
    watchRiskLevel: 'பார்க்க: உங்கள் அபாய நிலை',

    // Simple explanation by risk level
    explanationLow: 'உங்கள் இரத்த சர்க்கரை அளவுகள் ஆரோக்கியமான வரம்பில் உள்ளன. ஆரோக்கியமாக இருக்க உங்கள் தற்போதைய வாழ்க்கை முறையை பராமரிக்கவும்.',
    explanationLowModerate: 'உங்கள் இரத்த சர்க்கரை அளவுகள் சாதாரணத்தை விட சற்று அதிகமாக உள்ளன. இது ஒரு ஆரம்ப எச்சரிக்கை நிலை, ஆனால் எளிய வாழ்க்கை முறை மாற்றங்களால் இதை மாற்றலாம்.',
    explanationModerate: 'உங்கள் இரத்த சர்க்கரை அளவுகள் சாதாரணத்தை விட சற்று அதிகமாக உள்ளன. இது ஒரு ஆரம்ப எச்சரிக்கை நிலை, ஆனால் எளிய வாழ்க்கை முறை மாற்றங்களால் இதை மாற்றலாம்.',
    explanationModerateHigh: 'உங்கள் இரத்த சர்க்கரை அளவுகள் அதிகமாக உள்ளன. இது சர்க்கரை நோய் அபாயத்தைக் குறிக்கிறது, நடவடிக்கை எடுக்கவும் மற்றும் சுகாதார நிபுணரை அணுகவும்.',
    explanationHigh: 'உங்கள் இரத்த சர்க்கரை அளவுகள் அதிகமாக உள்ளன. இது சர்க்கரை நோய் அபாயத்தைக் குறிக்கிறது, நடவடிக்கை எடுக்கவும் மற்றும் சுகாதார நிபுணரை அணுகவும்.',

    // Emotional message
    emotionalLow: 'அருமை! உங்கள் ஆரோக்கியமான பழக்கங்களை தொடர்ந்து பராமரிக்கவும்.',
    emotionalLowModerate: 'நல்ல செய்தி! எளிய மாற்றங்களால் இதை மாற்றலாம். சிறியதாக தொடங்குங்கள், நிலையாக இருங்கள்.',
    emotionalModerate: 'நல்ல செய்தி! எளிய மாற்றங்களால் இதை மாற்றலாம். சிறியதாக தொடங்குங்கள், நிலையாக இருங்கள்.',
    emotionalModerateHigh: 'இப்போதே நடவடிக்கை எடுங்கள் — சிறிய படிகள் பெரிய முன்னேற்றத்திற்கு வழிவகுக்கும். நீங்கள் தனியாக இல்லை.',
    emotionalHigh: 'இப்போதே நடவடிக்கை எடுங்கள் — சிறிய படிகள் பெரிய முன்னேற்றத்திற்கு வழிவகுக்கும். நீங்கள் தனியாக இல்லை.',

    // 3 universal action steps
    actionStepsTitle: 'இப்போது என்ன செய்ய வேண்டும்',
    actionStep1: 'சர்க்கரை, சுத்திகரிக்கப்பட்ட உணவுகள் மற்றும் பேக்கேஜ் செய்யப்பட்ட சிற்றுண்டிகளை குறைக்கவும்',
    actionStep2: 'ஒவ்வொரு உணவிற்கும் பிறகு 10–15 நிமிடங்கள் நடக்கவும்',
    actionStep3: 'சரியான நேரத்தில் தூங்குங்கள் (இரவு 11 மணிக்கு முன்பு) மற்றும் இரவு சாப்பிடுவதை தவிர்க்கவும்',

    // Food guidance
    foodGuidanceTitle: 'உணவு வழிகாட்டி',
    foodEatMoreLabel: 'அதிகமாக சாப்பிடுங்கள்',
    foodEatMoreItems: 'காய்கறிகள், புரதம், பாரம்பரிய உணவுகள்',
    foodAvoidLabel: 'தவிர்க்கவும்',
    foodAvoidItems: 'சர்க்கரை பானங்கள், பேக்கரி பொருட்கள், பேக்கேஜ் சிற்றுண்டிகள்',

    // Daily tip
    dailyTipLabel: 'தெரியுமா?',

    // CTA buttons
    checkAgainLater: 'பின்னர் மீண்டும் சோதிக்கவும்',
    talkToExpert: 'நிபுணரிடம் பேசுங்கள்',
    callBooked: '✅ அழைப்பு முன்பதிவு செய்யப்பட்டது',
    bloodTestBooked: '✅ சோதனை முன்பதிவு செய்யப்பட்டது',

    // Disclaimer
    disclaimer: 'இது மருத்துவ நோய் நிர்ணயம் அல்ல. உறுதிப்படுத்த மருத்துவரை அணுகவும்.',
  },

  // Book Home Test page
  bookHomeTest: {
    pageTitle: 'வீட்டு சோதனை முன்பதிவு',
    doorstepTag: 'வீட்டு சேவை',
    introTitle: 'எப்போது வரவேண்டும்?',
    introDesc: 'வீட்டிலேயே மாதிரி சேகரிப்பு. 24 மணி நேரத்தில் அறிக்கை.',
    featurePanel: 'HbA1c + FBS பரிசோதனை',
    featurePanelSub: 'உங்கள் அபாய நிலையின் அடிப்படையில் தேர்ந்தெடுக்கப்பட்டது',
    featureReport: '24 மணி நேரத்தில் அறிக்கை',
    featureReportSub: 'சான்றளிக்கப்பட்ட ஆய்வக கூட்டாளர்',
    featureHome: 'வீட்டு சேகரிப்பு',
    featureHomeSub: 'ஆய்வகத்திற்கு செல்ல வேண்டியதில்லை',
    formTitle: 'தனிப்பட்ட மற்றும் சந்திப்பு விவரங்கள்',
    labelName: 'முழுப் பெயர்',
    placeholderName: 'முழுப் பெயர்',
    labelMobile: 'மொபைல்',
    labelAddress: 'முகவரி',
    placeholderAddress: 'முழு முகவரியை உள்ளிடவும்...',
    labelPincode: 'பின்கோடு',
    placeholderPincode: 'எ.கா. 600001',
    labelDate: 'விருப்பமான தேதி',
    labelTimeSlot: 'நேர இடைவெளி',
    slotMorning: 'காலை',
    slotAfternoon: 'மதியம்',
    slotEvening: 'மாலை',
    panelName: 'HbA1c + உண்ணாவிரத இரத்த சர்க்கரை பரிசோதனை',
    panelSub: 'உங்கள் அபாய மதிப்பெண்ணின் அடிப்படையில் தேர்ந்தெடுக்கப்பட்டது',
    submit: 'முன்பதிவு சமர்ப்பிக்கவும்',
    submitting: 'சேமிக்கிறது…',
    errorFill: 'அனைத்து தகவல்களையும் நிரப்பவும். மொபைல் 10 இலக்கங்கள் இருக்க வேண்டும்.',
    successTitle: 'முன்பதிவு கோரிக்கை சேமிக்கப்பட்டது',
    successText: 'உங்கள் வீட்டு சேகரிப்பை உறுதிப்படுத்த +91 {mobile} என்ற எண்ணில் தொடர்பு கொள்வோம்.',
    backToResult: 'முடிவுக்கு திரும்பு',
  },

  // Expert Call Modal
  expertCall: {
    title: 'அழைப்பு திட்டமிடுங்கள்',
    subtitle: 'உங்கள் நிபுணர் ஆலோசனைக்கு தேதி மற்றும் நேரத்தை தேர்ந்தெடுக்கவும்',
    timeHeading: 'நேரத்தை தேர்ந்தெடுக்கவும் (காலை 10 – மாலை 5)',
    confirmSchedule: 'திட்டத்தை உறுதிப்படுத்தவும்',
    confirmHeading: 'முன்பதிவை உறுதிப்படுத்தவும்',
    labelDate: 'தேதி',
    labelTime: 'நேரம்',
    labelName: 'பெயர்',
    labelPhone: 'தொலைபேசி',
    confirmNote: 'திட்டமிட்ட நேரத்தில் நிபுணர் உங்களை அழைப்பார்.',
    change: 'மாற்றவும்',
    bookCall: 'அழைப்பு முன்பதிவு',
    booking: 'அழைப்பை முன்பதிவு செய்கிறது…',
    successHeading: 'அழைப்பு திட்டமிடப்பட்டது!',
    successText: 'உங்கள் நிபுணர் அழைப்பு முன்பதிவு செய்யப்பட்டுள்ளது',
    successAt: 'நேரத்தில்',
    successNote: 'உங்கள் பதிவு செய்யப்பட்ட எண்ணில் நிபுணர் அழைப்பார்.',
    done: 'முடிந்தது',
    tryAgain: 'மீண்டும் முயற்சிக்கவும்',
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

/** Tamil labels for contribution factor chips (English key → Tamil text) */
const RESULT_FACTOR_TA = {
  'BMI under 18.5': 'பிஎம்ஐ 18.5க்கு கீழ்',
  'BMI 18.5–22.9': 'பிஎம்ஐ 18.5–22.9',
  'BMI 23–27.4': 'பிஎம்ஐ 23–27.4',
  'BMI 27.5–32.4': 'பிஎம்ஐ 27.5–32.4',
  'BMI over 32.4': 'பிஎம்ஐ 32.4க்கு மேல்',
  'Age 25–34': 'வயது 25–34',
  'Age 35–44': 'வயது 35–44',
  'Age 45–54': 'வயது 45–54',
  'Age 55+': 'வயது 55+',
  'Family history not sure': 'குடும்ப வரலாறு உறுதியில்லை',
  'Siblings with diabetes': 'சகோதரர்/சகோதரி சர்க்கரை நோய்',
  'One parent with diabetes': 'ஒரு பெற்றோர் சர்க்கரை நோய்',
  'Both parents with diabetes': 'பெற்றோர் இருவருக்கும் சர்க்கரை நோய்',
  'Hip size 90–100 cm': 'இடுப்பு 90–100 செ.மீ',
  'Hip size over 100 cm': 'இடுப்பு 100 செ.மீக்கு மேல்',
  'Hip size 80–90 cm': 'இடுப்பு 80–90 செ.மீ',
  'Hip size over 90 cm': 'இடுப்பு 90 செ.மீக்கு மேல்',
  '30 min walking daily': 'தினமும் 30 நிமிடம் நடைபயிற்சி',
  'Light movement': 'சிறிய அளவு உடற்பயிற்சி',
  'Mostly sitting': 'பெரும்பாலும் உட்கார்ந்தே இருப்பது',
  'Hypertension (High BP)': 'உயர் இரத்த அழுத்தம்',
  'PCOS': 'பிசிஓஎஸ்',
  'High cholesterol': 'ரத்தத்தில் கொழுப்பு அதிகமாக இருப்பது',
  'Thyroid disorder': 'தைராய்டு சுரப்பி செயல்பாட்டு பிரச்சனை',
  'Fatty liver': 'கல்லீரல் கொழுப்பு நோய்',
  'Heart disease': 'இதய நோய்',
  'Kidney disease': 'சிறுநீரக நோய்',
  'Frequent urination': 'அடிக்கடி சிறுநீர் கழித்தல்',
  'Excessive thirst': 'அடிக்கடி தாகம் எடுப்பது',
  'Increased hunger': 'அடிக்கடி பசி எடுப்பது',
  'Fatigue': 'சோர்வு',
  'Blurred vision': 'மங்கலான பார்வை',
  'Slow wound healing': 'காயம் மெதுவாக ஆறுதல்',
  'Tingling or numbness': 'சிலிர்ப்பு அல்லது மரப்பு தன்மை',
  'Dark patches around neck': 'கழுத்தைச் சுற்றி கருப்பு தழும்புகள்',
  'Junk/outside food frequency': 'ஜங்க்/வெளி உணவு அடிக்கடி',
  'Sugary beverages': 'சர்க்கரை பானங்கள்',
  'Smoking': 'புகைப்பழக்கம்',
  'Alcohol': 'மது அருந்துதல்',
  'Tobacco chewing': 'புகையிலை மெல்லுதல்',
  'Sleep 6–7 hours': 'தூக்கம் 6–7 மணி',
  'Sleep under 6 hours': 'தூக்கம் 6 மணிக்கு கீழ்',
  'Snoring not sure': 'குறட்டை உறுதியில்லை',
  'Snoring': 'குறட்டை',
  'Weight gain in last year': 'கடந்த ஒரு வருடத்தில் எடை அதிகரிப்பு',
  'Moderate stress': 'மிதமான மன அழுத்தம்',
  'High stress': 'அதிக மன அழுத்தம்',
  'History of gestational diabetes': 'கர்ப்ப கால சர்க்கரை நோய் வரலாறு',
}

export function getFactorLabel(factor, lang) {
  if (!factor) return factor
  if (lang === 'ta') return RESULT_FACTOR_TA[factor] ?? factor
  return factor
}
