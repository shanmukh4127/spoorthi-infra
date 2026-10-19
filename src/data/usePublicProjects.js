import { useEffect, useState } from 'react'

export default function usePublicProjects() {
  const [state, setState] = useState({ projects: [], services: [], status: 'loading' })
  useEffect(() => {
    const controller = new AbortController()
    const refresh = () => fetch('/api/public/projects', { signal: controller.signal })
      .then(response => response.ok ? response.json() : Promise.reject(new Error('Project service unavailable')))
      .then(data => {
        if (!Array.isArray(data.projects)) throw new Error('Invalid project response')
        setState({ projects: data.projects, services: data.services || [], status: 'ready' })
      })
      .catch(() => { if (!controller.signal.aborted) setState({ projects: [], services: [], status: 'error' }) })
    refresh()
    window.addEventListener('focus', refresh)
    return () => { controller.abort(); window.removeEventListener('focus', refresh) }
  }, [])
  return state
}
