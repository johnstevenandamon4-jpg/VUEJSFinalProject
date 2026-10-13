<script setup>
import { ref, watch } from 'vue'
import { PROVIDERS } from '../composables/useFinance'

const props = defineProps({
  account: { type: Object, default: null }
})

const emit = defineEmits(['save', 'cancel'])

const provider = ref('Landbank')
const name = ref('')
const type = ref('Bank')
const openingBalance = ref('')
const includeInTotal = ref(true)

watch(() => props.account, (a) => {
  if (a) {
    provider.value = a.provider
    name.value = a.name
    type.value = a.type
    openingBalance.value = a.openingBalance
    includeInTotal.value = a.includeInTotal !== false
  } else {
    provider.value = 'Landbank'
    name.value = ''
    type.value = 'Bank'
    openingBalance.value = ''
    includeInTotal.value = true
  }
}, { immediate: true })

function submitForm() {
  const data = {
    ...props.account,          
    provider: provider.value,
    name: name.value.trim(),
    type: type.value,
    openingBalance: Number(openingBalance.value),
    includeInTotal: includeInTotal.value
  }
  console.log('Account form submitted:', data)
  emit('save', data)
}
</script>

<template>
  <div class="panel mb-4">
    <span class="lesson-tag">Forms + Props + Emits</span>
    <h3 class="panel-title">{{ account ? 'Edit account' : 'Add an account' }}</h3>

    <form @submit.prevent="submitForm">
      <div class="mb-3">
        <label class="form-label">Provider</label>
        <select v-model="provider" class="form-select">
          <option v-for="p in PROVIDERS" :key="p" :value="p">{{ p }}</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Account name</label>
        <input v-model="name" type="text" class="form-control"
          placeholder="e.g. My GCash" required maxlength="40" />
      </div>

      <div class="mb-3">
        <label class="form-label">Type</label>
        <div class="choice-row">
          <label class="choice"><input type="radio" value="Bank" v-model="type" /> Bank</label>
          <label class="choice"><input type="radio" value="E-Wallet" v-model="type" /> E-Wallet</label>
          <label class="choice"><input type="radio" value="Cash" v-model="type" /> Cash</label>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Opening balance (₱)</label>
        <input v-model="openingBalance" type="number" min="0" step="0.01"
          class="form-control" placeholder="0.00" required />
      </div>

      <div class="mb-3">
        <label class="choice">
          <input type="checkbox" v-model="includeInTotal" /> Include in total balance
        </label>
      </div>

      <div class="d-flex gap-2">
        <button type="submit" class="btn-brand">
          {{ account ? 'Update account' : 'Add account' }}
        </button>
        <button v-if="account" type="button" class="btn-ghost" @click="emit('cancel')">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>