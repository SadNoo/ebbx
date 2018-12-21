<template>
  <div class="snapshot-control">
    <i class="fe-camera" @click="snapshot" />
    <portal to="nav-level">
      <div class="snapshot" v-if="snapshotImage">
        <i class="fe-x" @click="resetSnapshotImage" />
        <img data-playback-capture alt :src="snapshotImage" />
      </div>
    </portal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      snapshotImage: null,
    }
  },
  computed: {
    video() {
      return this.$parent.$parent.video
    },
  },
  methods: {
    async snapshot() {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      canvas.width = this.video.videoWidth
      canvas.height = this.video.videoHeight

      // draw corner
      const x = 0
      const y = 0
      const radius = 4
      context.beginPath()
      context.moveTo(x + radius, y)
      context.lineTo(x + (canvas.width - radius), y)
      context.quadraticCurveTo(x + canvas.width, y, x + canvas.width, y + radius)
      context.lineTo(x + canvas.width, y + (canvas.height - radius))
      context.quadraticCurveTo(
        x + canvas.width,
        y + canvas.height,
        x + (canvas.width - radius),
        y + canvas.height,
      )
      context.lineTo(x + radius, y + canvas.height)
      context.quadraticCurveTo(x, y + canvas.height, x, y + (canvas.height - radius))
      context.lineTo(x, y + radius)
      context.quadraticCurveTo(x, y, x + radius, y)
      context.closePath()
      context.clip()

      context.drawImage(this.video, 0, 0, canvas.width, canvas.height)
      const response = await window.fetch(canvas.toDataURL('image/png'))
      const blob = await response.blob()
      if (blob.size < 1) {
        return
      }
      this.resumeVideo = !this.video.paused
      this.video.pause()
      this.snapshotImage = URL.createObjectURL(blob)
      window.ga('send', 'event', 'Playback', 'capture', this.title)
    },
    resetSnapshotImage() {
      this.snapshotImage = null
      if (this.resumeVideo) {
        this.video.play()
      }
    },
  },
}
</script>

<style scoped lang="scss">
.snapshot-control > i {
  cursor: pointer;
  display: inline-block;
  font-size: 1.6rem;
  height: 3rem;
  line-height: 3rem;
  pointer-events: all;
  text-align: center;
  width: 3rem;
}

.snapshot {
  box-shadow: 0 0 32px rgba(0, 0, 0, .5);
  height: 0;
  left: 0;
  overflow: hidden; // for corner clipping
  padding-bottom: calc(56.25% - (22rem / 1.77));
  position: absolute;
  right: 22rem;
  top: 3.5rem;
  user-select: none;
  z-index: 4;

  &:after,
  > img {
    left: 0;
    height: 100%;
    position: absolute;
    top: 0;
    width: 100%;
  }

  // hide backdrop when image is loading
  &:after {
    background: #000;
    content: '';
  }

  > i {
    color: #fff;
    cursor: pointer;
    font-size: 2rem;
    position: absolute;
    right: 1.5rem;
    text-shadow: 0 0 4px #000;
    top: 1.5rem;
    z-index: 2;
  }

  > img {
    vertical-align: top;
    z-index: 1;
  }

  // tablet, break comment section
  @media (max-width: 1135px) {
    padding-bottom: 56.25%;
    right: 0;
  }
}
</style>
