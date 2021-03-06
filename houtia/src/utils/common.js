export default {
  parseTetxtURL(url) {
    const obj = {}
    const reg = /[?&][^?&]+=[^?&%]+/g
    const arr = url.match(reg)
    if (arr) {
      arr.forEach((item) => {
        const tempArr = item.substring(1).split('=')
        const key = decodeURIComponent(tempArr[0])
        const val = decodeURIComponent(tempArr[1])
        obj[key] = val
      })
    }
    return obj
  }
}
