/**
 * Unified profile save - uses API, Supabase, or profileStorage
 * Always persists to Supabase when we have the client and userId.
 */
import { supabase } from './supabaseClient'
import { saveProfile, getUserId } from './profileStorage'
import { hasApi, apiUpdateProfile } from './api'

export async function saveProfileData(userId, updates) {
  const effectiveUserId = userId || getUserId()
  saveProfile(updates)

  // Persist to Supabase when we have the client and userId
  if (supabase && effectiveUserId) {
    const { error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', effectiveUserId)
    if (error) throw error
  }

  // Also sync to backend API when enabled (for backend state consistency)
  if (hasApi() && effectiveUserId) {
    await apiUpdateProfile(effectiveUserId, updates)
  }
}
