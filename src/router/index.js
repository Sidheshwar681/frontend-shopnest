// src/router/index.js

import { createRouter, createWebHistory } from "vue-router";

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
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
  {
  path: "/products",
  component: Products
},
{
  path: "/cart",
  component: Cart
},
{
  path: "/orders",
  component: Orders
},
{
  path: "/products/:id",
  component: ProductDetails
},
{
  path: "/admin/products",
  component: AdminProducts
},
{
  path: "/admin/dashboard",
  component: AdminDashboard
},
{
  path: "/admin/orders",
  component: AdminOrders
},
{
  path: "/admin/categories",
  component: AdminCategories
}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;