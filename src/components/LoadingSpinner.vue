<template>
  <div v-if="loading" class="d-flex justify-content-center align-items-center py-5">
    <div class="spinner-container">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3 text-muted">{{ message || "Loading..." }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: true,
  },
  message: {
    type: String,
    default: "Loading...",
  },
});
</script>

<style scoped>
.spinner-container {
  text-align: center;
  padding: 2rem;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
  border-width: 0.3em;
}

p {
  font-size: 0.9rem;
  letter-spacing: 0.5px;
}
</style>
