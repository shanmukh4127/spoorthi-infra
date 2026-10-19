import test from 'node:test'
import assert from 'node:assert/strict'
import { createProjectStory } from '../src/data/shared/projectStory.js'
import { getPublicProjects } from '../src/data/spoorthi/publicProjects.js'
import { publicTejesProject } from '../src/data/tejes/publicProjectDetail.js'

test('both brands use each published admin project’s exact stage media and keep drafts private', () => {
  const records = ['Spoorthi Infra', 'Tejes Interiors'].flatMap((brand, index) => [
    { id: `uploaded-${index}`, brand, status: 'Published', title: `Uploaded project ${index}`, category: 'Residential', description: 'A supplied project brief.', twoDImage: `/uploads/${index}-plan.png`, threeDImage: `/uploads/${index}-model.webp`, finalOutputImage: `/uploads/${index}-final.jpg` },
    { id: `private-${index}`, brand, status: 'Draft', title: 'Private study', category: 'Residential', twoDImage: '/uploads/private.png' },
  ])
  const published = getPublicProjects(records)
  for (const record of records.filter(item => item.status === 'Published')) {
    assert.ok(published.some(item => item.id === record.id))
    const story = createProjectStory(record.brand === 'Tejes Interiors' ? publicTejesProject(record) : record)
    assert.equal(story.project.twoDImages[0].image.src, record.twoDImage)
    assert.equal(story.project.threeDImages[0].image.src, record.threeDImage)
    assert.equal(story.project.visualizationImages[0].image.src, record.finalOutputImage)
    assert.ok(story.copy.twoD.description.includes(record.title))
  }
  assert.ok(!published.some(item => item.id.startsWith('private-')))
})

test('missing stages never borrow cover imagery or another project; explicit clearing overrides legacy media', () => {
  const story = createProjectStory({ id: 'no-stages', title: 'Unfinished media', coverImage: '/uploads/cover.jpg', twoDImage: '', twoDImages: [{ image: { src: '/old-plan.png' } }] })
  for (const stage of story.stages) {
    assert.equal(story.project[stage.key][0].image.src, null)
    assert.match(story.copy[stage.copyKey].description, /not been added/)
  }
})

test('project-specific supplied stage copy and legacy media remain associated with their project', () => {
  const story = createProjectStory({ id: 'own-copy', title: 'Own copy', twoDImages: [{ image: { src: '/same-project-plan.svg', width: 800, height: 500 } }], showcaseCopy: { twoD: { heading: 'A custom plan.', description: 'The supplied layout description.' } } })
  assert.equal(story.project.twoDImages[0].image.src, '/same-project-plan.svg')
  assert.equal(story.copy.twoD.heading, 'A custom plan.')
  assert.equal(story.copy.twoD.description, 'The supplied layout description.')
})
