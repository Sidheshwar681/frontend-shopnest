<template>
  <div class="orders-page">
    <!-- Page Header -->
    <div class="page-header mb-4">
      <h1 class="page-title">My Orders</h1>
      <p class="text-muted">Track and manage all your orders</p>
    </div>

    <!-- Loading State -->
    <LoadingSpinner v-if="loading" message="Loading your orders..." />

    <!-- Empty State -->
    <EmptyState
      v-else-if="orders.length === 0"
      icon="bi-bag"
      title="No Orders Yet"
      message="Start shopping to create your first order"
      action-text="Start Shopping"
      action-route="/products"
    />

    <!-- Orders List -->
    <div v-else class="orders-list">
      <!-- List View -->
      <div v-for="order in orders" :key="order.id" class="order-card card mb-3 shadow-sm border-0">
        <div class="card-body">
          <div class="row align-items-center mb-3">
            <!-- Order Number & Date -->
            <div class="col-md-6">
              <h5 class="mb-1">
                <i class="bi bi-box me-2 text-primary"></i>Order #{{ order.id }}
              </h5>
              <p class="text-muted small mb-0">
                <i class="bi bi-calendar3 me-1"></i>
                {{ formatDate(order.created_at) }}
              </p>
            </div>

            <!-- Status Badge -->
            <div class="col-md-3">
              <span :class="['badge', getStatusBadgeClass(order.status), 'fs-6']">
                {{ order.status }}
              </span>
            </div>

            <!-- Amount -->
            <div class="col-md-3 text-end">
              <h6 class="text-primary fw-bold mb-0">₹{{ order.total_amount }}</h6>
              <small class="text-muted">{{ order.payment_method }}</small>
            </div>
          </div>

          <!-- Order Timeline -->
          <div class="order-timeline">
            <div class="timeline-item" :class="{ completed: isStageComplete('pending', order) }">
              <div class="timeline-marker"></div>
              <div class="timeline-content">
                <h6>Order Placed</h6>
                <p class="text-muted small">{{ formatDate(order.created_at) }}</p>
              </div>
            </div>

            <div class="timeline-item" :class="{ completed: isStageComplete('processing', order) }">
              <div class="timeline-marker"></div>
              <div class="timeline-content">
                <h6>Processing</h6>
                <p class="text-muted small">Your order is being prepared</p>
              </div>
            </div>

            <div class="timeline-item" :class="{ completed: isStageComplete('shipped', order) }">
              <div class="timeline-marker"></div>
              <div class="timeline-content">
                <h6>Shipped</h6>
                <p class="text-muted small">On its way to you</p>
              </div>
            </div>

            <div class="timeline-item" :class="{ completed: isStageComplete('delivered', order) }">
              <div class="timeline-marker"></div>
              <div class="timeline-content">
                <h6>Delivered</h6>
                <p class="text-muted small">Order delivered</p>
              </div>
            </div>
          </div>

          <!-- Order Details Toggle -->
          <div class="mt-3 pt-3 border-top">
            <button
              class="btn btn-sm btn-outline-primary"
              @click="toggleDetails(order.id)"
            >
              <i :class="['bi', expandedOrder === order.id ? 'bi-chevron-up' : 'bi-chevron-down', 'me-1']"></i>
              {{ expandedOrder === order.id ? "Hide" : "Show" }} Details
            </button>
          </div>

          <!-- Order Details (Expandable) -->
          <div v-if="expandedOrder === order.id" class="order-details mt-3 pt-3 border-top">
            <div class="row mb-3">
              <div class="col-md-6">
                <h6 class="fw-bold mb-2">Shipping Address</h6>
                <p class="text-muted small">{{ order.shipping_address }}</p>
              </div>
              <div class="col-md-6">
                <h6 class="fw-bold mb-2">Payment Method</h6>
                <p class="text-muted small">{{ order.payment_method }}</p>
              </div>
            </div>

            <!-- Order Items -->
            <h6 class="fw-bold mb-2">Order Items</h6>
            <table class="table table-sm table-borderless">
              <thead class="table-light">
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in getOrderItems(order.id)" :key="item.id">
                  <td>{{ item.Product?.name }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>₹{{ item.Product?.price }}</td>
                  <td>₹{{ (item.Product?.price || 0) * item.quantity }}</td>
                </tr>
              </tbody>
            </table>

            <!-- Total -->
            <div class="text-end">
              <h6 class="fw-bold">Total: <span class="text-primary">₹{{ order.total_amount }}</span></h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import EmptyState from "../components/EmptyState.vue";

const orders = ref([]);
const loading = ref(true);
const expandedOrder = ref(null);

const statusHierarchy = {
  pending: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
};

onMounted(async () => {
  try {
    const response = await api.get("/orders");
    orders.value = response.data;
  } catch (error) {
    console.error("Error loading orders:", error);
  } finally {
    loading.value = false;
  }
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusBadgeClass = (status) => {
  const statusLower = status.toLowerCase();
  switch (statusLower) {
    case "pending":
      return "bg-warning text-dark";
    case "processing":
      return "bg-info text-white";
    case "shipped":
      return "bg-primary";
    case "delivered":
      return "bg-success";
    case "cancelled":
      return "bg-danger";
    default:
      return "bg-secondary";
  }
};

const isStageComplete = (stage, order) => {
  const orderStatus = order.status.toLowerCase();
  return (statusHierarchy[orderStatus] || 0) >= (statusHierarchy[stage] || 0);
};

const toggleDetails = (orderId) => {
  expandedOrder.value = expandedOrder.value === orderId ? null : orderId;
};

const getOrderItems = (orderId) => {
  // This would require fetching order items from the API
  // For now, returning empty array - API should provide order items
  return [];
};
</script>

<style scoped>
.orders-page {
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

.order-card {
  transition: all 0.2s;
  border-radius: 0.75rem !important;
}

.order-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12) !important;
}

/* Timeline Styles */
.order-timeline {
  display: flex;
  position: relative;
  margin: 1.5rem 0;
  overflow-x: auto;
  padding: 1rem 0;
}

.timeline-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-width: 150px;
  position: relative;
}

.timeline-item:not(:last-child)::after {
  content: "";
  position: absolute;
  top: 25px;
  left: 50%;
  right: -50%;
  height: 2px;
  background: #e0e0e0;
  z-index: 0;
}

.timeline-item.completed::after {
  background: #28a745;
}

.timeline-marker {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: 3px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  transition: all 0.2s;
}

.timeline-item.completed .timeline-marker {
  background: #28a745;
  border-color: #28a745;
}

.timeline-item.completed .timeline-marker::after {
  content: "✓";
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
}

.timeline-content {
  text-align: center;
  margin-top: 0.5rem;
}

.timeline-content h6 {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0.25rem 0;
}

/* Order Details Table */
.table-sm th,
.table-sm td {
  padding: 0.5rem !important;
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 768px) {
  .page-title {
    font-size: 1.8rem;
  }

  .order-timeline {
    flex-wrap: wrap;
    gap: 1rem;
  }

  .timeline-item {
    min-width: 120px;
  }

  .timeline-item:not(:last-child)::after {
    display: none;
  }

  .row {
    flex-direction: column;
  }

  .text-end {
    text-align: left !important;
  }
}
</style>