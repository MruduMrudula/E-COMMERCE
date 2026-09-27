import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  cart: [],

  // ADD
  addToCart: (product) =>
    set((state) => {
      const existingProduct = state.cart.find((item) => item.id === product.id);

      if (existingProduct) {
        return {
          cart: state.cart.map((item) =>
            item.id === product.id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                }
              : item,
          ),
        };
      }

      return {
        cart: [
          ...state.cart,
          {
            ...product,
            quantity: 1,
          },
        ],
      };
    }),

  // REMOVE
  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== productId),
    })),

  // INCREASE
  increaseQuantity: (productId) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      ),
    })),

  // DECREASE
  decreaseQuantity: (productId) =>
    set((state) => ({
      cart: state.cart
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    })),
  getTotal: () => {
    const cart = get().cart;

    return cart.reduce(
      (total, item) => total + Number(item.price) * item.quantity,
      0,
    );
  },
}));
