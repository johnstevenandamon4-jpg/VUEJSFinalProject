<script>
import { counterMixin } from '../mixins/counterMixin'

export default {
  mixins: [counterMixin]
}
</script>

<template>
  <div>
    <h4>Count: {{ count }}</h4>
    <div class="d-flex gap-2">
      <button class="btn-brand" @click="increase">Increase</button>
      <button class="btn-ghost" @click="decrease">Decrease</button>
      <button class="btn-ghost" @click="reset">Reset</button>
    </div>
  </div>
</template>