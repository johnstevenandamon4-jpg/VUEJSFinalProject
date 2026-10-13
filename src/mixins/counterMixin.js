export const counterMixin = {
  data() {
    return {
      count: 0
    }
  },

  methods: {
    increase() {
      this.count++
    },
    decrease() {
      this.count--
    },
    reset() {
      this.count = 0
    }
  }
}