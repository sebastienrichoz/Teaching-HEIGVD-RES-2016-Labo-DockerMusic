/*
	Source: This program is based on the Thermomether example of wasadigi github user
		https://github.com/SoftEng-HEIGVD/Teaching-Docker-UDP-sensors

	This program simulates a musician in an orhcestra, who plays a sound each second 
	depending his instrument and publishes it on a multicast group.
	Other programs can join the group and receive the sound.

	The sound is transported in json payloads with the following format:
	
	{
		"uuid" : "aa7d8cb3-a15f-4f06-a0eb-b8feb6244a60",
		"sound" : "ti-ta-ti",
		"timestamp" : "789153154"
	}

	Usage: 	to start a musician, type the following command in a terminal
	(of course, you can run several musicians in parallel and observe that all
	sounds are transmitted via the multicast group):
	
	node musician.js <instrument>
	
	where <instrument> can be one of the following :
   	- piano
	- trumpet
	- flute
	- violin
	- drum

	@author : 	Sébastien Richoz
				Patrick Djomo
*/

/*
 * Get our global constants
 */
var protocol = require('./protocol');

/*
 * We use the Node.js uuid package to generate uuid
 */
var uuid = require('uuid');

/*
 * We use a standard Node.js module to work with UDP
 */
var dgram = require('dgram');

/*
 * Let's create a datagram socket. We will use it to send our UDP datagrams 
 */
var server = dgram.createSocket('udp4');

/*
 * Let's define a javascript class for our musician.
 * @param instrument is the instrument played by the musician
 */
function Musician(instrument) {

	/*
	 * Depending the choosen instrument, it plays a different sound
	 */
	if ( (this.sound = protocol.INSTRUMENT_MAP.get(instrument)) == undefined)
	 	throw "Error. The instrument you specified isn't played by this orchestra.";

	/*
	 * Let's generate a v4 random uuid for our musician
	 */
	this.uuid = uuid.v4();

	/*
	 * We will simulate the emition of the sound on a periodic base
	 */
	Musician.prototype.update = function() {

		/*
		 * Create the data as a dynamic javascript object,
		 * add the 3 properties and serialize the object to a JSON string
		 */
		var data = {
			uuid: this.uuid,
			sound: this.sound,
			timestamp: Date.now()
		}
		var payload = JSON.stringify(data);

		/*
		 * Finally, encapsulate the paylod in a UDP datagram, which we publish
		 * on the multicast address. All subscribers to this address will receive the message.
		 */
		message = new Buffer(payload);
		server.send(message, 0, message.length, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS, function(err, bytes) {
			console.log("Sending payload: " + payload + " via port " + server.address().port);
		});
	}

	/*
	 * Emit the sound every second
	 */
	setInterval(this.update.bind(this), 1000);

}

/*
 * Let's get the musician instrument from the command line attribute
 */
if (process.argv.length < 3) {
	console.log("Error. You should specify an instrument as third argument.");
} else { // The following args are ignored
	var instrument = process.argv[2];
	
	/*
	 * Let's create a new musician - the regular publication of sounds will
	 * be initiated within the constructor
	 */
	try {
		var m1 = new Musician(instrument);
	} catch (e) {
		console.log(e);
	}
}
