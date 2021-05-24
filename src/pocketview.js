import { html, css, LitElement } from "lit"

export class Pocket extends LitElement {
  static get properties() {
    return {
      name: { type: String }
    }
  }

  constructor() {
    super();
    this.name = "N/A"
    this.pocket = {}
  }

  loadPocket = () => {
    fetch(`data/portfolio/pocket_${this.name}.json`)
      .then(response => response.json())
      .then(pocket => {
        this.pocket = pocket
        this.requestUpdate()
      })
  }

  firstUpdated() {
    this.loadPocket()
  }
  createRenderRoot() { return this } // turn off shadow dom to access external styles

  render() {
    return html`
    ${["btc", "eth", "ada", "sol", "matic"].map(
      symbol => {
        return html`<asset-row symbol="${symbol}" pocket=${JSON.stringify(this.pocket)}></asset-row>`
      }
    )}
`
  }
}

customElements.define('pocket-view', Pocket);