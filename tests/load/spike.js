/**
 * Load Test — Spike (200 users burst — launch day simulation)
 * Run: k6 run tests/load/spike.js
 */
import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  stages: [
    { duration: '10s', target: 200 }, // spike instantly to 200
    { duration: '30s', target: 200 }, // hold
    { duration: '10s', target: 0   }, // drop
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.10'],
  },
}

const BASE = __ENV.BASE_URL || 'https://diabetesassessment.myhealthschool.in'

export default function () {
  const res = http.get(BASE)
  check(res, { 'status 200': r => r.status === 200 })
  sleep(1)
}
