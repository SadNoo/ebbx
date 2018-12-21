<template>
  <portal to="peek-preview">
    <span class="peek" v-if="image && enabled" :style="{
      backgroundImage: `url(${image.src})`,
      backgroundPosition: `${Math.floor(timeProgress * 100) * -thumbnailWidth}px`,
      backgroundSize: `${thumbnailWidth * 100}px ${thumbnailHeight}px`,
      height: `${thumbnailHeight}px`,
      left: peekLeft,
      opacity: visible ? 0 : 1,
      width: `${thumbnailWidth}px`,
      zIndex: 100,
    }" />
  </portal>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'peek-preview',
  props: {
    enabled: {
      type: Boolean,
      required: true,
    },
    image: {
      type: HTMLElement,
      required: false,
    },
    timeProgress: {
      type: Number,
      required: false,
    },
    sliderRef: {
      type: Object,
      required: false,
    },
    visible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      thumbnailWidth: null,
      thumbnailHeight: null,
      sliderRect: null,
      rectUpdateListener: null,
    }
  },
  computed: {
    peekLeft() {
      const { width } = this.sliderRect
      let left = this.timeProgress * width
      left -= this.thumbnailWidth / 2
      left = Math.max(0, left)
      left = Math.min(width - this.thumbnailWidth, left)
      return `${left}px`
    },
  },
  mounted() {
    this.rectUpdateListener = _.debounce(() => {
      this.sliderRect = this.sliderRef.$refs.slider.getBoundingClientRect()
    }, 250)
    window.addEventListener('resize', this.rectUpdateListener)
  },
  watch: {
    image() {
      if (!this.image) {
        return
      }
      const { width, height } = this.image
      const ratio = height / (width / 100)
      this.thumbnailWidth = 108
      this.thumbnailHeight = this.thumbnailWidth * ratio
      this.sliderRect = this.sliderRef.$refs.slider.getBoundingClientRect()
    },
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.rectUpdateListener)
  },
}
</script>

<style lang="scss" scoped>
.peek {
  background: none no-repeat;
  border-radius: 3px 3px 0 0;
  bottom: calc(1rem + 20px + 4px);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .5);
  pointer-events: none;
  position: absolute;
  transition: opacity .25s;
}
</style>
