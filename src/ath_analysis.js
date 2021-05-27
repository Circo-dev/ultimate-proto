import { html, css, LitElement } from 'lit'
import { formatLargeNum, formatPercentage, formatMoney, formatSince, getDenominator } from "./utils.js"
import * as d3 from "d3"

export class AthAnalysis extends LitElement {
  static get properties() {
    return {
      assetdetails: { type: Object },
      interaction: { type: Object}
    }
  }

  constructor() {
    super();
    this.assetdetails = null
    this.pocket = null
    this.interaction = null
  }

  createRenderRoot() { return this } // turn off shadow dom to access external styles

  render() {
    if (!this.assetdetails || !this.assetdetails.market_data
        || !this.interaction || !this.interaction.rulers) {
        return html`<div class="m-2 text-xs"><-Interact</div>`
    }
    const base = getDenominator()
    const {rulers, data} = this.interaction
    const {min, max} = data
    const { ath, ath_date, ath_change_percentage } = this.assetdetails.market_data
    const currentprice_y = Math.max(16, Math.min(70, rulers.ypos + 3))
    return html`
<div>
    <div class="flex bg-gray-100">
        <div class="text-xs uppercase w-16" style="height:126px;position:relative">
            <div class="bg-blue-200 pl-0.5 rounded-l-full border-1" style="padding-right:2px;position:absolute;top:2px">${formatLargeNum(max.value)}</div>
            <div class="bg-blue-200 pl-0.5 rounded-l-full border-1" style="padding-right:2px;z-index:1000;position:absolute;top:${currentprice_y}px">${formatLargeNum(rulers.price)}</div>
            <div class="bg-blue-200 pl-0.5 rounded-l-full border-1" style="padding-right:2px;position:absolute;bottom:18px">${formatLargeNum(min.value)}</div>
        </div>
        <div>
            <div class="h-16"></div>
            <div class="text-sm my-2">
                <div class="inline-block pl-2">
                <div class="inline-block tracking-wide">${formatMoney(ath.usd, base, false)}</div>
                <div class="text-xs text-gray-500">All-time high</div>
            </div>
            <div class="inline-block pl-2 border-l-2">
                <div class="inline-block tracking-wide">${formatSince(ath_date[base])}</div>
                <div class="text-xs text-gray-500">Since ath.</div>
            </div>
            <div class="inline-block pl-2 border-l-2">
                <div class="inline-block tracking-wide">${formatPercentage(ath_change_percentage[base])}</div>
                <div class="text-xs text-gray-500">Drawdown</div>
            </div>
        </div>
    </div>
</div>
`
  }
}

customElements.define('ath-analysis', AthAnalysis);