<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import CounterOptions from '../components/CounterOptions.vue'
import CounterComposable from '../components/CounterComposable.vue'

const program = 'bachelor of science in information technology'
const price = 120
const quantity = 3

const color = ref('#0f4c81')

const isActive = ref(true)

const isDisabled = ref(true)

const website = 'https://vuejs.org'

const image =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="70">' +
    '<rect width="160" height="70" rx="12" fill="#0f4c81"/>' +
    '<text x="80" y="42" font-size="22" fill="#fff" text-anchor="middle" font-family="Arial">₱ Vue</text>' +
    '</svg>'
  )

const message = ref('Hello World!')
const count = ref(0)
function increase() {
  count.value++
}

// watch
const watchNote = ref('Click the counter to trigger the watcher.')
watch(count, (newValue, oldValue) => {
  watchNote.value = `count changed from ${oldValue} to ${newValue}`
})

const visit = reactive({ total: 0 })
onMounted(() => {
  visit.total = Number(localStorage.getItem('dsm-visits') || 0) + 1
  localStorage.setItem('dsm-visits', visit.total)
})
</script>

<template>
  <div class="page">
    <h2 class="page-title">Vue Lab</h2>
    <p class="page-sub">Small demos of the lessons from class, each one labeled.</p>

    <div class="row g-4">
      <div class="col-md-6">
        <div class="panel h-100">
          <span class="lesson-tag">Lesson: Interpolation</span>
          <h3 class="panel-title">{{ program.toUpperCase() }}</h3>
          <p class="mb-0">Total: {{ price * quantity }} (price × quantity)</p>
        </div>
      </div>

      <div class="col-md-6">
        <div class="panel h-100">
          <span class="lesson-tag">Lesson: :style and :class binding</span>
          <h3 class="panel-title" :style="{ color: color }">Welcome to the World!</h3>
          <p :class="{ active: isActive }">This text uses an object class binding.</p>
          <button class="btn-ghost" @click="isActive = !isActive">Toggle class</button>
          <input v-model="color" type="color" class="ms-2" />
        </div>
      </div>

      <div class="col-md-6">
        <div class="panel h-100">
          <span class="lesson-tag">Lesson: :disabled, :href, :src</span>
          <div class="d-flex gap-2 align-items-center flex-wrap mb-3">
            <button class="btn-brand" :disabled="isDisabled">Click me!</button>
            <button class="btn-ghost" @click="isDisabled = !isDisabled">
              {{ isDisabled ? 'Enable' : 'Disable' }} button
            </button>
          </div>
          <a :href="website" target="_blank" rel="noopener">Visit Vue website</a>
          <div class="mt-3"><img :src="image" alt="Vue demo" /></div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="panel h-100">
          <span class="lesson-tag">Lesson: ref, @click, watch (Composition API)</span>
          <h3 class="panel-title">{{ message }}</h3>
          <button class="btn-ghost me-2" @click="message = 'This is a new message!'">Change message</button>
          <button class="btn-brand" @click="increase">Count: {{ count }}</button>
          <p class="text-muted mt-3 mb-0">{{ watchNote }}</p>
        </div>
      </div>

      <div class="col-md-6">
        <div class="panel h-100">
          <span class="lesson-tag">Lesson: reactive + onMounted</span>
          <h3 class="panel-title">Times you opened this page</h3>
          <p class="money mb-0" style="font-size: 2rem">{{ visit.total }}</p>
        </div>
      </div>

      <div class="col-md-6">
        <div class="panel h-100">
          <span class="lesson-tag">Lesson: Options API + Mixins</span>
          <h3 class="panel-title">counterMixin</h3>
          <CounterOptions />
        </div>
      </div>

      <div class="col-12">
        <div class="panel">
          <span class="lesson-tag">Lesson: Composables (two independent counters)</span>
          <h3 class="panel-title">useCounter()</h3>
          <CounterComposable />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.active { color: #c2410c; font-weight: bold; }
</style>