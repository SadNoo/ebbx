<template>
  <div class="wrapper" :style="style">
    <iframe
      frameBorder="0"
      :src="src"
      :style="style"
    />
  </div>
</template>

<script>
import { API_ROOT } from '@/api'

export default {
  name: 'ads',
  props: {
    type: {
      type: String,
      required: true,
    },
    size: {
      type: Object,
      required: true,
    },
  },
  computed: {
    src() {
      const { width, height } = this.size
      return `${API_ROOT.replace('_', 'ads')}/iframe?type=${this.type}#${width}x${height}`
    },
    style() {
      const { width, height } = this.size
      return {
        height: `${height}px`,
        width: `${width}px`,
      }
    },
  },
}
</script>

<style scoped>
.wrapper {
  user-select: none;
}
</style>
