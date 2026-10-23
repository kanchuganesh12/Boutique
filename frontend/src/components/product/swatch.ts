/** Display colours for catalogue colour names (used for swatches and filter chips). */
const SWATCHES: Record<string, string> = {
  maroon: '#7a1f2b',
  indigo: '#33407a',
  beige: '#d9c7a7',
  cream: '#f1e6cf',
  ivory: '#f8f2e4',
  sage: '#9caf88',
  mustard: '#d4a017',
  gold: '#c8a14a',
  black: '#1c1a17',
  red: '#b3261e',
  pink: '#e7a1b0',
  green: '#2f6f4e',
  blue: '#3b6ea8',
  white: '#ffffff',
}

export const swatchColor = (name?: string | null) =>
  (name && SWATCHES[name.toLowerCase()]) || '#c9c2b8'
