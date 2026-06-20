<template>
  <div class="container mt-4">
    <h2 class="mb-4">My Orders</h2>

    <div
      v-if="orders.length === 0"
      class="alert alert-info"
    >
      No orders found.
    </div>

    <table
      v-else
      class="table table-bordered table-striped"
    >
      <thead>
        <tr>
          <th>ID</th>
          <th>Status</th>
          <th>Total</th>
          <th>Payment</th>
          <th>Date</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="order in orders"
          :key="order.id"
        >
          <td>{{ order.id }}</td>

          <td>
            <span class="badge bg-warning text-dark">
              {{ order.status }}
            </span>
          </td>

          <td>
            ₹{{ order.total_amount }}
          </td>

          <td>
            {{ order.payment_method }}
          </td>

          <td>
            {{ new Date(order.created_at).toLocaleDateString() }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";

const orders = ref([]);

const loadOrders = async () => {
  const res = await api.get("/orders");
  orders.value = res.data;
};

onMounted(loadOrders);
</script>