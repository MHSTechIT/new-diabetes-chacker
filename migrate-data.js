/**
 * Data Migration Script
 * Copies all data from old Supabase project to new Supabase project
 * Run: node migrate-data.js
 */

const OLD_URL = 'https://yqmomeddcflhtpssldrn.supabase.co'
const OLD_KEY = 'sb_publishable_aRF5QiPhFMasC2Cn9yRLrg_3d8xeVlw'

const NEW_URL = 'https://jkunhkzscrozcghnbxnn.supabase.co'
const NEW_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprdW5oa3pzY3JvemNnaG5ieG5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MDY2MzIsImV4cCI6MjA5MDE4MjYzMn0.bgjoCxoMEVD4rgSQ1GVulws1kyRyQnu7Po9pGSAU4cQ'

async function fetchAll(baseUrl, key, table) {
  const res = await fetch(`${baseUrl}/rest/v1/${table}?select=*`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Failed to fetch ${table}: ${res.status} ${err}`)
  }
  return res.json()
}

async function insertBatch(baseUrl, key, table, rows) {
  if (!rows.length) return
  const res = await fetch(`${baseUrl}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=ignore-duplicates,return=minimal',
    },
    body: JSON.stringify(rows),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Failed to insert into ${table}: ${res.status} ${err}`)
  }
}

async function migrateTable(table) {
  process.stdout.write(`Migrating ${table}... `)
  try {
    const rows = await fetchAll(OLD_URL, OLD_KEY, table)
    if (!rows.length) {
      console.log('empty, skipped.')
      return
    }
    await insertBatch(NEW_URL, NEW_KEY, table, rows)
    console.log(`✅ ${rows.length} rows copied.`)
  } catch (e) {
    console.log(`❌ ${e.message}`)
  }
}

async function main() {
  console.log('=== Diabetes Checker Data Migration ===')
  console.log(`From: ${OLD_URL}`)
  console.log(`To:   ${NEW_URL}`)
  console.log()

  // Order matters: parent tables before child tables
  await migrateTable('user_profiles')
  await migrateTable('home_test_bookings')
  await migrateTable('expert_call_bookings')
  await migrateTable('blood_reports')

  console.log()
  console.log('Migration complete!')
}

main().catch(console.error)
