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
          <h1 class="page-title">Dashboard</h1>
          <p class="text-muted">Welcome to the admin panel</p>
        </div>

        <!-- Loading State -->
        <LoadingSpinner v-if="loading" message="Loading dashboard data..." />

        <!-- Dashboard Content -->
        <div v-else>
          <!-- Statistics Cards -->
          <div class="row g-4 mb-5">
            <!-- Total Products Card -->
            <div class="col-md-3 col-sm-6">
              <div class="stats-card card border-0 shadow-sm">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 class="text-muted mb-2">Total Products</h6>
                      <h2 class="text-primary fw-bold">{{ totalProducts }}</h2>
                      <small class="text-muted">Active in inventory</small>
                    </div>
                    <div class="stats-icon bg-primary">
                      <i class="bi bi-box-seam"></i>
                    </div>
                  </div>
                  <div class="progress mt-3" style="height: 4px">
                    <div class="progress-bar bg-primary" style="width: 75%"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Total Orders Card -->
            <div class="col-md-3 col-sm-6">
              <div class="stats-card card border-0 shadow-sm">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 class="text-muted mb-2">Total Orders</h6>
                      <h2 class="text-success fw-bold">{{ totalOrders }}</h2>
                      <small class="text-muted">All time</small>
                    </div>
                    <div class="stats-icon bg-success">
                      <i class="bi bi-bag-check"></i>
                    </div>
                  </div>
                  <div class="progress mt-3" style="height: 4px">
                    <div class="progress-bar bg-success" style="width: 60%"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Total Users Card -->
            <div class="col-md-3 col-sm-6">
              <div class="stats-card card border-0 shadow-sm">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 class="text-muted mb-2">Total Users</h6>
                      <h2 class="text-info fw-bold">{{ totalUsers }}</h2>
                      <small class="text-muted">Registered users</small>
                    </div>
                    <div class="stats-icon bg-info">
                      <i class="bi bi-people"></i>
                    </div>
                  </div>
                  <div class="progress mt-3" style="height: 4px">
                    <div class="progress-bar bg-info" style="width: 45%"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Revenue Card -->
            <div class="col-md-3 col-sm-6">
              <div class="stats-card card border-0 shadow-sm">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 class="text-muted mb-2">Total Revenue</h6>
                      <h2 class="text-warning fw-bold">₹{{ totalRevenue }}</h2>
                      <small class="text-muted">All time sales</small>
                    </div>
                    <div class="stats-icon bg-warning">
                      <i class="bi bi-graph-up"></i>
                    </div>
                  </div>
                  <div class="progress mt-3" style="height: 4px">
                    <div class="progress-bar bg-warning" style="width: 85%"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="row g-4 mb-5">
            <div class="col-md-6">
              <div class="quick-action-card card border-0 shadow-sm">
                <div class="card-body">
                  <h5 class="card-title fw-bold mb-3">Quick Actions</h5>
                  <div class="d-flex flex-wrap gap-2">
                    <router-link to="/admin/products" class="btn btn-outline-primary btn-sm">
                      <i class="bi bi-plus-circle me-1"></i>Add Product
                    </router-link>
                    <router-link to="/admin/categories" class="btn btn-outline-success btn-sm">
                      <i class="bi bi-plus-circle me-1"></i>Add Category
                    </router-link>
                    <router-link to="/admin/orders" class="btn btn-outline-info btn-sm">
                      <i class="bi bi-eye me-1"></i>View Orders
                    </router-link>
                  </div>
                </div>
              </div>
            </div>

            <!-- System Status -->
            <div class="col-md-6">
              <div class="system-status card border-0 shadow-sm">
                <div class="card-body">
                  <h5 class="card-title fw-bold mb-3">System Status</h5>
                  <div class="status-item d-flex justify-content-between align-items-center mb-2">
                    <span>Database</span>
                    <span class="badge bg-success">Connected</span>
                  </div>
                  <div class="status-item d-flex justify-content-between align-items-center mb-2">
                    <span>API</span>
                    <span class="badge bg-success">Running</span>
                  </div>
                  <div class="status-item d-flex justify-content-between align-items-center">
                    <span>Cache</span>
                    <span class="badge bg-success">Healthy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Orders Section -->
          <div class="row">
            <div class="col-12">
              <div class="card border-0 shadow-sm">
                <div class="card-header bg-light border-bottom">
                  <h5 class="card-title mb-0">
                    <i class="bi bi-clock-history me-2"></i>Recent Orders
                  </h5>
                </div>
                <div class="card-body p-0">
                  <div class="table-responsive">
                    <table class="table table-hover mb-0">
                      <thead class="table-light">
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-if="recentOrders.length === 0">
                          <td colspan="6" class="text-center text-muted py-4">
                            No orders yet
                          </td>
                        </tr>
                        <tr v-for="order in recentOrders" :key="order.id">
                          <td>
                            <span class="badge bg-light text-dark">#{{ order.id }}</span>
                          </td>
                          <td>{{ order.User?.name || "N/A" }}</td>
                          <td class="fw-bold">₹{{ order.total_amount }}</td>
                          <td>
                            <span :class="['badge', getStatusBadgeClass(order.status)]">
                              {{ order.status }}
                            </span>
                          </td>
                          <td class="text-muted small">{{ formatDate(order.created_at) }}</td>
                          <td>
                            <router-link to="/admin/orders" class="btn btn-sm btn-outline-primary">
                              <i class="bi bi-eye"></i>
                            </router-link>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
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

const totalProducts = ref(0);
const totalOrders = ref(0);
const totalUsers = ref(0);
const totalRevenue = ref(0);
const recentOrders = ref([]);
const loading = ref(true);

const loadDashboard = async () => {
  try {
    loading.value = true;

    // Load products
    const productsRes = await api.get("/products");
    totalProducts.value = productsRes.data.total || 0;

    // Load orders
    const ordersRes = await api.get("/orders");
    totalOrders.value = ordersRes.data.length || 0;
    recentOrders.value = ordersRes.data.slice(0, 5) || [];

    // Calculate revenue
    totalRevenue.value = (ordersRes.data || []).reduce(
      (sum, order) => sum + Number(order.total_amount || 0),
      0
    );

    // Load users (if endpoint exists)
    try {
      const usersRes = await api.get("/users");
      totalUsers.value = usersRes.data.length || 0;
    } catch {
      totalUsers.value = 0;
    }
  } catch (error) {
    console.error("Error loading dashboard:", error);
  } finally {
    loading.value = false;
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
    default:
      return "bg-secondary";
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-IN");
};

onMounted(loadDashboard);
</script>

<style scoped>
.admin-container {
  padding: 2rem 0;
}

.page-header {
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #ff9900;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
}

.stats-card {
  border-radius: 0.75rem !important;
  transition: all 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12) !important;
}

.stats-icon {
  width: 60px;
  height: 60px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white !important;
}

.quick-action-card,
.system-status {
  border-radius: 0.75rem !important;
}

.status-item {
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: #f8f9fa;
}

.table-hover tbody tr:hover {
  background: #f8f9fa;
}

@media (max-width: 992px) {
  .page-title {
    font-size: 1.5rem;
  }

  .stats-card {
    margin-bottom: 1rem;
  }
}

@media (max-width: 768px) {
  .admin-container {
    padding: 1rem 0;
  }

  .stats-icon {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }

  .table-responsive {
    overflow-x: auto;
  }
}
</style>