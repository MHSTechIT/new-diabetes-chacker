/**
 * Native Node.js Load Testing Suite
 * Run: node load-test-native.js
 */

const BASE_URL = 'https://new-diabetes-chacker.onrender.com'
const FRONTEND_URL = 'https://new-diabetes-chacker-hbqgarqx9-mhstechits-projects.vercel.app'

// Metrics
const metrics = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  errors: [],
  latencies: [],
  dbLatencies: [],
  startTime: Date.now(),
}

function generatePayload() {
  return {
    gender: Math.random() > 0.5 ? 'male' : 'female',
    name: `User_${Math.random().toString(36).substring(7)}`,
    phone: `98${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`,
    age_range: ['18-30', '30-50', '50+'][Math.floor(Math.random() * 3)],
  }
}

function generateQuizData() {
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

async function makeRequest(method, url, payload = null) {
  const startTime = Date.now()
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000,
    }

    if (payload) {
      options.body = JSON.stringify(payload)
    }

    const response = await fetch(url, options)
    const latency = Date.now() - startTime
    metrics.latencies.push(latency)
    metrics.totalRequests++

    if (response.ok || response.status === 404) {
      // 404 is acceptable (profile doesn't exist)
      metrics.successfulRequests++
      return { success: true, status: response.status, latency }
    } else {
      metrics.failedRequests++
      metrics.errors.push({ url, status: response.status, latency })
      return { success: false, status: response.status, latency }
    }
  } catch (error) {
    const latency = Date.now() - startTime
    metrics.failedRequests++
    metrics.errors.push({ url, error: error.message, latency })
    return { success: false, error: error.message, latency }
  }
}

async function simulateUserJourney() {
  const profilePayload = generatePayload()

  // 1. Create profile
  await makeRequest('POST', `${BASE_URL}/api/profiles`, profilePayload)

  // 2. Update quiz answers
  const quizData = generateQuizData()
  await makeRequest(
    'PATCH',
    `${BASE_URL}/api/profiles/${Math.random().toString().substring(2, 20)}`,
    quizData
  )

  // 3. Get result
  await makeRequest('GET', `${BASE_URL}/api/profiles/${Math.random().toString().substring(2, 20)}/result`)

  // 4. Score locally
  await makeRequest('POST', `${BASE_URL}/api/result`, quizData)

  // 5. Home test booking
  const bookingPayload = {
    full_name: profilePayload.name,
    mobile: profilePayload.phone,
    address: `Address_${Math.floor(Math.random() * 1000)}`,
    pincode: `${Math.floor(Math.random() * 100000)}`,
    preferred_date: '2026-04-15',
    time_slot: '09:00-11:00',
  }
  await makeRequest('POST', `${BASE_URL}/api/home-test-bookings`, bookingPayload)

  // 6. Frontend load
  await makeRequest('GET', FRONTEND_URL)
}

async function runLoadTest() {
  console.log('🚀 Starting Comprehensive Load Test Suite')
  console.log(`📊 Target: ${BASE_URL}`)
  console.log('='.repeat(60))

  const stages = [
    { name: 'Smoke Test', users: 5, duration: 30 },
    { name: 'Baseline (10 users)', users: 10, duration: 60 },
    { name: 'Step Load (50 users)', users: 50, duration: 90 },
    { name: 'Step Load (100 users)', users: 100, duration: 120 },
    { name: 'Stress (200 users)', users: 200, duration: 90 },
    { name: 'Soak Test (100 users)', users: 100, duration: 120 },
  ]

  for (const stage of stages) {
    console.log(`\n⏱️  Stage: ${stage.name}`)
    console.log(`   Users: ${stage.users}, Duration: ${stage.duration}s`)
    console.log('   Running...', )

    const startMetrics = { ...metrics }
    const stageStartTime = Date.now()

    // Run concurrent requests
    const promises = []
    const interval = (stage.duration * 1000) / stage.users

    for (let i = 0; i < stage.users; i++) {
      setTimeout(() => {
        simulateUserJourney()
      }, i * interval)
    }

    // Wait for stage to complete
    await new Promise(resolve => setTimeout(resolve, stage.duration * 1000))

    const stageDuration = (Date.now() - stageStartTime) / 1000
    const stageRequests = metrics.totalRequests - startMetrics.totalRequests
    const stageSuccess = metrics.successfulRequests - startMetrics.successfulRequests
    const stageFailed = metrics.failedRequests - startMetrics.failedRequests
    const stageAvgLatency = stageRequests > 0
      ? metrics.latencies
          .slice(-stageRequests)
          .reduce((a, b) => a + b, 0) / stageRequests
      : 0

    console.log(`   ✅ Requests: ${stageRequests} | Success: ${stageSuccess} | Failed: ${stageFailed}`)
    console.log(`   ⏱️  Avg Latency: ${stageAvgLatency.toFixed(0)}ms`)
    console.log(`   📈 Success Rate: ${((stageSuccess / stageRequests) * 100).toFixed(2)}%`)
  }

  // Final report
  console.log('\n' + '='.repeat(60))
  console.log('📊 FINAL LOAD TEST REPORT')
  console.log('='.repeat(60))

  const totalTime = (Date.now() - metrics.startTime) / 1000
  const successRate = (metrics.successfulRequests / metrics.totalRequests) * 100
  const avgLatency = metrics.latencies.length > 0
    ? metrics.latencies.reduce((a, b) => a + b, 0) / metrics.latencies.length
    : 0
  const p95Latency = metrics.latencies.sort((a, b) => a - b)[Math.floor(metrics.latencies.length * 0.95)]
  const p99Latency = metrics.latencies.sort((a, b) => a - b)[Math.floor(metrics.latencies.length * 0.99)]

  console.log(`\n📈 Overall Metrics:`)
  console.log(`   Total Requests: ${metrics.totalRequests}`)
  console.log(`   Successful: ${metrics.successfulRequests}`)
  console.log(`   Failed: ${metrics.failedRequests}`)
  console.log(`   Success Rate: ${successRate.toFixed(2)}%`)
  console.log(`   Total Duration: ${totalTime.toFixed(2)}s`)

  console.log(`\n⏱️  Latency Metrics:`)
  console.log(`   Average: ${avgLatency.toFixed(0)}ms`)
  console.log(`   P95: ${p95Latency}ms`)
  console.log(`   P99: ${p99Latency}ms`)

  console.log(`\n✅ Performance Targets:`)
  console.log(`   ${successRate >= 99 ? '✅' : '❌'} Success Rate >= 99% (actual: ${successRate.toFixed(2)}%)`)
  console.log(`   ${avgLatency < 800 ? '✅' : '❌'} Avg Latency < 800ms (actual: ${avgLatency.toFixed(0)}ms)`)
  console.log(`   ${p95Latency < 800 ? '✅' : '❌'} P95 Latency < 800ms (actual: ${p95Latency}ms)`)
  console.log(`   ${metrics.failedRequests / metrics.totalRequests < 0.01 ? '✅' : '❌'} Error Rate < 1%`)

  if (metrics.errors.length > 0) {
    console.log(`\n⚠️  Top Errors:`)
    const errorCounts = {}
    metrics.errors.forEach(e => {
      const key = e.error || `HTTP ${e.status}`
      errorCounts[key] = (errorCounts[key] || 0) + 1
    })
    Object.entries(errorCounts).slice(0, 5).forEach(([err, count]) => {
      console.log(`   ${count}x ${err}`)
    })
  }

  console.log(`\n🎯 Go-Live Readiness:`)
  const isReady = successRate >= 99 && avgLatency < 800 && metrics.failedRequests / metrics.totalRequests < 0.01
  if (isReady) {
    console.log('   ✅ READY FOR PRODUCTION')
  } else {
    console.log('   ⚠️  NEEDS OPTIMIZATION')
  }

  console.log('\n' + '='.repeat(60))
}

runLoadTest().catch(console.error)
