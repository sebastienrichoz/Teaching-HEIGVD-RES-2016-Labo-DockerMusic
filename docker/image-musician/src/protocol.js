/*
 * Our application defines standard string for simulating sounds played by the instruments
 */
 var myMap = new Map([
  	["piano", "ti-ta-ti"],
  	["trumpet", "pouet"],
  	["flute", "trulu"],
  	["violin", "gzi-gzi"],
  	["drum", "boum-boum"]
]);

exports.INSTRUMENT_MAP = myMap;

/*
 * Our application protocol specifies the following default multicast address and port
 */
exports.PROTOCOL_MULTICAST_ADDRESS = "239.255.22.5";
exports.PROTOCOL_PORT = 2205;
