import { formatPeso } from '../composables/useFormat'

export const currencyMixin = {
  methods: {
    peso(value) {
      return formatPeso(value)
    }
  }
}