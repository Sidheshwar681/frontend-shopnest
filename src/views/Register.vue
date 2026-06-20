<template>
  <div class="container mt-5" style="max-width: 500px">
    <div class="card shadow">
      <div class="card-body">
        <h2 class="mb-4 text-center">
          Register
        </h2>

        <form @submit.prevent="register">
          <div class="mb-3">
            <label class="form-label">
              Name
            </label>

            <input
              v-model="form.name"
              class="form-control"
              placeholder="Enter your name"
              required
            />
          </div>

          <div class="mb-3">
            <label class="form-label">
              Email
            </label>

            <input
              type="email"
              v-model="form.email"
              class="form-control"
              placeholder="Enter your email"
              required
            />
          </div>

          <div class="mb-3">
            <label class="form-label">
              Phone
            </label>

            <input
              v-model="form.phone"
              class="form-control"
              placeholder="Enter your phone number"
            />
          </div>

          <div class="mb-3">
            <label class="form-label">
              Password
            </label>

            <input
              type="password"
              v-model="form.password"
              class="form-control"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            class="btn btn-success w-100"
          >
            Register
          </button>
        </form>

        <div
          v-if="error"
          class="alert alert-danger mt-3"
        >
          {{ error }}
        </div>

        <div class="text-center mt-3">
          <router-link to="/login">
            Already have an account? Login
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";

const router = useRouter();

const error = ref("");

const form = reactive({
  name: "",
  email: "",
  phone: "",
  password: "",
});

const register = async () => {
  try {
    error.value = "";

    await api.post("/auth/register", form);

    alert("Registration Successful");

    router.push("/login");

  } catch (err) {
    console.error(err);

    error.value =
      err.response?.data?.message ||
      "Registration Failed";
  }
};
</script>