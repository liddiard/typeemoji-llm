export const baseUrl = import.meta.env.DEV
  ? 'http://localhost:5919'
  : 'https://api.typeemoji.com'

export const searchExamples = [
  'Japan',
  'New York City',
  'San Francisco',
  'Paris',
  'tropical island',
  'anime',
  'programming',
  'love',
  'humidity',
  'healthy food',
  'junk food',
  'magic',
  'meditation',
  'old fashioned',
  'desert',
  'celebrate',
  'science fiction',
  'office supplies',
  'Finding Nemo',
  'Dungeons & Dragons',
  'ennui',
  'military',
  'Earth Day',
  'martial arts',
  'triathalon',
  'in progress',
  'communication',
]
  // shuffle the examples
  .map((value) => ({ value, sort: Math.random() }))
  .sort((a, b) => a.sort - b.sort)
  .map(({ value }) => value)
