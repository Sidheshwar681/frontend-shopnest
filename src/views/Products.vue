<template>
  <div class="products-page">
    <!-- Page Header -->
    <div class="page-header mb-4">
      <div>
        <h1 class="page-title">Our Products</h1>
        <p class="text-muted mb-0">Browse, search, and filter the latest items</p>
      </div>
      <span v-if="!loading" class="result-pill">
        {{ products.length }} shown
      </span>
    </div>

    <!-- Search & Filters -->
    <SearchBar
      v-model="searchQuery"
      placeholder="Search products by name..."
      :show-filters="true"
      :filters="categories"
      :filter-value="selectedCategory"
      @search="onSearch"
      @input-search="onTypingSearch"
      @filter-change="onCategoryFilter"
      @clear="clearFilters"
    />

    <div class="search-scope mb-3">
      <i class="bi bi-funnel me-1"></i>
      Searching in: <strong>{{ searchScopeLabel }}</strong>
    </div>

    <div v-if="error" class="alert alert-danger d-flex align-items-center" role="alert">
      <i class="bi bi-exclamation-circle me-2"></i>
      <span>{{ error }}</span>
    </div>

    <!-- Loading State -->
    <LoadingSpinner v-if="loading" message="Loading products..." />

    <!-- Empty State -->
    <EmptyState
      v-else-if="products.length === 0"
      icon="bi-search"
      title="No Products Found"
      :message="`No products match your search: '${searchQuery}'`"
      action-text="View All Products"
      action-route=""
      @action="clearFilters"
    />

    <!-- Products Grid -->
    <div v-else>
      <div class="row g-4 mb-4">
        <div v-for="product in products" :key="product.id" class="col-lg-3 col-md-6 col-sm-12">
          <ProductCard :product="product" @add-to-cart="handleAddToCart" @add-to-wishlist="handleAddToWishlist" />
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination-wrapper">
        <nav v-if="totalPages > 1" aria-label="Page navigation" class="d-flex justify-content-center">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: page === 1 }">
              <button class="page-link" @click="prevPage" :disabled="page === 1">
                <i class="bi bi-chevron-left"></i>
                <span class="d-none d-sm-inline ms-1">Previous</span>
              </button>
            </li>

            <!-- Page numbers -->
            <li
              v-for="pageNum in visiblePages"
              :key="pageNum.key"
              class="page-item"
              :class="{ active: page === pageNum.value, disabled: pageNum.ellipsis }"
            >
              <span v-if="pageNum.ellipsis" class="page-link">...</span>
              <button v-else class="page-link" @click="goToPage(pageNum.value)">
                {{ pageNum.value }}
              </button>
            </li>

            <li class="page-item" :class="{ disabled: page === totalPages }">
              <button class="page-link" @click="nextPage" :disabled="page === totalPages">
                <span class="d-none d-sm-inline me-1">Next</span>
                <i class="bi bi-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>
        <div class="text-center mt-3 text-muted">
          Page {{ page }} of {{ totalPages }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../services/api";
import { useCartStore } from "../stores/cartStore";
import { useAuthStore } from "../stores/authStore";
import ProductCard from "../components/ProductCard.vue";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import EmptyState from "../components/EmptyState.vue";
import SearchBar from "../components/SearchBar.vue";
import { notify } from "../utils/notify";

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();

const products = ref([]);
const searchQuery = ref(route.query.search || "");
const selectedCategory = ref(route.query.category || "");
const page = ref(parseInt(route.query.page) || 1);
const totalPages = ref(1);
const loading = ref(true);
const categories = ref([]);
const error = ref("");
const searchTimer = ref(null);

const searchScopeLabel = computed(() => selectedCategory.value || "All Categories");

const visiblePages = computed(() => {
  const pages = new Set([1, totalPages.value]);
  const start = Math.max(1, page.value - 1);
  const end = Math.min(totalPages.value, page.value + 1);

  for (let i = start; i <= end; i++) {
    pages.add(i);
  }

  return [...pages]
    .sort((a, b) => a - b)
    .reduce((items, value, index, sorted) => {
      if (index > 0 && value - sorted[index - 1] > 1) {
        items.push({ key: `ellipsis-${value}`, ellipsis: true });
      }
      items.push({ key: `page-${value}`, value, ellipsis: false });
      return items;
    }, []);
});

const loadProducts = async () => {
  try {
    loading.value = true;
    error.value = "";
    const response = await api.get("/products", {
      params: {
        search: searchQuery.value || undefined,
        category: selectedCategory.value || undefined,
        page: page.value,
        limit: 12,
      },
    });

    products.value = response.data.products || response.data;
    totalPages.value = response.data.pages || response.data.totalPages || 1;
  } catch (error) {
    console.error("Error loading products:", error);
    products.value = [];
    totalPages.value = 1;
    error.value = "Unable to load products right now. Please try again.";
  } finally {
    loading.value = false;
  }
};

const loadCategories = async () => {
  try {
    const response = await api.get("/categories");
    categories.value = response.data.map((cat) => cat.name);
  } catch (error) {
    console.error("Error loading categories:", error);
  }
};

const updateQuery = (nextValues = {}) => {
  const nextQuery = {
    search: searchQuery.value || undefined,
    category: selectedCategory.value || undefined,
    page: page.value > 1 ? page.value : undefined,
    ...nextValues,
  };

  Object.keys(nextQuery).forEach((key) => {
    if (!nextQuery[key]) {
      delete nextQuery[key];
    }
  });

  router.push({ path: "/products", query: nextQuery });
};

const onSearch = (term) => {
  searchQuery.value = term;
  page.value = 1;
  updateQuery({ search: term || undefined, page: undefined });
};

const onTypingSearch = (term) => {
  clearTimeout(searchTimer.value);
  searchTimer.value = setTimeout(() => {
    searchQuery.value = term;
    page.value = 1;
    updateQuery({ search: term || undefined, page: undefined });
  }, 350);
};

const onCategoryFilter = (category) => {
  selectedCategory.value = category;
  page.value = 1;
  updateQuery({ category: category || undefined, page: undefined });
};

const clearFilters = () => {
  searchQuery.value = "";
  selectedCategory.value = "";
  page.value = 1;
  router.push({ path: "/products" });
};

const nextPage = () => {
  if (page.value < totalPages.value) {
    page.value++;
    updateQuery();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const prevPage = () => {
  if (page.value > 1) {
    page.value--;
    updateQuery();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const goToPage = (pageNum) => {
  page.value = pageNum;
  updateQuery();
  window.scrollTo({ top: 0, behavior: "smooth" });
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

const handleAddToWishlist = (productId) => {
  notify({
    type: "info",
    title: "Wishlist",
    message: "Wishlist feature is coming soon.",
  });
};

watch(
  () => route.query,
  () => {
    searchQuery.value = route.query.search || "";
    selectedCategory.value = route.query.category || "";
    page.value = Math.max(1, parseInt(route.query.page) || 1);
    loadProducts();
  },
  { immediate: true }
);

onMounted(() => {
  loadCategories();
});

onBeforeUnmount(() => {
  clearTimeout(searchTimer.value);
});
</script>

<style scoped>
.products-page {
  min-height: calc(100vh - 300px);
}

.page-header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.5rem 0;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
}

.result-pill {
  flex: 0 0 auto;
  padding: 0.45rem 0.75rem;
  border-radius: 999px;
  background: #ecfdf5;
  color: #047857;
  font-weight: 700;
  font-size: 0.85rem;
}

.search-scope {
  display: inline-flex;
  align-items: center;
  padding: 0.45rem 0.7rem;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  background: #fff;
  color: #4b5563;
  font-size: 0.9rem;
}

.pagination-wrapper {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #dee2e6;
}

.pagination {
  gap: 0.35rem;
  padding: 0.35rem;
  background: #fff;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
  border-radius: 10px;
  border: 1px solid #dee2e6;
}

.page-link {
  color: #333;
  border: none;
  border-radius: 8px;
  transition: all 0.2s;
  font-weight: 500;
}

.page-link:hover:not(:disabled) {
  background: #ff9900;
  color: white;
}

.page-item.active .page-link {
  background: #ff9900;
  border-color: #ff9900;
  color: white;
}

.page-link:disabled {
  color: #ccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .page-title {
    font-size: 1.8rem;
  }

  .pagination {
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .page-link {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
}
</style>
