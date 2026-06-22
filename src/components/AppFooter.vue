<template>
  <footer class="bg-dark text-light py-5 mt-5">
    <div class="container">
      <div class="row g-4">
        <!-- Company Info -->
        <div class="col-md-3">
          <h5 class="fw-bold mb-3">
            <i class="bi bi-shop me-2" style="color: #ff9900"></i>ShopNest
          </h5>
          <p class="text-muted small">
            Your one-stop online shopping destination. Shop millions of products with great deals.
          </p>
          <div class="d-flex gap-2">
            <a href="#" class="text-light"><i class="bi bi-facebook"></i></a>
            <a href="#" class="text-light"><i class="bi bi-twitter"></i></a>
            <a href="#" class="text-light"><i class="bi bi-instagram"></i></a>
            <a href="#" class="text-light"><i class="bi bi-linkedin"></i></a>
          </div>
        </div>

        <!-- Useful Links -->
        <div class="col-md-3">
          <h6 class="fw-bold mb-3">Quick Links</h6>
          <ul class="list-unstyled small">
            <li><router-link to="/" class="text-decoration-none text-light-hover">Home</router-link></li>
            <li><router-link to="/products" class="text-decoration-none text-light-hover">Products</router-link></li>
            <li><router-link to="/orders" class="text-decoration-none text-light-hover">My Orders</router-link></li>
            <li><a href="#" class="text-decoration-none text-light-hover">Contact Us</a></li>
            <li><a href="#" class="text-decoration-none text-light-hover">About Us</a></li>
          </ul>
        </div>

        <!-- Customer Service -->
        <div class="col-md-3">
          <h6 class="fw-bold mb-3">Customer Service</h6>
          <ul class="list-unstyled small">
            <li><a href="#" class="text-decoration-none text-light-hover">FAQ</a></li>
            <li><a href="#" class="text-decoration-none text-light-hover">Shipping Info</a></li>
            <li><a href="#" class="text-decoration-none text-light-hover">Returns</a></li>
            <li><a href="#" class="text-decoration-none text-light-hover">Track Order</a></li>
            <li><a href="#" class="text-decoration-none text-light-hover">Support</a></li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div class="col-md-3">
          <h6 class="fw-bold mb-3">Contact Info</h6>
          <p class="small text-muted">
            <i class="bi bi-telephone me-2"></i>+1 (555) 123-4567
          </p>
          <p class="small text-muted">
            <i class="bi bi-envelope me-2"></i>support@shopnest.com
          </p>
          <p class="small text-muted">
            <i class="bi bi-geo-alt me-2"></i>123 Commerce St, City, Country
          </p>
        </div>
      </div>

      <hr class="bg-secondary my-4" />

      <!-- Bottom Section -->
      <div class="row">
        <div class="col-md-6">
          <p class="small text-muted">
            &copy; 2026 ShopNest. All rights reserved.
          </p>
        </div>
        <div class="col-md-6 text-end">
          <p class="small text-muted">
            <a href="#" class="text-light-hover text-decoration-none">Privacy Policy</a> |
            <a href="#" class="text-light-hover text-decoration-none">Terms & Conditions</a> |
            <a href="#" class="text-light-hover text-decoration-none">Cookie Policy</a>
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
a.text-light-hover {
  transition: color 0.2s;
  color: #ccc !important;
}

a.text-light-hover:hover {
  color: #ff9900 !important;
}

footer {
  margin-top: auto;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
}

@media (max-width: 768px) {
  .col-md-3,
  .col-md-6 {
    margin-bottom: 1.5rem;
  }

  .text-end {
    text-align: left !important;
  }
}
</style>
