<script setup>
import { ref, computed } from 'vue'
import { useFinance } from '../composables/useFinance'
import { formatPeso } from '../composables/useFormat'

const { accounts, transactions, balanceOf, totalBalance } = useFinance()

const month = ref('')   
const scoped = computed(() =>
  transactions.value.filter(t =>
    !t.transferId && (month.value === '' || t.date.startsWith(month.value))
  )
)

const income = computed(() =>
  scoped.value.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0)
)

const expense = computed(() =>
  scoped.value.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0)
)

const byCategory = computed(() => {
  const totals = {}
  scoped.value
    .filter(t => t.type === 'Expense')
    .forEach(t => {
      totals[t.category] = (totals[t.category] || 0) + t.amount
    })

  return Object.entries(totals)
    .map(([category, total]) => ({
      category,
      total,
      percent: expense.value ? (total / expense.value) * 100 : 0
    }))
    .sort((a, b) => b.total - a.total)
})
</script>

<template>
  <div class="page">
    <h2 class="page-title">Reports</h2>
    <p class="page-sub">See where your money went and how much is left in each account.</p>

    <div class="mb-4 d-flex align-items-center gap-2 flex-wrap">
      <label class="form-label mb-0">Month</label>
      <input v-model="month" type="month" class="form-control w-auto" />
      <button class="btn-ghost" @click="month = ''">Show all time</button>
    </div>

    <div class="row g-3 mb-4">
      <div class="col-md-4">
        <div class="panel">
          <small class="text-muted">Income</small>
          <h4 class="money in mb-0">{{ formatPeso(income) }}</h4>
        </div>
      </div>
      <div class="col-md-4">
        <div class="panel">
          <small class="text-muted">Expenses</small>
          <h4 class="money out mb-0">{{ formatPeso(expense) }}</h4>
        </div>
      </div>
      <div class="col-md-4">
        <div class="panel">
          <small class="text-muted">Net</small>
          <h4 class="money mb-0" :class="{ in: income - expense >= 0, out: income - expense < 0 }">
            {{ formatPeso(income - expense) }}
          </h4>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-lg-7">
        <div class="panel h-100">
          <h3 class="panel-title">Where your money went</h3>
          <p v-if="byCategory.length === 0" class="empty">No expenses for this period.</p>

          <div v-for="row in byCategory" :key="row.category" class="mb-3">
            <div class="d-flex justify-content-between">
              <span class="fw-bold">{{ row.category }}</span>
              <span class="money">{{ formatPeso(row.total) }} ({{ row.percent.toFixed(0) }}%)</span>
            </div>
            <div class="bar"><div class="fill" :style="{ width: row.percent + '%' }"></div></div>
          </div>
        </div>
      </div>

      <div class="col-lg-5">
        <div class="panel h-100">
          <h3 class="panel-title">Balance per account</h3>
          <p v-if="accounts.length === 0" class="empty">No accounts yet.</p>

          <div v-for="a in accounts" :key="a.id" class="d-flex justify-content-between py-2 line">
            <span>{{ a.name }} <small class="text-muted">({{ a.provider }})</small></span>
            <span class="money">{{ formatPeso(balanceOf(a.id)) }}</span>
          </div>

          <div class="d-flex justify-content-between pt-3">
            <strong>Total</strong>
            <strong class="money">{{ formatPeso(totalBalance) }}</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bar { height: 10px; background: #e6ecf2; border-radius: 6px; margin-top: 4px; }
.fill { height: 100%; background: var(--brand); border-radius: 6px; }
.line { border-bottom: 1px solid var(--line); }
</style>