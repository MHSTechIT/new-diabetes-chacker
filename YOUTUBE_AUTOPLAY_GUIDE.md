# YouTube Autoplay Implementation Guide

## What Changed
The `RiskVideoPlayer.jsx` component now supports both Google Drive and YouTube embeds. **YouTube enables autoplay that actually works.**

## How It Works
- For YouTube URLs: Videos auto-play when the page loads (muted, as per browser policy)
- For Google Drive URLs: Manual play required (Google Drive limitation)
- Component auto-detects URL type and handles each appropriately

## To Enable Autoplay:

### Option 1: Quick Switch to YouTube (Recommended)
Update `src/config/videoConfig.js`:

```javascript
const VIDEO_CONFIG = {
  LOW: {
    url: 'https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1&mute=1',
    title: 'Low Risk - Maintain Your Health',
    duration: 30,
  },
  LOW_MODERATE: {
    url: 'https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1&mute=1',
    title: 'Low-Moderate Risk - Small Changes',
    duration: 45,
  },
  MODERATE: {
    url: 'https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1&mute=1',
    title: 'Moderate Risk - Action Recommended',
    duration: 60,
  },
  MODERATE_HIGH: {
    url: 'https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1&mute=1',
    title: 'Moderate-High Risk - Lifestyle Changes',
    duration: 60,
  },
  HIGH: {
    url: 'https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1&mute=1',
    title: 'High Risk - Consult Healthcare Provider',
    duration: 90,
  },
}
```

### Where to Find Your Video ID
1. Go to YouTube.com
2. Search for your video
3. Copy the URL: `https://www.youtube.com/watch?v=**dQw4w9WgXcQ**`
4. The part after `v=` is your video ID: `dQw4w9WgXcQ`

### Example:
```javascript
// Original
url: 'https://drive.google.com/file/d/1Z-hquISNa7o58-h7OKd3TaAq9xcEPpT7/preview'

// YouTube embed version
url: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1'
```

---

## How to Upload Google Drive Videos to YouTube

### Step 1: Go to YouTube.com
- Sign in with your Google account (same account that has your videos in Google Drive)

### Step 2: Click "Create" → "Upload videos"
- Select the video from your Google Drive
- Or download it first, then upload

### Step 3: Fill in Details
- Title: Use the same titles from your app
- Description: Optional
- Visibility: Set to "Unlisted" (only people with the link can see)

### Step 4: Get the Video ID
- After upload, go to the video
- Copy the URL
- Extract the video ID (after `v=`)

### Step 5: Update the Config
```javascript
// Use the video IDs in videoConfig.js
LOW: {
  url: 'https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1&mute=1',
  // ...
}
```

---

## Testing Autoplay

After updating videoConfig.js:

1. Open http://localhost:5173
2. Go through the assessment
3. On the result page, the video should **auto-play immediately**
4. Volume will be muted (YouTube requirement for autoplay)
5. User can unmute using the player controls

---

## Why YouTube Autoplay Works

- YouTube respects the `autoplay=1` parameter
- Browser autoplay policies allow it when `mute=1` is present
- Standard embed API with full player controls
- Works across all browsers and devices

---

## Current Status

✅ Code updated to support YouTube autoplay
⏳ Waiting for: Video IDs for your 5 risk levels

**Next Step:** Either:
1. Upload your videos to YouTube (5-15 min each), then share the video IDs
2. Search YouTube for existing videos matching your topics and use those IDs
3. Stick with Google Drive (manual play required)

---

Let me know the YouTube video IDs for each risk level, and I'll update the config!
