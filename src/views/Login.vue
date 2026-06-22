<template>
  <div class="login-page">
    <div class="container">
      <div class="row justify-content-center align-items-center min-vh-100">
        <div class="col-md-5 col-lg-4">
          <!-- Logo/Header -->
          <div class="text-center mb-4">
            <div class="logo-circle mb-3">
              <i class="bi bi-shop"></i>
            </div>
            <h1 class="h3 fw-bold">ShopNest</h1>
            <p class="text-muted">Sign in to your account</p>
          </div>

          <!-- Login Form Card -->
          <div class="card border-0 shadow-lg">
            <div class="card-body p-4">
              <form @submit.prevent="login">
                <!-- Email Input -->
                <div class="mb-3">
                  <label class="form-label fw-bold">Email Address</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-0">
                      <i class="bi bi-envelope text-muted"></i>
                    </span>
                    <input
                      v-model="email"
                      type="email"
                      class="form-control border-start-0"
                      placeholder="you@example.com"
                      autocomplete="email"
                      required
                    />
                  </div>
                </div>

                <!-- Password Input -->
                <div class="mb-3">
                  <label class="form-label fw-bold">Password</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-0">
                      <i class="bi bi-lock text-muted"></i>
                    </span>
                    <input
                      v-model="password"
                      :type="showPassword ? 'text' : 'password'"
                      class="form-control border-start-0"
                      placeholder="Enter your password"
                      autocomplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      class="btn btn-outline-secondary"
                      @click="showPassword = !showPassword"
                    >
                      <i :class="['bi', showPassword ? 'bi-eye-slash' : 'bi-eye']"></i>
                    </button>
                  </div>
                </div>

                <!-- Remember Me & Forgot Password -->
                <div class="mb-3 d-flex justify-content-between align-items-center">
                  <div class="form-check">
                    <input v-model="rememberMe" type="checkbox" class="form-check-input" id="rememberMe" />
                    <label class="form-check-label" for="rememberMe">
                      Remember me
                    </label>
                  </div>
                  <a href="#" class="text-decoration-none small">Forgot password?</a>
                </div>

                <!-- Error Alert -->
                <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
                  <i class="bi bi-exclamation-circle me-2"></i>
                  {{ error }}
                  <button type="button" class="btn-close" @click="error = ''"></button>
                </div>

                <div v-if="success" class="alert alert-success fade show" role="status">
                  <i class="bi bi-check-circle me-2"></i>
                  {{ success }}
                </div>

                <!-- Login Button -->
                <button
                  type="submit"
                  class="btn btn-primary w-100 btn-lg fw-bold"
                  :disabled="isLoading"
                >
                  <span v-if="!isLoading">
                    <i class="bi bi-box-arrow-in-right me-2"></i>Sign In
                  </span>
                  <span v-else>
                    <span class="spinner-border spinner-border-sm me-2"></span>Signing in...
                  </span>
                </button>
              </form>

              <!-- Divider -->
              <div class="auth-divider my-4">
                <hr />
                <span class="text-muted small">or</span>
                <hr />
              </div>

              <!-- Social Login (Placeholder) -->
              <div class="d-grid gap-2 mb-4">
                <button type="button" class="btn btn-outline-secondary" disabled>
                  <i class="bi bi-google me-2"></i>Sign in with Google
                </button>
              </div>

              <!-- Sign Up Link -->
              <p class="text-center text-muted mb-0">
                Don't have an account?
                <router-link to="/register" class="fw-bold text-primary">Sign up</router-link>
              </p>
            </div>
          </div>

          <!-- Footer Info -->
          <p class="text-center text-muted small mt-4">
            By signing in, you agree to our
            <a href="#" class="text-decoration-none">Terms of Service</a>
            and
            <a href="#" class="text-decoration-none">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../services/api";
import { useAuthStore } from "../stores/authStore";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const email = ref(route.query.email || "");
const password = ref("");
const showPassword = ref(false);
const rememberMe = ref(false);
const error = ref("");
const success = ref(route.query.registered ? "Account created successfully. Please sign in." : "");
const isLoading = ref(false);

const login = async () => {
  try {
    error.value = "";
    success.value = "";
    isLoading.value = true;

    const response = await api.post("/auth/login", {
      email: email.value.trim(),
      password: password.value,
    });

    authStore.login(response.data);

    // Store remember me preference
    if (rememberMe.value) {
      localStorage.setItem("rememberMe", "true");
    }

    success.value = "Signed in successfully. Taking you to products...";
    router.push(route.query.redirect || "/products");
  } catch (err) {
    console.error(err);
    error.value = err.response?.data?.message || "Invalid email or password. Please try again.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-page {
  background:
    radial-gradient(circle at top left, rgba(255, 153, 0, 0.14), transparent 34%),
    linear-gradient(135deg, #f8fafc 0%, #eef2f7 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.min-vh-100 {
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.logo-circle {
  width: 72px;
  height: 72px;
  margin: 0 auto;
  background: #ff9900;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
  color: white;
  box-shadow: 0 12px 30px rgba(255, 153, 0, 0.28);
}

.card {
  border-radius: 8px !important;
  overflow: hidden;
  border: 1px solid #e5e7eb !important;
}

.input-group-text {
  background: #f8f9fa !important;
  border: 1px solid #dee2e6;
}

.form-control {
  background: white !important;
}

.form-control:focus {
  border-color: #ff9900;
  box-shadow: 0 0 0 0.2rem rgba(255, 153, 0, 0.25);
}

.btn-primary {
  background: linear-gradient(135deg, #ff9900 0%, #ff7700 100%);
  border: none;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #ff7700 0%, #ff5500 100%);
}

.btn-outline-secondary:focus,
.btn-outline-secondary:hover {
  background: white;
  border-color: #dee2e6;
}

.auth-divider {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 0.75rem;
  align-items: center;
}

.auth-divider hr {
  margin: 0;
}

.form-check-input:checked {
  background: #ff9900;
  border-color: #ff9900;
}

.text-primary {
  color: #ff9900 !important;
}

@media (max-width: 768px) {
  .login-page {
    padding: 1rem;
  }

  .card {
    border-radius: 0.75rem !important;
  }

  .card-body {
    padding: 2rem 1.5rem !important;
  }
}
</style>
