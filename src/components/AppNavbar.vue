<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top app-navbar">
    <div class="container">
      <!-- Brand -->
      <router-link class="navbar-brand fw-bold fs-5 d-flex align-items-center" to="/">
        <span class="brand-mark me-2">
          <i class="bi bi-shop"></i>
        </span>
        ShopNest
      </router-link>

      <button
        class="btn btn-light border d-lg-none ms-auto me-2 icon-action"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#searchModal"
        aria-label="Search products"
      >
        <i class="bi bi-search"></i>
      </button>

      <!-- Toggler for mobile -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
        aria-controls="navbarContent"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navbar Content -->
      <div class="collapse navbar-collapse" id="navbarContent">
        <!-- Left Menu -->
        <ul class="navbar-nav me-auto align-items-lg-center">
          <li class="nav-item">
            <router-link class="nav-link" to="/products">
              <i class="bi bi-bag me-1"></i>Products
            </router-link>
          </li>
          <li v-if="authStore.isLoggedIn" class="nav-item">
            <router-link class="nav-link" to="/orders">
              <i class="bi bi-box me-1"></i>Orders
            </router-link>
          </li>
          <li v-if="authStore.isAdmin" class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="bi bi-gear me-1"></i>Admin
            </a>
            <ul class="dropdown-menu">
              <li>
                <router-link class="dropdown-item" to="/admin/dashboard">
                  Dashboard
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/admin/products">
                  Products
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/admin/categories">
                  Categories
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/admin/orders">
                  Orders
                </router-link>
              </li>
            </ul>
          </li>
        </ul>

        <!-- Right Side: Search, Cart & User -->
        <div class="nav-actions d-flex align-items-center gap-2 flex-wrap">
          <!-- Search Bar (hidden on mobile) -->
          <form class="nav-search input-group d-none d-lg-flex" @submit.prevent="performSearch">
            <input
              type="text"
              class="form-control form-control-sm"
              placeholder="Search products..."
              v-model="searchQuery"
            />
            <button class="btn btn-primary btn-sm" type="submit" aria-label="Search">
              <i class="bi bi-search"></i>
            </button>
          </form>

          <!-- Cart Icon with Badge -->
          <div v-if="authStore.isLoggedIn" class="position-relative">
            <router-link to="/cart" class="btn btn-outline-primary position-relative icon-action">
              <i class="bi bi-cart3" style="font-size: 1.2rem"></i>
              <span
                v-if="cartCount > 0"
                class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              >
                {{ cartCount }}
              </span>
            </router-link>
          </div>

          <!-- User Dropdown -->
          <div v-if="authStore.isLoggedIn" class="dropdown">
            <button
              class="btn btn-light border dropdown-toggle user-button"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="bi bi-person-circle me-1"></i>
              <span class="d-none d-sm-inline">
                {{ authStore.user?.name || "User" }}
              </span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <span class="dropdown-item-text small">
                  {{ authStore.user?.email }}
                </span>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <router-link class="dropdown-item" to="/orders">
                  <i class="bi bi-box me-2"></i>My Orders
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/cart">
                  <i class="bi bi-cart3 me-2"></i>Cart
                </router-link>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <button
                  class="dropdown-item text-danger"
                  @click="handleLogout"
                  style="border: none; background: none; cursor: pointer"
                >
                  <i class="bi bi-box-arrow-right me-2"></i>Logout
                </button>
              </li>
            </ul>
          </div>

          <!-- Login/Register Buttons (when not logged in) -->
          <div v-else class="d-flex gap-2 auth-buttons">
            <router-link to="/login" class="btn btn-outline-primary btn-sm px-3">
              Login
            </router-link>
            <router-link to="/register" class="btn btn-primary btn-sm px-3">
              Register
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <!-- Search Modal for Mobile -->
  <div
    class="modal fade"
    id="searchModal"
    tabindex="-1"
    aria-labelledby="searchModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-fullscreen-sm-down">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="searchModalLabel">Search Products</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form class="input-group mobile-search" @submit.prevent="performSearch">
            <input
              type="text"
              class="form-control"
              placeholder="Search products..."
              v-model="searchQuery"
              autofocus
            />
            <button class="btn btn-primary" type="submit">
              <i class="bi bi-search me-1"></i>Search
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";
import { useCartStore } from "../stores/cartStore";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const cartStore = useCartStore();
const searchQuery = ref(route.query.search || "");

const cartCount = computed(() => cartStore.cart?.length || 0);

const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};

const performSearch = () => {
  const query = searchQuery.value.trim();
  if (query) {
    router.push({
      path: "/products",
      query: { search: query, page: 1 },
    });
    document.querySelector("#searchModal [data-bs-dismiss='modal']")?.click();
  }
};

watch(
  () => route.query.search,
  (value) => {
    searchQuery.value = value || "";
  }
);

watch(
  () => authStore.isLoggedIn,
  async (isLoggedIn) => {
    if (isLoggedIn) {
      try {
        await cartStore.getCart();
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    }
  }
);

onMounted(async () => {
  if (authStore.isLoggedIn) {
    try {
      await cartStore.getCart();
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  }
});
</script>

<style scoped>
.app-navbar {
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
  transition: box-shadow 0.2s ease;
}

.navbar-brand {
  color: #1f2937 !important;
  font-size: 1.5rem !important;
  letter-spacing: 0;
}

.brand-mark {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #ff9900;
  color: #fff;
}

.nav-link {
  transition: color 0.2s, background 0.2s;
  color: #374151 !important;
  border-radius: 8px;
  padding: 0.55rem 0.8rem !important;
  font-weight: 500;
}

.nav-link:hover,
.router-link-active.nav-link {
  color: #ff9900 !important;
  background: #fff7ed;
}

.nav-search {
  width: 320px;
}

.nav-search .form-control,
.mobile-search .form-control {
  border-right: 0;
}

.nav-search .btn,
.mobile-search .btn,
.icon-action {
  border-radius: 8px;
}

.user-button {
  border-radius: 8px;
  max-width: 180px;
}

.dropdown-toggle::after {
  margin-left: 0.25rem;
}

@media (max-width: 768px) {
  .app-navbar .container {
    gap: 0.25rem;
  }

  .navbar-brand {
    font-size: 1.2rem !important;
  }

  .brand-mark {
    width: 30px;
    height: 30px;
  }

  .nav-link {
    padding: 0.65rem 0.75rem !important;
    margin-top: 0.5rem;
  }

  .nav-actions,
  .auth-buttons {
    width: 100%;
  }

  .auth-buttons .btn {
    flex: 1;
  }
}
</style>
