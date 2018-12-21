<template>
  <canvas data-ebuko width="110" height="176" @contextmenu.prevent @click.prevent="onAction"></canvas>
</template>

<script>
import SpriteNormalFace from '@/assets/ebuko-sprite_1.png'
import SpriteBlinkFace from '@/assets/ebuko-sprite_2.png'
import SpriteSmileFace from '@/assets/ebuko-sprite_3.png'
import SpriteHappyFace from '@/assets/ebuko-sprite_4.png'
import SpriteActionFace from '@/assets/ebuko-sprite_5.png'

export default {
  name: 'ebuko',
  data() {
    return {
      context: null,
      flag: null,
      disappearing: false,
      currentFrameAborting: false,
    }
  },
  methods: {
    loadResource({ src, frameCount, fps }) {
      return new Promise((resolve) => {
        const image = new Image()
        image.onload = () => resolve({
          image,
          frameCount,
          fps,
        })
        image.src = src
      })
    },
    draw({ image, frameCount }, currentFrame) {
      const { width, height } = this.$el
      const srcY = (image.height / frameCount) * currentFrame
      const targetWidth = image.width / (image.width / width)
      const targetHeight = image.height / (image.height / height)
      window.requestAnimationFrame(() => {
        this.context.clearRect(0, 0, width, height)
        this.context.drawImage(
          image,
          0,
          srcY,
          image.width,
          image.height,
          0,
          0,
          targetWidth,
          targetHeight * frameCount,
        )
      })
    },
    drawCycle(resource) {
      return new Promise((resolve) => {
        let currentFrame = 0
        const timer = setInterval(() => {
          this.draw(resource, currentFrame)
          currentFrame += 1
          if (this.currentFrameAborting || currentFrame === resource.frameCount) {
            clearInterval(timer)
            resolve()
          }
        }, 1000 / resource.fps)
      })
    },
    onAction() {
      if (this.flag !== 'action') {
        this.flag = 'action'
        this.currentFrameAborting = true
      }
    },
  },
  async mounted() {
    const canvas = this.$el
    this.context = canvas.getContext('2d')
    const { width: oldWidth, height: oldHeight } = canvas
    canvas.width = oldWidth * window.devicePixelRatio
    canvas.height = oldHeight * window.devicePixelRatio
    canvas.style.width = `${oldWidth}px`
    canvas.style.height = `${oldHeight}px`
    this.context.imageSmoothingQuality = 'medium'

    const normalFace = await this.loadResource({ src: SpriteNormalFace, frameCount: 18, fps: 14 })
    const blinkFace = await this.loadResource({ src: SpriteBlinkFace, frameCount: 19, fps: 14 })
    const smileFace = await this.loadResource({ src: SpriteSmileFace, frameCount: 18, fps: 14 })
    const happyFace = await this.loadResource({ src: SpriteHappyFace, frameCount: 39, fps: 18 })
    const actionFace = await this.loadResource({ src: SpriteActionFace, frameCount: 36, fps: 18 })

    const randomizedIntervalExecution = (base, fn) => {
      if (this.disappearing) {
        return
      }
      const range = 400
      const timeout = Math.round(((Math.random() * range) + base) - (range / 2))
      setTimeout(() => {
        fn()
        randomizedIntervalExecution(base, fn)
      }, timeout)
    }

    randomizedIntervalExecution(1000 * 5, () => {
      if (this.flag !== null) {
        return
      }
      this.flag = Math.random() > 0.6 ? 'smile' : 'blink'
    })
    randomizedIntervalExecution(1000 * 30, () => {
      this.flag = 'happy'
    })
    const tick = async () => {
      if (this.disappearing) {
        return
      }
      switch (this.flag) {
        case 'blink':
          await this.drawCycle(blinkFace)
          if (!this.currentFrameAborting) {
            this.flag = null
          }
          break
        case 'smile':
          await this.drawCycle(smileFace)
          if (!this.currentFrameAborting) {
            this.flag = null
          }
          break
        case 'happy':
          await this.drawCycle(happyFace)
          if (!this.currentFrameAborting) {
            this.flag = null
          }
          break
        case 'action':
          await this.drawCycle(actionFace)
          if (!this.currentFrameAborting) {
            this.flag = null
          }
          break
        default:
          await this.drawCycle(normalFace)
      }
      this.currentFrameAborting = false
      tick()
    }
    tick()
  },
  beforeDestroy() {
    this.disappearing = true
  },
}
</script>
