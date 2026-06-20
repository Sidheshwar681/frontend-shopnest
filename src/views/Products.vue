<template>
  <div class="container mt-4">
    <h2 class="mb-4">Products</h2>
    <div class="row mb-3">
      <div class="col-md-4">
        <input
          v-model="search"
          class="form-control"
          placeholder="Search products..."
          @input="onSearch"
        />
      </div>
    </div>
    <div class="row">
      <div v-for="product in products" :key="product.id" class="col-md-4 mb-4">
        <div class="card h-100 shadow-sm">
          <img
            :src="product.image_url"
            class="card-img-top"
            style="height: 250px; object-fit: cover"
          />

          <div class="card-body">
            <h5>{{ product.name }}</h5>

            <p>₹{{ product.price }}</p>

            <button class="btn btn-primary" @click="addToCart(product.id)">
              Add To Cart
            </button>
            <router-link
              :to="`/products/${product.id}`"
              class="btn btn-outline-primary"
            >
              View Details
            </router-link>
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-center mt-4">
        <button
          class="btn btn-secondary me-2"
          :disabled="page === 1"
          @click="prevPage"
        >
          Previous
        </button>

        <span class="align-self-center">
          Page {{ page }} of {{ totalPages }}
        </span>

        <button
          class="btn btn-secondary ms-2"
          :disabled="page === totalPages"
          @click="nextPage"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";
import { useCartStore } from "../stores/cartStore";

const cartStore = useCartStore();
const products = ref([]);
const search = ref("");
const page = ref(1);
const totalPages = ref(1);

const loadProducts = async () => {
  try {
    const response = await api.get("/products", {
      params: {
        search: search.value,
        page: page.value,
        limit: 6,
      },
    });

    products.value = response.data.products || response.data;
    totalPages.value = response.data.pages;
  } catch (error) {
    console.error(error);
  }
};

const onSearch = () => {
  page.value = 1;
  loadProducts();
};
const addToCart = async (id) => {
  try {
    await cartStore.addToCart(id);

    alert("Added to cart");
  } catch (error) {
    console.error(error);
  }
};

//pagination functions
const nextPage = () => {
  if (page.value < totalPages.value) {
    page.value++;
    loadProducts();
  }
};

const prevPage = () => {
  if (page.value > 1) {
    page.value--;
    loadProducts();
  }
};

onMounted(loadProducts);
</script>
