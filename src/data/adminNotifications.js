export const enquiryIdentity = enquiry => enquiry.id || enquiry.name

export function newEnquiries(previous, next) {
  const known = new Set(previous.map(enquiryIdentity))
  return next.filter(enquiry => !known.has(enquiryIdentity(enquiry)))
}

export function workspaceNotifications(enquiries, projects) {
  return [
    ...enquiries.filter(enquiry => enquiry.status !== 'Replied').map(enquiry => ({ id: `enquiry-${enquiryIdentity(enquiry)}`, label: enquiry.status === 'New' ? 'New enquiry received' : 'Enquiry in review', detail: `${enquiry.name} · ${enquiry.subject}`, target: 'enquiries' })),
    ...projects.filter(project => !project.deleted && (project.status || 'Published') === 'Draft').map(project => ({ id: `project-${project.id}`, label: 'Project is still a draft', detail: project.title, target: 'projects' })),
  ]
}
