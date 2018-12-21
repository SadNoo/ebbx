<template>
  <div class="player-ad" v-if="!isMobile && showAd">
    <div class="ads-wrapper" v-if="adsType === 1 && !adDismissed">
      <div>
        <ads type="iit_box" :size="{ width: 480, height: 320 }" />
        <i class="fe-x" @click="adDismissed = true" />
      </div>
    </div>
    <div class="ads-banner" v-if="adsType === 2">
      <ads type="ypa_banner" :size="{ width: 620, height: 120 }" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Ads from '@/components/Ads'

export default {
  components: {
    Ads,
  },
  data() {
    return {
      adsType: 1,
      adDismissed: false,
    }
  },
  computed: {
    ...mapState({
      isMobile: (state) => state.isMobile,
    }),
    player() {
      return this.$parent
    },
    showAd() {
      return this.player.paused
    },
  },
  watch: {
    showAd() {
      this.adDismissed = false
    },
  },
  mounted() {
    this.adsType = Math.floor(Math.random() * 2) + 1
  },
}
</script>

<style scoped lang="scss">
.player-ad {
  height: 100%;
  left: 0;
  pointer-events: none;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 70;
}

.ads-banner {
  background: #1e1f2e;
  border-radius: 6px;
  bottom: 5rem;
  box-shadow: 0 6px 12px rgba(0, 0, 0, .4);
  left: calc(100% / 2);
  pointer-events: all;
  position: absolute;
  transform: translateX(-50%);
  z-index: 2;

  // tablet, break comment section
  @media (max-width: 1135px) {
    left: 50%;
  }
}

.ads-wrapper {
  align-items: center;
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 2;

  > div {
    background: rgba(67, 73, 90, .9);
    border-radius: 4px;
    box-shadow: 0 2px 10px 2px rgba(0, 0, 0, .25);
    pointer-events: all;
    position: relative;

    > i {
      align-items: center;
      background: #52596d;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      font-size: 1.4rem;
      height: 2rem;
      justify-content: center;
      position: absolute;
      right: -.5rem;
      top: -.5rem;
      width: 2rem;
    }
  }
}
</style>
