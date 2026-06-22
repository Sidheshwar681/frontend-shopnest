// src/router/index.js

import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/authStore";

import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Products from "../views/Products.vue";
import Cart from "../views/Cart.vue";
import Orders from "../views/Orders.vue";
import ProductDetails from "../views/ProductDetails.vue";
import AdminProducts from "../views/AdminProducts.vue";
import AdminDashboard from "../views/AdminDashboard.vue";
import AdminOrders from "../views/AdminOrders.vue";
import AdminCategories from "../views/AdminCategories.vue";

const routes = [
  {
    path: "/",
    component: Home,
    name: "Home",
  },
  {
    path: "/login",
    component: Login,
    name: "Login",
    meta: { requiresGuest: true },
  },
  {
    path: "/register",
    component: Register,
    name: "Register",
    meta: { requiresGuest: true },
  },
  {
    path: "/products",
    component: Products,
    name: "Products",
  },
  {
    path: "/products/:id",
    component: ProductDetails,
    name: "ProductDetails",
  },
  {
    path: "/cart",
    component: Cart,
    name: "Cart",
    meta: { requiresAuth: true },
  },
  {
    path: "/orders",
    component: Orders,
    name: "Orders",
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/dashboard",
    component: AdminDashboard,
    name: "AdminDashboard",
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/products",
    component: AdminProducts,
    name: "AdminProducts",
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/orders",
    component: AdminOrders,
    name: "AdminOrders",
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/categories",
    component: AdminCategories,
    name: "AdminCategories",
    meta: { requiresAdmin: true },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
    name: "NotFound",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Check if route requires guest (not logged in)
  if (to.meta.requiresGuest && authStore.isLoggedIn) {
    next("/");
    return;
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next("/login");
    return;
  }

  // Check if route requires admin role
  if (to.meta.requiresAdmin) {
    if (!authStore.isLoggedIn) {
      next("/login");
      return;
    }
    if (!authStore.isAdmin) {
      next("/");
      return;
    }
  }

  next();
});

export default router;