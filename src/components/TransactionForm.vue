<script setup>
import { ref, watch } from 'vue'
import { CATEGORIES } from '../composables/useFinance'
import { todayString } from '../composables/useFormat'

const props = defineProps({
  transaction: { type: Object, default: null },
  accounts: { type: Array, default: () => [] }
})

const emit = defineEmits(['save', 'cancel'])

const accountId = ref('')
const title = ref('')
const amount = ref('')
const type = ref('Expense')
const category = ref('Food')
const date = ref(todayString())
const note = ref('')

watch(() => props.transaction, (t) => {
  if (t) {
    accountId.value = t.accountId
    title.value = t.title
    amount.value = t.amount
    type.value = t.type
    category.value = t.category
    date.value = t.date
    note.value = t.note
  } else {
    accountId.value = props.accounts[0]?.id ?? ''
    title.value = ''
    amount.value = ''
    type.value = 'Expense'
    category.value = 'Food'
    date.value = todayString()
    note.value = ''
  }
}, { immediate: true })

function submitForm() {
  const data = {
    ...props.transaction,        
    accountId: accountId.value,
    title: title.value.trim(),
    amount: Number(amount.value),
    type: type.value,
    category: category.value,
    date: date.value,
    note: note.value
  }
  console.log('Transaction form submitted:', data)
  emit('save', data)
}
</script>

<template>
  <div class="panel mb-4">
    <span class="lesson-tag">Forms + Props + Emits</span>
    <h3 class="panel-title">{{ transaction ? 'Edit transaction' : 'Add a transaction' }}</h3>

    <p v-if="accounts.length === 0" class="empty">
      You need an account first.
      <RouterLink :to="{ name: 'Accounts' }">Go to Accounts</RouterLink>
    </p>

    <form @submit.prevent="submitForm">
      <div class="mb-3">
        <label class="form-label">Account</label>
        <select v-model="accountId" class="form-select" required>
          <option v-for="a in accounts" :key="a.id" :value="a.id">
            {{ a.name }} ({{ a.provider }})
          </option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Title</label>
        <input v-model="title" type="text" class="form-control"
          placeholder="e.g. Lunch" required maxlength="60" />
      </div>

      <div class="row">
        <div class="col-6 mb-3">
          <label class="form-label">Amount (₱)</label>
          <input v-model="amount" type="number" min="0.01" step="0.01"
            class="form-control" required />
        </div>
        <div class="col-6 mb-3">
          <label class="form-label">Date</label>
          <input v-model="date" type="date" class="form-control" required />
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Type</label>
        <div class="choice-row">
          <label class="choice"><input type="radio" value="Expense" v-model="type" /> Expense</label>
          <label class="choice"><input type="radio" value="Income" v-model="type" /> Income</label>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Category</label>
        <select v-model="category" class="form-select">
          <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Note</label>
        <textarea v-model="note" class="form-control" rows="2"></textarea>
      </div>

      <div class="d-flex gap-2">
        <button type="submit" class="btn-brand" :disabled="accounts.length === 0">
          {{ transaction ? 'Update' : 'Add transaction' }}
        </button>
        <button v-if="transaction" type="button" class="btn-ghost" @click="emit('cancel')">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>