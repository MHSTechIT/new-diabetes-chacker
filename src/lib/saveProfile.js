/**
 * Unified profile save - uses API, Supabase, or profileStorage
 */
import { supabase } from './supabaseClient'
import { saveProfile } from './profileStorage'
import { hasApi, apiUpdateProfile } from './api'

export async function saveProfileData(userId, updates) {
  saveProfile(updates)
  if (hasApi() && userId) {
    await apiUpdateProfile(userId, updates)
    return
  }
  if (supabase && userId) {
    await supabase.from('user_profiles').update(updates).eq('id', userId)
  }
}
