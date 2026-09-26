export type Product = {
  id: string
  name: string
  price: number
  category: string
  colors: { name: string; hex: string }[]
  sizes: string[]
  specs: string[]
  /** number of gallery slots on the detail view */
  slots: number
}

const COLORS = {
  black: { name: 'Negro', hex: '#111111' },
  white: { name: 'Blanco', hex: '#f4f4f4' },
  blue: { name: 'Azul', hex: '#1e3a8a' },
  sand: { name: 'Arena', hex: '#d8c7a8' },
  olive: { name: 'Olivo', hex: '#5b6247' },
  gray: { name: 'Gris', hex: '#4b4b4b' },
}

const baseSpecs = [
  'Algodón peinado 180 g/m² premium',
  'Corte loose fit contemporáneo',
  'Serigrafía de alta densidad',
  'Costuras reforzadas doble aguja',
  'Etiqueta tejida Textiles Reyes',
  'Preencogido, no destiñe',
]

export const products: Product[] = [
  {
    id: 'pantalon-sastre',
    name: 'Pantalón Sastre Loose Fit',
    price: 849,
    category: 'SERIGRAFÍA',
    colors: [COLORS.black, COLORS.gray, COLORS.sand],
    sizes: ['S', 'M', 'G', 'XL'],
    specs: baseSpecs,
    slots: 3,
  },
  {
    id: 'playera-grafica',
    name: 'Playera Gráfica Loose Fit',
    price: 349,
    category: 'SERIGRAFÍA',
    colors: [COLORS.white, COLORS.black, COLORS.blue],
    sizes: ['S', 'M', 'G', 'XL'],
    specs: baseSpecs,
    slots: 3,
  },
  {
    id: 'pantalon-cargo',
    name: 'Pantalón Cargo Loose Fit',
    price: 899,
    category: 'SERIGRAFÍA',
    colors: [COLORS.gray, COLORS.olive, COLORS.black],
    sizes: ['S', 'M', 'G', 'XL'],
    specs: baseSpecs,
    slots: 3,
  },
  {
    id: 'playera-oversized',
    name: 'Playera Oversized Manga Larga',
    price: 399,
    category: 'SERIGRAFÍA',
    colors: [COLORS.blue, COLORS.black, COLORS.white],
    sizes: ['S', 'M', 'G', 'XL'],
    specs: baseSpecs,
    slots: 3,
  },
  {
    id: 'hoodie-print',
    name: 'Hoodie Print Reyes',
    price: 899,
    category: 'SERIGRAFÍA',
    colors: [COLORS.black, COLORS.gray, COLORS.blue],
    sizes: ['S', 'M', 'G', 'XL'],
    specs: baseSpecs,
    slots: 3,
  },
  {
    id: 'bomber-reyes',
    name: 'Bomber Reyes',
    price: 1290,
    category: 'SERIGRAFÍA',
    colors: [COLORS.black, COLORS.olive],
    sizes: ['S', 'M', 'G', 'XL'],
    specs: baseSpecs,
    slots: 3,
  },
  {
    id: 'raglan-tee',
    name: 'Raglan Tee 3/4',
    price: 429,
    category: 'SERIGRAFÍA',
    colors: [COLORS.white, COLORS.black],
    sizes: ['S', 'M', 'G', 'XL'],
    specs: baseSpecs,
    slots: 3,
  },
  {
    id: 'short-cargo',
    name: 'Short Cargo Utility',
    price: 649,
    category: 'SERIGRAFÍA',
    colors: [COLORS.olive, COLORS.sand, COLORS.black],
    sizes: ['S', 'M', 'G', 'XL'],
    specs: baseSpecs,
    slots: 3,
  },
  {
    id: 'jogger-print',
    name: 'Jogger Print Loose',
    price: 749,
    category: 'SERIGRAFÍA',
    colors: [COLORS.black, COLORS.gray],
    sizes: ['S', 'M', 'G', 'XL'],
    specs: baseSpecs,
    slots: 3,
  },
  {
    id: 'crewneck-reyes',
    name: 'Crewneck Reyes Heavy',
    price: 799,
    category: 'SERIGRAFÍA',
    colors: [COLORS.sand, COLORS.black, COLORS.blue],
    sizes: ['S', 'M', 'G', 'XL'],
    specs: baseSpecs,
    slots: 3,
  },
  {
    id: 'tank-oversized',
    name: 'Tank Oversized',
    price: 299,
    category: 'SERIGRAFÍA',
    colors: [COLORS.white, COLORS.black],
    sizes: ['S', 'M', 'G', 'XL'],
    specs: baseSpecs,
    slots: 3,
  },
  {
    id: 'denim-shirt',
    name: 'Camisa Denim Washed',
    price: 990,
    category: 'SERIGRAFÍA',
    colors: [COLORS.blue, COLORS.black],
    sizes: ['S', 'M', 'G', 'XL'],
    specs: baseSpecs,
    slots: 3,
  },
  {
    id: 'polo-knit',
    name: 'Polo Knit Premium',
    price: 699,
    category: 'SERIGRAFÍA',
    colors: [COLORS.black, COLORS.sand, COLORS.olive],
    sizes: ['S', 'M', 'G', 'XL'],
    specs: baseSpecs,
    slots: 3,
  },
  {
    id: 'windbreaker',
    name: 'Windbreaker Street',
    price: 1190,
    category: 'SERIGRAFÍA',
    colors: [COLORS.black, COLORS.blue],
    sizes: ['S', 'M', 'G', 'XL'],
    specs: baseSpecs,
    slots: 3,
  },
  {
    id: 'boxy-tee',
    name: 'Boxy Tee Heavyweight',
    price: 379,
    category: 'SERIGRAFÍA',
    colors: [COLORS.white, COLORS.sand, COLORS.black],
    sizes: ['S', 'M', 'G', 'XL'],
    specs: baseSpecs,
    slots: 3,
  },
  {
    id: 'chino-relaxed',
    name: 'Chino Relaxed Fit',
    price: 869,
    category: 'SERIGRAFÍA',
    colors: [COLORS.sand, COLORS.olive, COLORS.black],
    sizes: ['S', 'M', 'G', 'XL'],
    specs: baseSpecs,
    slots: 3,
  },
]

export function getProduct(id: string) {
  return products.find((p) => p.id === id)
}

export function formatMXN(value: number) {
  return `$${value.toLocaleString('es-MX')} MXN`
}
