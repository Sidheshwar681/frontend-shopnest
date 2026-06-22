<template>
  <div class="admin-sidebar">
    <!-- Sidebar Toggle for Mobile -->
    <button
      class="btn btn-outline-primary d-lg-none mb-3 w-100"
      type="button"
      data-bs-toggle="offcanvas"
      data-bs-target="#adminSidebar"
    >
      <i class="bi bi-list me-2"></i>Menu
    </button>

    <!-- Sidebar Content -->
    <div
      class="offcanvas-lg offcanvas-start bg-light"
      tabindex="-1"
      id="adminSidebar"
      aria-labelledby="adminSidebarLabel"
    >
      <div class="offcanvas-header border-bottom d-lg-none">
        <h5 class="offcanvas-title fw-bold" id="adminSidebarLabel">
          <i class="bi bi-gear me-2"></i>Admin Menu
        </h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="offcanvas"
          data-bs-target="#adminSidebar"
        ></button>
      </div>

      <div class="offcanvas-body p-0">
        <!-- Sidebar Header (Desktop only) -->
        <div class="p-3 border-bottom d-none d-lg-block">
          <h6 class="fw-bold text-uppercase text-muted">Admin Panel</h6>
        </div>

        <!-- Navigation Items -->
        <nav class="nav flex-column p-2">
          <!-- Dashboard -->
          <router-link
            to="/admin/dashboard"
            class="nav-link"
            active-class="active"
            data-bs-dismiss="offcanvas"
            data-bs-target="#adminSidebar"
          >
            <i class="bi bi-speedometer2 me-2"></i>
            Dashboard
          </router-link>

          <!-- Products -->
          <router-link
            to="/admin/products"
            class="nav-link"
            active-class="active"
            data-bs-dismiss="offcanvas"
            data-bs-target="#adminSidebar"
          >
            <i class="bi bi-box-seam me-2"></i>
            Products
          </router-link>

          <!-- Categories -->
          <router-link
            to="/admin/categories"
            class="nav-link"
            active-class="active"
            data-bs-dismiss="offcanvas"
            data-bs-target="#adminSidebar"
          >
            <i class="bi bi-tags me-2"></i>
            Categories
          </router-link>

          <!-- Orders -->
          <router-link
            to="/admin/orders"
            class="nav-link"
            active-class="active"
            data-bs-dismiss="offcanvas"
            data-bs-target="#adminSidebar"
          >
            <i class="bi bi-bag-check me-2"></i>
            Orders
          </router-link>

          <!-- Divider -->
          <div class="nav-divider my-2"></div>

          <!-- Back to Shop -->
          <router-link
            to="/products"
            class="nav-link text-muted"
            data-bs-dismiss="offcanvas"
            data-bs-target="#adminSidebar"
          >
            <i class="bi bi-arrow-left me-2"></i>
            Back to Shop
          </router-link>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.admin-sidebar {
  margin-bottom: 2rem;
}

.nav-link {
  color: #333;
  padding: 0.75rem 1rem;
  border-radius: 0.25rem;
  transition: all 0.2s;
  font-weight: 500;
}

.nav-link:hover {
  background: #e9ecef;
  color: #ff9900;
  padding-left: 1.5rem;
}

.nav-link.active {
  background: #ff9900;
  color: white;
  border-left: 4px solid #ff7700;
  padding-left: calc(1rem - 4px);
}

.nav-divider {
  height: 1px;
  background: #dee2e6;
  margin-left: 1rem;
  margin-right: 1rem;
}

.offcanvas-header {
  background: #f8f9fa;
}

.btn-outline-primary {
  border-color: #0d6efd;
  color: #0d6efd;
}

.btn-outline-primary:hover {
  background: #0d6efd;
  color: white;
}

/* Desktop Layout */
@media (min-width: 992px) {
  .admin-sidebar {
    position: sticky;
    top: 80px;
    height: calc(100vh - 80px);
    overflow-y: auto;
  }
}

/* Mobile adjustments */
@media (max-width: 991px) {
  .nav-link {
    padding: 0.6rem 1rem;
  }

  .nav-link:hover {
    padding-left: 1.5rem;
  }
}
</style>
