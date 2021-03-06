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
    return ; ////////////////// !!!!!!!!!!
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
    //<div class="text-xl font-bold">${this.name}</div>
    return html`
<div class="my-2 ml-2" @requestupdate=${e => this.requestUpdate()}>
  
  ${["btc", "eth", "ada", "sol", "matic", "link", "vet", "cake", "hot-cross"].map(
    symbol => {
      return html`<asset-row symbol="${symbol}" pocket=${JSON.stringify(this.pocket)}></asset-row>`
    }
  )}
</div>
`
  }
}

customElements.define('pocket-view', Pocket);
