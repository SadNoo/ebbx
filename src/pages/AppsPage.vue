<template>
  <article>
    <var data-mark />
    <section>
      <h2>Apps</h2>
      在行動裝置上取得 ebb 應用程式
      <br />
      播放體驗大上昇<sup><i class="fe-arrow-up" /></sup>！
      <br />
      <br />
      <br />
      <div class="apps">
        <div class="row">
          <div class="image">
            <img alt src="https://lh3.googleusercontent.com/DFo-TwN7VnuDN9g3GxyhonZqmRjVZG0wE9cZg6lJYZCoR_Ad7ZNZn_X6qqAfykLMJOE=s75-rw" />
          </div>
          <div class="text">
            <span>ebb for Android <sup>(beta)</sup></span>
            <span>
              <a href="https://get.ebb.app/android" target="_blank">按此下載 APK</a>
            </span>
          </div>
        </div>
      </div>
    </section>
  </article>
</template>

<script>
export default {
  name: 'apps-page',
  async mounted() {
    await this.$nextTick()
    this.$root.$emit('pageload')
  },
}
</script>

<style scoped lang="scss">
.apps {
  .row {
    display: flex;

    .image {
      align-items: center;
      display: flex;
    }

    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: 2rem;

      > span {
        padding: .4rem 0;
      }

      > span:first-child {
        font-size: 1.2rem;
      }
    }
  }
}
</style>
