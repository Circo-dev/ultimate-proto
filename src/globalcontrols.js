import { html, css, LitElement } from 'lit'
import { formatLargeNum, formatPercentage, formatSince } from "./utils.js"
import * as d3 from "d3"

export class GlobalControls extends LitElement {
  static LOG_SCALE = "log"
  static LINEAR_SCALE = "linear"

  static SCALE_KEY = "ultimate.global.scale"

  static get properties() {
    return {
      scale: { type: String }
    }
  }

  constructor() {
    super();
    this.scale = GlobalControls.scaleType()
  }

  createRenderRoot() { return this }

  setScale = (event) => {
    localStorage.setItem(GlobalControls.SCALE_KEY, event.target.checked ? GlobalControls.LOG_SCALE : GlobalControls. LINEAR_SCALE)
  }

  render() {
    return html`
<div class="w-full h-9 p-2 bg-gray-50 shadow-md overflow-hidden flex justify-center">
  <div class="">
    <input type="checkbox" name="logscale" id="logscale" ?checked=${this.scale == GlobalControls.LOG_SCALE} @change=${this.setScale}>
    <label for="logscale">Log scale</label>
  </div>
</div>
`
  }

  static scaleType() {
    return localStorage.getItem(GlobalControls.SCALE_KEY) || GlobalControls.LINEAR_SCALE
  }
}

customElements.define('global-controls', GlobalControls);
