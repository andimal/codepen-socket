var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 5000
var counter = 0

app.use(express.static(__dirname + "/"))

var server = http.createServer(app)
server.listen(port)

console.log("http server listening on %d", port)

var wss = new WebSocketServer({server: server})
console.log("websocket server created")

wss.broadcast = function(data) {
  for (var i in this.clients)
    this.clients[i].send(data);
};

wss.on("connection", function(ws) {
  console.log("websocket connection open")
  counter++
  console.log(counter)
  wss.broadcast( JSON.stringify({counter: counter}) )

  ws.on('message', function(data, flags) {
    wss.broadcast(data);
  })

  ws.on("close", function() {
    console.log("websocket connection closed")
    counter --
    wss.broadcast( JSON.stringify({counter: counter}) )
  })
})
