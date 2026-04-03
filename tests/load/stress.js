/**
 * Load Test — Stress (ramp up to 100 users)
 * Run: k6 run tests/load/stress.js
 */
import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  stages: [
    { duration: '30s', target: 10  },  // warm up
    { duration: '60s', target: 50  },  // ramp to 50
    { duration: '60s', target: 100 },  // ramp to 100
    { duration: '30s', target: 0   },  // cool down
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.05'],
  },
}

const BASE = __ENV.BASE_URL || 'https://diabetesassessment.myhealthschool.in'

export default function () {
  const res = http.get(BASE)
  check(res, { 'status 200': r => r.status === 200 })
  sleep(1)
}
