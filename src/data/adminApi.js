export async function adminRequest(path, { method = 'GET', body, csrfToken, signal } = {}) {
  const response = await fetch(`/api/admin/${path}`, {
    method, signal, credentials: 'same-origin',
    headers: { ...(body ? { 'Content-Type': 'application/json' } : {}), ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  let data
  try { data = await response.json() } catch { throw new Error('The admin server is unavailable. Start the configured backend and try again.') }
  if (!response.ok) throw Object.assign(new Error(data.error || 'The workspace could not be updated.'), { status: response.status, localDevelopment: data.localDevelopment === true })
  return data
}
