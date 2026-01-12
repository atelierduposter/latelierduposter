/**
 * Analytics Tracking
 * 
 * Tracks unique visits and stores them in localStorage and Supabase.
 */

import { createSupabaseClient } from '@/lib/supabase/client'

const VISIT_STORAGE_KEY = 'monpetitposter_visit'
const VISITS_STORAGE_KEY = 'monpetitposter_visits'

export interface Visit {
  date: string // YYYY-MM-DD
  timestamp: number
  isUnique: boolean
}

export async function trackVisit(): Promise<void> {
  if (typeof window === 'undefined') return

  const today = new Date().toISOString().split('T')[0]
  const now = Date.now()

  // Check if we've already tracked a visit today
  const lastVisit = localStorage.getItem(VISIT_STORAGE_KEY)
  const lastVisitDate = lastVisit ? JSON.parse(lastVisit).date : null

  const isUnique = lastVisitDate !== today

  if (isUnique) {
    // Store today's visit
    localStorage.setItem(VISIT_STORAGE_KEY, JSON.stringify({
      date: today,
      timestamp: now,
    }))

    // Add to visits array
    const visitsStr = localStorage.getItem(VISITS_STORAGE_KEY)
    const visits: Visit[] = visitsStr ? JSON.parse(visitsStr) : []
    
    visits.push({
      date: today,
      timestamp: now,
      isUnique: true,
    })

    // Keep only last 90 days
    const ninetyDaysAgo = now - (90 * 24 * 60 * 60 * 1000)
    const recentVisits = visits.filter(v => v.timestamp > ninetyDaysAgo)
    
    localStorage.setItem(VISITS_STORAGE_KEY, JSON.stringify(recentVisits))

    // Try to store in Supabase (optional, for server-side analytics)
    try {
      const supabase = createSupabaseClient()
      const { error } = await supabase.from('visits').insert({
        visit_date: today,
        timestamp: now,
      })
      if (error) {
        // Ignore errors if table doesn't exist
      }
    } catch (error) {
      // Ignore errors
    }
  }
}

export function getVisits(): Visit[] {
  if (typeof window === 'undefined') return []
  
  const visitsStr = localStorage.getItem(VISITS_STORAGE_KEY)
  return visitsStr ? JSON.parse(visitsStr) : []
}

export function getUniqueVisitsByDay(): Record<string, number> {
  const visits = getVisits()
  const visitsByDay: Record<string, number> = {}

  visits.forEach(visit => {
    if (visit.isUnique) {
      visitsByDay[visit.date] = (visitsByDay[visit.date] || 0) + 1
    }
  })

  return visitsByDay
}

export function getUniqueVisitsByMonth(): Record<string, number> {
  const visits = getVisits()
  const visitsByMonth: Record<string, number> = {}

  visits.forEach(visit => {
    if (visit.isUnique) {
      const month = visit.date.substring(0, 7) // YYYY-MM
      visitsByMonth[month] = (visitsByMonth[month] || 0) + 1
    }
  })

  return visitsByMonth
}
