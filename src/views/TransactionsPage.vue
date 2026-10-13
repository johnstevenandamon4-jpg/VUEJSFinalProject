<script setup>
import { ref, computed } from 'vue'
import { useFinance } from '../composables/useFinance'
import TransactionForm from '../components/TransactionForm.vue'
import TransactionItem from '../components/TransactionItem.vue'

const {
  accounts, transactions, accountName,
  addTransaction, updateTransaction, deleteTransaction
} = useFinance()

const editingTransaction = ref(null)
const formKey = ref(0)
const message = ref({ text: '', kind: 'ok' })

const filterAccount = ref('All')
const filterType = ref('All')
const search = ref('')

const filteredTransactions = computed(() =>
  [...transactions.value]
    .filter(t => filterAccount.value === 'All' || t.accountId === filterAccount.value)
    .filter(t => filterType.value === 'All' || t.type === filterType.value)
    .filter(t => t.title.toLowerCase().includes(search.value.toLowerCase()))
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
)

function show(result, okText) {
  message.value = result.ok
    ? { text: okText, kind: 'ok' }
    : { text: result.message, kind: 'error' }
}

function handleSave(data) {
  const result = data.id ? updateTransaction(data) : addTransaction(data)
  show(result, data.id ? 'Transaction updated.' : 'Transaction added.')
  if (result.ok) {
    editingTransaction.value = null
    formKey.value++
  }
}

function startEdit(transaction) {
  editingTransaction.value = transaction
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function cancelEdit() {
  editingTransaction.value = null
  formKey.value++
}

function handleDelete(id) {
  if (!confirm('Delete this transaction?')) return
  const result = deleteTransaction(id)
  show(result, 'Transaction deleted.')
  if (result.ok && editingTransaction.value?.id === id) cancelEdit()
}
</script>

<template>
  <div class="page">
    <h2 class="page-title">Transactions</h2>
    <p class="page-sub">Record what you spend and earn. Each entry belongs to one account.</p>

    <div v-if="message.text" class="notice" :class="message.kind">
      {{ message.text }}
    </div>

    <div class="row g-4">
      <div class="col-lg-5">
        <TransactionForm :key="formKey" :transaction="editingTransaction"
          :accounts="accounts" @save="handleSave" @cancel="cancelEdit" />
      </div>

      <div class="col-lg-7">
        <div class="d-flex gap-2 mb-3 flex-wrap">
          <input v-model="search" type="text" class="form-control w-auto flex-grow-1"
            placeholder="Search by title" />

          <select v-model="filterAccount" class="form-select w-auto">
            <option value="All">All accounts</option>
            <option v-for="a in accounts" :key="a.id" :value="a.id">{{ a.name }}</option>
          </select>

          <select v-model="filterType" class="form-select w-auto">
            <option value="All">All types</option>
            <option value="Expense">Expense</option>
            <option value="Income">Income</option>
          </select>
        </div>

        <p v-if="filteredTransactions.length === 0" class="empty">
          No transactions found.
        </p>

        <div class="d-flex flex-column gap-2">
          <TransactionItem v-for="t in filteredTransactions" :key="t.id"
            :transaction="t" :accountName="accountName(t.accountId)"
            :isEditing="editingTransaction?.id === t.id"
            @edit="startEdit" @delete="handleDelete" />
        </div>
      </div>
    </div>
  </div>
</template>