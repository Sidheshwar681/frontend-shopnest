<template>
  <div class="container mt-4">
    <h2 class="mb-4">Product Management</h2>

    <!-- Add Product Form -->

    <div class="card mb-4">
      <div class="card-body">
        <h4>Add Product</h4>

        
        <form @submit.prevent="saveProduct">
          <input
            v-model="form.name"
            class="form-control mb-2"
            placeholder="Product Name"
          />

          <input
            v-model="form.price"
            type="number"
            class="form-control mb-2"
            placeholder="Price"
          />

          <input
            v-model="form.stock"
            type="number"
            class="form-control mb-2"
            placeholder="Stock"
          />

          <textarea
            v-model="form.description"
            class="form-control mb-2"
            placeholder="Description"
          ></textarea>

          <input
            v-model="form.category_id"
            type="number"
            class="form-control mb-3"
            placeholder="Category ID"
          />
          <input
            v-model="form.image_url"
            type="text"
            class="form-control mb-2"
            placeholder="Image URL"
          />
          <button class="btn btn-success">
            {{ editingId ? "Update Product" : "Add Product" }}
          </button>
        </form>
      </div>
    </div>

    <!-- Products Table -->

    <table class="table table-bordered">
      <thead>
        <tr>
          <th>ID</th>
          <th>Image</th>
          <th>Name</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.id }}</td>

          <td>{{ product.name }}</td>

          <td>₹{{ product.price }}</td>

          <td>{{ product.stock_quantity }}</td>
          <td>
            <img
              :src="product.image_url"
              alt="Product"
              width="60"
              height="60"
              style="object-fit: cover; border-radius: 8px"
            />
          </td>
          <td>
            <button
              class="btn btn-primary btn-sm me-2"
              @click="editProduct(product)"
            >
              Edit
            </button>

            <button
              class="btn btn-danger btn-sm"
              @click="deleteProduct(product.id)"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import api from "../services/api";

const products = ref([]);
const editingId = ref(null);

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
    const res = await api.get("/products");

    console.log(res.data);

    products.value = res.data.products;
  } catch (error) {
    console.error(error);
  }
};

//edit product function
const editProduct = (product) => {
  editingId.value = product.id;

  Object.assign(form, {
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock_quantity,
    category_id: product.category_id,
    image_url: product.image_url,
  });
};

const saveProduct = async () => {
  try {
    if (editingId.value) {
      await api.put(`/products/${editingId.value}`, {
        ...form,
        stock_quantity: form.stock,
      });

      alert("Product Updated");
    } else {
      await api.post("/products", {
        ...form,
        stock_quantity: form.stock,
      });

      alert("Product Added");
    }

    editingId.value = null;

    Object.assign(form, {
      name: "",
      description: "",
      price: "",
      stock: "",
      category_id: "",
      image_url: "",
    });

    await loadProducts();
  } catch (error) {
    console.error(error.response?.data);
  }
};
const deleteProduct = async (id) => {
  console.log("Deleting Product ID:", id);

  if (!id) {
    alert("ID is undefined");
    return;
  }

  try {
    await api.delete(`/products/${id}`);

    alert("Product Deleted");

    await loadProducts();
  } catch (error) {
    console.error(error.response?.data);
  }
};

onMounted(loadProducts);
</script>
