<script setup>
import { useCounter } from '../composables/useCounter'

const { count: firstCount, increase: increaseFirst } = useCounter()
const { count: secondCount, increase: increaseSecond } = useCounter()
</script>

<template>
  <div class="d-flex gap-4 flex-wrap">
    <div>
      <h4>First: {{ firstCount }}</h4>
      <button class="btn-brand" @click="increaseFirst">+</button>
    </div>
    <div>
      <h4>Second: {{ secondCount }}</h4>
      <button class="btn-brand" @click="increaseSecond">+</button>
    </div>
  </div>
</template>