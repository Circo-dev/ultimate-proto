import { html, css, LitElement } from 'lit'
import { formatLargeNum, formatPercentage, colorClass } from "./utils.js"
import * as d3 from "d3"

export class PocketRowManager extends LitElement {
  static get properties() {
    return {
      pocket: { type: Object },
      assetdetails: { type: Object }
    }
  }

  constructor() {
    super();
    this.assetdetails = null
    this.pocket = null
  }

  createRenderRoot() { return this } // turn off shadow dom to access external styles

  render() {
    const base = "usd"
    if (!this.assetdetails || !this.assetdetails.market_data || !this.pocket) return html``
    const symbol = this.assetdetails.symbol
    const holdings = this.pocket[symbol]
    console.log(this.assetdetails)
    const value = holdings * this.assetdetails.market_data.current_price[base]
    const { market_cap_rank } = this.assetdetails
    return html`
    <div class="flex bg-gray-100">
      <div class="flex-shrink-0">
        <div class="ml-4 bg-red-100" style="position:relative">
          <div style="position:absolute; top:100px">
  x
          </div>
        </div>
      </div>
      <div class="ml-4 ">
        <div class="inline-block uppercase tracking-wide font-bold">${formatPercentage(Math.random() * 20, false)}</div>
        <div class="inline-block uppercase tracking-wide text-sm m-2">${formatLargeNum(holdings)} ${symbol},</div>
        <div class="inline-block uppercase tracking-wide text-sm">${formatLargeNum(value)} ${base}</div>
        <div class="text-xs text-gray-500">Holdings</div>
      </div>
</div>
`
  }
}

customElements.define('pocket-row-manager', PocketRowManager);