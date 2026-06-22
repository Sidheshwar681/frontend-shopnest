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
          <h1 class="page-title">Category Management</h1>
          <p class="text-muted">Create and manage product categories</p>
        </div>

        <!-- Add Category Form -->
        <div class="card border-0 shadow-sm mb-4">
          <div class="card-header bg-light">
            <h5 class="mb-0">Add New Category</h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="createCategory">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-bold">Category Name</label>
                  <input
                    v-model="form.name"
                    type="text"
                    class="form-control"
                    placeholder="Enter category name"
                    required
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-bold">Image URL</label>
                  <input
                    v-model="form.image_url"
                    type="url"
                    class="form-control"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div class="col-12">
                  <label class="form-label fw-bold">Description</label>
                  <textarea
                    v-model="form.description"
                    class="form-control"
                    rows="3"
                    placeholder="Category description"
                  ></textarea>
                </div>

                <!-- Image Preview -->
                <div v-if="form.image_url" class="col-12">
                  <img
                    :src="form.image_url"
                    alt="Preview"
                    class="rounded"
                    style="max-width: 150px; max-height: 150px; object-fit: cover"
                  />
                </div>

                <div class="col-12">
                  <button type="submit" class="btn btn-primary">
                    <i class="bi bi-plus-circle me-2"></i>Add Category
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <!-- Categories Table -->
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-light">
            <h5 class="mb-0">All Categories ({{ categories.length }})</h5>
          </div>
          <div class="card-body p-0">
            <LoadingSpinner v-if="loading" message="Loading categories..." />
            <EmptyState
              v-else-if="categories.length === 0"
              icon="bi-inbox"
              title="No Categories"
              message="No categories found. Create your first category."
              action-text="Add Category"
            />
            <div v-else class="table-responsive">
              <table class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="category in categories" :key="category.id">
                    <td>
                      <span class="badge bg-light text-dark">{{ category.id }}</span>
                    </td>
                    <td>
                      <img
                        v-if="category.image_url"
                        :src="category.image_url"
                        :alt="category.name"
                        style="width: 60px; height: 60px; object-fit: cover; border-radius: 0.35rem"
                      />
                      <span v-else class="text-muted small">No image</span>
                    </td>
                    <td class="fw-bold">{{ category.name }}</td>
                    <td class="text-muted small" style="max-width: 250px">
                      {{ category.description || "No description" }}
                    </td>
                    <td>
                      <button
                        class="btn btn-sm btn-outline-danger"
                        @click="deleteCategory(category.id)"
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

const categories = ref([]);
const loading = ref(false);

const form = reactive({
  name: "",
  description: "",
  image_url: "",
});

const loadCategories = async () => {
  try {
    loading.value = true;
    const res = await api.get("/categories");
    categories.value = res.data.categories || res.data || [];
  } catch (error) {
    console.error("Error loading categories:", error);
  } finally {
    loading.value = false;
  }
};

const createCategory = async () => {
  try {
    if (!form.name.trim()) {
      notify({
        type: "warning",
        title: "Category name needed",
        message: "Please enter a category name.",
      });
      return;
    }

    await api.post("/categories", {
      name: form.name,
      description: form.description,
      image_url: form.image_url,
    });

    notify({ type: "success", title: "Category added", message: "Category added successfully." });

    Object.assign(form, {
      name: "",
      description: "",
      image_url: "",
    });

    await loadCategories();
  } catch (error) {
    console.error("Error creating category:", error);
    notify({
      type: "danger",
      title: "Create failed",
      message: error.response?.data?.message || "Failed to create category.",
    });
  }
};

const deleteCategory = async (id) => {
  const confirmed = await confirmAction({
    type: "danger",
    title: "Delete category?",
    message: "This category will be permanently removed.",
    confirmText: "Delete",
  });

  if (!confirmed) {
    return;
  }

  try {
    await api.delete(`/categories/${id}`);
    notify({ type: "success", title: "Category deleted", message: "Category deleted successfully." });
    await loadCategories();
  } catch (error) {
    console.error("Error deleting category:", error);
    notify({
      type: "danger",
      title: "Delete failed",
      message: error.response?.data?.message || "Failed to delete category.",
    });
  }
};

onMounted(loadCategories);
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
