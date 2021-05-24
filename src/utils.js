
export function formatLargeNum(num) {
    if (isNaN(num)) return "∞" // TODO print NaN if needed
    let postfix = ""
    if (num > 1e9) {
      postfix= "B"
      num = num / 1e9
    } else if (num > 1e6) {
      postfix = "M"
      num = num / 1e6
    }
    if (num > 1000) {
      return "" + Math.ceil(num / 1000) + " " + Math.round( (num % 1000) * 10) / 10 + postfix
    }
    return "" + Math.round(num * 10) / 10 + postfix
  }

 export function formatPercentage(percentage, forceplus=true) {
    const sign = (forceplus && percentage > 0) ? "+" : ""
    return sign + (Math.round(percentage * 10) / 10) + "%"
  }

 export function colorClass(value, max = 4) {
    const idx = Math.max(5, Math.min(9, 10 - Math.round((Math.abs(value) / max) * 5)))
    return value > 0 ? "text-green-" + idx + "00" : "text-red-" + idx +"00"
  }
