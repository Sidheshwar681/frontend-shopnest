<template>
  <div class="toast-region" aria-live="polite" aria-atomic="true">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="app-toast"
      :class="`toast-${toast.type}`"
      role="status"
    >
      <div class="toast-icon">
        <i :class="toastIcon(toast.type)"></i>
      </div>
      <div class="toast-copy">
        <strong v-if="toast.title">{{ toast.title }}</strong>
        <span>{{ toast.message }}</span>
      </div>
      <button class="toast-close" type="button" @click="removeToast(toast.id)" aria-label="Close">
        <i class="bi bi-x"></i>
      </button>
    </div>
  </div>

  <div v-if="confirmation" class="confirm-backdrop" role="presentation">
    <div class="confirm-dialog" role="dialog" aria-modal="true" :aria-labelledby="`confirm-${confirmation.id}`">
      <div class="confirm-icon" :class="`confirm-${confirmation.type}`">
        <i :class="toastIcon(confirmation.type)"></i>
      </div>
      <div>
        <h2 :id="`confirm-${confirmation.id}`">{{ confirmation.title }}</h2>
        <p>{{ confirmation.message }}</p>
      </div>
      <div class="confirm-actions">
        <button type="button" class="btn btn-light border" @click="finishConfirm(false)">
          {{ confirmation.cancelText }}
        </button>
        <button type="button" class="btn btn-primary" @click="finishConfirm(true)">
          {{ confirmation.confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";

const toasts = ref([]);
const confirmation = ref(null);
const timers = new Map();

const toastIcon = (type) => {
  const icons = {
    success: "bi bi-check-circle-fill",
    danger: "bi bi-exclamation-circle-fill",
    warning: "bi bi-exclamation-triangle-fill",
    info: "bi bi-info-circle-fill",
  };

  return icons[type] || icons.info;
};

const removeToast = (id) => {
  toasts.value = toasts.value.filter((toast) => toast.id !== id);
  clearTimeout(timers.get(id));
  timers.delete(id);
};

const onNotify = (event) => {
  const toast = event.detail;
  toasts.value = [toast, ...toasts.value].slice(0, 4);

  timers.set(
    toast.id,
    setTimeout(() => removeToast(toast.id), toast.duration)
  );
};

const onConfirm = (event) => {
  confirmation.value = event.detail;
};

const finishConfirm = (confirmed) => {
  if (!confirmation.value) {
    return;
  }

  window.dispatchEvent(
    new CustomEvent("app-confirm-result", {
      detail: { id: confirmation.value.id, confirmed },
    })
  );
  confirmation.value = null;
};

onMounted(() => {
  window.addEventListener("app-notify", onNotify);
  window.addEventListener("app-confirm", onConfirm);
});

onBeforeUnmount(() => {
  window.removeEventListener("app-notify", onNotify);
  window.removeEventListener("app-confirm", onConfirm);
  timers.forEach((timer) => clearTimeout(timer));
});
</script>

<style scoped>
.toast-region {
  position: fixed;
  top: 88px;
  right: 18px;
  z-index: 1100;
  display: grid;
  gap: 0.75rem;
  width: min(360px, calc(100vw - 24px));
}

.app-toast {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.75rem;
  align-items: start;
  padding: 0.9rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-left: 4px solid #2563eb;
  border-radius: 8px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.16);
}

.toast-success {
  border-left-color: #16a34a;
}

.toast-danger {
  border-left-color: #dc2626;
}

.toast-warning {
  border-left-color: #f59e0b;
}

.toast-icon {
  color: #2563eb;
  font-size: 1.15rem;
}

.toast-success .toast-icon {
  color: #16a34a;
}

.toast-danger .toast-icon {
  color: #dc2626;
}

.toast-warning .toast-icon {
  color: #f59e0b;
}

.toast-copy {
  display: grid;
  gap: 0.15rem;
  color: #374151;
}

.toast-copy strong {
  color: #111827;
}

.toast-close {
  border: 0;
  background: transparent;
  color: #6b7280;
  line-height: 1;
}

.confirm-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.42);
}

.confirm-dialog {
  width: min(420px, 100%);
  display: grid;
  gap: 1rem;
  padding: 1.25rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.28);
}

.confirm-icon {
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #fff7ed;
  color: #f59e0b;
  font-size: 1.25rem;
}

.confirm-danger {
  background: #fef2f2;
  color: #dc2626;
}

.confirm-dialog h2 {
  margin: 0 0 0.35rem;
  font-size: 1.2rem;
  font-weight: 800;
}

.confirm-dialog p {
  margin: 0;
  color: #6b7280;
}

.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

@media (max-width: 576px) {
  .toast-region {
    top: 76px;
    right: 12px;
  }
}
</style>
