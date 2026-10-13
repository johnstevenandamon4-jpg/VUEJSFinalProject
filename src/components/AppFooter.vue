<script setup>
const year = new Date().getFullYear()
const vueLink = 'https://vuejs.org'
</script>

<template>
  <footer class="foot">
    Daily Spend Management {{ year }} · built with
    <a :href="vueLink" target="_blank" rel="noopener">Vue 3</a>
  </footer>
</template>

<style scoped>
.foot {
  text-align: center;
  color: var(--ink-soft);
  padding: 24px 12px 36px;
  font-size: 0.9rem;
}
.foot a { color: var(--brand); font-weight: 700; }
</style>