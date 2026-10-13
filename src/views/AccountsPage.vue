<script setup>
import { ref } from 'vue'
import { useFinance } from '../composables/useFinance'
import AccountForm from '../components/AccountForm.vue'
import AccountCard from '../components/AccountCard.vue'
import TransferForm from '../components/TransferForm.vue'

const {
  accounts, transactions, balanceOf,
  addAccount, updateAccount, deleteAccount, transfer
} = useFinance()

const editingAccount = ref(null)
const formKey = ref(0)   
const message = ref({ text: '', kind: 'ok' })

function show(result, okText) {
  message.value = result.ok
    ? { text: okText, kind: 'ok' }
    : { text: result.message, kind: 'error' }
}

function handleSaveAccount(data) {
  const result = data.id ? updateAccount(data) : addAccount(data)
  show(result, data.id ? 'Account updated.' : 'Account added.')
  if (result.ok) {
    editingAccount.value = null
    formKey.value++
  }
}

function startEdit(account) {
  editingAccount.value = account
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function cancelEdit() {
  editingAccount.value = null
  formKey.value++
}

function handleDelete(id) {
  const count = transactions.value.filter(t => t.accountId === id).length
  if (!confirm(`Delete this account and its ${count} transaction(s)?`)) return

  deleteAccount(id)
  if (editingAccount.value?.id === id) editingAccount.value = null
  formKey.value++
  show({ ok: true }, 'Account deleted.')
}

function handleTransfer(data) {
  const result = transfer(data)
  show(result, 'Transfer complete.')
  if (result.ok) formKey.value++
}
</script>

<template>
  <div class="page">
    <h2 class="page-title">Accounts</h2>
    <p class="page-sub">Add your bank accounts and e-wallets, then move money between them.</p>

    <div v-if="message.text" class="notice" :class="message.kind">
      {{ message.text }}
    </div>

    <div class="row g-4">
      <div class="col-lg-5">
        <AccountForm :key="'a' + formKey" :account="editingAccount"
          @save="handleSaveAccount" @cancel="cancelEdit" />

        <TransferForm :key="'t' + formKey" :accounts="accounts"
          @transfer="handleTransfer" />
      </div>

      <div class="col-lg-7">
        <p v-if="accounts.length === 0" class="empty">
          No accounts yet. Add one on the left, for example Landbank or GCash.
        </p>

        <div class="row g-3">
          <div v-for="a in accounts" :key="a.id" class="col-md-6">
            <AccountCard :account="a" :balance="balanceOf(a.id)"
              @edit="startEdit" @delete="handleDelete" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>