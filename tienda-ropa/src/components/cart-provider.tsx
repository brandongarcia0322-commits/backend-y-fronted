'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react'

export type CartItem = {
  key: string
  id: string
  name: string
  price: number
  color: string
  size: string
  qty: number
  image?: string
}

type AddPayload = Omit<CartItem, 'key'>

type CartContextValue = {
  items: CartItem[]
  count: number
  subtotal: number
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  addItem: (item: AddPayload) => void
  removeItem: (key: string) => void
  updateQty: (key: string, qty: number) => void
  clear: () => void
  favorites: string[]
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
}

const CartContext = createContext<CartContextValue | null>(null)

function makeKey(item: AddPayload) {
  return `${item.id}_${item.color}_${item.size}`
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const addItem = useCallback((payload: AddPayload) => {
    // Sanitización para asegurar que nunca haya valores undefined o NaN
    const safePayload: AddPayload = {
      id: String(payload.id || 'item'),
      name: payload.name || 'Producto',
      price: Number(payload.price) || 0,
      color: payload.color || 'Único',
      size: payload.size || 'Única',
      qty: Math.max(1, Number(payload.qty) || 1),
      image: payload.image || '/placeholder.svg',
    }

    const key = makeKey(safePayload)

    setItems((prev) => {
      const existing = prev.find((i) => i.key === key)
      if (existing) {
        return prev.map((i) =>
          i.key === key
            ? { ...i, qty: (Number(i.qty) || 0) + safePayload.qty }
            : i
        )
      }
      return [...prev, { ...safePayload, key }]
    })
    setIsOpen(true)
  }, [])

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key))
  }, [])

  const updateQty = useCallback((key: string, qty: number) => {
    const safeQty = Number(qty)
    if (isNaN(safeQty) || safeQty <= 0) {
      setItems((prev) => prev.filter((i) => i.key !== key))
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.key === key ? { ...i, qty: safeQty } : i))
    )
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    )
  }, [])

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites]
  )

  const count = useMemo(
    () => items.reduce((sum, i) => sum + (Number(i.qty) || 0), 0),
    [items]
  )

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, i) =>
          sum + (Number(i.qty) || 0) * (Number(i.price) || 0),
        0
      ),
    [items]
  )

  const value: CartContextValue = {
    items,
    count,
    subtotal,
    isOpen,
    openCart,
    closeCart,
    addItem,
    removeItem,
    updateQty,
    clear,
    favorites,
    toggleFavorite,
    isFavorite,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}