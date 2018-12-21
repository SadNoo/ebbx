<template>
  <div class="search-bar">
    <input
      type="text"
      spellcheck="false"
      placeholder="搜尋動畫作品"
      :value="searchQuery"
      @input="onChange"
    />
    <div class="sbi-toggle" @click="showSBIRect = true">
      <i class="fe-camera" />
    </div>
    <div class="sbi-rect" v-if="showSBIRect">
      <header>
        <div>
          <h1>以圖搜尋</h1>
          <span>直接使用場景截圖搜尋作品</span>
        </div>
        <i class="fe-x" @click="tryClose" />
      </header>
      <div
        class="drop-hint"
        v-if="isSearching || hasDragEventOccurred" 
        @dragover.prevent
        @drop.prevent="onFileChange($event, 'dataTransfer')"
      >
        {{ isSearching ? '搜尋中，請稍等...' : '將圖片拖放到這裡' }}
      </div>
      <div class="legend" v-else>
        <nav>
          <ul>
            <li :class="{ active: sbiMode === 'image_url' }" @click="sbiMode = 'image_url'">
              貼上圖片網址
            </li>
            <li :class="{ active: sbiMode === 'image' }" @click="sbiMode = 'image'">
              上載圖片
            </li>
          </ul>
        </nav>
        <div class="search-option">
          <div class="sbi-input" v-if="sbiMode === 'image_url'">
            <input type="text" v-model="imageUrl" />
            <button @click="loadImageFromUrl" :disabled="imageLoading">搜尋</button>
          </div>
          <template v-else>
            <input type="file" @change="onFileChange($event, 'target')" />
          </template>
          <div class="powered">
            <span>
              powered by
              <a rel="noopener noreferrer nofollow" href="https://trace.moe" target="_blank">trace.moe</a>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import axios from 'axios'
import { Base64 } from 'js-base64'

function getMostFrequentItem(array) {
  if (array.length < 1) {
    return null
  }
  const map = {}
  let needle = array[0]
  let maxCount = 1
  for (let i = 0; i < array.length; i += 1) {
    const el = array[i]
    map[el] = (map[el] || 0) + 1
    if (map[el] > maxCount) {
      needle = el
      maxCount = map[el]
    }
  }
  return needle
}

export default {
  name: 'search-bar',
  computed: {
    ...mapState([
      'searchQuery',
    ]),
  },
  data() {
    return {
      fetcherDelay: null,
      showSBIRect: false,
      sbiMode: 'image_url',
      imageUrl: '',
      imageLoading: false,
      handlePageClickListener: null,
      hasDragEventOccurred: false,
      hideSBIRectWhenDragLeaves: false,
      isSearching: false,
    }
  },
  methods: {
    ...mapActions([
      'enqueueNotification',
      'fetchSearchResults',
    ]),
    tryClose() {
      if (this.isSearching) {
        return
      }
      this.showSBIRect = false
    },
    onChange(event) {
      let location = {}
      const value = event.target.value.trim()
      if (value.length) {
        location = { path: '/search', query: { q: value } }
      }
      const method = this.$route.name !== 'search' ? 'push' : 'replace'
      this.$router[method](location)
      clearTimeout(this.fetcherDelay)
      this.fetcherDelay = setTimeout(() => this.fetchSearchResults(value), 500)
    },
    searchResized(image) {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      const resizedWidth = 480
      const resizedHeight = Math.floor(resizedWidth / (image.width / image.height))
      canvas.width = resizedWidth
      canvas.height = resizedHeight
      ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, resizedWidth, resizedHeight)

      const base64 = canvas.toDataURL('image/jpeg', 0.9)
      this.searchByImage(base64)
    },
    loadImageFromUrl() {
      this.imageLoading = true
      const image = new Image()
      image.crossOrigin = 'anonymous'
      image.onload = () => {
        this.imageLoading = false
        this.imageUrl = ''
        this.searchResized(image)
      }
      image.onerror = () => {
        this.enqueueNotification({ type: 'alert', text: '無法讀取圖片', duration: 2000 })
        this.imageLoading = false
        this.imageUrl = ''
      }
      image.src = `https://image.trace.moe/imgproxy?url=${encodeURIComponent(this.imageUrl)}`
    },
    onFileChange(event, field) {
      const { [field]: { files: [file] } } = event
      let url
      if (!this.isSearching) {
        if (file) {
          // has image dropped
          if (!file.type.startsWith('image/')) {
            this.enqueueNotification({ type: 'alert', text: '只接受圖像檔案', duration: 2000 })
          } else {
            url = URL.createObjectURL(file)
          }
        } else {
          // no image dropped, try obtain url from html
          if (field === 'dataTransfer') {
            let elem = document.createElement('div')
            elem.innerHTML = event.dataTransfer.getData('text/html')
            elem = elem.querySelector('img')
            if (elem) {
              url = `https://image.trace.moe/imgproxy?url=${encodeURIComponent(elem.src)}`
            }
          }
        }
      }
      if (!url) {
        // reset flag
        this.hasDragEventOccurred = false
        return
      }
      const image = new Image()
      image.crossOrigin = 'anonymous'
      image.onload = () => {
        this.searchResized(image)
        if (!url.startsWith('http')) {
          URL.revokeObjectURL(url)
        }
      }
      image.onerror = () => {
        // reset flag
        this.hasDragEventOccurred = false
        this.enqueueNotification({ type: 'alert', text: '不支援的圖像格式', duration: 2000 })
      }
      image.src = url
    },
    async searchByImage(image) {
      try {
        this.isSearching = true
        const { data } = await axios({
          method: 'post',
          url: 'https://trace.moe/api/search',
          data: { image },
        })
        const { docs/* , quota, quota_ttl: quotaTtl */ } = data
        if (docs.length < 1) {
          this.enqueueNotification({ type: 'info', text: '沒有符合條件的結果', duration: 2000 })
          return
        }
        // sort similarity from high to low
        const reducedEpisodeCounting = docs.reduce((acc, doc) => [
          ...acc,
          `${doc.anilist_id}\0${doc.episode}`,
        ], [])
        const reducedTimeCounting = docs.reduce((acc, doc) => [
          ...acc,
          `${doc.anilist_id}\0${doc.at}`,
        ], [])
        const [aid, ep] = getMostFrequentItem(reducedEpisodeCounting).split('\0')
        const [_, time] = getMostFrequentItem(reducedTimeCounting).split('\0')
        const doc = docs.find((d) =>
          String(d.anilist_id) === aid &&
          String(d.episode) === ep &&
          String(d.at) === time)
        const {
          at,
          filename: file,
          tokenthumb: thumb,
          title_chinese: nameChi,
          title_native: nameJpn,
          similarity,
        } = doc
        const score = (similarity * 100).toFixed(1)
        const preview = `https://trace.moe/thumbnail.php?anilist_id=${aid}&file=${encodeURIComponent(file)}&t=${at}&token=${thumb}`
        const payload = Base64.encodeURI(JSON.stringify({
          at, ep, nameChi, nameJpn, preview, score,
        }))
        window.ga('send', 'event', 'Search', 'image', JSON.stringify({ nameChi, ep, at, score, preview }))
        this.$router.push({ name: 'what-anime', query: { payload } })
      } catch (error) {
        console.error(error)
        this.enqueueNotification({ type: 'alert', text: '搜尋時發生未知錯誤', duration: 2000 })
      } finally {
        this.isSearching = false
        // reset flag
        this.hasDragEventOccurred = false
      }
    },
  },
  watch: {
    $route() {
      this.tryClose()
    },
    showSBIRect(show) {
      if (!show) {
        // reset the flag when box is going hidden
        this.hideSBIRectWhenDragLeaves = false
        this.sbiMode = 'image_url'
      }
    },
    hasDragEventOccurred(occurred) {
      if (occurred) {
        this.showSBIRect = true
        this.sbiMode = 'image'
      } else if (this.hideSBIRectWhenDragLeaves) {
        this.showSBIRect = false
      }
    },
  },
  mounted() {
    this.handlePageClickListener = ({ target }) => {
      let div = target
      // svg .className will return SVGAnimatedString instead of string
      while (div !== null && String(div.getAttribute('class')).indexOf('sbi-') < 0) {
        if (div.id === 'app') {
          break
        }
        div = div.parentNode
      }
      if (div !== null && div.className.indexOf('sbi-') < 0) { // sbi-toggle / sbi-rect
        this.tryClose()
      }
    }
    this.handleDragEnterListener = ({ relatedTarget }) => {
      if (relatedTarget !== null) {
        // for drag into document only
        return
      }
      this.hasDragEventOccurred = true
      // force sbi box to show when drag enter and box is invisible
      if (!this.showSBIRect) {
        this.hideSBIRectWhenDragLeaves = true
      }
    }
    this.handleDragLeaveListener = ({ relatedTarget }) => {
      if (relatedTarget !== null) {
        // for drag into document only
        return
      }
      this.hasDragEventOccurred = false
    }
    document.addEventListener('click', this.handlePageClickListener)
    document.addEventListener('dragenter', this.handleDragEnterListener)
    document.addEventListener('dragleave', this.handleDragLeaveListener)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handlePageClickListener)
    document.removeEventListener('dragenter', this.handleDragEnterListener)
    document.removeEventListener('dragleave', this.handleDragLeaveListener)
  },
}
</script>

<style lang="scss" scoped>
.search-bar {
  align-items: center;
  display: flex;
  height: 3.5rem;
  justify-content: center;
  position: relative;

  > input {
    height: 2rem;
    line-height: 2rem;
    margin-top: 2px;
    padding: 0 2rem 0 1rem;
    text-align: left;
    width: 20rem;
  }

  .sbi-toggle {
    align-items: center;
    color: rgba(255, 255, 255, .6);
    cursor: pointer;
    display: flex;
    height: 2rem;
    justify-content: center;
    position: absolute;
    left: calc(50% + (20rem / 2) - 2rem);
    top: 50%;
    transform: translateY(-50%);
    width: 2rem;
    z-index: 2;

    &:hover { color: #fff; }
  }

  .sbi-rect {
    background: #2f3b4e;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, .25);
    display: flex;
    flex-direction: column;
    height: 12rem;
    left: 0;
    line-height: 1rem;
    overflow: hidden;
    position: absolute;
    text-align: left;
    top: 0;
    width: 22rem;
    z-index: 10;

    > header {
      display: flex;
      flex-shrink: 0;
      margin-bottom: 1rem;

      > div {
        flex: 1;
        padding: 0 1rem;

        > h1 {
          font-size: 1rem;
          font-weight: bold;
          height: 2.5rem;
          line-height: 2.5rem;
          margin: 0;
          position: relative;
        }

        > span { font-size: .9rem; }
      }

      > i {
        cursor: pointer;
        height: 2.5rem;
        line-height: 2.5rem;
        text-align: center;
        width: 2.5rem;
      }
    }

    .drop-hint {
      align-items: center;
      background: #384152;
      box-shadow: 0 -1px #4d596d;
      display: flex;
      flex: 1;
      font-size: 1.2rem;
      justify-content: center;
    }

    .legend {
      display: flex;
      flex: 1;
      flex-direction: column;

      nav {
        position: relative;
        z-index: 2;

        ul {
          display: flex;
          font-size: .9rem;
          font-weight: bold;
          height: 2rem;
          line-height: 2rem;
          list-style: none;
          margin: 0;
          padding: 0;

          li {
            border: 0 solid transparent;
            border-radius: 2px 2px 0 0;
            border-width: 1px 1px 0;
            cursor: pointer;
            padding: 0 1rem;

            &.active {
              background: #384152;
              border-color: #4d596d;
              padding: 0 .5rem;
            }

            &:first-child.active {
              margin-left: 1rem;
            }
          }
        }
      }

      .search-option {
        background: #384152;
        box-shadow: 0 -1px #4d596d;
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: center;
        line-height: 1rem;
        padding: 0 1rem 2rem;
        position: relative;

        .sbi-input {
          position: relative;
          width: 100%;

          > input {
            background: rgba(255, 255, 255, 0.125);
            border-radius: 12px 0 0 12px;
            height: 2rem;
            padding: 0 .55rem;
            vertical-align: top;
            width: calc(100% - 12px);
          }

          > button {
            background: #5285ac;
            border: 0;
            border-radius: 12px;
            color: #fff;
            font: inherit;
            height: 2rem;
            padding: 0 1rem;
            position: absolute;
            right: 0;
            top: 0;
            z-index: 2;
          }
        }

        .powered {
          align-items: center;
          bottom: .5rem;
          display: flex;
          font-size: .8rem;
          height: 1rem;
          position: absolute;
          right: 1rem;

          &:before {
            background: url(https://trace.moe/favicon.png);
            background-size: cover;
            border-radius: 50%;
            content: '';
            display: inline-block;
            height: 1rem;
            margin-right: .5rem;
            width: 1rem;
          }

          a { text-decoration: none; }
        }
      }
    }
  }
}
</style>
