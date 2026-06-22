<template>
  <div class="register-page">
    <div class="container">
      <div class="row justify-content-center align-items-center min-vh-100">
        <div class="col-md-5 col-lg-4">
          <!-- Logo/Header -->
          <div class="text-center mb-4">
            <div class="logo-circle mb-3">
              <i class="bi bi-shop"></i>
            </div>
            <h1 class="h3 fw-bold">ShopNest</h1>
            <p class="text-muted">Create your account</p>
          </div>

          <!-- Register Form Card -->
          <div class="card border-0 shadow-lg">
            <div class="card-body p-4">
              <form @submit.prevent="register">
                <!-- Name Input -->
                <div class="mb-3">
                  <label class="form-label fw-bold">Full Name</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-0">
                      <i class="bi bi-person text-muted"></i>
                    </span>
                    <input
                      v-model="form.name"
                      type="text"
                      class="form-control border-start-0"
                      placeholder="John Doe"
                      autocomplete="name"
                      required
                    />
                  </div>
                </div>

                <!-- Email Input -->
                <div class="mb-3">
                  <label class="form-label fw-bold">Email Address</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-0">
                      <i class="bi bi-envelope text-muted"></i>
                    </span>
                    <input
                      v-model="form.email"
                      type="email"
                      class="form-control border-start-0"
                      placeholder="you@example.com"
                      autocomplete="email"
                      required
                    />
                  </div>
                </div>

                <!-- Phone Input -->
                <div class="mb-3">
                  <label class="form-label fw-bold">Phone Number</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-0">
                      <i class="bi bi-telephone text-muted"></i>
                    </span>
                    <input
                      v-model="form.phone"
                      type="tel"
                      class="form-control border-start-0"
                      placeholder="+91 98765 43210"
                      autocomplete="tel"
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
                      v-model="form.password"
                      :type="showPassword ? 'text' : 'password'"
                      class="form-control border-start-0"
                      placeholder="Min. 6 characters"
                      autocomplete="new-password"
                      required
                      minlength="6"
                    />
                    <button
                      type="button"
                      class="btn btn-outline-secondary"
                      @click="showPassword = !showPassword"
                    >
                      <i :class="['bi', showPassword ? 'bi-eye-slash' : 'bi-eye']"></i>
                    </button>
                  </div>
                  <small class="text-muted">At least 6 characters for security</small>
                </div>

                <!-- Confirm Password Input -->
                <div class="mb-3">
                  <label class="form-label fw-bold">Confirm Password</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-0">
                      <i class="bi bi-shield-lock text-muted"></i>
                    </span>
                    <input
                      v-model="form.confirmPassword"
                      :type="showPassword ? 'text' : 'password'"
                      class="form-control border-start-0"
                      placeholder="Re-enter password"
                      autocomplete="new-password"
                      required
                      minlength="6"
                    />
                  </div>
                </div>

                <!-- Terms & Conditions -->
                <div class="mb-3 form-check">
                  <input v-model="agreeTerms" type="checkbox" class="form-check-input" id="agreeTerms" required />
                  <label class="form-check-label" for="agreeTerms">
                    I agree to the
                    <a href="#" class="text-decoration-none">Terms of Service</a>
                    and
                    <a href="#" class="text-decoration-none">Privacy Policy</a>
                  </label>
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

                <!-- Register Button -->
                <button type="submit" class="btn btn-primary w-100 btn-lg fw-bold" :disabled="isLoading">
                  <span v-if="!isLoading">
                    <i class="bi bi-person-plus me-2"></i>Create Account
                  </span>
                  <span v-else>
                    <span class="spinner-border spinner-border-sm me-2"></span>Creating account...
                  </span>
                </button>
              </form>

              <!-- Divider -->
              <div class="auth-divider my-4">
                <hr />
                <span class="text-muted small">or</span>
                <hr />
              </div>

              <!-- Social Signup (Placeholder) -->
              <div class="d-grid gap-2 mb-4">
                <button type="button" class="btn btn-outline-secondary" disabled>
                  <i class="bi bi-google me-2"></i>Sign up with Google
                </button>
              </div>

              <!-- Sign In Link -->
              <p class="text-center text-muted mb-0">
                Already have an account?
                <router-link to="/login" class="fw-bold text-primary">Sign in</router-link>
              </p>
            </div>
          </div>

          <!-- Footer Info -->
          <p class="text-center text-muted small mt-4">
            We'll never share your information without your permission
          </p>
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

const form = reactive({
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
});

const showPassword = ref(false);
const agreeTerms = ref(false);
const error = ref("");
const success = ref("");
const isLoading = ref(false);

const register = async () => {
  try {
    error.value = "";
    success.value = "";

    if (!agreeTerms.value) {
      error.value = "Please agree to the terms and conditions";
      return;
    }

    if (form.password !== form.confirmPassword) {
      error.value = "Passwords do not match";
      return;
    }

    isLoading.value = true;

    await api.post("/auth/register", {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      password: form.password,
    });

    success.value = "Account created successfully. Please sign in.";
    router.push({
      path: "/login",
      query: { registered: "1", email: form.email.trim() },
    });
  } catch (err) {
    console.error(err);
    error.value =
      err.response?.data?.message ||
      "Registration failed. Please try again.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.register-page {
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
  .register-page {
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
