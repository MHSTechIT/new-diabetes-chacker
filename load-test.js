/**
 * Comprehensive Load Testing Suite for Diabetes Checker App
 * Run with: npx k6 run load-test.js
 */

import http from 'k6/http'
import { check, group, sleep } from 'k6'
import { Rate, Trend, Counter, Gauge } from 'k6/metrics'

// Configuration
const BASE_URL = 'https://new-diabetes-chacker.onrender.com'
const FRONTEND_URL = 'https://new-diabetes-chacker-hbqgarqx9-mhstechits-projects.vercel.app'

// Custom metrics
const errorRate = new Rate('errors')
const apiLatency = new Trend('api_latency')
const dbLatency = new Trend('db_latency')
const successfulRequests = new Counter('successful_requests')
const failedRequests = new Counter('failed_requests')

export const options = {
  stages: [
    // Baseline: smoke test with 10 users for 1 min
    { duration: '1m', target: 10, name: 'smoke' },

    // Step load: gradually increase to 100, 250, 500, 750, 1000
    { duration: '2m', target: 100, name: 'step1' },
    { duration: '3m', target: 250, name: 'step2' },
    { duration: '3m', target: 500, name: 'step3' },
    { duration: '3m', target: 750, name: 'step4' },
    { duration: '5m', target: 1000, name: 'step5' },

    // Soak: hold at 500 for 5 min to test stability
    { duration: '5m', target: 500, name: 'soak' },

    // Spike: jump to 1500 then back down
    { duration: '1m', target: 1500, name: 'spike_up' },
    { duration: '1m', target: 100, name: 'spike_down' },

    // Ramp down
    { duration: '1m', target: 0, name: 'ramp_down' },
  ],
  thresholds: {
    'http_req_duration': ['p(95)<800', 'p(99)<2000'],
    'http_req_failed': ['rate<0.01'],
    'errors': ['rate<0.01'],
  },
}

function generateProfilePayload() {
  return {
    gender: ['male', 'female'][Math.floor(Math.random() * 2)],
    name: `User_${Math.random().toString(36).substring(7)}`,
    phone: `98${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`,
    age_range: ['18-30', '30-50', '50+'][Math.floor(Math.random() * 3)],
  }
}

function generateQuizAnswers() {
  return {
    gestational_diabetes: Math.random() > 0.5 ? 'yes' : 'no',
    weight_kg: (50 + Math.random() * 50).toFixed(1),
    height_cm: (150 + Math.random() * 50).toFixed(0),
    family_history: Math.random() > 0.5 ? 'yes' : 'no',
    physical_activity_level: ['low', 'moderate', 'high'][Math.floor(Math.random() * 3)],
    junk_food_frequency: ['rarely', 'sometimes', 'often'][Math.floor(Math.random() * 3)],
    sleep_duration: ['<6', '6-8', '>8'][Math.floor(Math.random() * 3)],
    stress_level: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
  }
}

export default function () {
  const startTime = Date.now()
  let success = true

  group('1. Create User Profile', () => {
    const payload = generateProfilePayload()
    const response = http.post(`${BASE_URL}/api/profiles`, JSON.stringify(payload), {
      headers: { 'Content-Type': 'application/json' },
    })

    const isSuccess = check(response, {
      'create profile success': (r) => r.status === 200 || r.status === 201,
      'profile has id': (r) => {
        const body = JSON.parse(r.body)
        return body.id !== undefined
      },
    })

    if (!isSuccess) {
      success = false
      failedRequests.add(1)
      errorRate.add(1)
    } else {
      successfulRequests.add(1)
    }

    apiLatency.add(response.timings.duration)
    sleep(0.5)
  })

  group('2. Update Quiz Answers', () => {
    const payload = generateQuizAnswers()
    const response = http.patch(
      `${BASE_URL}/api/profiles/${Math.random().toString().substring(2, 20)}`,
      JSON.stringify(payload),
      { headers: { 'Content-Type': 'application/json' } }
    )

    const isSuccess = check(response, {
      'quiz update: 200 or 404': (r) => r.status === 200 || r.status === 404,
    })

    if (response.status >= 400) {
      success = false
    }

    apiLatency.add(response.timings.duration)
    sleep(0.3)
  })

  group('3. Get Result (DB Read Heavy)', () => {
    const response = http.get(
      `${BASE_URL}/api/profiles/${Math.random().toString().substring(2, 20)}/result`
    )

    const isSuccess = check(response, {
      'get result: 200 or 404': (r) => r.status === 200 || r.status === 404,
      'response time <2s': (r) => r.timings.duration < 2000,
    })

    if (!isSuccess) {
      success = false
    }

    dbLatency.add(response.timings.duration)
    apiLatency.add(response.timings.duration)
    sleep(0.5)
  })

  group('4. Local Mode Scoring', () => {
    const payload = generateQuizAnswers()
    const response = http.post(`${BASE_URL}/api/result`, JSON.stringify(payload), {
      headers: { 'Content-Type': 'application/json' },
    })

    const isSuccess = check(response, {
      'local scoring success': (r) => r.status === 200,
      'has score': (r) => {
        try {
          const body = JSON.parse(r.body)
          return body.score !== undefined
        } catch {
          return false
        }
      },
    })

    if (!isSuccess) {
      success = false
      failedRequests.add(1)
    }

    apiLatency.add(response.timings.duration)
    sleep(0.5)
  })

  group('5. Booking Endpoints', () => {
    // Home test booking
    const bookingPayload = {
      full_name: `User_${Math.random().toString(36).substring(7)}`,
      mobile: `98${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`,
      address: `Address_${Math.floor(Math.random() * 1000)}`,
      pincode: `${Math.floor(Math.random() * 100000)}`,
      preferred_date: '2026-04-15',
      time_slot: '09:00-11:00',
    }

    const response = http.post(
      `${BASE_URL}/api/home-test-bookings`,
      JSON.stringify(bookingPayload),
      { headers: { 'Content-Type': 'application/json' } }
    )

    const isSuccess = check(response, {
      'booking success': (r) => r.status === 200 || r.status === 201,
    })

    if (!isSuccess) {
      failedRequests.add(1)
    }

    apiLatency.add(response.timings.duration)
    sleep(0.5)
  })

  group('6. Frontend Load (Page Rendering)', () => {
    const response = http.get(FRONTEND_URL)

    const isSuccess = check(response, {
      'frontend loads': (r) => r.status === 200,
      'has content': (r) => r.body.length > 1000,
      'response time <3s': (r) => r.timings.duration < 3000,
    })

    if (!isSuccess) {
      success = false
    }

    apiLatency.add(response.timings.duration)
    sleep(1)
  })

  if (!success) {
    errorRate.add(1)
  }

  // Random think time between requests
  sleep(Math.random() * 2)
}
