
export function formatLargeNum(num) {
  let remaining = num
  if (isNaN(remaining)) return "∞" // TODO print NaN if needed
  let postfix = ""
  if (remaining > 1e9) {
    postfix= "\u2009B"
    remaining = remaining / 1e9
  } else if (remaining > 1e6) {
    postfix = "\u2009M"
    remaining = remaining / 1e6
  }
  if (remaining >= 1000) {
    return "" + Math.floor(remaining / 1000) + " " + Math.round( (remaining % 1000) * 10) / 10 + postfix
  } else if (remaining >= 10) {
    return "" + Math.round(remaining * 10) / 10 + postfix
  } else {
    return "" + Math.round(remaining * 100) / 100 + postfix
  }  
}

 export function formatPercentage(percentage, forceplus=true) {
    const sign = (forceplus && percentage > 0) ? "+" : ""
    return sign + (Math.round(percentage * 10) / 10) + "%"
  }

 export function colorClass(value, max = 4) {
    const idx = Math.max(5, Math.min(9, 10 - Math.round((Math.abs(value) / max) * 5)))
    return value > 0 ? "text-green-" + idx + "00" : "text-red-" + idx +"00"
  }
