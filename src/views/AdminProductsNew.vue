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
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h1 class="page-title">Product Management</h1>
              <p class="text-muted">Add, edit, and manage your products</p>
            </div>
            <button class="btn btn-primary" @click="resetForm">
              <i class="bi bi-plus-circle me-2"></i>Add New Product
            </button>
          </div>
        </div>

        <!-- Add/Edit Form -->
        <div class="card border-0 shadow-sm mb-4">
          <div class="card-header bg-light">
            <h5 class="mb-0">
              {{ editingId ? "Edit Product" : "Add New Product" }}
            </h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="saveProduct">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-bold">Product Name</label>
                  <input
                    v-model="form.name"
                    type="text"
                    class="form-control"
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-bold">Price (₹)</label>
                  <input
                    v-model.number="form.price"
                    type="number"
                    class="form-control"
                    placeholder="0"
                    step="0.01"
                    required
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-bold">Stock Quantity</label>
                  <input
                    v-model.number="form.stock"
                    type="number"
                    class="form-control"
                    placeholder="0"
                    required
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-bold">Category ID</label>
                  <input
                    v-model.number="form.category_id"
                    type="number"
                    class="form-control"
                    placeholder="Select category"
                    required
                  />
                </div>

                <div class="col-12">
                  <label class="form-label fw-bold">Description</label>
                  <textarea
                    v-model="form.description"
                    class="form-control"
                    rows="3"
                    placeholder="Product description"
                  ></textarea>
                </div>

                <div class="col-12">
                  <label class="form-label fw-bold">Image URL</label>
                  <input
                    v-model="form.image_url"
                    type="url"
                    class="form-control"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <!-- Image Preview -->
                <div v-if="form.image_url" class="col-12">
                  <img
                    :src="form.image_url"
                    alt="Preview"
                    class="rounded"
                    style="max-width: 200px; max-height: 200px; object-fit: cover"
                  />
                </div>

                <div class="col-12">
                  <div class="d-flex gap-2">
                    <button type="submit" class="btn btn-primary">
                      <i class="bi bi-check-circle me-2"></i>
                      {{ editingId ? "Update Product" : "Add Product" }}
                    </button>
                    <button v-if="editingId" type="button" class="btn btn-secondary" @click="resetForm">
                      <i class="bi bi-x-circle me-2"></i>Cancel
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        <!-- Products Table -->
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-light">
            <h5 class="mb-0">All Products ({{ products.length }})</h5>
          </div>
          <div class="card-body p-0">
            <LoadingSpinner v-if="loading" message="Loading products..." />
            <EmptyState
              v-else-if="products.length === 0"
              icon="bi-inbox"
              title="No Products"
              message="No products found. Add your first product to get started."
              action-text="Add Product"
              @click="resetForm"
            />
            <div v-else class="table-responsive">
              <table class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="product in products" :key="product.id">
                    <td>
                      <span class="badge bg-light text-dark">{{ product.id }}</span>
                    </td>
                    <td>
                      <img
                        :src="product.image_url"
                        :alt="product.name"
                        style="width: 50px; height: 50px; object-fit: cover; border-radius: 0.35rem"
                      />
                    </td>
                    <td class="fw-bold">{{ product.name }}</td>
                    <td>₹{{ product.price }}</td>
                    <td>
                      <span :class="['badge', product.stock > 10 ? 'bg-success' : 'bg-warning text-dark']">
                        {{ product.stock || product.stock_quantity || 0 }}
                      </span>
                    </td>
                    <td>{{ product.category_id }}</td>
                    <td>
                      <button
                        class="btn btn-sm btn-outline-primary me-2"
                        @click="editProduct(product)"
                        title="Edit"
                      >
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button
                        class="btn btn-sm btn-outline-danger"
                        @click="deleteProduct(product.id)"
                        title="Delete"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
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
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import api from "../services/api";
import AdminSidebar from "../components/AdminSidebar.vue";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import EmptyState from "../components/EmptyState.vue";
import { confirmAction, notify } from "../utils/notify";

const products = ref([]);
const editingId = ref(null);
const loading = ref(false);

const form = reactive({
  name: "",
  description: "",
  price: "",
  stock: "",
  category_id: "",
  image_url: "",
});

const loadProducts = async () => {
  try {
    loading.value = true;
    const res = await api.get("/products");
    products.value = res.data.products || [];
  } catch (error) {
    console.error("Error loading products:", error);
  } finally {
    loading.value = false;
  }
};

const editProduct = (product) => {
  editingId.value = product.id;
  Object.assign(form, {
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock_quantity || product.stock || 0,
    category_id: product.category_id,
    image_url: product.image_url,
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const resetForm = () => {
  editingId.value = null;
  Object.assign(form, {
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    image_url: "",
  });
};

const saveProduct = async () => {
  try {
    if (editingId.value) {
      await api.put(`/products/${editingId.value}`, {
        ...form,
        stock_quantity: form.stock,
      });
      notify({ type: "success", title: "Product updated", message: "Product updated successfully." });
    } else {
      await api.post("/products", {
        ...form,
        stock_quantity: form.stock,
      });
      notify({ type: "success", title: "Product added", message: "Product added successfully." });
    }

    resetForm();
    await loadProducts();
  } catch (error) {
    console.error("Error saving product:", error);
    notify({
      type: "danger",
      title: "Save failed",
      message: error.response?.data?.message || "Failed to save product.",
    });
  }
};

const deleteProduct = async (id) => {
  const confirmed = await confirmAction({
    type: "danger",
    title: "Delete product?",
    message: "This product will be permanently removed.",
    confirmText: "Delete",
  });

  if (!confirmed) {
    return;
  }

  try {
    await api.delete(`/products/${id}`);
    notify({ type: "success", title: "Product deleted", message: "Product deleted successfully." });
    await loadProducts();
  } catch (error) {
    console.error("Error deleting product:", error);
    notify({
      type: "danger",
      title: "Delete failed",
      message: error.response?.data?.message || "Failed to delete product.",
    });
  }
};

onMounted(loadProducts);
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

@media (max-width: 768px) {
  .table-responsive {
    font-size: 0.9rem;
  }

  .btn-sm {
    padding: 0.35rem 0.6rem;
  }
}
</style>
