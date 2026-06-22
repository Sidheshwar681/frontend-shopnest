<template>
  <div>
    <!-- Hero Section -->
    <section class="hero-section mb-5">
      <div class="hero-content">
        <div class="container">
          <div class="row align-items-center min-vh-50">
            <div class="col-lg-6 col-md-12 mb-4 mb-lg-0">
              <h1 class="hero-title mb-3">
                Welcome to <span style="color: #ff9900">ShopNest</span>
              </h1>
              <p class="hero-subtitle mb-4">
                Discover millions of products at unbeatable prices. Shop from the comfort of your home.
              </p>
              <div class="d-flex gap-3 flex-wrap">
                <router-link to="/products" class="btn btn-primary btn-lg">
                  <i class="bi bi-shop me-2"></i>Start Shopping
                </router-link>
                <button class="btn btn-outline-primary btn-lg" @click="scrollToFeatured">
                  <i class="bi bi-arrow-down me-2"></i>View Deals
                </button>
              </div>
            </div>
            <div class="col-lg-6 col-md-12">
              <img
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&h=500&fit=crop"
                alt="Shopping"
                class="img-fluid rounded-3"
                style="max-width: 100%; height: auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section mb-5">
      <div class="container">
        <div class="row g-4">
          <div class="col-md-3 col-sm-6">
            <div class="feature-card text-center">
              <div class="feature-icon">
                <i class="bi bi-truck"></i>
              </div>
              <h5>Fast Delivery</h5>
              <p>Free shipping on orders over Rs. 500</p>
            </div>
          </div>
          <div class="col-md-3 col-sm-6">
            <div class="feature-card text-center">
              <div class="feature-icon">
                <i class="bi bi-shield-check"></i>
              </div>
              <h5>100% Safe</h5>
              <p>Your transactions are secure</p>
            </div>
          </div>
          <div class="col-md-3 col-sm-6">
            <div class="feature-card text-center">
              <div class="feature-icon">
                <i class="bi bi-arrow-counterclockwise"></i>
              </div>
              <h5>Easy Returns</h5>
              <p>30-day return guarantee</p>
            </div>
          </div>
          <div class="col-md-3 col-sm-6">
            <div class="feature-card text-center">
              <div class="feature-icon">
                <i class="bi bi-headset"></i>
              </div>
              <h5>24/7 Support</h5>
              <p>Dedicated customer support</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="featured-section" ref="featuredRef">
      <div class="container">
        <div class="mb-4">
          <h2 class="section-title">Featured Products</h2>
          <p class="text-muted">Check out our handpicked selection</p>
        </div>

        <LoadingSpinner v-if="loading" message="Loading featured products..." />

        <EmptyState
          v-else-if="products.length === 0"
          icon="bi-inbox"
          title="No Products Available"
          message="Check back soon for our latest products"
          action-text="View All Products"
          action-route="/products"
        />

        <div v-else class="row g-4">
          <div v-for="product in products" :key="product.id" class="col-lg-3 col-md-6 col-sm-12">
            <ProductCard :product="product" @add-to-cart="handleAddToCart" @add-to-wishlist="handleAddToWishlist" />
          </div>
        </div>

        <div class="text-center mt-5">
          <router-link to="/products" class="btn btn-outline-primary btn-lg">
            View All Products
          </router-link>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section my-5 py-5">
      <div class="container">
        <div class="text-center text-white">
          <h2 class="mb-3">Ready to Shop?</h2>
          <p class="mb-4 fs-5">Join thousands of happy customers shopping on ShopNest</p>
          <router-link v-if="!authStore.isLoggedIn" to="/register" class="btn btn-light btn-lg">
            Create Account
          </router-link>
          <router-link v-else to="/products" class="btn btn-light btn-lg">
            Continue Shopping
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";
import { useCartStore } from "../stores/cartStore";
import { useAuthStore } from "../stores/authStore";
import ProductCard from "../components/ProductCard.vue";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import EmptyState from "../components/EmptyState.vue";
import { notify } from "../utils/notify";

const cartStore = useCartStore();
const authStore = useAuthStore();
const products = ref([]);
const loading = ref(true);
const featuredRef = ref(null);

onMounted(async () => {
  try {
    const response = await api.get("/products", {
      params: {
        limit: 8,
        page: 1,
      },
    });
    products.value = response.data.products || response.data;
  } catch (error) {
    console.error("Error loading products:", error);
  } finally {
    loading.value = false;
  }
});

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

const handleAddToWishlist = (productId) => {
  notify({
    type: "info",
    title: "Wishlist",
    message: "Wishlist feature is coming soon.",
  });
};

const scrollToFeatured = () => {
  if (featuredRef.value) {
    featuredRef.value.scrollIntoView({ behavior: "smooth" });
  }
};
</script>

<style scoped>
/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
  padding: 2rem 0;
  border-radius: 1rem;
  overflow: hidden;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.2;
  color: #333;
}

.hero-subtitle {
  font-size: 1.3rem;
  color: #666;
  line-height: 1.6;
}

.min-vh-50 {
  min-height: 50vh;
  display: flex;
  align-items: center;
}

/* Features Section */
.features-section {
  padding: 2rem 0;
}

.feature-card {
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.feature-icon {
  font-size: 2.5rem;
  color: #ff9900;
  margin-bottom: 1rem;
}

.feature-card h5 {
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: #666;
  font-size: 0.95rem;
}

/* Featured Section */
.featured-section {
  padding: 3rem 0;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  position: relative;
  padding-bottom: 1rem;
}

.section-title::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 4px;
  background: #ff9900;
  border-radius: 2px;
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, #ff9900 0%, #ff7700 100%);
  border-radius: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .feature-card {
    padding: 1.5rem;
  }

  .d-flex {
    gap: 0.5rem !important;
  }

  .btn {
    font-size: 0.9rem;
    padding: 0.5rem 1rem !important;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.5rem;
  }

  .hero-subtitle {
    font-size: 0.9rem;
  }

  .section-title {
    font-size: 1.5rem;
  }
}
</style>
