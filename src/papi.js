import * as MsgPack from "@ygoe/msgpack"

let ws = null
let block_queue = []
let out_queue = []
let opened = false

export function connect(url) {
    ws = new WebSocket(url);
    // TODO: Error handling
    ws.onopen = e => {// TODO: message identification subprotocol (needs patching HTTP.jl)
        opened = true
        out_queue.forEach(send)
        out_queue = null
    } 
    ws.onmessage = e => {
        let promfns = block_queue.shift()
        promfns.resolve(e.data)
    }
}

export function empty(blob) {
    return null
}

export function text(blob) {
    return blob.text()
}

export function json(blob) {
    return blob.text().then(txt => JSON.parse(txt))
}
// (blob => blob.arrayBuffer()), msgpack.deserialize

export function exec(program, preprocessor = json) {
    return new Promise((resolve, reject) => {
        if (opened) {
            send(program)
        } else {
            out_queue.push(program)
        }
        block_queue.push({resolve, reject})
    }).then(preprocessor)
}

function send(program) {
    ws.send(program)
}

