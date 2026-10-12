import { create } from "zustand";
import { storage } from "../storage/mmkv";

const CART_KEY = "cart";

const getStoredCart = () => {
  const data = storage.getString(CART_KEY);

  if (!data) {
    return [];
  }

  try {
    return JSON.parse(data);
  } catch (error) {
    console.log("Error loading cart:", error);
    return [];
  }
};

export const useCartStore = create((set, get) => ({
  cart: getStoredCart(),

  // ADD
  addToCart: (product) =>
    set((state) => {
      const existingProduct = state.cart.find((item) => item.id === product.id);

      let updatedCart;

      if (existingProduct) {
        updatedCart = state.cart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      } else {
        updatedCart = [
          ...state.cart,
          {
            ...product,
            quantity: 1,
          },
        ];
      }

      storage.set(CART_KEY, JSON.stringify(updatedCart));

      return {
        cart: updatedCart,
      };
    }),

  // REMOVE
  removeFromCart: (productId) =>
    set((state) => {
      const updatedCart = state.cart.filter((item) => item.id !== productId);

      storage.set(CART_KEY, JSON.stringify(updatedCart));

      return {
        cart: updatedCart,
      };
    }),

  // INCREASE
  increaseQuantity: (productId) =>
    set((state) => {
      const updatedCart = state.cart.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      );

      storage.set(CART_KEY, JSON.stringify(updatedCart));

      return {
        cart: updatedCart,
      };
    }),

  // DECREASE
  decreaseQuantity: (productId) =>
    set((state) => {
      const updatedCart = state.cart
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item,
        )
        .filter((item) => item.quantity > 0);

      storage.set(CART_KEY, JSON.stringify(updatedCart));

      return {
        cart: updatedCart,
      };
    }),

  getTotal: () => {
    const cart = get().cart;

    return cart.reduce(
      (total, item) => total + Number(item.price) * item.quantity,
      0,
    );
  },
}));
