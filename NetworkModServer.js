var net = require("net");

var server = net.createServer();

var clients = [];
var clientsName = [];
var clientsPosX = [];
var clientsPosY = [];

server.on("connection", function(socket) {
	var remoteAdress = socket.remoteAdress + ":" + socket.remotePort;
	console.log("New client connection is made %s", remoteAdress);
	clients.push(socket);
	var myName = "";
	
	socket.on("data", function(d) {
		var res = d.toString().split(" ");
		if(res[0] == "SetName") {
			clientsName.push(res[1]);
			clientsPosX.push(0);
			clientsPosY.push(0);
			myName = res[1];
			socket.write("Willkommen");
		} else if(res[0] == "UpdatePosition") {
			clientsPosX[clientsName.indexOf(myName)] = res[2];
			clientsPosY[clientsName.indexOf(myName)] = res[3];
			
			clients.forEach(function(client, index) {
				if(client != socket) {
					socket.write("UpdatePosition " + clientsName[index] + " " + clientsPosX[index] + " " + clientsPosY[index]);
				}
			});
			socket.write("idle");
		}
		console.log("Data from %s(%s): %s", remoteAdress, myName, d);
	});
	
	socket.on("disconnect", function() {
		clients.splice(clients.indexOf(socket), 1);
		clientsName.splice(clientsName.indexOf(myName));
	})
	
	socket.on("error", function(err) {
		clients.splice(clients.indexOf(socket), 1);
		clientsName.splice(clientsName.indexOf(myName));
		console.log("Connection %s error: %s", remoteAdress, err.message);
	});
});

server.listen(9000, function() {
	console.log("Server listening to %j", server.address());
});
