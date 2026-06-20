import { defineStore } from "pinia";
import api from "../services/api";

export const useCartStore = defineStore("cart", {
  state: () => ({
    cart: []
  }),

  actions: {
    async getCart() {
      const res = await api.get("/cart");
      this.cart = res.data;
    },

    async addToCart(productId) {
      await api.post("/cart", {
        product_id: productId,
        quantity: 1
      });

      await this.getCart();
    }
  }
});