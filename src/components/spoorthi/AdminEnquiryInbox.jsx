import { useRef, useState } from 'react'
import { Search, Trash2 } from 'lucide-react'

export default function AdminEnquiryInbox({ enquiries, onStatusChange, onDelete }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [candidate, setCandidate] = useState(null)
  const confirmation = useRef(null)
  const term = query.trim().toLowerCase()
  const visible = enquiries.filter(item => (status === 'all' || item.status === status) && [item.name, item.email, item.subject].some(value => value?.toLowerCase().includes(term)))
  const identity = item => item.id || item.name
  return <section className="admin-section admin-section--compact" id="admin-enquiries" aria-labelledby="admin-enquiries-title">
    <div className="admin-section__head"><div><p className="admin-kicker">Enquiry inbox</p><h2 id="admin-enquiries-title">Enquiries</h2></div><span className="admin-inbox-count" role="status">{visible.length} of {enquiries.length}</span></div>
    <div className="admin-toolbar admin-inbox-toolbar">
      <label className="admin-search"><Search size={16} aria-hidden="true" /><span className="sr-only">Search enquiries</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Name, email or subject" /></label>
      <label className="admin-filter"><span className="sr-only">Filter enquiries by status</span><select value={status} onChange={event => setStatus(event.target.value)}><option value="all">All enquiries</option>{['New', 'In review', 'Replied'].map(value => <option key={value}>{value}</option>)}</select></label>
    </div>
    <div className="admin-enquiry-list">{visible.map(enquiry => <article className="admin-enquiry" key={identity(enquiry)}>
      <span className="admin-enquiry__avatar">{enquiry.initials}</span>
      <div><strong>{enquiry.name}</strong><span>{enquiry.subject}</span><small>{enquiry.date}</small>
        {enquiry.email && <a href={`mailto:${enquiry.email}`}>{enquiry.email}</a>}
        {enquiry.message && <details><summary>View enquiry</summary><p style={{ whiteSpace: 'pre-wrap' }}>{enquiry.message}</p>{enquiry.area && <p>Area: {enquiry.area} sq.ft</p>}{enquiry.context && <p>Project scope: {enquiry.context}</p>}</details>}
      </div>
      <div className="admin-inbox-actions"><button type="button" className={`admin-status admin-status--${enquiry.status === 'New' ? 'new' : enquiry.status === 'In review' ? 'review' : 'replied'}`} onClick={() => onStatusChange(identity(enquiry))} aria-label={`Change status for ${enquiry.name}, currently ${enquiry.status}`}>{enquiry.status}</button>
        <button type="button" className="admin-more admin-more--danger" aria-label={`Delete enquiry from ${enquiry.name}`} onClick={() => { setCandidate(enquiry); confirmation.current.showModal() }}><Trash2 size={16} aria-hidden="true" /></button></div>
    </article>)}</div>
    {!visible.length && <p className="admin-empty">{enquiries.length ? 'No enquiries match your search or status filter.' : 'No enquiries yet. New submissions will appear here.'}</p>}
    <dialog ref={confirmation} className="admin-confirm-dialog admin-enquiry-confirm" aria-labelledby="delete-enquiry-title" aria-describedby="delete-enquiry-description" onClose={() => setCandidate(null)}>
      <p className="admin-kicker">Remove enquiry</p><h2 id="delete-enquiry-title">Delete this enquiry?</h2>
      <p id="delete-enquiry-description">The enquiry from <strong>{candidate?.name}</strong> will be permanently removed from the shared inbox. This cannot be undone.</p>
      <div><button type="button" className="admin-secondary-button" autoFocus onClick={() => confirmation.current.close()}>Cancel</button><button type="button" className="admin-danger-button" onClick={() => { if (candidate) onDelete(identity(candidate)); confirmation.current.close() }}>Delete enquiry</button></div>
    </dialog>
  </section>
}
