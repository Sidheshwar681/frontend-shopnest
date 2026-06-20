<template>
  <div class="container mt-4">

    <h2 class="mb-4">
      Category Management
    </h2>

    <!-- Add Category Form -->
    <div class="card shadow mb-4">
      <div class="card-body">

        <h4 class="mb-3">
          Add Category
        </h4>

        <form @submit.prevent="createCategory">

          <div class="mb-3">
            <label class="form-label">
              Category Name
            </label>

            <input
              v-model="form.name"
              class="form-control"
              placeholder="Enter Category Name"
              required
            />
          </div>

          <div class="mb-3">
            <label class="form-label">
              Description
            </label>

            <textarea
              v-model="form.description"
              class="form-control"
              rows="3"
              placeholder="Enter Category Description"
            ></textarea>
          </div>

          <div class="mb-3">
            <label class="form-label">
              Image URL
            </label>

            <input
              v-model="form.image_url"
              class="form-control"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div
            v-if="form.image_url"
            class="mb-3"
          >
            <img
              :src="form.image_url"
              alt="Preview"
              class="img-thumbnail"
              style="max-height: 150px"
            />
          </div>

          <button
            type="submit"
            class="btn btn-success"
          >
            Add Category
          </button>

        </form>

      </div>
    </div>

    <!-- Categories Table -->
    <div class="card shadow">
      <div class="card-body">

        <h4 class="mb-3">
          Categories
        </h4>

        <table class="table table-bordered align-middle">

          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            <tr
              v-for="category in categories"
              :key="category.id"
            >
              <td>{{ category.id }}</td>

              <td>
                <img
                  v-if="category.image_url"
                  :src="category.image_url"
                  width="80"
                  height="80"
                  class="rounded"
                  style="object-fit: cover"
                />

                <span v-else>
                  No Image
                </span>
              </td>

              <td>
                {{ category.name }}
              </td>

              <td>
                {{ category.description }}
              </td>

              <td>

                <button
                  class="btn btn-danger btn-sm"
                  @click="deleteCategory(category.id)"
                >
                  Delete
                </button>

              </td>
            </tr>

          </tbody>

        </table>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import api from "../services/api";

const categories = ref([]);

const form = reactive({
  name: "",
  description: "",
  image_url: ""
});

const loadCategories = async () => {
  try {
    const res = await api.get("/categories");

    categories.value =
      res.data.categories || res.data;

  } catch (error) {
    console.error(error);
  }
};

const createCategory = async () => {
  try {

    await api.post("/categories", {
      name: form.name,
      description: form.description,
      image_url: form.image_url
    });

    alert("Category Added Successfully");

    Object.assign(form, {
      name: "",
      description: "",
      image_url: ""
    });

    await loadCategories();

  } catch (error) {
    console.error(error.response?.data);
  }
};

const deleteCategory = async (id) => {
  try {

    if (!confirm("Delete this category?")) {
      return;
    }

    await api.delete(`/categories/${id}`);

    alert("Category Deleted Successfully");

    await loadCategories();

  } catch (error) {

    alert(
      error.response?.data?.message ||
      "Delete failed"
    );

    console.error(error.response?.data);
  }
};

onMounted(() => {
  loadCategories();
});
</script>