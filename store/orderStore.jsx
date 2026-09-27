
import { create } from "zustand";

export const useOrderStore = create((set) => ({
  orders: [],

  // ADD ORDER
  addOrder: (order) =>
    set((state) => ({
      orders: [order, ...state.orders],
    })),

  // CLEAR ORDERS
  clearOrders: () =>
    set({
      orders: [],
    }),
}));
