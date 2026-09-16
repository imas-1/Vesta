export const CATEGORY_ICONS = {
  Tricouri: '👕',
  Camasi: '👔',
  Hanorace: '🧥',
  Pulovere: '🧶',
  Pantaloni: '👖',
  Blugi: '👖',
  'Pantaloni scurti': '🩳',
  Geci: '🧥',
  Incaltaminte: '👟',
  Accesorii: '👜',
  Altele: '🏷️'
}

export function categoryIcon(category) {
  return CATEGORY_ICONS[category] || '🏷️'
}
