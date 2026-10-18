// Conceptual storytelling, not a catalogue of verified company services.
export const tejasChapters = [
  { label: 'The first impression', title: 'A feeling.\nBefore a word.', text: 'Step inside a study in quiet elegance. A journey through light, material and the spaces in between.', detail: 'An interior story in twelve chapters', image: 'hero-living' },
  { label: 'The design philosophy', title: 'Room for\npossibility.', text: 'Warmth in the palette. Purpose in every line. Beauty begins with the way a space makes you feel.', detail: 'Intention · Balance · Belonging', image: 'philosophy-light' },
  { label: 'Understanding the space', title: 'Every line\nhas a purpose.', text: 'Proportion, movement and a place for everyday rituals. The invisible framework of a considered interior.', detail: 'From a line on paper to a place to live', image: 'process-interior' },
  { label: 'Materials & textures', title: 'Made to\nbe felt.', text: 'The grain of oak. The coolness of stone. The softness of linen. A conversation between natural textures.', detail: 'Oak · Marble · Linen · Brushed metal', image: 'material-wood' },
  { label: 'The heart of the home', title: 'Where life\ncomes together.', text: 'A kitchen imagined around the rhythm of the day. Tactile surfaces, considered storage and room to gather.', detail: 'A study in the everyday', image: 'category-kitchen' },
  { label: 'Personal living spaces', title: 'A quieter\nkind of luxury.', text: 'A restful bedroom, a private reading corner and a stone-lined bathroom. Follow the quieter rhythm of the private wing.', detail: 'Stillness, by design', image: 'category-bedroom' },
  { label: 'Living spaces', title: 'Space to\njust be.', text: 'Furniture in conversation. Light moving across the floor. A living space with room for your own story.', detail: 'Comfort meets composition', image: 'category-living' },
  { label: 'Beyond residential', title: 'A different\nperspective.', text: 'A framed workspace study explores another way to gather, focus and exchange ideas. A separate concept, encountered within the home.', detail: 'A commercial concept study', image: 'category-office' },
  { label: 'The art of lighting', title: 'Light changes\neverything.', text: 'Daylight reveals the architecture. A warm glow brings it closer. Layers of light give each surface a new expression.', detail: 'Natural · Ambient · Architectural', image: 'philosophy-light' },
  { label: 'Visualizing the vision', title: 'An idea,\nmade visible.', text: 'Structure gives way to texture. Lines become surfaces. An imagined space takes on depth, warmth and life.', detail: 'From outline to atmosphere', image: 'development-visual' },
  { label: 'Bringing it together', title: 'The detail\nis the difference.', text: 'A precise join. A softened edge. The alignment of grain and finish. Small decisions create a coherent whole.', detail: 'Crafted connections', image: 'quality-interior' },
  { label: 'The final reveal', title: 'Beautifully\nyours to imagine.', text: 'Light, proportion and material, finally in harmony. Let this be the beginning of a conversation about your space.', detail: 'Your next chapter starts here', image: 'final-living' },
]
export const chapterAt = progress => Math.min(11, Math.max(0, Math.round(progress * 11)))
export const chapterProgress = index => Math.max(0, Math.min(11, index)) / 11
export const interiorCameraStops = [
  [[2.25,1.45,6.8],[.2,1.1,2.8]], [[-1.1,1.5,5.8],[.5,1.15,2.9]],
  [[1.8,2.6,7.5],[4,.9,5.4]], [[4.2,1.65,6.9],[5.5,1.1,4.4]],
  [[9.4,1.65,5.7],[7.4,1.2,1.3]], [[14,1.55,5.8],[15.6,.85,2.5]],
  [[18.8,1.5,6.2],[20,1.05,2.9]], [[24,1.65,6.1],[25,1.1,2.3]],
  [[24.4,1.8,7.6],[20,2.3,2.8]], [[16.6,2.05,7.5],[15.6,1.2,2.5]],
  [[8.7,1.6,7.4],[7.4,1.1,1.3]], [[2,1.5,6.5],[.3,1.25,2.8]],
]
