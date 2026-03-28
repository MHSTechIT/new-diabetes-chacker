# Tamil strings reference (Diabetes Risk Assessment app)

**Source:** `src/translations/index.js` — object `ta` and map `RESULT_FACTOR_TA`  
**How to change copy:** Edit the same file in code; keep translation keys (`t('...')`) unchanged unless you rename keys in both `en` and `ta`.

**Note:** `outsideFood`, `sugaryBeverages`, `snoring`, and `weightGain` only define **titles** in Tamil; answer buttons reuse `common.yes` / `common.no` / `common.notSure` where applicable.

---

## Root keys

| Key | Tamil (or fixed label) |
|-----|-------------------------|
| `language` | மொழி |
| `selectYourLanguage` | உங்கள் மொழியைத் தேர்ந்தெடுக்கவும் |
| `english` | English |
| `tamil` | தமிழ் |

---

## intro

| Key | Tamil |
|-----|--------|
| `intro.title` | நீரிழிவு அபாய மதிப்பீடு |
| `intro.description` | இந்த மதிப்பீடு திரையிடல் கருவி மட்டுமே; மருத்துவ நோய் நிர்ணயத்தை மாற்றாது. முடிவுகள் சுய-அறிக்கை தகவல்களின் அடிப்படையில் உள்ளன. |
| `intro.startButton` | மதிப்பீட்டைத் தொடங்கு → |

---

## common

| Key | Tamil |
|-----|--------|
| `common.next` | அடுத்தது |
| `common.back` | பின்செல் |
| `common.result` | முடிவு |
| `common.cancel` | ரத்து |
| `common.yes` | ஆம் |
| `common.no` | இல்லை |
| `common.notSure` | உறுதியில்லை |

---

## confirm

| Key | Tamil |
|-----|--------|
| `confirm.startOver` | சோதனையை முதலிலிருந்து தொடங்க விரும்புகிறீர்களா? |
| `confirm.backToStart` | முதலிலிருந்து தொடங்க வேண்டுமா? |

---

## gender

| Key | Tamil |
|-----|--------|
| `gender.heading` | உங்கள் பாலினம் என்ன? |
| `gender.subtext` | உங்களை நன்றாக அறிந்து கொள்ளுங்கள் |
| `gender.male` | ஆண் |
| `gender.female` | பெண் |

---

## age

| Key | Tamil |
|-----|--------|
| `age.title` | தயவுசெய்து உங்கள் வயதைத் தேர்ந்தெடுக்கவும் |
| `age.below25` | 25க்கு கீழ் |
| `age.age26_30` | வயது 26 - 30 |
| `age.age30_35` | வயது 30 - 35 |
| `age.age35_40` | வயது 35 - 40 |
| `age.age40_45` | வயது 40 - 45 |
| `age.age45_50` | வயது 45 - 50 |
| `age.above50` | 50க்கு மேல் |

---

## gestational

| Key | Tamil |
|-----|--------|
| `gestational.title` | கர்ப்ப காலத்தில் கர்ப்ப நீரிழிவு வரலாறு உண்டா? |
| `gestational.notApplicable` | பொருந்தாது |

---

## weightHeight

| Key | Tamil |
|-----|--------|
| `weightHeight.title` | உங்களை நன்றாக அறிந்து கொள்ளுங்கள் |
| `weightHeight.subtitle` | உங்கள் நீரிழிவு மேலாண்மை திட்டத்தை தனிப்பயனாக்க உதவுங்கள் |
| `weightHeight.weight` | எடை |
| `weightHeight.height` | உயரம் |
| `weightHeight.bmi` | பிஎம்ஐ |
| `weightHeight.kg` | கி.கி |
| `weightHeight.lbs` | லிப் |
| `weightHeight.cm` | செ.மீ |
| `weightHeight.ft` | அடி |

---

## familyHistory

| Key | Tamil |
|-----|--------|
| `familyHistory.title` | உங்கள் குடும்பத்தில் நீரிழிவு வரலாறு உள்ளதா? |
| `familyHistory.none` | இல்லை, எங்கள் குடும்பத்தில் யாருக்கும் இல்லை. |
| `familyHistory.notSure` | எங்கள் குடும்ப வரலாறு பற்றி உறுதியாக தெரியவில்லை. |
| `familyHistory.siblings` | ஆம், என் சகோதரன் அல்லது சகோதரிக்கு உள்ளது. |
| `familyHistory.oneParent` | ஆம், என் பெற்றோரில் ஒருவருக்கு உள்ளது. |
| `familyHistory.bothParents` | ஆம், இருவர் பெற்றோருக்கும் உள்ளது. |

---

## hipSize

| Key | Tamil |
|-----|--------|
| `hipSize.title` | நாபி மட்டத்தில் இடுப்பு அளவு? |
| `hipSize.maleLess90` | 90 செ.மீக்கு குறைவு |
| `hipSize.male90_100` | 90–100 செ.மீ |
| `hipSize.maleMore100` | 100 செ.மீக்கு மேல் |
| `hipSize.femaleLess80` | 80 செ.மீக்கு குறைவு |
| `hipSize.female80_90` | 80–90 செ.மீ |
| `hipSize.femaleMore90` | 90 செ.மீக்கு மேல் |

---

## physicalActivity

| Key | Tamil |
|-----|--------|
| `physicalActivity.title` | உங்கள் தினசரி உடல் செயல்பாட்டு நிலை என்ன? |
| `physicalActivity.vigorous` | உடல் உழைப்பு வேலை அல்லது வழக்கமான உடற்பயிற்சி |
| `physicalActivity.moderate` | தினமும் 30 நிமிடம் நடைபயிற்சி |
| `physicalActivity.light` | இலகுவான இயக்கம் (வீட்டு வேலை / குறுகிய நடை) |
| `physicalActivity.sedentary` | பெரும்பாலும் உட்கார்ந்து (மேசை வேலை / குறைந்த இயக்கம்) |

---

## junkFood

| Key | Tamil |
|-----|--------|
| `junkFood.title` | எத்தனை முறை ஜங்க் உணவு சாப்பிடுகிறீர்கள்? |
| `junkFood.rarely` | அரிதாக |
| `junkFood.weekly1_2` | வாரத்திற்கு 1–2 முறை |
| `junkFood.weekly3_4` | வாரத்திற்கு 3–4 முறை |
| `junkFood.weekly5plus` | வாரத்திற்கு 5 அல்லது அதற்கு மேல் |

---

## outsideFood

| Key | Tamil |
|-----|--------|
| `outsideFood.title` | வெளி உணவு (உணவகம்/எடுத்துச் செல்ல) எத்தனை முறை சாப்பிடுகிறீர்கள்? |

---

## carbohydrate

| Key | Tamil |
|-----|--------|
| `carbohydrate.title` | பெரும்பாலும் எந்த வகை கார்போஹைட்ரேட்டுகளை சாப்பிடுகிறீர்கள்? |
| `carbohydrate.complex` | பெரும்பாலும் சிக்கலான (தினை, கோதுமை அரிசி, முழு தானியங்கள்) |
| `carbohydrate.mixed` | கலப்பு |
| `carbohydrate.refined` | பெரும்பாலும் சுத்திகரிக்கப்பட்ட (வெள்ளை அரிசி, மைதா, பேக்கரி) |

---

## sugaryBeverages

| Key | Tamil |
|-----|--------|
| `sugaryBeverages.title` | தினமும் சர்க்கரை பானங்கள் (தேநீர், காபி அல்லது பானங்கள்) சாப்பிடுகிறீர்களா? |

---

## sleepDuration

| Key | Tamil |
|-----|--------|
| `sleepDuration.title` | தினமும் எத்தனை மணி நேரம் தூங்குகிறீர்கள்? |
| `sleepDuration.hours7_8` | 7–8 மணி |
| `sleepDuration.more8` | 8 மணிக்கு மேல் |
| `sleepDuration.hours6_7` | 6–7 மணி |
| `sleepDuration.less6` | 6 மணிக்கு குறைவு |

---

## snoring

| Key | Tamil |
|-----|--------|
| `snoring.title` | வழக்கமாக குறட்டை விடுகிறீர்களா? |

---

## weightGain

| Key | Tamil |
|-----|--------|
| `weightGain.title` | கடந்த 1 வருடத்தில் திடீர் எடை அதிகரிப்பு ஏற்பட்டதா? |

---

## stressLevel

| Key | Tamil |
|-----|--------|
| `stressLevel.title` | உங்கள் மன அழுத்த நிலை என்ன? |
| `stressLevel.low` | குறைவு |
| `stressLevel.moderate` | மிதமான |
| `stressLevel.high` | அதிகம் |

---

## medicalConditions

| Key | Tamil |
|-----|--------|
| `medicalConditions.title` | உங்களுக்கு உள்ள நிலைமைகளைத் தேர்ந்தெடுக்கவும்? |
| `medicalConditions.hypertension` | உயர் இரத்த அழுத்தம் |
| `medicalConditions.highCholesterol` | உயர் கொழுப்பு |
| `medicalConditions.pcos` | பிசிஓஎஸ் |
| `medicalConditions.thyroidDisorder` | தைராய்டு சீர்கேடு |
| `medicalConditions.fattyLiver` | கொழுப்பு கல்லீரல் |
| `medicalConditions.heartDisease` | இதய நோய் |
| `medicalConditions.kidneyDisease` | சிறுநீரக நோய் |
| `medicalConditions.none` | எதுவும் இல்லை |

---

## symptoms

| Key | Tamil |
|-----|--------|
| `symptoms.title` | இந்த அறிகுறிகளில் ஏதேனும் அனுபவிக்கிறீர்களா? |
| `symptoms.frequentUrination` | அடிக்கடி சிறுநீர் கழித்தல் |
| `symptoms.excessiveThirst` | அதிக தாகம் |
| `symptoms.increasedHunger` | அதிக பசி |
| `symptoms.fatigue` | சோர்வு |
| `symptoms.blurredVision` | மங்கலான பார்வை |
| `symptoms.slowWoundHealing` | காயம் மெதுவாக ஆறுதல் |
| `symptoms.tinglingNumbness` | கைகள்/கால்களில் சிலிர்ப்பு அல்லது மரப்பு |
| `symptoms.darkPatches` | கழுத்தைச் சுற்றி இருண்ட படைகள் |
| `symptoms.noneAbove` | மேலுள்ள எதுவும் இல்லை |

---

## habits

| Key | Tamil |
|-----|--------|
| `habits.title` | இந்த பழக்கங்களில் ஏதேனும் உள்ளதா? |
| `habits.smoking` | புகைப்பழக்கம் |
| `habits.alcohol` | மது |
| `habits.tobaccoChewing` | புகையிலை மெல்லுதல் |
| `habits.none` | எதுவும் இல்லை |
| `habits.modalTitle` | கிட்டத்தட்ட முடிந்துவிட்டது! |
| `habits.modalSubtitle` | முடிவைப் பார்க்க உங்கள் விவரங்களை உள்ளிடவும். |
| `habits.nameLabel` | பெயர் |
| `habits.phoneLabel` | தொலைபேசி எண் |
| `habits.ageLabel` | வயது |
| `habits.locationLabel` | இருப்பிடம் |
| `habits.namePlaceholder` | உங்கள் முழுப் பெயர் |
| `habits.phonePlaceholder` | எ.கா. 9876543210 |
| `habits.phoneHint` | சரியாக 10 இலக்கங்கள் உள்ளிடவும் |
| `habits.agePlaceholder` | எ.கா. 35 |
| `habits.locationPlaceholder` | எ.கா. சென்னை, தமிழ்நாடு |
| `habits.viewResult` | என் முடிவைப் பார் |

---

## resultLoader

| Key | Tamil |
|-----|--------|
| `resultLoader.calculating` | உங்கள் முடிவைக் கணக்கிடுகிறது… |

---

## resultPage

| Key | Tamil |
|-----|--------|
| `resultPage.lowRisk` | நீரிழிவு இருக்க வாய்ப்பு குறைவு |
| `resultPage.lowModerate` | நீரிழிவு வர வாய்ப்பு குறைவு |
| `resultPage.moderate` | நீங்கள் முன்-நீரிழிவு இருக்கலாம் |
| `resultPage.moderateHigh` | நீரிழிவு இருக்க வாய்ப்பு அதிகம் |
| `resultPage.high` | நீரிழிவு இருக்க வாய்ப்பு அதிகம் — உடனடியாக நடவடிக்கை எடுங்கள் |
| `resultPage.lowRiskBadge` | குறைந்த அபாயம் |
| `resultPage.lowModerateBadge` | குறைந்து முதல் மிதமான |
| `resultPage.moderateBadge` | மிதமான அபாயம் |
| `resultPage.moderateHighBadge` | மிதமானது முதல் அதிகம் |
| `resultPage.highRiskBadge` | அதிக அபாயம் |
| `resultPage.maintainWeight` | ஆரோக்கிய எடையை பராமரிக்கவும் |
| `resultPage.stayActive` | சுறுசுறுப்பாக இருங்கள் |
| `resultPage.eatBalanced` | சமச்சீர் உணவு சாப்பிடுங்கள் |
| `resultPage.reduceCarbs` | சுத்திகரிக்கப்பட்ட கார்போஹைட்ரேட்டுகள் மற்றும் சர்க்கரை பானங்களை குறைக்கவும் |
| `resultPage.addWalking` | தினமும் 30 நிமிடம் நடைபயிற்சி சேர்க்கவும் |
| `resultPage.bloodTest6mo` | 6 மாதங்களுக்குள் இரத்த சர்க்கரை சோதனை செய்யுங்கள் |
| `resultPage.seeDoctor` | மருத்துவரைப் பாருங்கள் |
| `resultPage.hba1c` | HbA1c மற்றும் fasting குளுக்கோஸ் |
| `resultPage.lifestyleChanges` | வாழ்க்கை முறை மாற்றங்கள் |
| `resultPage.seeDoctorSoon` | விரைவில் மருத்துவரைப் பாருங்கள் |
| `resultPage.fullBloodPanel` | முழு இரத்த பேனல் |
| `resultPage.strictLifestyle` | கடுமையான வாழ்க்கை முறை மாற்றங்கள் |
| `resultPage.seeDoctorNow` | உடனடியாக மருத்துவரைப் பாருங்கள் |
| `resultPage.bloodTests` | இரத்த சோதனைகள் |
| `resultPage.followAdvice` | மருத்துவ ஆலோசனையைப் பின்பற்றுங்கள் |
| `resultPage.yourResult` | உங்கள் முடிவு |
| `resultPage.visualAndResult` | காட்சி மற்றும் முடிவு |
| `resultPage.yourReportSummary` | உங்கள் அறிக்கை சுருக்கம் |
| `resultPage.accuracyNote` | இந்த முடிவு 50–60% துல்லியமானது. உங்கள் பதில்களின் அடிப்படையில் மட்டுமே. |
| `resultPage.bookBloodTestCta` | 100% முடிவுக்கு இன்றே இரத்த சோதனை புத்தகம் செய்யுங்கள் |
| `resultPage.whatToDoNext` | அடுத்து என்ன செய்வது |
| `resultPage.contributionFactor` | பங்களிப்பு காரணி |
| `resultPage.probability` | நிகழ்தகவு |
| `resultPage.noFactorsNote` | இந்த வரம்பில் மிக அதிக அபாய பங்களிப்பு காரணிகள் இல்லை. முடிவு உங்கள் ஒட்டுமொத்த சுயவிவரத்தின் அடிப்படையில் உள்ளது. |
| `resultPage.retest` | மறுசோதனை |
| `resultPage.share` | பகிர் |
| `resultPage.retestConfirmMessage` | முதலிலிருந்து மதிப்பீட்டை மீண்டும் தொடங்குவீர்களா? உங்கள் தற்போதைய முடிவு அழிக்கப்படும். |
| `resultPage.retestConfirmYes` | ஆம், மறுசோதனை |
| `resultPage.loadingText` | உங்கள் முடிவு ஏற்றுக் கொள்ளப்படுகிறது...... |
| `resultPage.analyzingReport` | உங்கள் அறிக்கையை பகுப்பாய்வு செய்கிறது… |
| `resultPage.summaryHigh` | உங்கள் அபாயம் அதிகம். தயவுசெய்து விரைவில் மருத்துவரைப் பாருங்கள். |
| `resultPage.summaryLowPrefix` | உங்கள் அபாயம் குறைவு.  |
| `resultPage.summaryLowSuffix` |  போன்ற காரணிகள் பங்களிக்கக்கூடும். ஆரோக்கியமான பழக்கங்களை பராமரிக்கவும். |
| `resultPage.summaryLowModeratePrefix` | உங்களுக்கு குறைந்த ஆனால் இருக்கும் அபாயம் உள்ளது.  |
| `resultPage.summaryLowModerateSuffix` |  பங்களிக்கின்றன. இலக்கு வாழ்க்கை முறை மாற்றங்கள் இந்த அபாயத்தை வளராமல் இருக்க செய்யும். |
| `resultPage.summaryModeratePrefix` | குறிப்பிடத்தக்க காரணிகள்:  |
| `resultPage.summaryModerateSuffix` | . சோதனை பரிந்துரைக்கப்படுகிறது. |
| `resultPage.summaryModerateHighPrefix` | பல காரணிகள் (எ.கா.  |
| `resultPage.summaryModerateHighSuffix` | ) அதிகரித்த அபாயத்தைக் குறிக்கின்றன. தயவுசெய்து சுகாதார சேவை வழங்குநரைக் கலந்தாலோசிக்கவும். |
| `resultPage.summaryHighMultiPrefix` | பல அபாய காரணிகள் உட்பட  |
| `resultPage.summaryHighMultiSuffix` |  அதிக அபாயத்தைக் குறிக்கிறது. விரைவில் மருத்துவரைப் பாருங்கள். |
| `resultPage.summaryNoFactorsLow` | உங்கள் பதில்கள் குறைந்த நீரிழிவு அபாயத்தைக் குறிக்கின்றன. ஆரோக்கியமான பழக்கங்களை பராமரிக்கவும். |
| `resultPage.summaryNoFactorsLowModerate` | உங்களுக்கு குறைந்த ஆனால் இருக்கும் அபாயம் உள்ளது. இலக்கு வாழ்க்கை முறை மாற்றங்கள் இந்த அபாயத்தை வளராமல் இருக்க செய்யும். |
| `resultPage.summaryNoFactorsModerate` | உங்கள் அபாயம் மிதமானது. மருத்துவருடன் பேச பரிந்துரைக்கிறோம். |
| `resultPage.summaryNoFactorsModerateHigh` | உங்கள் அபாயம் அதிகரித்துள்ளது. தயவுசெய்து சுகாதார சேவை வழங்குநரைக் கலந்தாலோசிக்கவும். |
| `resultPage.goBack` | பின்செல் |
| `resultPage.watchRiskLevel` | பார்க்க: உங்கள் அபாய நிலை |

---

## RESULT_FACTOR_TA (English scoring label → Tamil on result screen)

Left column must stay **exactly** as in code (matches `scoring.js` / factor strings). Right column is the Tamil shown when language is Tamil.

| English key (do not change) | Tamil |
|----------------------------|--------|
| BMI under 18.5 | பிஎம்ஐ 18.5க்கு கீழ் |
| BMI 18.5–22.9 | பிஎம்ஐ 18.5–22.9 |
| BMI 23–27.4 | பிஎம்ஐ 23–27.4 |
| BMI 27.5–32.4 | பிஎம்ஐ 27.5–32.4 |
| BMI over 32.4 | பிஎம்ஐ 32.4க்கு மேல் |
| Age 25–34 | வயது 25–34 |
| Age 35–44 | வயது 35–44 |
| Age 45–54 | வயது 45–54 |
| Age 55+ | வயது 55+ |
| Family history not sure | குடும்ப வரலாறு உறுதியில்லை |
| Siblings with diabetes | சகோதரர்/சகோதரி நீரிழிவு |
| One parent with diabetes | ஒரு பெற்றோர் நீரிழிவு |
| Both parents with diabetes | இருவர் பெற்றோரும் நீரிழிவு |
| Hip size 90–100 cm | இடுப்பு 90–100 செ.மீ |
| Hip size over 100 cm | இடுப்பு 100 செ.மீக்கு மேல் |
| Hip size 80–90 cm | இடுப்பு 80–90 செ.மீ |
| Hip size over 90 cm | இடுப்பு 90 செ.மீக்கு மேல் |
| 30 min walking daily | தினமும் 30 நிமிடம் நடைபயிற்சி |
| Light movement | இலகுவான இயக்கம் |
| Mostly sitting | பெரும்பாலும் உட்கார்ந்து |
| Hypertension (High BP) | உயர் இரத்த அழுத்தம் |
| PCOS | பிசிஓஎஸ் |
| High cholesterol | உயர் கொழுப்பு |
| Thyroid disorder | தைராய்டு சீர்கேடு |
| Fatty liver | கொழுப்பு கல்லீரல் |
| Heart disease | இதய நோய் |
| Kidney disease | சிறுநீரக நோய் |
| Frequent urination | அடிக்கடி சிறுநீர் கழித்தல் |
| Excessive thirst | அதிக தாகம் |
| Increased hunger | அதிக பசி |
| Fatigue | சோர்வு |
| Blurred vision | மங்கலான பார்வை |
| Slow wound healing | காயம் மெதுவாக ஆறுதல் |
| Tingling or numbness | சிலிர்ப்பு அல்லது மரப்பு |
| Dark patches around neck | கழுத்தைச் சுற்றி இருண்ட படைகள் |
| Junk food frequency | ஜங்க் உணவு அடிக்கடி |
| Outside food frequency | வெளி உணவு அடிக்கடி |
| Refined carbohydrates | சுத்திகரிக்கப்பட்ட கார்போஹைட்ரேட்டுகள் |
| Sugary beverages | சர்க்கரை பானங்கள் |
| Smoking | புகைப்பழக்கம் |
| Alcohol | மது |
| Tobacco chewing | புகையிலை மெல்லுதல் |
| Sleep 6–7 hours | தூக்கம் 6–7 மணி |
| Sleep under 6 hours | தூக்கம் 6 மணிக்கு கீழ் |
| Snoring not sure | குறட்டை உறுதியில்லை |
| Snoring | குறட்டை |
| Weight gain in last year | கடந்த வருடம் எடை அதிகரிப்பு |
| Moderate stress | மிதமான மன அழுத்தம் |
| High stress | அதிக மன அழுத்தம் |
| History of gestational diabetes | கர்ப்ப நீரிழிவு வரலாறு |

---

*Generated from `src/translations/index.js`. After editing Tamil here for review, copy changes back into that file and keep keys in sync.*
