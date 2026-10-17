// Replace pending fields with client-approved copy and local, approved imagery.
// Approval gates prevent a draft biography or milestone from becoming a public claim.
export const companyStory = {
  founder: { approved: false, name: '', role: '', biography: '', portrait: '', portraitAlt: '' },
  vision: { approved: false, text: '' },
  mission: { approved: false, text: '' },
  // Each entry: { approved: true, date: '', title: '', description: '' }.
  milestones: [],
}
