<template>
  <footer class="foot">
    <p>© {{ year }} Daily Spend Management</p>
    <p class="foot-subtitle">Manage your money. Track your progress.</p>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

<style scoped>
.foot {
  text-align: center;
  color: var(--ink-soft);
  padding: 24px 12px 36px;
  font-size: 0.9rem;
}

.foot p {
  margin: 0;
}

.foot-subtitle {
  margin-top: 6px !important;
  font-size: 0.8rem;
  opacity: 0.8;
}
</style>
