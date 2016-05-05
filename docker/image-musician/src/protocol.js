/*
 * Our application defines standard string for simulating sounds played by the instruments
 */
 var myMap = new Map();

// Define the values
myMap.set("piano", "ti-ta-ti");
myMap.set("trumpet", "pouet");
myMap.set("flute", "trulu");
myMap.set("violin", "gzi-gzi");
myMap.set("drum", "boum-boum");

exports.INSTRUMENT_MAP = myMap;

/*
 * Our application protocol specifies the following default multicast address and port
 */
exports.PROTOCOL_MULTICAST_ADDRESS = "239.255.22.5";
exports.PROTOCOL_PORT = 2205;