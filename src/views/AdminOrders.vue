<template>
  <div class="container mt-4">
    <h2>Manage Orders</h2>

    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>User</th>
          <th>Total</th>
          <th>Status</th>
          <th>Update</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="order in orders"
          :key="order.id"
        >
          <td>{{ order.id }}</td>

          <td>{{ order.user_id }}</td>

          <td>₹{{ order.total_amount }}</td>

          <td>{{ order.status }}</td>

          <td>
            <select
              v-model="order.status"
              class="form-select"
            >
              <option>pending</option>
              <option>processing</option>
              <option>shipped</option>
              <option>delivered</option>
              <option>cancelled</option>
            </select>

            <button
              class="btn btn-primary btn-sm mt-2"
              @click="updateStatus(order)"
            >
              Save
            </button>
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

const updateStatus = async (order) => {
  await api.put(
    `/orders/${order.id}/status`,
    {
      status: order.status
    }
  );

  alert("Status Updated");
};

onMounted(loadOrders);
</script>