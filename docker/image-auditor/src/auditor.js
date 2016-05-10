
/*
	Source: This program is based on the Thermomether example of wasadigi github user
			https://github.com/SoftEng-HEIGVD/Teaching-Docker-UDP-sensors

	This program simulates a "data collection station", which joins a multicast
	group in order to receive sounds played by musicians.
	The sounds are transported in json payloads with the following format:

	 	{
	   		"uuid" : "aa7d8cb3-a15f-4f06-a0eb-b8feb6244a60",
	    	"sound" : "ti-ta-ti",
	    	"timestamp" : "789153154"
	    }

	Usage: to start the auditor, use the following command in a terminal
		node auditor.js
*/

/*
 * We have defined the multicast address and port in a file, that can be imported both by
 * musician.js and auditor.js. The address and the port are part of our simple 
 * application-level protocol
 */
var protocol = require('./protocol');

/*
 * We use a standard Node.js module to work with UDP
 */
var dgram = require('dgram');

/*
 * We use a Node.js module to manipulate dates
 */
var moment = require('moment');

/*
 * We use a Node.js module to manipulate ECMAScript6 Maps
 */
var Map = require('es6-map');
var dictionnary = new Map();

/*
 * Let's define a javascript class for our musician.
 * @param sound is the sound played by the musician
 * @param timestamp is the time when he played that sound
 */
function Musician(sound, activeSince, lastTimePlayed) {
	this.instrument = protocol.INSTRUMENT_MAP.get(sound);
	this.activeSince = activeSince;
	this.lastTimePlayed = lastTimePlayed;
}
Musician.prototype.setLastTimePlayed = function(lastTimePlayed) {
	this.lastTimePlayed = lastTimePlayed;
}

/*
 * Let's define a function which returns a JSON payload
 * of active musicians. A musician is active if he has
 * played a sound during the last 5 seconds.
 */
function activeMusicians() {

	// Declare an empty array of musicians
	var musicians = [];

	// Check in our disctionnary if a musician is still active
	// and add him to our musicians array if it's the case
	dictionnary.forEach(function (value, key) {

		if (value['lastTimePlayed'] < Date.now() - protocol.ACTIVITY_TIME) {
			// Remove the musician from our dictionnary
			dictionnary.delete(key);
		} else {
			// Add this musician to our musicians' array
			var data = {
				uuid: key,
				instrument: value['instrument'],
				activeSince: moment(value['activeSince']).format("YYYY-MM-DDThh:mm:ss.SSS")
			}
			musicians.push(data);
		}

	});

	// Return the array formatted properly in JSON
	return JSON.stringify(musicians);
}

/* 
 * Let's create a datagram socket. We will use it to listen for datagrams published in the
 * multicast group by musicians and containing sounds
 */
var s = dgram.createSocket('udp4');
s.bind(protocol.PROTOCOL_PORT, function() {
  console.log("Joining multicast group");
  s.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});

/* 
 * This call back is invoked when a new datagram has arrived.
 * The goal is to have our dictionnary up to date
 */
s.on('message', function(msg, source) {

	// Get data in JSON format
	json = JSON.parse(msg);

	// Add musician if he's not contained in our dictionnary
	// or modify the last time he played if he's already contained
	if (!dictionnary.has(json['uuid'])) {
		dictionnary.set(json['uuid'], new Musician(json['sound'], Date.now(), json['timestamp']));
	} else {
		dictionnary.get(json['uuid']).setLastTimePlayed(json['timestamp']);
	}

	// This is just to display active musicians to show that it works
	console.log(activeMusicians());
});

/*
 * Include a TCP server with Node.js' net module
 */
var net = require('net');

var server = net.createServer((socket) => {
	socket.write(activeMusicians());
	socket.pipe(socket);
});
server.listen(protocol.PROTOCOL_PORT);