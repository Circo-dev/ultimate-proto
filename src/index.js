import {connect, exec} from "./papi.js"
connect("ws://localhost:7274")
exec(`
def Last7Days
    HISTORY 5 mins
        STARTAT now 7 days -
        ENDAT now
        FIELDS TimeStamp High
;
`, nothing)

import {LitElement, html, nothing} from "lit"
import {customElement, property} from "lit/decorators.js"

import "./simplediagram.js"
import "./pocketrowmanager.js"
import "./ath_analysis.js"
import "./assetrow.js"
import "./pocketview.js"
import "./globalcontrols.js"

