const NEUTRALS = ['negru', 'alb', 'gri', 'bej', 'crem', 'bleumarin', 'denim']

const TOP_CATEGORIES = ['Tricouri', 'Camasi', 'Hanorace', 'Pulovere', 'Geci']
const BOTTOM_CATEGORIES = ['Pantaloni', 'Blugi', 'Pantaloni scurti']
const SHOE_CATEGORIES = ['Incaltaminte']
const ACCESSORY_CATEGORIES = ['Accesorii']

function isNeutral(color) {
  if (!color) return false
  return NEUTRALS.some((n) => color.toLowerCase().includes(n))
}

function colorsMatch(a, b) {
  if (!a || !b) return true
  if (isNeutral(a) || isNeutral(b)) return true
  return a.trim().toLowerCase() === b.trim().toLowerCase()
}

function pickFrom(items, categories, preferColor) {
  const pool = items.filter((i) => categories.includes(i.category))
  if (pool.length === 0) return null

  const favorites = pool.filter((i) => i.favorite)
  const matching = (preferColor ? pool.filter((i) => colorsMatch(i.color, preferColor)) : pool)

  const priorityPool = favorites.filter((i) => matching.includes(i))
  const source = priorityPool.length > 0 ? priorityPool : matching.length > 0 ? matching : pool

  return source[Math.floor(Math.random() * source.length)]
}

// Suggests an outfit by picking one top, one bottom, optionally shoes and an
// accessory, preferring favorites and color-compatible pieces. Pure
// client-side logic - no external AI calls, so it stays free.
export function suggestOutfit(items) {
  const top = pickFrom(items, TOP_CATEGORIES)
  if (!top) return null

  const bottom = pickFrom(items, BOTTOM_CATEGORIES, top.color)
  const shoes = pickFrom(items, SHOE_CATEGORIES, top.color)
  const accessory = Math.random() > 0.5 ? pickFrom(items, ACCESSORY_CATEGORIES, top.color) : null

  const picks = [top, bottom, shoes, accessory].filter(Boolean)
  if (picks.length < 2) return null

  return picks.map((i) => i.id)
}
