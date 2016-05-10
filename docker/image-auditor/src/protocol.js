/*
 * Our application defines standard string for retrieving instruments from sounds
 */
var myMap = new Map([
	["ti-ta-ti", "piano"],
	["pouet", "trumpet"],
	["trulu", "flute"],
	["gzi-gzi", "violin"],
	["boum-boum", "drum"]
]);

exports.INSTRUMENT_MAP = myMap;

/*
 * A musician is active if he had played a sound during the last 5 seconds
 */
exports.ACTIVITY_TIME = 5000;

/*
 * Our application protocol specifies the following default multicast address and port
 */
exports.PROTOCOL_MULTICAST_ADDRESS = "239.255.22.5";
exports.PROTOCOL_PORT = 2205;
