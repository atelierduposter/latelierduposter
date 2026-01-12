/**
 * Admin Route Handler
 * 
 * Redirects /admin to /admin/login if not authenticated,
 * otherwise redirects to /admin/index
 */

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { isAdminAuthenticated } from '@/lib/admin/auth'

export default function AdminRoute() {
  const router = useRouter()

  useEffect(() => {
    if (isAdminAuthenticated()) {
      router.replace('/admin')
    } else {
      router.replace('/admin/login')
    }
  }, [router])

  return <div>Redirection...</div>
}
