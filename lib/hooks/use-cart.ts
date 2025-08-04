import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  productId: string
  variantId?: string
  name: string
  price: number
  image: string
  quantity: number
  variant?: {
    color?: string
    length?: string
    density?: string
  }
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const items = get().items
        const existingItem = items.find(
          (i) => i.productId === item.productId && i.variantId === item.variantId
        )

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === existingItem.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          })
        } else {
          set({
            items: [...items, { ...item, quantity: 1, id: `${item.productId}-${item.variantId || 'default'}` }],
          })
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) })
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }

        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
    }),
    {
      name: 'truth-hair-cart',
    }
  )
)