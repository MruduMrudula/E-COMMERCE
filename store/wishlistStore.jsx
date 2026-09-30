import { create } from "zustand";

export const useWishlistStore = create((set) => ({
  wishlist: [],

  addToWishlist: (product) =>
    set((state) => {
      const alreadyExists = state.wishlist.some(
        (item) => item.id === product.id,
      );

      if (alreadyExists) {
        return state;
      }

      return {
        wishlist: [...state.wishlist, product],
      };
    }),

  removeFromWishlist: (productId) =>
    set((state) => ({
      wishlist: state.wishlist.filter((item) => item.id !== productId),
    })),

  toggleWishlist: (product) =>
    set((state) => {
      const alreadyExists = state.wishlist.some(
        (item) => item.id === product.id,
      );

      if (alreadyExists) {
        return {
          wishlist: state.wishlist.filter((item) => item.id !== product.id),
        };
      }

      return {
        wishlist: [...state.wishlist, product],
      };
    }),
}));
