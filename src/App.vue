<template>
  <div class="app-container">
    <!-- Header -->
    <AppNavbar />

    <!-- Main Content -->
    <main class="main-content">
      <div class="container-wrapper">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" :key="$route.path" />
          </transition>
        </router-view>
      </div>
    </main>

    <!-- Footer -->
    <AppFooter />
    <AppNotifications />
  </div>
</template>

<script setup>
import AppNavbar from "./components/AppNavbar.vue";
import AppFooter from "./components/AppFooter.vue";
import AppNotifications from "./components/AppNotifications.vue";
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 2rem 0;
  background: #f5f5f5;
}

.container-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Global Typography */
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
    Arial, sans-serif;
  font-size: 0.95rem;
  line-height: 1.5;
  color: #333;
  background: #f5f5f5;
}

/* Links */
a {
  color: #ff9900;
  text-decoration: none;
  transition: color 0.2s;
}

a:hover {
  color: #ff7700;
}

/* Buttons */
.btn {
  border-radius: 0.35rem;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary {
  background: #ff9900;
  border-color: #ff9900;
}

.btn-primary:hover {
  background: #ff7700;
  border-color: #ff7700;
}

/* Cards */
.card {
  border: none;
  border-radius: 0.5rem;
  overflow: hidden;
}

.card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
}

/* Forms */
.form-control,
.form-select {
  border-radius: 0.35rem;
  border: 1px solid #dee2e6;
}

.form-control:focus,
.form-select:focus {
  border-color: #ff9900;
  box-shadow: 0 0 0 0.2rem rgba(255, 153, 0, 0.25);
}

/* Badge */
.badge {
  border-radius: 0.25rem;
  font-weight: 600;
  font-size: 0.75rem;
}

/* Responsive */
@media (max-width: 768px) {
  .main-content {
    padding: 1rem 0;
  }

  .container-wrapper {
    padding: 0 0.75rem;
  }
}

@media (max-width: 480px) {
  body {
    font-size: 0.9rem;
  }

  .container-wrapper {
    padding: 0 0.5rem;
  }
}
</style>
