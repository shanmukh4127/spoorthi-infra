import test from 'node:test'
import assert from 'node:assert/strict'
import { newEnquiries, workspaceNotifications } from '../src/data/adminNotifications.js'

test('only newly received enquiries trigger notices, including different senders with the same name', () => {
  const original = { id: 'first', name: 'Same name', status: 'New' }
  const incoming = { id: 'second', name: 'Same name', status: 'New' }
  assert.deepEqual(newEnquiries([original], [incoming, original]), [incoming])
  assert.deepEqual(newEnquiries([original], [{ ...original, status: 'In review' }]), [])
  assert.deepEqual(newEnquiries([original], []), [])
})

test('bell lists every unresolved enquiry with distinct identities and working inbox targets', () => {
  const enquiries = Array.from({ length: 8 }, (_, i) => ({ id: String(i), name: 'Same name', subject: 'Project request', status: i === 7 ? 'Replied' : 'New' }))
  const notifications = workspaceNotifications(enquiries, [])
  assert.equal(notifications.length, 7)
  assert.equal(new Set(notifications.map(item => item.id)).size, 7)
  assert.ok(notifications.every(item => item.target === 'enquiries' && item.label === 'New enquiry received'))
  const readIds = notifications.map(item => item.id)
  assert.equal(notifications.filter(item => !readIds.includes(item.id)).length, 0)
  const updated = workspaceNotifications([...enquiries, { id: 'new', name: 'New sender', subject: 'New request', status: 'New' }], [])
  assert.equal(updated.filter(item => !readIds.includes(item.id)).length, 1)
})

test('legacy enquiries remain supported and deleted projects do not create notifications', () => {
  const notifications = workspaceNotifications([{ name: 'Legacy sender', status: 'In review', subject: 'Request' }], [{ id: 'hidden', status: 'Draft', deleted: true }])
  assert.equal(notifications.length, 1)
  assert.equal(notifications[0].label, 'Enquiry in review')
})
