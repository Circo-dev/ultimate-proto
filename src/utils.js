
export function formatNum(num) {
  return num < 1000 ? formatSmallNum(num) : formatLargeNum(num)
}

export function formatSmallNum(num, postfix = "") {
  if (num > 1000) {
    return "" + Math.floor(num / 1000) + " " + Math.round( (num % 1000) * 10) / 10 + postfix
  } else if (num >= 10) {
    return "" + Math.round(num * 10) / 10 + postfix
  } else {
    return "" + Math.round(num * 100) / 100 + postfix
  } 
}

export function formatLargeNum(num) {
  let remaining = num
  if (isNaN(remaining)) return "∞" // TODO print NaN if needed
  let postfix = ""
  if (remaining >= 1e9) {
    postfix= "\u2009B"
    remaining = remaining / 1e9
  } else if (remaining >= 1e6) {
    postfix = "\u2009M"
    remaining = remaining / 1e6
  }
  return formatSmallNum(remaining, postfix)
}

export function formatPercentage(percentage, forceplus=true) {
  const sign = (forceplus && percentage > 0) ? "+" : ""
  return sign + (Math.round(percentage * 10) / 10) + "%"
}

export function formatSince(date) {
  const diff = (Date.now() - Number(new Date(date))) / 86400000
  return formatSmallNum(diff, " days")
}

export function colorClass(value, max = 4) {
  const idx = Math.max(5, Math.min(9, 10 - Math.round((Math.abs(value) / max) * 5)))
  return value > 0 ? "text-green-" + idx + "00" : "text-red-" + idx +"00"
}

export function _priceat(prices, date, l, r) {
  if (l >= r) return prices[l].value
  const centeridx = Math.floor((l + r) / 2)
  if (prices[centeridx].date < date) {
    return _priceat(prices, date, centeridx + 1, r)
  } else {
    return _priceat(prices, date, l, centeridx - 1)
  }
}

export function priceat(prices, date) {
  if (!prices || !prices.length) return 0
  return _priceat(prices, date, 0, prices.length - 1)
}
