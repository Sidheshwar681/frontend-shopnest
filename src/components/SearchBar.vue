<template>
  <div class="search-container mb-4">
    <div class="search-panel">
      <div class="search-field">
        <form class="input-group" @submit.prevent="onSearch">
          <span class="input-group-text">
            <i class="bi bi-search"></i>
          </span>
          <input
            type="text"
            class="form-control form-control-lg"
            :placeholder="placeholder"
            v-model="searchTerm"
            @input="onInput"
          />
          <button
            class="btn btn-primary"
            type="submit"
            :disabled="!searchTerm.trim()"
          >
            Search
          </button>
          <button
            v-if="searchTerm"
            class="btn btn-outline-secondary"
            type="button"
            @click="clearSearch"
            title="Clear search"
          >
            <i class="bi bi-x"></i>
          </button>
        </form>
      </div>

      <!-- Filter Options (optional) -->
      <div v-if="showFilters" class="filter-field">
        <select class="form-select form-select-lg" v-model="selectedFilter" @change="onFilterChange">
          <option value="">All Categories</option>
          <option v-for="filter in filters" :key="filter" :value="filter">
            {{ filter }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  placeholder: {
    type: String,
    default: "Search...",
  },
  showFilters: {
    type: Boolean,
    default: false,
  },
  filters: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: String,
    default: "",
  },
  filterValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["search", "input-search", "filter-change", "update:modelValue", "clear"]);

const searchTerm = ref(props.modelValue);
const selectedFilter = ref(props.filterValue);

const onInput = () => {
  emit("update:modelValue", searchTerm.value);
  emit("input-search", searchTerm.value.trim());
};

const onSearch = () => {
  emit("search", searchTerm.value.trim());
};

const clearSearch = () => {
  searchTerm.value = "";
  selectedFilter.value = "";
  emit("update:modelValue", "");
  emit("clear");
};

const onFilterChange = () => {
  emit("filter-change", selectedFilter.value);
};

watch(
  () => props.modelValue,
  (value) => {
    searchTerm.value = value || "";
  }
);

watch(
  () => props.filterValue,
  (value) => {
    selectedFilter.value = value || "";
  }
);
</script>

<style scoped>
.search-container {
  padding: 0;
}

.search-panel {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(220px, 300px);
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
}

.form-control,
.form-select,
.btn {
  border-radius: 8px !important;
  border: 1px solid #dee2e6 !important;
}

.input-group-text {
  background: #fff;
  border-radius: 8px 0 0 8px !important;
  color: #6b7280;
}

.input-group .form-control {
  border-left: 0 !important;
}

.btn-primary {
  background-color: #ff9900;
  border-color: #ff9900;
}

.btn-primary:hover {
  background-color: #ff7700;
  border-color: #ff7700;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .search-panel {
    grid-template-columns: 1fr;
    padding: 0.75rem;
  }

  .form-control,
  .form-select,
  .btn {
    font-size: 0.95rem;
  }
}
</style>
