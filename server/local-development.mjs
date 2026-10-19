const loopback = address => ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(address)

export function isLocalDevelopmentRequest(request) {
  const hosts = ['localhost:5173', '127.0.0.1:5173', '[::1]:5173']
  if (!loopback(request.socket.remoteAddress) || !loopback(request.socket.localAddress) || request.socket.localPort !== 5173) return false
  if (!hosts.includes(request.headers.host)) return false
  if (Object.keys(request.headers).some(key => key === 'forwarded' || key === 'via' || key.startsWith('x-forwarded-'))) return false
  if (request.headers['sec-fetch-site'] === 'cross-site') return false
  if (request.headers.origin && !hosts.map(host => `http://${host}`).includes(request.headers.origin)) return false
  return true
}
