const cookie = {
  read(name: string) {
    const cookies = document.cookie
    const matches = cookies.match(new RegExp(`(^|;\\s*)(${name})=([^;]*)`))
    if (matches) {
      return decodeURIComponent(matches[3])
    } else {
      return null
    }
  }
}

export default cookie
