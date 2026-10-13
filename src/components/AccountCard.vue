<script>
import { currencyMixin } from '../mixins/currencyMixin'
import { providerColor } from '../composables/useFinance'

export default {
  mixins: [currencyMixin],

  props: {
    account: Object,
    balance: Number
  },

  emits: ['edit', 'delete'],

  computed: {
    color() {
      return providerColor(this.account.provider)
    },
    providerLabel() {
      return this.account.provider.toUpperCase()
    },
    isLow() {
      return this.balance < 100
    }
  },

  methods: {
    editAccount() {
      this.$emit('edit', this.account)
    },
    deleteAccount() {
      this.$emit('delete', this.account.id)
    }
  }
}
</script>

<template>
  <div class="wallet" :style="{ background: color }">
    <div>
      <small class="provider">{{ providerLabel }} · {{ account.type }}</small>
      <h5 class="name">{{ account.name }}</h5>
    </div>

    <div>
      <div class="balance money">{{ peso(balance) }}</div>
      <small v-if="isLow" class="flag">Low balance</small>
      <small v-if="account.includeInTotal === false" class="flag">Not counted in total</small>

      <div class="actions">
        <button class="wallet-btn" @click="editAccount">Edit</button>
        <button class="wallet-btn" @click="deleteAccount">Delete</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wallet {
  position: relative;
  overflow: hidden;
  color: #fff;
  border-radius: 16px;
  padding: 20px;
  min-height: 190px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.wallet::after {
  content: '';
  position: absolute;
  right: -34px;
  top: -34px;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}
.provider { opacity: 0.85; font-weight: 700; letter-spacing: 0.02em; }
.name { margin: 4px 0 0; font-weight: 800; }
.balance { font-size: 1.7rem; }
.flag {
  display: block;
  margin-top: 2px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 1px 8px;
  width: fit-content;
}
.actions { display: flex; gap: 8px; margin-top: 12px; position: relative; z-index: 1; }
.wallet-btn {
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 8px;
  padding: 4px 14px;
  font-weight: 700;
}
.wallet-btn:hover { background: rgba(255, 255, 255, 0.3); }
</style>