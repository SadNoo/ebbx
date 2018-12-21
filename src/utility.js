import moment from 'moment'
import 'moment/locale/zh-tw'

moment.locale('zh-tw')

export const getFormattedTime = (seconds) => moment()
  .startOf('day')
  .seconds(seconds)
  .format(seconds >= 3600 ? 'H:mm:ss' : 'm:ss')

export const getFormattedDate = (date, str = 'YYYY-MM-DD') => moment(date).format(str)

export const getFullDate = (date, str = 'YYYY-MM-DD HH:mm:ss') => moment(date).format(str)

export const getRelativeDate = (date) => moment(date).fromNow()

export const getRelativeDate2 = (dateStr) => {
  /* eslint-disable prefer-template */
  const msPerMinute = 60 * 1000
  const msPerHour = msPerMinute * 60
  const msPerDay = msPerHour * 24
  const msPerMonth = msPerDay * 30
  const msPerYear = msPerDay * 365

  const elapsed = Date.now() - new Date(dateStr)

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + 's'
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + 'm'
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + 'h'
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + 'd'
  } else if (elapsed < msPerYear) {
    return moment(dateStr).format('MM.DD')
  } else {
    return Math.round(elapsed / msPerYear) + 'y'
  }
  /* eslint-enable prefer-template */
}

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
