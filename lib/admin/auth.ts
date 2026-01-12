/**
 * Admin Authentication Utilities
 */

export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  
  const authenticated = sessionStorage.getItem('admin_authenticated')
  const loginTime = sessionStorage.getItem('admin_login_time')
  
  if (!authenticated || authenticated !== 'true' || !loginTime) {
    return false
  }

  // Session expires after 8 hours
  const eightHours = 8 * 60 * 60 * 1000
  const timeSinceLogin = Date.now() - parseInt(loginTime, 10)
  
  if (timeSinceLogin > eightHours) {
    sessionStorage.removeItem('admin_authenticated')
    sessionStorage.removeItem('admin_login_time')
    return false
  }

  return true
}

export function logoutAdmin() {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('admin_authenticated')
    sessionStorage.removeItem('admin_login_time')
  }
}
