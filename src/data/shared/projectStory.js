const stageDefinitions = [
  { field: 'twoDImage', key: 'twoDImages', copyKey: 'twoD', label: '2D design', title: 'Begin with the plan.', description: 'Review the drawing supplied for this project.' },
  { field: 'threeDImage', key: 'threeDImages', copyKey: 'threeD', label: '3D design', title: 'Explore the form.', description: 'Explore the three-dimensional view supplied for this project.' },
  { field: 'finalOutputImage', key: 'visualizationImages', copyKey: 'visualization', label: 'Final output', title: 'See the final image.', description: 'View the final image supplied for this project. This image alone does not establish construction or completion status.' },
]

export function createProjectStory(record) {
  const project = { id: record.id, title: record.title }
  const copy = {}
  const stages = stageDefinitions.map(stage => {
    const existing = record[stage.key]?.[0]
    const src = typeof record[stage.field] === 'string'
      ? record[stage.field].trim() || null
      : existing?.image?.src || null
    const saved = record.showcaseCopy?.[stage.copyKey] || record.stageCopy?.[stage.copyKey]
    project[stage.key] = [{ image: { ...(typeof record[stage.field] !== 'string' ? existing?.image : {}), src, width: existing?.image?.width || 1600, height: existing?.image?.height || 1000 }, alt: `${record.title} — ${stage.label}`, missingLabel: `${stage.label} image not yet added` }]
    copy[stage.copyKey] = {
      heading: typeof saved?.heading === 'string' && saved.heading.trim() ? saved.heading : stage.title,
      description: src
        ? typeof saved?.description === 'string' && saved.description.trim() ? saved.description : `${record.title}. ${stage.description}`
        : `A ${stage.label.toLowerCase()} image has not been added to this project yet.`,
    }
    return { key: stage.key, copyKey: stage.copyKey, label: stage.label, title: stage.title, note: src ? record.isConcept ? 'Illustrative concept image' : 'Project image supplied through the workspace' : 'Awaiting project media' }
  })
  return { project, copy, stages }
}
