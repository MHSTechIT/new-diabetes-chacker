/**
 * Load Test — Baseline
 * 10 virtual users for 30 seconds
 * Run: k6 run tests/load/baseline.js
 */
import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
}

const BASE = __ENV.BASE_URL || 'https://diabetesassessment.myhealthschool.in'

export default function () {
  // Load home page
  const home = http.get(BASE)
  check(home, { 'home status 200': r => r.status === 200 })

  sleep(1)

  // Load booking page
  const booking = http.get(`${BASE}/book-home-test`)
  check(booking, { 'booking status 200': r => r.status === 200 })

  sleep(1)
}
