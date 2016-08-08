'use strict';
/*global process*/

import ndConnector from "./lib/ndConnector";
import ndMidi from "./lib/ndMidi";
import ndSelector from "./lib/ndSelector";



/*
 * Container for the NERD DISCO, you might say it's a party.
 */
const container = document.getElementById('nerddisco');





/**
 * Connect the client to the server over socket.io
 */
const websocket = new ndConnector({
  url : 'localhost:1337'
});

/**
 * Control MIDI devices.
 */
const midi = new ndMidi({
  debug : true
});

console.log(process.env.PIXEL_PER_LED_X);

/*
 * Select an area on the canvas.
 */
const selector_front = new ndSelector({
  parent_element : container,
  selector_element_name : 'front',
  selector_element_x : 500,
  selector_element_width : process.env.PIXEL_PER_LED_X * 8,
  selector_element_height : process.env.PIXEL_PER_LED_Y * 30
});
