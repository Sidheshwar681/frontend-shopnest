<template>
  <div class="cart-page">
    <!-- Page Header -->
    <div class="page-header mb-4">
      <h1 class="page-title">Shopping Cart</h1>
      <p class="text-muted">{{ cartItems.length }} item(s)</p>
    </div>

    <!-- Loading State -->
    <LoadingSpinner v-if="loading" message="Loading cart..." />

    <!-- Empty Cart -->
    <EmptyState
      v-else-if="cartItems.length === 0"
      icon="bi-cart-x"
      title="Your Cart is Empty"
      message="Add some products to get started"
      action-text="Continue Shopping"
      action-route="/products"
    />

    <!-- Cart Content -->
    <div v-else class="row g-4">
      <!-- Cart Items -->
      <div class="col-lg-8">
        <div class="cart-items-section">
          <div v-for="item in cartItems" :key="item.id" class="cart-item card mb-3 border-0 shadow-sm">
            <div class="card-body">
              <div class="row align-items-center">
                <!-- Product Image -->
                <div class="col-auto">
                  <img
                    :src="item.product?.image_url || fallbackImage"
                    :alt="item.product?.name || `Product ${item.product_id}`"
                    class="rounded"
                    style="width: 100px; height: 100px; object-fit: cover"
                  />
                </div>

                <!-- Product Details -->
                <div class="col">
                  <h5 class="card-title mb-1">
                    {{ item.product?.name || `Product ID: ${item.product_id}` }}
                  </h5>
                  <p class="text-muted small mb-2">
                    {{ item.product?.description || "Product details unavailable" }}
                  </p>
                  <h6 class="text-primary fw-bold">{{ formatCurrency(item.product?.price) }}</h6>
                </div>

                <!-- Quantity Controls -->
                <div class="col-md-auto">
                  <div class="input-group" style="max-width: 120px">
                    <button class="btn btn-outline-secondary btn-sm" @click="decreaseQuantity(item)" :disabled="item.quantity <= 1">
                      <i class="bi bi-dash"></i>
                    </button>
                    <input
                      type="number"
                      class="form-control form-control-sm text-center"
                      v-model.number="item.quantity"
                      min="1"
                      readonly
                    />
                    <button class="btn btn-outline-secondary btn-sm" @click="increaseQuantity(item)">
                      <i class="bi bi-plus"></i>
                    </button>
                  </div>
                </div>

                <!-- Item Total -->
                <div class="col-md-auto text-end">
                  <h6 class="fw-bold mb-2">{{ formatCurrency(lineTotal(item)) }}</h6>
                  <button
                    class="btn btn-outline-danger btn-sm"
                    @click="removeFromCart(item)"
                    title="Remove item"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary Sidebar -->
      <div class="col-lg-4">
        <div class="order-summary card shadow-sm border-0 sticky-top" style="top: 100px">
          <div class="card-body">
            <h5 class="card-title fw-bold mb-3">Order Summary</h5>

            <!-- Totals -->
            <div class="summary-row mb-2">
              <span>Subtotal:</span>
              <span class="fw-bold">{{ formatCurrency(subtotal) }}</span>
            </div>
            <div class="summary-row mb-2">
              <span>Shipping:</span>
              <span class="fw-bold text-success">Free</span>
            </div>
            <div class="summary-row mb-2">
              <span>Tax (10%):</span>
              <span class="fw-bold">{{ formatCurrency(tax) }}</span>
            </div>

            <hr class="my-3" />

            <div class="summary-row mb-4 fs-5">
              <span class="fw-bold">Total:</span>
              <span class="fw-bold text-primary">{{ formatCurrency(total) }}</span>
            </div>

            <!-- Checkout Form -->
            <div class="mb-3">
              <label class="form-label fw-bold">Shipping Address</label>
              <textarea
                v-model="shippingAddress"
                class="form-control"
                rows="3"
                placeholder="Enter your complete shipping address"
              ></textarea>
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold">Payment Method</label>
              <select v-model="paymentMethod" class="form-select">
                <option value="">Select Payment Method</option>
                <option value="COD">Cash On Delivery</option>
                <option value="UPI">UPI</option>
                <option value="CARD">Credit / Debit Card</option>
                <option value="NET_BANKING">Net Banking</option>
              </select>
            </div>

            <!-- Buttons -->
            <div class="d-grid gap-2">
              <button
                class="btn btn-primary btn-lg"
                @click="placeOrder"
                :disabled="isProcessing"
              >
                <span v-if="!isProcessing">
                  <i class="bi bi-check-circle me-2"></i>Place Order
                </span>
                <span v-else>
                  <span class="spinner-border spinner-border-sm me-2"></span>Processing...
                </span>
              </button>
              <router-link to="/products" class="btn btn-outline-secondary">
                Continue Shopping
              </router-link>
            </div>

            <!-- Info -->
            <p class="text-muted small mt-3 mb-0">
              <i class="bi bi-info-circle me-1"></i>
              By placing an order, you agree to our terms and conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../services/api";
import { useCartStore } from "../stores/cartStore";
import { useRouter } from "vue-router";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import EmptyState from "../components/EmptyState.vue";
import { confirmAction, notify } from "../utils/notify";

const cartStore = useCartStore();
const router = useRouter();

const shippingAddress = ref("");
const paymentMethod = ref("");
const loading = ref(false);
const isProcessing = ref(false);
const cartItems = ref([]);
const fallbackImage =
  "https://images.unsplash.com/photo-1557821552-17105176677c?w=300&h=300&fit=crop";

const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return `Rs. ${amount.toFixed(2)}`;
};

const lineTotal = (item) => Number(item.product?.price || 0) * Number(item.quantity || 0);

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + lineTotal(item), 0);
});

const tax = computed(() => {
  return Math.round(subtotal.value * 0.1);
});

const total = computed(() => {
  return subtotal.value + tax.value;
});

const loadCart = async () => {
  try {
    loading.value = true;
    await cartStore.getCart();

    cartItems.value = await Promise.all(
      cartStore.cart.map(async (item) => {
        try {
          const response = await api.get(`/products/${item.product_id}`);
          return {
            ...item,
            product: response.data,
          };
        } catch (error) {
          console.error(`Error loading product ${item.product_id}:`, error);
          return {
            ...item,
            product: null,
          };
        }
      })
    );
  } catch (error) {
    console.error("Error loading cart:", error);
    notify({
      type: "danger",
      title: "Cart failed to load",
      message: "Unable to load your cart right now.",
    });
  } finally {
    loading.value = false;
  }
};

onMounted(loadCart);

const updateQuantity = async (item, quantity) => {
  try {
    await api.put(`/cart/${item.product_id}`, { quantity });
    await loadCart();
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    notify({
      type: "danger",
      title: "Quantity update failed",
      message: "Unable to update item quantity.",
    });
  }
};

const decreaseQuantity = async (item) => {
  if (item.quantity > 1) {
    await updateQuantity(item, item.quantity - 1);
  }
};

const increaseQuantity = async (item) => {
  await updateQuantity(item, item.quantity + 1);
};

const removeFromCart = async (item) => {
  const confirmed = await confirmAction({
    type: "danger",
    title: "Remove item?",
    message: "This item will be removed from your cart.",
    confirmText: "Remove",
  });

  if (!confirmed) {
    return;
  }

  try {
    await api.delete(`/cart/${item.product_id}`);
    await loadCart();
    notify({
      type: "success",
      title: "Cart updated",
      message: "Item removed from cart.",
    });
  } catch (error) {
    console.error("Error removing item:", error);
    notify({
      type: "danger",
      title: "Remove failed",
      message: "Failed to remove item.",
    });
  }
};

const placeOrder = async () => {
  try {
    if (!shippingAddress.value.trim()) {
      notify({
        type: "warning",
        title: "Shipping address needed",
        message: "Please enter your shipping address.",
      });
      return;
    }

    if (!paymentMethod.value) {
      notify({
        type: "warning",
        title: "Payment method needed",
        message: "Please select a payment method.",
      });
      return;
    }

    isProcessing.value = true;

    const response = await api.post("/orders", {
      shipping_address: shippingAddress.value,
      payment_method: paymentMethod.value,
    });

    notify({
      type: "success",
      title: "Order placed",
      message: "Your order was placed successfully.",
    });
    await cartStore.getCart();
    router.push("/orders");
  } catch (error) {
    console.error(error);
    notify({
      type: "danger",
      title: "Order failed",
      message: error.response?.data?.message || "Failed to place order.",
    });
  } finally {
    isProcessing.value = false;
  }
};
</script>

<style scoped>
.cart-page {
  min-height: calc(100vh - 300px);
}

.page-header {
  padding: 2rem 0;
  border-bottom: 2px solid #ff9900;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
}

.cart-item {
  transition: all 0.2s;
}

.cart-item:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-summary {
  border: 1px solid #dee2e6 !important;
  background: #f8f9fa;
}

@media (max-width: 992px) {
  .order-summary {
    position: static !important;
    top: auto !important;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.8rem;
  }

  .cart-item .row {
    flex-direction: column;
  }

  .cart-item .col-auto,
  .cart-item .col-md-auto {
    width: 100%;
    margin-top: 0.5rem;
  }

  .cart-item img {
    width: 80px !important;
    height: 80px !important;
  }
}
</style>
