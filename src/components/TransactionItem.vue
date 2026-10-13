<script setup>
import { formatPeso } from '../composables/useFormat'

const props = defineProps({
  transaction: Object,
  accountName: String,
  isEditing: Boolean
})

const emit = defineEmits(['edit', 'delete'])

function editTransaction() {
  emit('edit', props.transaction)
}

function deleteTransaction() {
  emit('delete', props.transaction.id)
}
</script>

<template>
  <div class="item" :class="{ editing: isEditing }">
    <div class="icon" :class="{ in: transaction.type === 'Income', out: transaction.type === 'Expense' }">
      {{ transaction.type === 'Income' ? '+' : '−' }}
    </div>

    <div class="info">
      <strong>{{ transaction.title }}</strong>
      <div class="meta">
        {{ transaction.category }} · {{ transaction.date }} · {{ accountName }}
      </div>
      <div v-if="transaction.note" class="meta">{{ transaction.note }}</div>
    </div>

    <div class="money" :class="{ in: transaction.type === 'Income', out: transaction.type === 'Expense' }">
      {{ transaction.type === 'Income' ? '+' : '−' }}{{ formatPeso(transaction.amount) }}
    </div>

    <div class="buttons">
      <!-- transfers can only be deleted, not edited -->
      <button v-if="!transaction.transferId" class="btn-ghost small-btn" @click="editTransaction">Edit</button>
      <button class="btn-danger-soft small-btn" @click="deleteTransaction">Delete</button>
    </div>
  </div>
</template>

<style scoped>
.item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 12px;
  flex-wrap: wrap;
}
.item.editing { border-color: var(--brand); background: #f1f7fd; }
.icon {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-weight: 800;
  flex-shrink: 0;
}
.icon.in { background: #e4f4ea; color: var(--income); }
.icon.out { background: #fdeee7; color: var(--expense); }
.info { flex: 1; min-width: 160px; }
.meta { font-size: 0.85rem; color: var(--ink-soft); }
.buttons { display: flex; gap: 6px; }
.small-btn { padding: 4px 12px; font-size: 0.85rem; }
</style>