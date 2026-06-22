<template>
  <div class="product-card-wrapper">
    <div class="card h-100 product-card shadow-sm border-0">
      <!-- Product Image -->
      <div class="product-image-container position-relative overflow-hidden">
        <img
          :src="product.image_url || fallbackImage"
          :alt="product.name"
          class="card-img-top product-image"
          style="height: 250px; object-fit: cover"
          @error="onImageError"
        />
        <div class="overlay">
          <button
            class="btn btn-primary btn-sm"
            @click="$emit('add-to-cart', product.id)"
            :disabled="availableStock <= 0"
          >
            <i class="bi bi-cart-plus me-1"></i>{{ availableStock > 0 ? "Add to Cart" : "Out of Stock" }}
          </button>
        </div>
        <!-- Category Badge -->
        <span class="badge bg-warning position-absolute top-0 start-0 m-2">
          {{ product.category_name || "General" }}
        </span>
      </div>

      <!-- Product Info -->
      <div class="card-body d-flex flex-column">
        <h6 class="card-title text-truncate" :title="product.name">
          {{ product.name }}
        </h6>

        <!-- Description (truncated) -->
        <p class="card-text text-muted small text-truncate mb-2">
          {{ product.description || "No description available" }}
        </p>

        <!-- Price & Stock -->
        <div class="mb-2">
          <div class="d-flex align-items-baseline gap-2">
            <span class="h5 text-primary fw-bold mb-0">
              Rs. {{ product.price }}
            </span>
            <span v-if="product.original_price" class="text-muted text-decoration-line-through small">
              Rs. {{ product.original_price }}
            </span>
          </div>
          <small v-if="product.discount" class="text-success fw-bold">
            {{ product.discount }}% OFF
          </small>
        </div>

        <!-- Stock Status -->
        <div class="mb-3">
          <small v-if="availableStock > 0" class="text-success">
            <i class="bi bi-check-circle me-1"></i>{{ availableStock }} in stock
          </small>
          <small v-else class="text-danger">
            <i class="bi bi-x-circle me-1"></i>Out of stock
          </small>
        </div>

        <!-- Rating (if available) -->
        <div v-if="product.rating" class="mb-2">
          <small class="text-warning">
            <i class="bi bi-star-fill"></i>
            {{ product.rating }} ({{ product.reviews || 0 }} reviews)
          </small>
        </div>

        <!-- Actions -->
        <div class="mt-auto d-flex gap-2">
          <router-link
            :to="`/products/${product.id}`"
            class="btn btn-outline-primary btn-sm flex-grow-1"
          >
            View Details
          </router-link>
          <button
            class="btn btn-outline-secondary btn-sm"
            @click="$emit('add-to-wishlist', product.id)"
            title="Add to Wishlist"
          >
            <i class="bi bi-heart"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  product: {
    type: Object,
    required: true,
    validator: (obj) => obj.id && obj.name && obj.price,
  },
});

defineEmits(["add-to-cart", "add-to-wishlist"]);

const availableStock = computed(() => {
  return Number(props.product.stock ?? props.product.stock_quantity ?? 0);
});

const fallbackImage =
  "https://images.unsplash.com/photo-1557821552-17105176677c?w=600&h=500&fit=crop";

const onImageError = (event) => {
  event.target.src = fallbackImage;
};
</script>

<style scoped>
.product-card-wrapper {
  height: 100%;
}

.product-card {
  transition: all 0.3s ease;
  overflow: hidden;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
}

.product-image-container {
  position: relative;
  background: #f8f9fa;
}

.product-image {
  transition: transform 0.3s ease;
  object-fit: cover;
}

.product-card:hover .product-image {
  transform: scale(1.08);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .overlay {
  opacity: 1;
}

.card-title {
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.3;
  color: #333;
}

.card-text {
  font-size: 0.85rem;
}

.badge {
  font-size: 0.75rem;
  padding: 0.35rem 0.6rem;
  color: #333 !important;
  font-weight: 600;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .product-image {
    height: 200px !important;
  }

  .card-title {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .product-image {
    height: 180px !important;
  }
}
</style>
