<template>
  <div class="container mt-4">
    <h2 class="mb-4">My Cart</h2>

    <div
      v-if="cartStore.cart.length === 0"
      class="alert alert-info"
    >
      Your cart is empty.
    </div>

    <div v-else>
      <table class="table table-bordered table-hover">
        <thead class="table-dark">
          <tr>
            <th>Product</th>
            <th>Quantity</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="item in cartStore.cart"
            :key="item.id"
          >
            <td>
              {{
                item.Product?.name ||
                `Product ID: ${item.product_id}`
              }}
            </td>

            <td>
              {{ item.quantity }}
            </td>
          </tr>
        </tbody>
      </table>

      <div class="mb-3">
        <label class="form-label">
          Shipping Address
        </label>

        <textarea
          v-model="shippingAddress"
          class="form-control"
          rows="3"
          placeholder="Enter your shipping address"
        ></textarea>
      </div>

      <div class="mb-3">
        <label class="form-label">
          Payment Method
        </label>

        <select
          v-model="paymentMethod"
          class="form-select"
        >
          <option value="">
            Select Payment Method
          </option>

          <option value="COD">
            Cash On Delivery
          </option>

          <option value="UPI">
            UPI
          </option>

          <option value="CARD">
            Credit / Debit Card
          </option>

          <option value="NET_BANKING">
            Net Banking
          </option>
        </select>
      </div>

      <button
        class="btn btn-success"
        @click="placeOrder"
      >
        Place Order
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useCartStore } from "../stores/cartStore";
import api from "../services/api";

const cartStore = useCartStore();

const paymentMethod = ref("");
const shippingAddress = ref("");

onMounted(async () => {
  await cartStore.getCart();
});

const placeOrder = async () => {
  try {
    if (!shippingAddress.value.trim()) {
      alert("Please enter shipping address");
      return;
    }

    if (!paymentMethod.value) {
      alert("Please select a payment method");
      return;
    }

    const res = await api.post("/orders", {
      shipping_address: shippingAddress.value,
      payment_method: paymentMethod.value,
    });

    alert("Order placed successfully");

    console.log("Order Response:", res.data);

    shippingAddress.value = "";
    paymentMethod.value = "";

    await cartStore.getCart();

  } catch (error) {
    console.error(error.response?.data);

    alert(
      error.response?.data?.message ||
      "Failed to place order"
    );
  }
};
</script>