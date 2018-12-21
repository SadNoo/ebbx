<template>
  <article>
    <var data-mark />
    <section>
      <div class="slogan">
        ebb ・ <b>meticulously designed by anime enthusiast with <span style="color:#57b0cf">❤</span></b>
      </div>
      <h2>聯絡我們</h2>
      <div class="para">
        您可透過以下方式聯絡我們的團隊
        <br />
        電郵：<a class="link" href="mailto:info.ebb.io@gmail.com" target="_blank">info.ebb.io@gmail.com</a>
        <br />
        Telegram：<a class="link" href="https://t.me/ebbio" target="_blank">@ebbio</a>
      </div>
      <br />
      <h2>使用 PayPal 捐款</h2>
      <div class="para">
        我們需要您的支持以繼續營運此網站
        <br />
        <br />
        捐贈 $9.99 USD：
        <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&amp;hosted_button_id=7GJ2XK4RX94VJ" target="_blank">
          <img src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif">
        </a>
        <br />
        <br />
        自由輸入捐贈金額：
        <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&amp;hosted_button_id=K3L4ZP9WLBQCY" target="_blank">
          <img src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif">
        </a>
      </div>
    </section>
  </article>
</template>

<script>
export default {
  name: 'about-page',
  async mounted() {
    await this.$nextTick()
    this.$root.$emit('pageload')
  },
}
</script>

<style lang="scss" scoped>
article {
  padding: 0 2rem;
}

.slogan {
  font-size: 1.1rem;
  margin-bottom: 4rem;
}

h2 {
  margin: 2rem 0;
}
</style>
