# Blood Test Dashboard - Integration Setup Guide

## What You Have Now ✅

Your existing Diabetes Assessment App already has:
- ✅ Supabase project configured
- ✅ `user_profiles` table with assessment data
- ✅ Supabase client setup in `src/lib/supabaseClient.js`
- ✅ User authentication ready
- ✅ Environment variables configured

## What We're Adding 🎯

We've created:

### 1. **Database Migration File**
- Location: `supabase/migrations/20250326000000_create_blood_reports_table.sql`
- Adds 3 new tables:
  - `blood_reports` - Store blood test data
  - `blood_test_history` - Track changes over time
  - `test_reference_ranges` - Normal value ranges

### 2. **React Components**
- `src/components/dashboard/DashboardHome.tsx` - Main dashboard view
- `src/components/dashboard/BloodTestForm.tsx` - Blood test entry form

### 3. **Documentation**
- `BLOOD_TEST_DASHBOARD_PROMPT.md` - Complete project specifications
- `BLOOD_TEST_DASHBOARD_SETUP.md` - This file

## Step-by-Step Integration

### Step 1: Apply the Database Migration

#### Option A: Using Supabase Dashboard (Easiest)
1. Log in to your Supabase project: https://app.supabase.com
2. Go to **SQL Editor**
3. Click **New Query**
4. Copy the entire contents of: `supabase/migrations/20250326000000_create_blood_reports_table.sql`
5. Paste into the SQL editor
6. Click **Run**
7. You should see: "Success. No rows returned"

#### Option B: Using Supabase CLI
```bash
cd "C:\new diabetes chacker"
supabase migration up
```

### Step 2: Verify Tables Were Created

In Supabase Dashboard:
1. Go to **Table Editor**
2. You should see these new tables:
   - `blood_reports`
   - `blood_test_history`
   - `test_reference_ranges`

If you don't see them, check the SQL output for errors.

### Step 3: Seed Reference Test Ranges (Optional but Recommended)

This populates the normal value ranges for display:

```sql
-- Insert reference ranges in Supabase SQL Editor
INSERT INTO test_reference_ranges (test_name, age_range, gender, min_value, max_value, unit, notes) VALUES
('HbA1c', 'all', 'all', 0, 5.7, '%', 'Normal range'),
('HbA1c', 'all', 'all', 5.7, 6.4, '%', 'Pre-diabetes range'),
('Fasting Glucose', 'all', 'all', 70, 100, 'mg/dL', 'Normal fasting'),
('Fasting Glucose', 'all', 'all', 100, 126, 'mg/dL', 'Impaired fasting'),
('Total Cholesterol', 'all', 'all', 0, 200, 'mg/dL', 'Desirable'),
('Total Cholesterol', 'all', 'all', 200, 240, 'mg/dL', 'Borderline high'),
('LDL Cholesterol', 'all', 'all', 0, 100, 'mg/dL', 'Optimal'),
('HDL Cholesterol', 'all', 'male', 0, 40, 'mg/dL', 'Low'),
('HDL Cholesterol', 'all', 'female', 0, 50, 'mg/dL', 'Low'),
('Triglycerides', 'all', 'all', 0, 150, 'mg/dL', 'Normal');
```

### Step 4: Add Components to Your Project

#### Option A: Copy Files (Recommended)
The component files are already created:
- `src/components/dashboard/DashboardHome.tsx`
- `src/components/dashboard/BloodTestForm.tsx`

They're ready to use!

#### Option B: Create Dashboard Page
Create a new route/page for the dashboard. Example in your main app router:

```typescript
import DashboardHome from './components/dashboard/DashboardHome'
import BloodTestForm from './components/dashboard/BloodTestForm'

// Add to your router
<Route path="/dashboard" element={<DashboardHome userId={currentUserId} />} />
<Route path="/blood-test/upload" element={<BloodTestForm userId={currentUserId} onSuccess={handleSuccess} />} />
```

### Step 5: Get User ID in Your App

The components need the `userId`. This typically comes from Supabase Auth:

```typescript
import { supabase } from './lib/supabaseClient'

const { data: { user } } = await supabase.auth.getUser()
const userId = user?.id
```

### Step 6: Update .env if Needed

Your `.env.local` should already have (from assessment app):
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

These are the same credentials the components use - no changes needed!

## File Structure

After integration, your project looks like:
```
src/
├── components/
│   ├── dashboard/
│   │   ├── DashboardHome.tsx         ← NEW
│   │   └── BloodTestForm.tsx         ← NEW
│   └── ... (existing components)
├── lib/
│   └── supabaseClient.js             (no changes needed)
└── ... (rest of app)

supabase/
├── migrations/
│   ├── 20250303000000_create_user_profiles.sql
│   ├── 20250304000000_add_blood_report_labs.sql
│   ├── 20250304100000_create_home_test_bookings.sql
│   ├── 20250322000000_add_age_location_to_profiles.sql
│   └── 20250326000000_create_blood_reports_table.sql   ← NEW
```

## How Data Flows

```
User Assessment
    ↓
user_profiles table
    ↓
DashboardHome shows assessment risk
    ↓
User enters/uploads blood tests
    ↓
blood_reports table (linked to user_profiles via user_id)
    ↓
DashboardHome fetches both and compares
    ↓
Shows integrated view of assessment + lab data
```

## Component Features

### DashboardHome.tsx
Displays:
- Assessment Risk Level (calculated from user_profiles)
- Latest Blood Test Results (from blood_reports)
- Key metrics (HbA1c, glucose, cholesterol, etc.)
- Comparison between assessment prediction and lab results
- Action buttons (view full results, upload new test, download report)

### BloodTestForm.tsx
Features:
- Date picker for test date
- Lab name field
- Input fields for:
  - Glucose markers (HbA1c, fasting glucose)
  - Lipid profile (total cholesterol, LDL, HDL, triglycerides)
  - Blood count (hemoglobin)
  - Blood pressure
  - Notes
- Reference values display
- Form validation
- Success/error messages

## Testing Locally

### 1. Start Your App
```bash
npm run dev
```

### 2. Navigate to Dashboard
- If using routes: `/dashboard`
- Or import and render the component

### 3. Enter Some Blood Tests
- Click "Upload Blood Test" in the upload form
- Fill in some sample values
- Click "Save Blood Test Results"

### 4. Verify in Supabase
1. Go to Supabase Dashboard
2. Go to **Table Editor**
3. Click on **blood_reports**
4. You should see your entered data

## Customization Ideas

### Add More Fields
Edit `BloodTestForm.tsx` and add new input fields. Then add columns to `blood_reports` table.

### Change Risk Calculation
Edit `calculateAssessmentRisk()` and `calculateLabRisk()` in `DashboardHome.tsx`

### Add Charts/Trends
Install Recharts:
```bash
npm install recharts
```

Then create a TrendChart component:
```typescript
import { LineChart, Line, XAxis, YAxis } from 'recharts'
```

### Add PDF Export
Install react-pdf or jsPDF:
```bash
npm install jspdf
```

Create a ReportPDF component to generate downloadable reports.

## Troubleshooting

### Tables Not Showing in Supabase
- Check SQL migration output for errors
- Verify you ran the migration
- Try refreshing the page
- Check that Supabase URL and key are correct

### Components Not Loading
- Check browser console for errors
- Verify `userId` is being passed correctly
- Ensure `supabase` client is initialized
- Check that user has authenticated

### Data Not Saving
- Check Supabase RLS policies
- Verify the `user_id` is correct
- Look at Supabase logs for INSERT errors
- Try directly inserting data via SQL editor to test

### Missing User ID
```typescript
// Debug in your component
useEffect(() => {
  console.log('Current userId:', userId)
}, [userId])
```

## Next Steps

After getting this working:

1. **Add More Dashboard Features**
   - Trend charts over time
   - Medical conditions tracking
   - Medication management
   - Doctor notes/consultations

2. **Add File Upload**
   - Upload PDF blood test reports
   - OCR to extract values automatically
   - Store files in Supabase Storage

3. **Add Export**
   - Generate PDF health reports
   - Combine assessment + blood tests
   - Share with doctor

4. **Add Notifications**
   - Alert when new test results are abnormal
   - Reminders for periodic tests
   - Email summaries

5. **Add Doctor Portal**
   - Doctor can view patient reports
   - Doctor can add notes/recommendations
   - Patient-doctor messaging

## Need Help?

- Check `BLOOD_TEST_DASHBOARD_PROMPT.md` for detailed specifications
- Review component comments for specific questions
- Check Supabase documentation: https://supabase.com/docs
- React component patterns: https://react.dev

## Security Reminders

✅ Row Level Security (RLS) is enabled on all tables
✅ Users can only see their own data
✅ Never expose `VITE_SUPABASE_SERVICE_KEY` in frontend code
✅ Always use `VITE_SUPABASE_ANON_KEY` in React components
✅ Sensitive data (medical records) should be encrypted at rest
✅ GDPR/HIPAA compliance required for medical data

That's it! You're ready to use the integrated blood test dashboard! 🎉
