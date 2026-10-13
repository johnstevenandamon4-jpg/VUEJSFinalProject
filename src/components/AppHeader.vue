<template>
  <header class="bar">
    <div class="bar-inner">
      <RouterLink class="brand" to="/">
        <span class="coin">₱</span>
        <span>Daily Spend</span>
      </RouterLink>

      <nav class="links">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink :to="{ name: 'Accounts' }">Accounts</RouterLink>
        <RouterLink :to="{ name: 'Transactions' }">Transactions</RouterLink>
        <RouterLink :to="{ name: 'Reports' }">Reports</RouterLink>
        <RouterLink :to="{ name: 'Lab' }">Vue Lab</RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.bar {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #fff;
  border-bottom: 1px solid var(--line);
}
.bar-inner {
  max-width: 1080px;
  margin: 0 auto;
  padding: 10px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  font-size: 1.1rem;
  color: var(--ink);
  text-decoration: none;
}
.coin {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--brand);
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 800;
}
.links { display: flex; gap: 4px; flex-wrap: wrap; }
.links a {
  color: var(--ink-soft);
  text-decoration: none;
  font-weight: 700;
  padding: 7px 14px;
  border-radius: 999px;
}
.links a:hover { background: #f1f4f8; }
.links a.router-link-exact-active {
  background: var(--brand);
  color: #fff;
}
</style>