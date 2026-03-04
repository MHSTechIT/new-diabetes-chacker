import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY

export const supabase = url && key ? createClient(url, key) : null

// In-memory fallback when no Supabase
const profiles = new Map()

export async function createProfile(data) {
  if (supabase) {
    const { data: row, error } = await supabase
      .from('user_profiles')
      .insert(data)
      .select('id')
      .single()
    if (error) throw error
    return row.id
  }
  const id = crypto.randomUUID()
  profiles.set(id, { id, ...data, created_at: new Date().toISOString() })
  return id
}

export async function getProfile(id) {
  if (supabase) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  }
  return profiles.get(id) || null
}

export async function updateProfile(id, updates) {
  if (supabase) {
    const { error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', id)
    if (error) throw error
    return
  }
  const existing = profiles.get(id)
  if (existing) {
    profiles.set(id, { ...existing, ...updates })
  }
}
