import { html, css, LitElement } from 'lit'
import { formatLargeNum, formatPercentage, formatSince } from "./utils.js"
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
    const base = "usd"
    const {rulers, data} = this.interaction
    const {min, max} = data
    const { ath, ath_date, ath_change_percentage } = this.assetdetails.market_data
    const currentprice_y = Math.max(20, Math.min(78, rulers.ypos))
    return html`
<div class="flex bg-gray-100">
    <div class="text-xs w-16 uppercase p-1" style="height:126px;position:relative">
        <div style="position:absolute;top:8px">${formatLargeNum(min)}</div>
        <div style="position:absolute;top:${currentprice_y}px">${formatLargeNum(rulers.price)}</div>
        <div style="position:absolute;bottom:20px">${formatLargeNum(max)}</div>
    </div>
    <div class="text-sm my-2">
        <div class="inline-block pl-2">
        <div class="inline-block tracking-wide">${formatLargeNum(ath[base])}</div>
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
`
  }
}

customElements.define('ath-analysis', AthAnalysis);