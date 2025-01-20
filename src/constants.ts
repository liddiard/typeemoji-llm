export const searchExamples = [
  'Japan',
  'New York City',
  'San Francisco',
  'Paris',
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
]
  // shuffle the examples
  .map((value) => ({ value, sort: Math.random() }))
  .sort((a, b) => a.sort - b.sort)
  .map(({ value }) => value)
