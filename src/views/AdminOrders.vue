<template>
  <div class="admin-container">
    <div class="row g-4">
      <!-- Sidebar -->
      <div class="col-lg-2 d-none d-lg-block">
        <AdminSidebar />
      </div>

      <!-- Main Content -->
      <div class="col-lg-10">
        <!-- Mobile Sidebar Toggle -->
        <div class="d-lg-none mb-3">
          <AdminSidebar />
        </div>

        <!-- Page Header -->
        <div class="page-header mb-4">
          <h1 class="page-title">Order Management</h1>
          <p class="text-muted">Manage and track all customer orders</p>
        </div>

        <!-- Loading State -->
        <LoadingSpinner v-if="loading" message="Loading orders..." />

        <!-- Empty State -->
        <EmptyState
          v-else-if="orders.length === 0"
          icon="bi-inbox"
          title="No Orders"
          message="No orders found"
        />

        <!-- Orders Table -->
        <div v-else class="card border-0 shadow-sm">
          <div class="card-header bg-light">
            <h5 class="mb-0">All Orders ({{ orders.length }})</h5>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="order in orders" :key="order.id">
                    <td>
                      <span class="badge bg-light text-dark">#{{ order.id }}</span>
                    </td>
                    <td class="fw-bold">{{ order.User?.name || "N/A" }}</td>
                    <td class="text-muted small">{{ order.User?.email || "N/A" }}</td>
                    <td class="fw-bold text-primary">₹{{ order.total_amount }}</td>
                    <td>
                      <select
                        v-model="order.status"
                        @change="updateStatus(order)"
                        :class="['form-select form-select-sm', getStatusClass(order.status)]"
                        style="min-width: 120px"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <span :class="['badge', getPaymentBadgeClass(order.payment_method)]">
                        {{ order.payment_method }}
                      </span>
                    </td>
                    <td class="text-muted small">{{ formatDate(order.created_at) }}</td>
                    <td>
                      <button
                        class="btn btn-sm btn-outline-primary"
                        @click="viewOrder(order)"
                        title="View Details"
                      >
                        <i class="bi bi-eye"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Order Details Modal -->
        <div
          v-if="selectedOrder"
          class="modal d-block bg-dark bg-opacity-50"
          style="display: flex"
          @click="selectedOrder = null"
        >
          <div class="modal-dialog modal-dialog-centered" @click.stop>
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Order #{{ selectedOrder.id }} Details</h5>
                <button type="button" class="btn-close" @click="selectedOrder = null"></button>
              </div>
              <div class="modal-body">
                <div class="row mb-3">
                  <div class="col-md-6">
                    <h6 class="fw-bold">Customer Info</h6>
                    <p class="mb-1">
                      <strong>Name:</strong> {{ selectedOrder.User?.name }}
                    </p>
                    <p class="mb-1">
                      <strong>Email:</strong> {{ selectedOrder.User?.email }}
                    </p>
                    <p>
                      <strong>Phone:</strong> {{ selectedOrder.User?.phone || "N/A" }}
                    </p>
                  </div>
                  <div class="col-md-6">
                    <h6 class="fw-bold">Order Info</h6>
                    <p class="mb-1">
                      <strong>Order ID:</strong> {{ selectedOrder.id }}
                    </p>
                    <p class="mb-1">
                      <strong>Date:</strong> {{ formatDate(selectedOrder.created_at) }}
                    </p>
                    <p>
                      <strong>Total:</strong> ₹{{ selectedOrder.total_amount }}
                    </p>
                  </div>
                </div>
                <div class="mb-3">
                  <h6 class="fw-bold">Shipping Address</h6>
                  <p class="text-muted">{{ selectedOrder.shipping_address }}</p>
                </div>
                <div>
                  <h6 class="fw-bold">Payment Method</h6>
                  <p class="text-muted">{{ selectedOrder.payment_method }}</p>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="selectedOrder = null">
                  Close
                </button>
              </div>
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
import AdminSidebar from "../components/AdminSidebar.vue";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import EmptyState from "../components/EmptyState.vue";
import { notify } from "../utils/notify";

const orders = ref([]);
const loading = ref(false);
const selectedOrder = ref(null);

const loadOrders = async () => {
  try {
    loading.value = true;

    const res = await api.get("/orders/admin/all");

    console.log("API Response:", res.data);

    orders.value = res.data || [];

    console.log("Orders Value:", orders.value);

  } catch (error) {
    console.error("Error loading orders:", error);
  } finally {
    loading.value = false;
  }
};

const updateStatus = async (order) => {
  try {
    await api.put(`/orders/${order.id}/status`, {
      status: order.status,
    });
    notify({ type: "success", title: "Status updated", message: "Order status updated successfully." });
  } catch (error) {
    console.error("Error updating status:", error);
    notify({
      type: "danger",
      title: "Update failed",
      message: error.response?.data?.message || "Failed to update status.",
    });
  }
};

const getStatusClass = (status) => {
  const statusLower = status.toLowerCase();
  switch (statusLower) {
    case "pending":
      return "border-warning";
    case "processing":
      return "border-info";
    case "shipped":
      return "border-primary";
    case "delivered":
      return "border-success";
    case "cancelled":
      return "border-danger";
    default:
      return "border-secondary";
  }
};

const getStatusBadgeClass = (status) => {
  const statusLower = status.toLowerCase();
  switch (statusLower) {
    case "pending":
      return "bg-warning text-dark";
    case "processing":
      return "bg-info";
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

const getPaymentBadgeClass = (method) => {
  switch (method.toUpperCase()) {
    case "COD":
      return "bg-light text-dark";
    case "UPI":
      return "bg-info";
    case "CARD":
      return "bg-primary";
    case "NET_BANKING":
      return "bg-success";
    default:
      return "bg-secondary";
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-IN");
};

const viewOrder = (order) => {
  selectedOrder.value = order;
};

onMounted(loadOrders);
</script>

<style scoped>
.admin-container {
  padding: 2rem 0;
}

.page-header {
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #ff9900;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
}

.table-hover tbody tr:hover {
  background: #f8f9fa;
}

.form-select-sm {
  padding: 0.4rem 2rem 0.4rem 0.5rem;
  font-size: 0.85rem;
}

@media (max-width: 768px) {
  .table-responsive {
    font-size: 0.9rem;
  }

  .btn-sm {
    padding: 0.35rem 0.6rem;
  }
}
</style>
