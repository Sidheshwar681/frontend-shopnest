<template>
  <div
    v-if="product"
    class="container mt-4"
  >
    <div class="card shadow">
      <div class="card-body">

        <h2>{{ product.name }}</h2>

        <h4 class="text-success">
          ₹{{ product.price }}
        </h4>

        <p>
          {{ product.description }}
        </p>

        <p>
          <strong>Stock:</strong>
          {{ product.stock }}
        </p>

        <p>
          <strong>Category:</strong>
          {{ product.category_id }}
        </p>

        <button
          class="btn btn-success"
          @click="addToCart"
        >
          Add To Cart
        </button>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import api from "../services/api";
import { useCartStore } from "../stores/cartStore";

const route = useRoute();
const cartStore = useCartStore();

const product = ref(null);

onMounted(async () => {
  const res = await api.get(
    `/products/${route.params.id}`
  );

  product.value = res.data;
});

const addToCart = async () => {
  await cartStore.addToCart(product.value.id);

  alert("Added To Cart");
};
</script>