<template>
  <div
    class="plark"
    @mousewheel="handleMousewheel"
    @mousedown="onDown"
    @touchstart="onDown"
    @contextmenu="onEnd"
  >
    <div ref="inner" class="inner">
      <slot />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'plark',
  data() {
    return {
      offsetX: 0,

      previousMouseDownTime: 0,
      doubleClickDetected: false,

      lockingBrowserNavigation: false,
      lockBrowserNavigationTimeout: null,

      dragged: null,
      dragStartPosition: null,
      isDragging: null,
      scrollDirection: null,
      scrollDirectionResetTimer: null,

      ticker: null,
      timestamp: null,
      frame: null,
      target: null,
      amplitude: null,
      velocity: null,
    }
  },
  methods: {
    updateOffsetXBy(delta) {
      const { scrollWidth, clientWidth } = this.$refs.inner
      let offsetX = this.offsetX - delta
      offsetX = Math.min(0, offsetX)
      offsetX = Math.max((scrollWidth - clientWidth) * -1, offsetX)
      this.offsetX = offsetX
      this.$refs.inner.style.transform = `translateX(${this.offsetX}px)`
    },
    handleMousewheel: _.throttle(function fn(event) {
      // get scroll direction
      const { deltaX, deltaY } = event
      const absX = Math.abs(deltaX)
      const absY = Math.abs(deltaY)
      const scrollDirection = absY > absX ? 1 : -1
      const isVerticalScroll = scrollDirection === 1
      // check browser navigation
      const { scrollWidth, clientWidth } = this.$refs.inner
      const reachedLeftmost = event.deltaX < 0 && this.offsetX === 0
      const reachedRightmost = event.deltaX > 0 && this.offsetX === -(scrollWidth - clientWidth)
      if (
        !this.lockingBrowserNavigation
        && !isVerticalScroll
        && (reachedLeftmost || reachedRightmost)
      ) {
        return
      }
      // check scroll direction
      if (!this.scrollDirection) {
        // don't prevent vertical scrolls
        if (!isVerticalScroll) {
          event.preventDefault()
        }
        this.scrollDirection = scrollDirection
        return
      }
      event.preventDefault()
      // prevent immediate navigation after dragging
      this.lockingBrowserNavigation = true
      clearTimeout(this.lockBrowserNavigationTimeout)
      this.lockBrowserNavigationTimeout = setTimeout(() => {
        this.lockingBrowserNavigation = false
      }, 75)
      // abort auto scroll
      clearInterval(this.ticker)
      this.amplitude = null
      // reset after certain timeout
      clearTimeout(this.scrollDirectionResetTimer)
      this.scrollDirectionResetTimer = setTimeout(() => { this.scrollDirection = null }, 25)
      if (isVerticalScroll) {
        // handle vertical
        window.scrollBy(0, deltaY)
      } else {
        // handle horizontal
        this.timestamp = Date.now() - 80
        this.amplitude = -deltaX
        this.target = Math.round(this.offsetX + this.amplitude)
        this.autoScroll()
      }
    }, 10),
    track() {
      const now = Date.now()
      const elapsed = now - this.timestamp
      this.timestamp = now
      const delta = this.offsetX - this.frame
      this.frame = this.offsetX
      const speed = 400
      const v = speed * (delta / (elapsed + 1))
      this.velocity = (0.35 * v) + (0.65 * this.velocity)
    },
    autoScroll() {
      if (this.amplitude) {
        const elapsed = Date.now() - this.timestamp
        const timeConstant = 125
        const delta = -this.amplitude * Math.exp(-elapsed / timeConstant)
        if (delta > 0.5 || delta < -0.5) {
          this.updateOffsetXBy(this.offsetX - (this.target + delta))
          setTimeout(this.autoScroll, 1000 / 59)
        } else {
          this.updateOffsetXBy(this.offsetX - this.target)
          this.amplitude = null
        }
      }
    },
    onDown(event) {
      window.getSelection().removeAllRanges()
      this.$el.removeAttribute('data-no-select')
      const isTouchEvent = event.type === 'touchstart'
      if (!isTouchEvent) {
        const prev = this.previousMouseDownTime
        this.previousMouseDownTime = Date.now()
        if (this.previousMouseDownTime - prev <= 250) {
          // double click in 300ms
          this.doubleClickDetected = true
          return
        }
      }
      this.$el.setAttribute('data-no-select', '')
      // reset
      this.dragStartPosition = {
        x: isTouchEvent ? event.touches[0].clientX : event.clientX,
        y: isTouchEvent ? event.touches[0].clientY : event.clientY,
      }
      this.dragged = 0
      this.amplitude = null
      this.velocity = 0
      this.frame = this.offsetX
      this.timestamp = Date.now()
      this.isDragging = true

      clearInterval(this.ticker)
      this.ticker = setInterval(this.track, 20)
    },
    onTouchMove(event) {
      // return if not dragging
      if (!this.isDragging) {
        return
      }
      const diffX = event.touches[0].clientX - this.dragStartPosition.x
      const diffY = event.touches[0].clientY - this.dragStartPosition.y
      if (!this.scrollDirection) {
        this.scrollDirection = Math.abs(diffY) > Math.abs(diffX) ? 1 : -1
      }
      // is scrolling page
      if (this.scrollDirection === 1) {
        return
      }
      this.updateOffsetXBy(-diffX - this.dragged)
      this.dragged = -diffX
      event.preventDefault()
      event.stopPropagation()
    },
    onMouseMove(event) {
      // return if not dragging
      if (!this.isDragging || this.doubleClickDetected) {
        return
      }
      const diffX = event.clientX - this.dragStartPosition.x
      const diffY = event.clientY - this.dragStartPosition.y
      if (diffX === 0 && diffY === 0) {
        // required on some Windows 8 machines that gets
        // mousemove event without actual mouse movement
        return
      }
      this.updateOffsetXBy(-diffX - this.dragged)
      this.dragged = -diffX
    },
    onEnd() {
      // return if not dragging
      if (!this.isDragging) {
        return
      }
      // reset
      clearInterval(this.ticker)
      this.scrollDirection = null
      this.isDragging = false
      this.doubleClickDetected = false

      // start kinetic
      if (this.velocity > 10 || this.velocity < -10) {
        this.amplitude = 0.8 * this.velocity
        this.target = Math.round(this.offsetX + this.amplitude)
        this.autoScroll()
      }
    },
  },
  mounted() {
    document.addEventListener('touchmove', this.onTouchMove)
    document.addEventListener('touchend', this.onEnd)
    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mouseup', this.onEnd)
  },
  beforeDestroy() {
    // abort current offset update
    this.amplitude = null
    document.removeEventListener('touchmove', this.onTouchMove)
    document.removeEventListener('touchend', this.onEnd)
    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mouseup', this.onEnd)
  },
}
</script>

<style lang="scss" scoped>
.plark {
  display: block;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;

  &[data-no-select] {
    user-select: none;
  }

  > .inner {
    cursor: ew-resize;
    position: relative;
    width: 100%;
    will-change: transform;
  }
}
</style>
