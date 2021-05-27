import { html, LitElement } from "lit"
import { priceat, getDenominator, setDenominator, setPrice } from "./utils.js"
import { GlobalControls } from "./globalcontrols.js"
import * as d3 from "d3"

export class SimpleDiagram extends LitElement {
    static syncedupdates = []
    static alldata = {}

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
        this.rulers = {
            price: NaN,
            xpos: 0,
            ypos: 0    
        }
    }

    createRenderRoot() { return this }

    getState() {
        return{
            rulers: this.rulers,
            data: this.data
        }
    }

    fireInteraction() {
        this.dispatchEvent(new CustomEvent('interaction', {
            detail: this.getState()
        }))        
    }

    fireRequestUpdate() {
        this.dispatchEvent(new CustomEvent('requestupdate', {
            detail: this.getState()
        }))        
    }

    firstUpdated() {
        const margin = { top: 10, right: 3, bottom: 25, left: 45 },
            width = 360 - margin.left - margin.right,
            height = 126 - margin.top - margin.bottom

        const root = d3.select("." + this.id)
            .on("mousemove touchmove", moved)
            .on("click", clicked.bind(this))

        let rule_max = null
        let rule_min = null
        let rule_h = null
        let rule_v = null

        let svg = null
        let container = null

        let x = null
        let y = null
        let prices = null

        let current_denominator = getDenominator()

        const drawChart = () => {
            const data = SimpleDiagram.alldata[this.symbol]
            if (!data) return
            prices = this.denominate_series(data)
            if (!prices) return
            current_denominator = getDenominator()
            this.calcStats(prices)
            this.fireInteraction()
            if (container) {
                container.remove()
            }
            container = root
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)

            svg = container.append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

            x = d3.scaleUtc()
            x.domain(d3.extent(prices, function (d) { return d.date; }))
                .range([0, width])
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .style("stroke", "grey")
                .call(d3.axisBottom(x).ticks(6))

            y = GlobalControls.scaleType() == GlobalControls.LOG_SCALE ? d3.scaleLog() : d3.scaleLinear()
            y.domain([d3.min(prices, function (d) { return +d.value; }) * 0.98, d3.max(prices, function (d) { return +d.value; })])
                .range([height, 0])
            svg.append("g")
                .style("stroke", "grey")
                .call(d3.axisLeft(y).ticks(5));

            // Add the line
            svg.append("path")
                .datum(prices)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1)
                .attr("d", d3.line()
                    .x(d => x(d.date))
                    .y(d => y(d.value))
                )

            rule_v = svg.append("g")
                .append("line")
                .attr("y1", height)
                .attr("y2", 0)
                .attr("stroke", "brown")
                .attr("stroke-dasharray", "1,3")
    
            rule_h = svg.append("g")
                .append("line")
                .attr("x1", 0)
                .attr("x2", width)
                .attr("stroke", "brown")
                .attr("stroke-dasharray", "1,3")
    
            rule_min = svg.append("g")
                .append("line")
                .attr("x1", 0)
                .attr("x2", width)
                .attr("stroke", "gray")
                .attr("stroke-dasharray", "1,3")
    
            rule_max = svg.append("g")
                .append("line")
                .attr("x1", 0)
                .attr("x2", width)
                .attr("stroke", "gray")
                .attr("stroke-dasharray", "1,3")

            rule_min.attr("transform", `translate(0,${y(this.data.min.value) + 0.5})`)
            rule_min.attr("x1", x(this.data.min.date))
            rule_max.attr("transform", `translate(0,${y(this.data.max.value) + 0.5})`)
            rule_max.attr("x1", x(this.data.max.date))
            SimpleDiagram.updatesynced(new Date())
        }

        function update(date) {
            if (!svg || current_denominator != getDenominator()) drawChart()
            if (!svg) return
            const xpos = x(date)
            const price = priceat(prices, date)
            const ypos = y(price)
            rule_v.attr("transform", `translate(${xpos + 0.5},0)`)
            rule_h.attr("transform", `translate(0, ${ypos + 0.5})`)
            svg.property("value", date).dispatch("input")
            this.rulers = {
                price: price,
                xpos: xpos,
                ypos: ypos    
            }
            this.fireInteraction()
        }

        function moved(event) {
            const target = x.invert(d3.pointer(event, this)[0] - margin.left)
            SimpleDiagram.updatesynced(target)
        }

        function clicked(event) {
            setDenominator(getDenominator() == this.symbol ? "usd" : this.symbol)
            const target = x.invert(d3.pointer(event, this)[0] - margin.left)
            this.fireRequestUpdate()
            SimpleDiagram.updatesynced(target)
        }

        const formattedData = fetch(`data/chart_${this.symbol}_usd.json`)
        .then(response => response.json())
        .then(chartdata => {
            prices = chartdata.prices.map(d => {
                return {date: new Date(d[0]), value: d[1]}
            })
            setPrice(this.symbol, prices[prices.length - 1].value)
            return  prices
        })

        formattedData.then(
            data => {
                SimpleDiagram.alldata[this.symbol] = data
                SimpleDiagram.syncedupdates.push(update.bind(this))
                drawChart()
            })
    }

    calcStats(data) {
        let minval = Infinity
        let maxval = -Infinity
        let min = {}
        let max = {}
        for (var i = 1; i < data.length; i++) {
            const val = data[i].value
            if (val >= maxval) {
                maxval = val
                max = data[i]
            }
            if (val <= minval) {
                minval = val
                min = data[i]
            }
        }
        this.data.min = min
        this.data.max = max
    }

    denominate_series(data) {
        if (getDenominator() == "usd") return data
        const denom = SimpleDiagram.alldata[getDenominator()]
        if (!denom) return null
        const copyonly = getDenominator() == this.symbol
        const newdata = []
        for (var i = 0; i < data.length; i++) {
            const denomprice = priceat(denom, data[i].date)
            const price = (copyonly ? 1 : data[i].value / denomprice)
            newdata[i] = {
                date: data[i].date,
                value: price
            }
        }
        return newdata
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
