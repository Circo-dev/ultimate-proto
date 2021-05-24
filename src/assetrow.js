import { html, css, LitElement } from "lit"
import { formatLargeNum, formatPercentage, colorClass } from "./utils.js"


export class AssetRow extends LitElement {
  static get properties() {
    return {
      symbol: { type: String },
      pocket: { type: Object }
    }
  }

  constructor() {
    super();
    this.symbol = "N/A"
    this.pocket = {}
    this.details = {}
  }

  loadDetails = () => {
    fetch(`data/details_${this.symbol}.json`)
      .then(response => response.json())
      .then(details => {
        this.details = details
        //console.log(details)
        this.requestUpdate()
      })
  }

  updated(changedProperties) {
    if (changedProperties.has('symbol') && this.symbol != "N/A") {
      this.loadDetails()
    }
    super.update(changedProperties)
  }

  createRenderRoot() { return this } // turn off shadow dom to access external styles

  render() {
    const base = "usd"
    let { symbol, market_cap_rank, image, market_data, name} = this.details
    image = image || {}
    market_data = market_data || {}
    const current_price = market_data.current_price || {}
    const market_cap = market_data.market_cap || {}
    const market_cap_change_percentage_24h = market_data.market_cap_change_percentage_24h || {}
    const price_change_percentage_24h = market_data.price_change_percentage_24h || {}
    const total_volume = market_data.total_volume || {}
    const fully_diluted_valuation = market_data.fully_diluted_valuation || {}
    return html`
    <div class="container mx-auto bg-white rounded-xl shadow-md overflow-hidden m-2">
    <div class="md:flex bg-gray-100">
      <div class="md:flex-shrink-0">
          <div>
            <img class="m-2 h-12 w-12" src="${image.small}" alt="XXX">
            <div class="text-center uppercase tracking-wide">${symbol}</div>
            <div class="text-center text-sm">#${market_cap_rank}</div>
        </div>
      </div>
      <div class="px-4 py-2 w-60">
        <div>${name}</div>
        <div class="my-2">
            <div class="inline-block uppercase tracking-wide font-bold">${formatLargeNum(current_price[base])} ${base}</div>
            <div class="inline-block pl-1 tracking-wide ${colorClass(price_change_percentage_24h)}">${formatPercentage(price_change_percentage_24h)}</div>
        </div>
        <div class="text-sm my-2">
            <div class="inline-block">
                <div class="inline-block tracking-wide">${formatLargeNum(total_volume[base])}</div>
                <div class="text-xs text-gray-500">Vol.</div>
            </div>
            <div class="inline-block border-l-2 pl-2">
                <div class="inline-block tracking-wide">${formatLargeNum(market_cap[base])}</div>
                <div class="text-xs text-gray-500">Mkt. Cap.</div>
            </div>
            <div class="inline-block border-l-2 pl-2">
                <div class="inline-block tracking-wide">${formatLargeNum(fully_diluted_valuation[base])}</div>
                <div class="text-xs text-gray-500">Fully Diluted</div>
            </div>
        </div>
     </div>
    <simple-diagram symbol="${this.symbol}"></simple-diagram>
    <pocket-row-manager 
      assetdetails=${JSON.stringify(this.details)}
      pocket=${JSON.stringify(this.pocket)}>
    </pocket-row-manager>
    </div>
</div>
`
  }
}

customElements.define('asset-row', AssetRow);