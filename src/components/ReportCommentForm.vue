<template>
  <div class="report-form">
    <div class="row">
      評論內容：<span v-html="comment.text" />
    </div>
    <div class="row">
      出現時間：{{ getFormattedTime(comment.time) }}
    </div>
    <div class="row">
      檢舉原因：<input type="text" v-model="reason" />
    </div>
    <div class="button" @click="reportAbuse">
      <i class="fe-chevron-right" />
    </div>
    <div class="recaptcha-terms">
      This site is protected by reCAPTCHA and the Google
      <a href="https://policies.google.com/privacy" target="_blank">Privacy Policy</a> and
      <a href="https://policies.google.com/terms" target="_blank">Terms of Service</a> apply.
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { getFormattedTime } from '@/utility'
import API from '@/api'

export default {
  name: 'report-comment-form',
  props: {
    comment: Object,
  },
  data() {
    return {
      reason: '',
    }
  },
  methods: {
    ...mapActions([
      'enqueueNotification',
    ]),
    getFormattedTime,
    async reportAbuse() {
      const reason = this.reason.trim()
      if (!reason.length) {
        this.enqueueNotification({ type: 'alert', text: '請填寫檢舉原因', duration: 3000 })
        return
      }
      const token = await this.$recaptcha('report_comment')
      const { id } = this.comment
      const { status } = await API.reportCommentAbuse({ id, reason, token })
      if (status === 412) {
        alert('無法通過 reCAPTCHA 測試，請重新載入頁面後重試')
      } else if (status === 200) {
        this.enqueueNotification({ type: 'info', text: '感謝你的回報<br>我們會盡快檢查相關的評論<br>如發現有不當內容會盡快刪除', duration: 10000 })
      }
      this.$emit('submitted')
    },
  },
}
</script>

<style lang="scss" scoped>
.report-form {
  color: #fff;
  max-width: 400px;
  position: relative;

  .row {
    align-items: center;
    display: flex;
    height: 2.5rem;
    margin-right: 1rem;

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 75%;
    }

    input {
      background: #444;
      padding: .25rem 1rem;
      width: 240px;
    }
  }

  .button {
    align-items: center;
    background: #4585a7;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    font-size: 1.5rem;
    height: 3rem;
    justify-content: center;
    position: absolute;
    right: calc(-2rem - (3rem / 2));
    top: calc(50% - 3rem);
    width: 3rem;

    &:active {
      background: #3b799a;
    }
  }
}

.recaptcha-terms {
  color: #888;
  font-size: .8rem;
  line-height: 1rem;
  margin-top: 1rem;

  > a {
    color: #7aa1b5;
    text-decoration: none;
  }
}
</style>
