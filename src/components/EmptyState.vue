<template>
  <div class="empty-state d-flex flex-column justify-content-center align-items-center py-5">
    <div class="text-center">
      <i :class="`bi ${icon} display-1 text-muted mb-3`"></i>
      <h3 class="text-muted">{{ title }}</h3>
      <p class="text-muted mb-4">{{ message }}</p>
      <router-link v-if="actionRoute" :to="actionRoute" class="btn btn-primary">
        {{ actionText }}
      </router-link>
      <button v-else type="button" class="btn btn-primary" @click="$emit('action')">
        {{ actionText }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineEmits(["action"]);

defineProps({
  icon: {
    type: String,
    default: "bi-inbox",
  },
  title: {
    type: String,
    default: "Nothing to show",
  },
  message: {
    type: String,
    default: "No items available at the moment.",
  },
  actionText: {
    type: String,
    default: "Go Shopping",
  },
  actionRoute: {
    type: String,
    default: "/products",
  },
});
</script>

<style scoped>
.empty-state {
  min-height: 400px;
}

.display-1 {
  font-size: 4rem;
  opacity: 0.5;
}

h3 {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

p {
  font-size: 1rem;
  line-height: 1.5;
}
</style>
