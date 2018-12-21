<template>
  <article>
    <h2>我的帳號</h2>
    <div class="profile">
      <div class="profile-photo" :style="{ backgroundImage: `url(${user.photo_url})` }" />
      <span>
        {{ user.nickname }}
        <br />
        <a href="#" class="link" @click.prevent="logout">登出</a>
      </span>
    </div>
    <div class="links">
      <router-link class="link" :to="{ name: 'watch-history' }">
        <i class="fe-clock" /> 播放紀錄
      </router-link>
    </div>
  </article>
</template>

<script>
import { mapState } from 'vuex'
import API from '@/api'

export default {
  name: 'account-page',
  computed: {
    ...mapState([
      'user',
    ]),
  },
  methods: {
    async logout() {
      await API.logout()
      window.location.reload()
    },
  },
  async mounted() {
    await this.$nextTick()
    this.$root.$emit('pageload')
  },
}
</script>

<style lang="scss" scoped>
article {
  padding: 0 2rem;
  width: 480px;

  .profile {
    align-items: center;
    display: flex;
    height: 4rem;

    .profile-photo {
      background: #294c71 center no-repeat;
      background-size: contain;
      border-radius: 1.6rem;
      height: 4rem;
      margin-right: 2rem;
      width: 4rem;
    }
  }

  .links {
    margin-top: 4rem;
  }
}
</style>
