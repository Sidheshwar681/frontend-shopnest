<template>
  <div class="container mt-4">
    <h2 class="mb-4">Admin Dashboard</h2>

    <div class="row">

      <div class="col-md-3">
        <div class="card text-center shadow">
          <div class="card-body">
            <h5>Total Products</h5>
            <h2>{{ totalProducts }}</h2>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card text-center shadow">
          <div class="card-body">
            <h5>Total Orders</h5>
            <h2>{{ totalOrders }}</h2>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card text-center shadow">
          <div class="card-body">
            <h5>Total Users</h5>
            <h2>{{ totalUsers }}</h2>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card text-center shadow">
          <div class="card-body">
            <h5>Revenue</h5>
            <h2>₹{{ totalRevenue }}</h2>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";

const totalProducts = ref(0);
const totalOrders = ref(0);
const totalUsers = ref(0);
const totalRevenue = ref(0);

const loadDashboard = async () => {
  try {

    const productsRes = await api.get("/products");
    totalProducts.value = productsRes.data.total;

    const ordersRes = await api.get("/orders");
    totalOrders.value = ordersRes.data.length;

    totalRevenue.value = ordersRes.data.reduce(
      (sum, order) => sum + Number(order.total_amount || 0),
      0
    );

    const usersRes = await api.get("/users");
    totalUsers.value = usersRes.data.length;

  } catch (error) {
    console.error(error);
  }
};

onMounted(loadDashboard);
</script>