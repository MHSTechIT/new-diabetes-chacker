# Blood Test Report Dashboard - Integrated with Assessment App

## Overview
Build a blood test report dashboard that integrates with the existing Diabetes Assessment App. The dashboard will:
- Display assessment results alongside blood test data
- Track blood test reports over time
- Show comparisons between reported values and normal ranges
- Visualize health trends with charts
- Generate health reports combining assessment + lab data

## Database Integration

### Current Database Structure
Your existing Supabase database already has:
```
user_profiles (main table)
├── Assessment data (age, BMI, family history, etc.)
├── Basic info (name, phone, gender, location)
├── Blood report fields (hba1c, fasting_glucose)
└── Assessment timestamps
```

### New Tables to Add
The migration file adds:
```
blood_reports
├── Complete blood test data (lipids, liver function, kidney function, CBC)
├── Lab metadata (date, lab name, file URL)
└── Linked to user_profiles via user_id

blood_test_history
├── Historical tracking of test values
└── Linked to blood_reports for trend analysis

test_reference_ranges
├── Normal value ranges by age/gender
└── Public read access for displaying normal ranges
```

## How Assessment + Blood Tests Work Together

```
User Flow:
1. Complete Diabetes Assessment → Saves to user_profiles
2. Upload/Enter Blood Test Results → Saves to blood_reports
3. Dashboard Shows:
   - Assessment Risk Level
   - Blood Test Results
   - Comparison: Assessment Risk vs Actual Lab Values
   - Trend Analysis over time
   - Health Recommendations based on both
```

## Architecture

### Frontend Pages
```
/dashboard
├── OverviewCard (Assessment Risk + Key Blood Tests)
├── BloodTestResults (Full lab panel display)
├── TrendCharts (Blood glucose, lipids, etc over time)
├── Comparison (Assessment predictions vs actual results)
└── UploadReport (Add new blood test file/data)

/profile
├── Assessment Summary
├── Personal Health History
└── Download Health Report (PDF with both assessment + tests)
```

### React Components
```
src/components/dashboard/
├── DashboardHome.tsx
│   ├── RiskSummary.tsx (Assessment risk level from user_profiles)
│   ├── LatestBloodTests.tsx (Most recent blood_reports)
│   └── HealthScore.tsx (Composite score from both)
├── BloodTestPanel.tsx
│   ├── BloodTestTable.tsx (Display all values with ref ranges)
│   ├── TestUpload.tsx (Upload PDF/image or manual entry)
│   └── TestForm.tsx (Form for manual blood test entry)
├── TrendAnalysis.tsx
│   ├── GlucoseTrendChart.tsx
│   ├── LipidTrendChart.tsx
│   ├── HistoryComparison.tsx
│   └── TimelineView.tsx
└── Reports.tsx
    ├── HealthReportPDF.tsx
    ├── ComparisonReport.tsx
    └── ExportOptions.tsx

src/hooks/
├── useUserProfile.ts (Fetch from user_profiles)
├── useBloodReports.ts (Fetch from blood_reports)
├── useTestHistory.ts (Track changes over time)
└── useHealthScore.ts (Calculate combined score)

src/services/
├── bloodReportService.ts (CRUD operations)
├── referenceRangeService.ts (Fetch normal ranges)
└── reportGenerationService.ts (PDF export)
```

## Key Features

### 1. Integrated Dashboard View
**What it shows:**
```
┌─────────────────────────────────────┐
│ HEALTH OVERVIEW                     │
├─────────────────────────────────────┤
│ Assessment Risk Level: MODERATE     │
│ Latest Blood Test: March 20, 2025   │
│                                     │
│ KEY METRICS:                        │
│ HbA1c: 6.8% (Pre-diabetic range)   │
│ Glucose: 145 mg/dL (High)          │
│ Cholesterol: 220 (Borderline)      │
│                                     │
│ COMPARISON:                         │
│ Assessment predicted MODERATE risk  │
│ Blood tests confirm moderate risk   │
│ ✓ Predictions align with results   │
└─────────────────────────────────────┘
```

### 2. Blood Test Upload & Analysis
```typescript
// Upload options:
- PDF report (AI extract values)
- Image of report (OCR extract)
- Manual entry form
- CSV import

// Auto-extract:
- test_name, value, unit
- Parse against reference_ranges
- Flag abnormal results (↑ High, ↓ Low)
```

### 3. Trend Analysis (Over Time)
```
Chart: Blood Glucose Levels (Last 12 Months)

160 |     •
    |    / \
140 |   •   •
    |  /     \
120 | •       •
    |___________ Time
```

### 4. Assessment vs Reality Comparison
```
ASSESSMENT PREDICTED:
├── Risk Level: MODERATE
├── Key Concerns: Family history, high BMI
└── Recommendations: Exercise, diet control

ACTUAL BLOOD TESTS:
├── HbA1c: 6.8% (Confirms pre-diabetes)
├── BMI: 28.5 (Overweight)
└── Lipids: High triglycerides

VERDICT: ✓ Assessment accurately predicted
```

### 5. Health Score Calculation
```typescript
// Combine assessment + blood tests
function calculateHealthScore(profile, bloodReport) {
  const assessmentRisk = calculateAssessmentRisk(profile);
  const labIndicators = calculateLabScore(bloodReport);

  const composite = (assessmentRisk * 0.4) + (labIndicators * 0.6);

  return {
    assessmentComponent: assessmentRisk,
    labComponent: labIndicators,
    compositeScore: composite,
    recommendation: getRecommendation(composite)
  };
}
```

## Implementation Steps

### Phase 1: Setup (Already Started)
- ✅ Migration file created: `supabase/migrations/20250326000000_create_blood_reports_table.sql`
- [ ] Run migration in Supabase
- [ ] Seed test_reference_ranges table with common test values

### Phase 2: Backend Services
- [ ] Blood report CRUD API endpoints
- [ ] File upload to Supabase Storage
- [ ] OCR/AI extract from PDF (optional, using Gemini API)

### Phase 3: Frontend Components
- [ ] DashboardHome with assessment + blood test overview
- [ ] BloodTestPanel with table and upload form
- [ ] TrendAnalysis with charts (Recharts)

### Phase 4: Advanced Features
- [ ] Export PDF with both assessment and test results
- [ ] Compare multiple blood tests over time
- [ ] Health recommendations based on combined data
- [ ] Invite doctor to view reports (sharing)

## Running the Migration

### In Supabase Dashboard:
1. Go to **SQL Editor**
2. Create **new query**
3. Copy contents of: `supabase/migrations/20250326000000_create_blood_reports_table.sql`
4. Click **Run**

### Or via Supabase CLI:
```bash
supabase migration up
```

## Sample API Endpoints

### Get User Assessment + Blood Tests
```typescript
// GET /api/health/dashboard/:userId
Response:
{
  assessment: {
    userId, age, bmi, familyHistory, ...
    assessmentRiskLevel: 'MODERATE',
    calculatedScore: 45
  },
  latestBloodTest: {
    reportDate, hba1c, fasting_glucose, ...
    labRiskLevel: 'MODERATE_HIGH',
    abnormalTests: ['hba1c', 'triglycerides']
  },
  comparison: {
    alignmentScore: 0.85,
    verdict: 'Assessment accurately predicted risk'
  }
}
```

### Get Blood Test History
```typescript
// GET /api/blood-tests/:userId/history
Response: {
  tests: [
    {
      reportDate: '2025-03-20',
      hba1c: 6.8,
      glucose: 145,
      cholesterol: 220
    },
    ...
  ]
}
```

### Upload Blood Report
```typescript
// POST /api/blood-tests/:userId/upload
// multipart/form-data with file + metadata
```

## Data Flow Diagram

```
User Assessment
     ↓
user_profiles table
     ↓
Dashboard calculates
assessment risk level
     ↓
User uploads blood test
     ↓
blood_reports table
     ↓
Dashboard compares
both sources
     ↓
Shows combined health view
with recommendations
```

## Security & Privacy

✅ Row Level Security (RLS) configured on all tables
✅ Users can only see their own data
✅ Reference ranges are public (for display)
✅ Blood tests linked to user_profiles with ON DELETE CASCADE
✅ File uploads stored in Supabase Storage (encrypted)

## Environment Variables Needed

In your `.env.local`:
```
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
VITE_SUPABASE_SERVICE_KEY=your_service_key
```

These are the same as your assessment app already uses!

## Next Steps

1. **Apply Migration**: Run the SQL migration in Supabase
2. **Seed Reference Ranges**: Insert normal blood test ranges
3. **Create Backend Routes**: Build upload/fetch APIs
4. **Build Frontend**: Create dashboard components
5. **Integrate Charts**: Add Recharts for trend visualization
6. **Test & Deploy**: Verify with real assessment + blood data

## Medical Data Compliance

⚠️ Remember:
- HIPAA compliance (if US-based)
- GDPR compliance (if EU users)
- User consent for storing medical data
- Secure backup of blood test files
- Privacy policy disclosures
