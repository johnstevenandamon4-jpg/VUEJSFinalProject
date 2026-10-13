<script setup>
import { ref } from 'vue'
import { todayString } from '../composables/useFormat'

const props = defineProps({
  accounts: { type: Array, default: () => [] }
})

const emit = defineEmits(['transfer'])

const fromId = ref(props.accounts[0]?.id ?? '')
const toId = ref(props.accounts[1]?.id ?? '')
const amount = ref('')
const date = ref(todayString())
const note = ref('')

function submitForm() {
  const data = {
    fromId: fromId.value,
    toId: toId.value,
    amount: Number(amount.value),
    date: date.value,
    note: note.value
  }
  console.log('Transfer submitted:', data)
  emit('transfer', data)
}
</script>

<template>
  <div class="panel">
    <span class="lesson-tag">Forms + :disabled</span>
    <h3 class="panel-title">Transfer money</h3>

    <p v-if="accounts.length < 2" class="empty">
      Add at least two accounts to move money between them (for example Landbank to GCash).
    </p>

    <form v-else @submit.prevent="submitForm">
      <div class="row">
        <div class="col-6 mb-3">
          <label class="form-label">From</label>
          <select v-model="fromId" class="form-select">
            <option v-for="a in accounts" :key="a.id" :value="a.id">{{ a.name }}</option>
          </select>
        </div>
        <div class="col-6 mb-3">
          <label class="form-label">To</label>
          <select v-model="toId" class="form-select">
            <option v-for="a in accounts" :key="a.id" :value="a.id">{{ a.name }}</option>
          </select>
        </div>
      </div>

      <p v-if="fromId === toId" class="text-danger small">Choose two different accounts.</p>

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
        <label class="form-label">Note</label>
        <textarea v-model="note" class="form-control" rows="2"></textarea>
      </div>

      <button type="submit" class="btn-brand" :disabled="fromId === toId">Transfer</button>
    </form>
  </div>
</template>