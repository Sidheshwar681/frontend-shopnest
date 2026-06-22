<template>
  <div v-if="loading" class="py-5">
    <LoadingSpinner message="Loading product details..." />
  </div>

  <div v-else-if="!product" class="py-5">
    <EmptyState
      icon="bi-inbox"
      title="Product Not Found"
      message="The product you're looking for doesn't exist"
      action-text="Back to Products"
      action-route="/products"
    />
  </div>

  <div v-else class="product-details-page">
    <!-- Product Section -->
    <div class="row g-4 mb-5">
      <!-- Image Gallery -->
      <div class="col-lg-5 col-md-6">
        <div class="product-image-container">
          <img
            :src="product.image_url"
            :alt="product.name"
            class="img-fluid rounded-3"
            style="width: 100%; height: auto; max-height: 500px; object-fit: cover"
          />
          <div class="mt-3 d-flex gap-2">
            <small class="badge bg-warning text-dark">
              {{ product.category_name || "General" }}
            </small>
            <small v-if="product.stock > 0" class="badge bg-success">
              <i class="bi bi-check-circle me-1"></i>In Stock
            </small>
            <small v-else class="badge bg-danger">
              <i class="bi bi-x-circle me-1"></i>Out of Stock
            </small>
          </div>
        </div>
      </div>

      <!-- Product Info -->
      <div class="col-lg-7 col-md-6">
        <div class="product-info">
          <h1 class="product-name mb-2">{{ product.name }}</h1>
          <p class="text-muted mb-3">SKU: {{ product.id }}</p>

          <!-- Rating -->
          <div class="mb-3">
            <span class="text-warning">
              <i class="bi bi-star-fill"></i>
              <i class="bi bi-star-fill"></i>
              <i class="bi bi-star-fill"></i>
              <i class="bi bi-star-half"></i>
              <i class="bi bi-star"></i>
            </span>
            <span class="ms-2 text-muted small">(124 reviews)</span>
          </div>

          <!-- Price Section -->
          <div class="price-section mb-4 p-3 bg-light rounded">
            <div class="row align-items-center">
              <div class="col">
                <h2 class="text-primary mb-0">Rs. {{ product.price }}</h2>
              </div>
              <div class="col-auto">
                <span class="badge bg-danger">10% OFF</span>
              </div>
            </div>
            <p class="text-muted small mt-2 mb-0">
              <s>Rs. {{ Math.round(product.price * 1.1) }}</s>
              <span class="text-success ms-2">You save Rs. {{ Math.round(product.price * 0.1) }}</span>
            </p>
          </div>

          <!-- Description -->
          <div class="mb-4">
            <h5>Description</h5>
            <p class="text-muted">
              {{ product.description || "No description available" }}
            </p>
          </div>

          <!-- Quantity & Actions -->
          <div class="mb-4">
            <label class="form-label fw-bold">Quantity</label>
            <div class="d-flex align-items-center gap-3">
              <div class="input-group" style="max-width: 150px">
                <button
                  class="btn btn-outline-secondary"
                  @click="quantity > 1 ? quantity-- : null"
                  :disabled="quantity <= 1"
                >
                  <i class="bi bi-dash"></i>
                </button>
                <input
                  type="number"
                  class="form-control text-center"
                  v-model.number="quantity"
                  min="1"
                  :max="product.stock"
                />
                <button
                  class="btn btn-outline-secondary"
                  @click="quantity < product.stock ? quantity++ : null"
                  :disabled="quantity >= product.stock"
                >
                  <i class="bi bi-plus"></i>
                </button>
              </div>
              <small class="text-muted">{{ product.stock }} available</small>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="d-flex gap-3 flex-wrap mb-4">
            <button
              class="btn btn-primary btn-lg flex-grow-1"
              @click="addToCart"
              :disabled="product.stock <= 0"
            >
              <i class="bi bi-cart-plus me-2"></i>
              {{ product.stock > 0 ? "Add to Cart" : "Out of Stock" }}
            </button>
            <button class="btn btn-outline-secondary btn-lg">
              <i class="bi bi-heart me-2"></i>Wishlist
            </button>
          </div>

          <!-- Additional Info -->
          <div class="border-top pt-4">
            <div class="row g-3">
              <div class="col-md-6">
                <div class="d-flex gap-2 mb-3">
                  <i class="bi bi-truck text-primary fs-5"></i>
                  <div>
                    <h6 class="mb-1">Free Delivery</h6>
                    <small class="text-muted">On orders above Rs. 500</small>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="d-flex gap-2 mb-3">
                  <i class="bi bi-arrow-counterclockwise text-primary fs-5"></i>
                  <div>
                    <h6 class="mb-1">Easy Returns</h6>
                    <small class="text-muted">30-day return policy</small>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="d-flex gap-2">
                  <i class="bi bi-shield-check text-primary fs-5"></i>
                  <div>
                    <h6 class="mb-1">Secure Purchase</h6>
                    <small class="text-muted">100% safe transactions</small>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="d-flex gap-2">
                  <i class="bi bi-headset text-primary fs-5"></i>
                  <div>
                    <h6 class="mb-1">24/7 Support</h6>
                    <small class="text-muted">Dedicated customer care</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Related Products Section -->
    <div class="related-section">
      <h3 class="mb-4">Related Products</h3>
      <div class="row g-4">
        <div v-for="relProduct in relatedProducts" :key="relProduct.id" class="col-lg-3 col-md-6 col-sm-12">
          <ProductCard :product="relProduct" @add-to-cart="handleAddToCart" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import api from "../services/api";
import { useCartStore } from "../stores/cartStore";
import { useAuthStore } from "../stores/authStore";
import ProductCard from "../components/ProductCard.vue";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import EmptyState from "../components/EmptyState.vue";
import { notify } from "../utils/notify";

const route = useRoute();
const cartStore = useCartStore();
const authStore = useAuthStore();

const product = ref(null);
const relatedProducts = ref([]);
const quantity = ref(1);
const loading = ref(true);

onMounted(async () => {
  try {
    const response = await api.get(`/products/${route.params.id}`);
    product.value = response.data;

    // Load related products (same category)
    if (product.value.category_id) {
      const relatedResponse = await api.get("/products", {
        params: {
          category: product.value.category_name,
          limit: 4,
        },
      });
      relatedProducts.value = (relatedResponse.data.products || relatedResponse.data).filter(
        (p) => p.id !== product.value.id
      );
    }
  } catch (error) {
    console.error("Error loading product:", error);
  } finally {
    loading.value = false;
  }
});

const addToCart = async () => {
  try {
    if (!authStore.isLoggedIn) {
      notify({
        type: "warning",
        title: "Login required",
        message: "Please login to add items to cart.",
      });
      return;
    }

    // Note: The backend API currently adds with quantity: 1
    // We would need to update this if the backend supports custom quantity
    for (let i = 0; i < quantity.value; i++) {
      await cartStore.addToCart(product.value.id);
    }

    notify({
      type: "success",
      title: "Added to cart",
      message: `Added ${quantity.value} item(s) to your cart.`,
    });
    quantity.value = 1;
  } catch (error) {
    console.error(error);
    notify({
      type: "danger",
      title: "Cart update failed",
      message: "Failed to add this product to cart.",
    });
  }
};

const handleAddToCart = async (productId) => {
  try {
    if (!authStore.isLoggedIn) {
      notify({
        type: "warning",
        title: "Login required",
        message: "Please login to add items to cart.",
      });
      return;
    }
    await cartStore.addToCart(productId);
    notify({
      type: "success",
      title: "Added to cart",
      message: "Product added to your cart successfully.",
    });
  } catch (error) {
    console.error(error);
    notify({
      type: "danger",
      title: "Cart update failed",
      message: "Failed to add this product to cart.",
    });
  }
};
</script>

<style scoped>
.product-details-page {
  padding: 2rem 0;
}

.product-name {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  line-height: 1.3;
}

.product-image-container {
  position: sticky;
  top: 100px;
}

.price-section {
  border: 2px solid #ff9900;
  background: linear-gradient(135deg, #fff9f0 0%, #ffe6cc 100%) !important;
}

.input-group input {
  text-align: center;
  font-weight: 600;
}

.related-section {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 2px solid #dee2e6;
}

@media (max-width: 768px) {
  .product-name {
    font-size: 1.5rem;
  }

  .product-image-container {
    position: static;
  }

  .d-flex {
    gap: 1rem !important;
  }

  .btn-lg {
    padding: 0.65rem 1.5rem !important;
    font-size: 0.95rem !important;
  }
}
</style>
