<template>
  <div class="container mt-5" style="max-width:500px">
    <div class="card shadow">
      <div class="card-body">
        <h2 class="mb-4">Login</h2>

        <form @submit.prevent="login">
          <div class="mb-3">
            <label>Email</label>
            <input
              v-model="email"
              type="email"
              class="form-control"
              required
            />
          </div>

          <div class="mb-3">
            <label>Password</label>
            <input
              v-model="password"
              type="password"
              class="form-control"
              required
            />
          </div>

          <button class="btn btn-primary w-100">
            Login
          </button>
        </form>

        <div
          v-if="error"
          class="alert alert-danger mt-3"
        >
          {{ error }}
        </div>

        <div class="mt-3 text-center">
          <router-link to="/register">
            Don't have an account? Register
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";
import { useAuthStore } from "../stores/authStore";

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const error = ref("");

const login = async () => {
  try {
    error.value = "";

    const response = await api.post("/auth/login", {
      email: email.value,
      password: password.value,
    });

    console.log(response.data);

    authStore.login(response.data);

    alert("Login Successful");

    router.push("/products");

  } catch (err) {
    console.error(err);

    error.value =
      err.response?.data?.message ||
      "Login Failed";
  }
};
</script>