import { html, LitElement } from "lit"
import { priceat } from "./utils.js"
import * as d3 from "d3"

export class SimpleDiagram extends LitElement {
    static syncedupdates = []

    static updatesynced(target) {
        SimpleDiagram.syncedupdates.map(u => u(target))
    }

    static get properties() {
        return {
            symbol: { type: String }
        }
    }

    constructor() {
        super();
        this.symbol = "N/A"
        this.id = "sd_" + Math.round(Math.random() * 1e12)
        this.data = {
            min: 0,
            max: NaN,
            raw: []
        }
    }

    createRenderRoot() { return this }

    firstUpdated() {
        const margin = { top: 10, right: 10, bottom: 25, left: 45 },
            width = 360 - margin.left - margin.right,
            height = 126 - margin.top - margin.bottom

        const svg = d3.select("." + this.id)
            .on("mousemove touchmove", moved)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")")

        const x = d3.scaleUtc()
        const y = d3.scaleLinear()
        let prices = null

        function update(date) {
            const xpos = x(date)
            const price = priceat(prices, date)
            const ypos = y(price)
            rule_v.attr("transform", `translate(${xpos + 0.5},0)`)
            rule_h.attr("transform", `translate(0, ${ypos + 0.5})`)
            svg.property("value", date).dispatch("input")
            this.dispatchEvent(new CustomEvent('interaction', {
                detail: {
                    rulers: {
                        price: price,
                        xpos: xpos,
                        ypos: ypos    
                    },
                    data: this.data
                }
            }))
        }

        function moved(event) {
            const target = x.invert(d3.pointer(event, this)[0] - margin.left)
            SimpleDiagram.updatesynced(target)
        }

        const formattedData = fetch(`data/chart_${this.symbol}_usd.json`)
        .then(response => response.json())
        .then(chartdata => {
            prices = chartdata.prices.map(d => {
                return {date: new Date(d[0]), value: d[1]}
            })
            return  prices
        })
  

        formattedData.then(
            data => {
                this.calcStats(data)
                // Add X axis --> it is a date format
                x.domain(d3.extent(data, function (d) { return d.date; }))
                    .range([0, width])
                svg.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .style("stroke", "grey")
                    .call(d3.axisBottom(x).ticks(6))

                // Add Y axis
                y.domain([d3.min(data, function (d) { return +d.value; }) * 0.98, d3.max(data, function (d) { return +d.value; })])
                    .range([height, 0]);
                svg.append("g")
                    .style("stroke", "grey")
                    .call(d3.axisLeft(y).ticks(6));

                // Add the line
                svg.append("path")
                    .datum(data)
                    .attr("fill", "none")
                    .attr("stroke", "steelblue")
                    .attr("stroke-width", 1)
                    .attr("d", d3.line()
                        .x(function (d) { return x(d.date) })
                        .y(function (d) { return y(d.value) })
                    )
                SimpleDiagram.syncedupdates.push(update.bind(this))
            })

        const rule_v = svg.append("g")
            .append("line")
            .attr("y1", height)
            .attr("y2", 0)
            .attr("stroke", "brown")
            .attr("stroke-dasharray", "1,3")

        const rule_h = svg.append("g")
            .append("line")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("stroke", "brown")
            .attr("stroke-dasharray", "1,3")

    }

    calcStats(data) {
        let minval = Infinity
        let maxval = -Infinity
        for (var i = 1; i < data.length; i++) {
            minval = Math.min(minval, data[i].value)
            maxval = Math.max(maxval, data[i].value)
        }
        this.data.min = minval
        this.data.max = maxval
    }

    render() {
        return html`
    <div class="md:flex">
        <div class="bg-white text-xl text-gray-400 simplediagram ${this.id}" style="user-select:none"></div>
    </div>
`
    }
}

customElements.define('simple-diagram', SimpleDiagram)