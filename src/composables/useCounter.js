import { ref } from 'vue'

export function useCounter() {
  // REACTIVE STATE
  const count = ref(0)

  function increase() {
    count.value++
  }
  function decrease() {
    count.value--
  }
  function reset() {
    count.value = 0
  }

  return { count, increase, decrease, reset }
}