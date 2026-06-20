<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <router-link class="navbar-brand" to="/products"> ShopNest </router-link>

      <div class="navbar-nav">
        <router-link class="nav-link" to="/products"> Products </router-link>

        <router-link v-if="authStore.isLoggedIn" class="nav-link" to="/cart">
          Cart
        </router-link>

        <router-link v-if="authStore.isLoggedIn" class="nav-link" to="/orders">
          Orders
        </router-link>

        <router-link v-if="!authStore.isLoggedIn" class="nav-link" to="/login">
          Login
        </router-link>

        <router-link
          v-if="!authStore.isLoggedIn"
          class="nav-link"
          to="/register"
        >
          Register
        </router-link>
        <li class="nav-item">
          <router-link class="nav-link" to="/admin/dashboard">
            Dashboard
          </router-link>
        </li>
        <router-link v-if="authStore.isAdmin" class="nav-link" to="/admin">
          Admin
        </router-link>
        <router-link class="nav-link" to="/admin/orders">
          Manage Orders
        </router-link>
        <router-link class="nav-link" to="/admin/categories">
          Categories
        </router-link>
        <button
          v-if="authStore.isLoggedIn"
          class="btn btn-danger ms-3"
          @click="logout"
        >
          Logout
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";

const router = useRouter();
const authStore = useAuthStore();

const logout = () => {
  authStore.logout();
  router.push("/login");
};
</script>
