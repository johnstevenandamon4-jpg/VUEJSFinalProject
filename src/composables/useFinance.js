import { ref, computed, watch } from 'vue'

export const PROVIDERS = ['Landbank', 'GCash', 'Maya', 'BDO', 'BPI', 'Cash on hand', 'Other']
export const CATEGORIES = ['Food', 'Transport', 'School', 'Bills', 'Allowance', 'Savings', 'Other']

const PROVIDER_COLORS = {
  Landbank: '#0b7a3e',
  GCash: '#0a6cff',
  Maya: '#1f2937',
  BDO: '#0b2e6f',
  BPI: '#b3261e',
  'Cash on hand': '#9a6b12',
  Other: '#475569'
}

export function providerColor(provider) {
  return PROVIDER_COLORS[provider] || '#475569'
}

function readStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || []
  } catch {
    return []
  }
}

const accounts = ref(readStorage('dsm-accounts'))
const transactions = ref(readStorage('dsm-transactions'))

watch(accounts, (newValue) => {
  localStorage.setItem('dsm-accounts', JSON.stringify(newValue))
}, { deep: true })

watch(transactions, (newValue) => {
  localStorage.setItem('dsm-transactions', JSON.stringify(newValue))
}, { deep: true })

let idCounter = 0
function newId() {
  idCounter++
  return Date.now() * 100 + (idCounter % 100)
}

function balanceOf(accountId) {
  const account = accounts.value.find(a => a.id === accountId)
  if (!account) return 0

  const total = transactions.value
    .filter(t => t.accountId === accountId)
    .reduce(
      (sum, t) => (t.type === 'Income' ? sum + t.amount : sum - t.amount),
      account.openingBalance
    )

  return Math.round(total * 100) / 100
}

function tryChange(change, accountIds) {
  const backup = [...transactions.value]
  change()

  const ok = accountIds.every(id => balanceOf(id) >= 0)
  if (!ok) {
    transactions.value = backup
    return { ok: false, message: 'That would make the account balance go below ₱0.' }
  }
  return { ok: true }
}

export function useFinance() {

  function addAccount(data) {
    accounts.value.push({ id: newId(), ...data })
    return { ok: true }
  }

  function updateAccount(updated) {
    const index = accounts.value.findIndex(a => a.id === updated.id)
    if (index === -1) return { ok: false, message: 'Account not found.' }

    const old = accounts.value[index]
    accounts.value[index] = updated

    if (balanceOf(updated.id) < 0) {
      accounts.value[index] = old
      return { ok: false, message: 'That opening balance would make the account negative.' }
    }
    return { ok: true }
  }

  function deleteAccount(id) {
    const transferIds = transactions.value
      .filter(t => t.accountId === id && t.transferId)
      .map(t => t.transferId)

    transactions.value = transactions.value
      .filter(t => t.accountId !== id)
      .map(t => (transferIds.includes(t.transferId)
        ? { ...t, transferId: null, category: 'Other' }
        : t))

    accounts.value = accounts.value.filter(a => a.id !== id)
    return { ok: true }
  }


  // CREATE
  function addTransaction(data) {
    return tryChange(() => {
      transactions.value.push({ id: newId(), ...data })
    }, [data.accountId])
  }

  // UPDATE
  function updateTransaction(updated) {
    const old = transactions.value.find(t => t.id === updated.id)
    if (!old) return { ok: false, message: 'Transaction not found.' }

    return tryChange(() => {
      const index = transactions.value.findIndex(t => t.id === updated.id)
      transactions.value[index] = updated
    }, [old.accountId, updated.accountId])
  }

  function deleteTransaction(id) {
    const target = transactions.value.find(t => t.id === id)
    if (!target) return { ok: false, message: 'Transaction not found.' }

    const linked = target.transferId
      ? transactions.value.filter(t => t.transferId === target.transferId)
      : [target]

    const ids = linked.map(t => t.id)
    const accountIds = linked.map(t => t.accountId)

    return tryChange(() => {
      transactions.value = transactions.value.filter(t => !ids.includes(t.id))
    }, accountIds)
  }

  function transfer(data) {
    const from = accounts.value.find(a => a.id === data.fromId)
    const to = accounts.value.find(a => a.id === data.toId)

    if (!from || !to) return { ok: false, message: 'Choose two accounts.' }
    if (from.id === to.id) return { ok: false, message: 'Choose two different accounts.' }
    if (!(data.amount > 0)) return { ok: false, message: 'Enter an amount above 0.' }

    const transferId = newId()

    return tryChange(() => {
      transactions.value.push({
        id: newId(), transferId, accountId: from.id,
        title: `Transfer to ${to.name}`, amount: data.amount,
        type: 'Expense', category: 'Transfer', date: data.date, note: data.note
      })
      transactions.value.push({
        id: newId(), transferId, accountId: to.id,
        title: `Transfer from ${from.name}`, amount: data.amount,
        type: 'Income', category: 'Transfer', date: data.date, note: data.note
      })
    }, [from.id])
  }

  const totalBalance = computed(() =>
    accounts.value
      .filter(a => a.includeInTotal !== false)
      .reduce((sum, a) => sum + balanceOf(a.id), 0)
  )

  function accountName(id) {
    const account = accounts.value.find(a => a.id === id)
    return account ? account.name : 'Deleted account'
  }

  return {
    accounts, transactions, totalBalance,
    balanceOf, accountName,
    addAccount, updateAccount, deleteAccount,
    addTransaction, updateTransaction, deleteTransaction,
    transfer
  }
}