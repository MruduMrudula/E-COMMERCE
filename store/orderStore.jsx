import { create } from "zustand";
import { storage } from "../storage/mmkv";

const ORDERS_KEY = "orders";
const UNREAD_ORDERS_KEY = "unreadOrders";

const getStoredOrders = () => {
  const data = storage.getString(ORDERS_KEY);

  if (!data) {
    return [];
  }

  try {
    return JSON.parse(data);
  } catch (error) {
    console.log("Error loading orders:", error);
    return [];
  }
};

const getStoredUnreadOrders = () => {
  const data = storage.getString(UNREAD_ORDERS_KEY);

  if (!data) {
    return 0;
  }

  return Number(data);
};

export const useOrderStore = create((set) => ({
  orders: getStoredOrders(),
  unreadOrders: getStoredUnreadOrders(),

  // ADD ORDER
  addOrder: (order) =>
    set((state) => {
      const updatedOrders = [order, ...state.orders];
      const updatedUnreadOrders = state.unreadOrders + 1;

      storage.set(ORDERS_KEY, JSON.stringify(updatedOrders));
      storage.set(UNREAD_ORDERS_KEY, String(updatedUnreadOrders));

      return {
        orders: updatedOrders,
        unreadOrders: updatedUnreadOrders,
      };
    }),

  // MARK ORDERS AS READ
  markOrdersAsRead: () => {
    storage.set(UNREAD_ORDERS_KEY, "0");

    set({
      unreadOrders: 0,
    });
  },

  // CLEAR ORDERS
  clearOrders: () => {
    storage.delete(ORDERS_KEY);
    storage.delete(UNREAD_ORDERS_KEY);

    set({
      orders: [],
      unreadOrders: 0,
    });
  },
}));
