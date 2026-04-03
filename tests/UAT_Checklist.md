# UAT Test Plan — MY Health School Diabetes Risk Assessment
Date: April 2026 | Tester: _________________ | Sign-off: _________________

---

## SECTION 1 — Language Selection
| ID | Test | Expected | Pass/Fail |
|----|------|----------|-----------|
| U01 | Open the app | Language selection screen appears | |
| U02 | Select English | All text changes to English | |
| U03 | Select Tamil (தமிழ்) | All text changes to Tamil correctly | |
| U04 | Tamil text — no garbled characters anywhere | All Tamil text is readable | |

---

## SECTION 2 — Quiz Flow (English)
| ID | Test | Expected | Pass/Fail |
|----|------|----------|-----------|
| U05 | Select Male gender | Proceeds to age selection | |
| U06 | Select Female gender | Gestational diabetes question appears later | |
| U07 | Age selection — tap any age group | Proceeds to next question | |
| U08 | Enter weight and height | BMI calculated, proceeds | |
| U09 | Family history — select "Both parents" | Records and proceeds | |
| U10 | Hip size selection | Correct options shown for gender | |
| U11 | Physical activity — select Sedentary | Proceeds | |
| U12 | Junk food frequency — select 5+ per week | Proceeds | |
| U13 | Sugary beverages — select Yes | Proceeds | |
| U14 | Sleep duration — select Less than 6 hrs | Proceeds | |
| U15 | Weight gain — select Yes | Proceeds | |
| U16 | Stress level — select High | Proceeds | |
| U17 | Medical conditions — select multiple | Multiple selection works | |
| U18 | Symptoms — select 3 or more | Multiple selection works | |
| U19 | Habits — select Smoking + Alcohol | Multiple selection works | |
| U20 | Name field — enter name | Accepts letters only | |
| U21 | Phone field — enter 9999999999 | Shows error: all identical digits | |
| U22 | Phone field — enter valid number (e.g. 9876543201) | Accepted | |
| U23 | Age field — type letters or symbols | Does NOT accept, digits only | |
| U24 | Location field — type numbers or symbols | Does NOT accept, letters only | |
| U25 | Click "View My Result" | Loads result page with animation | |

---

## SECTION 3 — Result Page
| ID | Test | Expected | Pass/Fail |
|----|------|----------|-----------|
| U26 | Result page shows risk level badge | LOW / LOW_MODERATE / MODERATE / MODERATE_HIGH / HIGH | |
| U27 | Risk gauge/meter is visible | Gauge shows correct level | |
| U28 | YouTube video plays automatically | Video plays, no YouTube controls visible | |
| U29 | Video is unmuted and has sound | Audio plays | |
| U30 | Tap/click video — play/pause button appears | Button appears, disappears after 2 seconds | |
| U31 | Risk factors list is shown | Shows contributing factors | |
| U32 | Action steps section is shown | 3 action steps visible | |
| U33 | "Book Blood Test" button visible | Button present | |
| U34 | "Talk to Expert" button visible | Button present | |
| U35 | Press Chrome back button from result | Stays on result page, does NOT go to quiz | |

---

## SECTION 4 — Blood Test Booking
| ID | Test | Expected | Pass/Fail |
|----|------|----------|-----------|
| U36 | Click "Book Blood Test" | Opens booking form | |
| U37 | Press back (←) in booking form | Returns to result page | |
| U38 | Enter non-serviceable pincode (e.g. 600001) | Error: "We are not serviceable to your location" | |
| U39 | Enter serviceable pincode (e.g. 600095) | Error clears | |
| U40 | Select date — today's date | Today should NOT be selectable | |
| U41 | Select date — tomorrow or later | Selectable, proceeds | |
| U42 | Submit booking form with all valid data | Success screen appears | |
| U43 | Return to result after booking | Button shows "Test Booked" (disabled) | |
| U44 | Refresh result page after booking | Button still shows "Test Booked" (disabled) | |

---

## SECTION 5 — Talk to Expert
| ID | Test | Expected | Pass/Fail |
|----|------|----------|-----------|
| U45 | Click "Talk to Expert" | Expert call modal opens | |
| U46 | Select today's date in calendar | Today NOT selectable (greyed out) | |
| U47 | Select tomorrow or later | Selectable | |
| U48 | Select a time slot | Time slot highlights | |
| U49 | Click "Schedule Call" | Success confirmation shown | |
| U50 | Return to result page | "Talk to Expert" button disabled | |
| U51 | Refresh result page | Button still disabled | |
| U52 | Click "Retake Assessment" | Button resets, new quiz starts | |

---

## SECTION 6 — Tamil Language Flow
| ID | Test | Expected | Pass/Fail |
|----|------|----------|-----------|
| U53 | Complete full quiz in Tamil | All questions shown in Tamil | |
| U54 | Result page in Tamil | Risk level and advice in Tamil | |
| U55 | Booking form in Tamil | All labels in Tamil | |
| U56 | Error messages in Tamil | Validation errors in Tamil | |

---

## SECTION 7 — Mobile Device Testing
| ID | Test | Expected | Pass/Fail |
|----|------|----------|-----------|
| U57 | Open app on Android Chrome | Loads correctly, no zoom issues | |
| U58 | Open app on iPhone Safari | Loads correctly, no zoom on input tap | |
| U59 | Tap phone input on iPhone | Page does NOT zoom in | |
| U60 | All buttons are easily tappable | No buttons too small to tap | |

---

## Sign-off

| | |
|--|--|
| **Tested by** | _________________ |
| **Date** | _________________ |
| **Total Pass** | ___ / 60 |
| **Total Fail** | ___ / 60 |
| **Blockers** | _________________ |
| **Go / No-Go** | ☐ GO &nbsp;&nbsp; ☐ NO-GO |
| **Signature** | _________________ |
