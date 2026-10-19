import { useEffect, useState } from 'react'
import { adminRequest } from './adminApi.js'

export default function useAdminSession() {
  const [session, setSession] = useState(null)
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState('')
  const [localDevelopment, setLocalDevelopment] = useState(false)
  useEffect(() => {
    const controller = new AbortController()
    adminRequest('session', { signal: controller.signal })
      .then(next => { setSession(next); setLocalDevelopment(next.localDevelopment === true) })
      .catch(error => { if (!controller.signal.aborted) { setLocalDevelopment(error.localDevelopment === true); if (error.status !== 401) setError(error.message) } })
      .finally(() => { if (!controller.signal.aborted) setChecking(false) })
    return () => controller.abort()
  }, [])
  async function login(credentials) {
    setError('')
    const next = await adminRequest('login', { method: 'POST', body: credentials })
    setSession(next)
  }
  async function logout() {
    try { await adminRequest('logout', { method: 'POST', csrfToken: session?.csrfToken }) }
    catch (error) { if (error.status !== 401) { setError(error.message); return } }
    setSession(null)
  }
  return { session, checking, error, localDevelopment, login, logout, expire: () => setSession(null) }
}
