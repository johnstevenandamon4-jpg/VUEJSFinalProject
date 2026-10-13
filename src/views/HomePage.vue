<script setup>
import { computed } from 'vue'
import { useFinance, providerColor } from '../composables/useFinance'
import { formatPeso } from '../composables/useFormat'

const { accounts, transactions, totalBalance, balanceOf, accountName } = useFinance()

const recent = computed(() =>
  [...transactions.value]
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
    .slice(0, 5)
)
</script>

<template>
  <div class="page">
    <section class="hero">
      <p class="hero-label">Money left across your accounts</p>
      <h1 class="hero-amount money">{{ formatPeso(totalBalance) }}</h1>
      <p v-if="accounts.length === 0" class="hero-note">
        Start by adding an account like Landbank or GCash.
      </p>
      <p v-else class="hero-note">
        {{ accounts.length }} account(s) · {{ transactions.length }} transaction(s)
      </p>

      <div class="d-flex gap-2 flex-wrap mt-3">
        <RouterLink class="hero-btn" :to="{ name: 'Accounts' }">Manage accounts</RouterLink>
        <RouterLink class="hero-btn ghost" :to="{ name: 'Transactions' }">Add a transaction</RouterLink>
      </div>
    </section>

    <div class="row g-4 mt-1">
      <div class="col-lg-6">
        <div class="panel h-100">
          <h3 class="panel-title">Your accounts</h3>
          <p v-if="accounts.length === 0" class="empty">
            No accounts yet.
            <RouterLink :to="{ name: 'Accounts' }">Add your first account</RouterLink>
          </p>
          <div v-else class="d-flex flex-column gap-2">
            <div v-for="a in accounts" :key="a.id" class="row-line">
              <span class="dot" :style="{ background: providerColor(a.provider) }"></span>
              <span class="grow">{{ a.name }} <small class="text-muted">({{ a.provider }})</small></span>
              <span class="money">{{ formatPeso(balanceOf(a.id)) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="panel h-100">
          <h3 class="panel-title">Recent transactions</h3>
          <p v-if="recent.length === 0" class="empty">Nothing yet.</p>
          <div v-else class="d-flex flex-column gap-2">
            <div v-for="t in recent" :key="t.id" class="row-line">
              <span class="grow">
                {{ t.title }}
                <small class="text-muted">({{ accountName(t.accountId) }})</small>
              </span>
              <span class="money" :class="{ in: t.type === 'Income', out: t.type === 'Expense' }">
                {{ t.type === 'Income' ? '+' : '−' }}{{ formatPeso(t.amount) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero {
  background: var(--ink);
  color: #fff;
  border-radius: 20px;
  padding: 34px;
}
.hero-label { margin: 0; opacity: 0.75; font-weight: 600; }
.hero-amount { font-size: clamp(2.2rem, 7vw, 3.6rem); margin: 6px 0; }
.hero-note { margin: 0; opacity: 0.75; }
.hero-btn {
  background: #fff;
  color: var(--ink);
  border-radius: 10px;
  padding: 10px 18px;
  font-weight: 800;
  text-decoration: none;
}
.hero-btn.ghost { background: transparent; color: #fff; border: 1px solid rgba(255, 255, 255, 0.45); }
.row-line { display: flex; align-items: center; gap: 10px; padding: 6px 0; border-bottom: 1px solid var(--line); }
.row-line:last-child { border-bottom: 0; }
.dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
.grow { flex: 1; }
</style>