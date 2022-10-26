export default function descCut(str, titLength) {
  let strings = 0
  if (titLength <= 25) strings = 5
  if (titLength > 25 && titLength < 40) strings = 4
  if (titLength >= 40) strings = 3

  const strLength = 33
  const length = strLength * strings
  if (str.length < length) {
    return str
  }
  const newStr = str.substring(0, length)
  const lastSpace = newStr.lastIndexOf(' ')
  let shortDesc = newStr.slice(0, lastSpace)
  if (/[.,:]/.test(shortDesc.split(' ').pop())) {
    shortDesc = shortDesc.slice(0, -1)
  }
  return `${shortDesc}...`
}
