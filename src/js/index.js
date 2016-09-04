'use strict';
/*global process*/

import config from "./config";
import ndVisualization from "./lib/ndVisualization";
import ndParticleGroup from "./lib/ndParticleGroup";
import ndConnector from "./lib/ndConnector";
import ndMidi from "./lib/ndMidi";
import ndSelector from "./lib/ndSelector";

// MIDI Controllers
import ndKorgNanoPad2 from "./lib/ndKorgNanoPad2";
import ndXDrumDD530 from "./lib/ndXDrumDD530";

 // Container for the NERD DISCO, you might say it's a party.
const container = document.getElementById('nerddisco');




/*
 * Select areas on the canvas
 */
let selectors = [];

[1, 2, 3, 4, 5, 6, 7, 8].forEach(name => {
  selectors.push(new ndSelector({
    parent_element : container,
    selector_element_name : name,
    selector_element_width : config.pixel_per_led_x * config.led_row_amount,
    selector_element_height : config.pixel_per_led_y * config.led_column_amount
  }));
});

/**
 * Handle all visualzations on canvas
 */
const visualization = new ndVisualization({
  parent_element : container,
  drawing_activated : false,
  drawing_permanent : false,
  drawing_square_size_x : 400,
  drawing_square_size_y : 100,
  led_row_amount : config.led_row_amount,
  led_column_amount : config.led_column_amount,
  pixel_per_led_x : config.pixel_per_led_x,
  pixel_per_led_y : config.pixel_per_led_y,
  selectors : selectors
});

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
  debug : false
});

const nanopad2 = new ndKorgNanoPad2();
const edrum = new ndXDrumDD530();





/*
 * Observable all the things \0_0/
 */
//nanopad2.listen();
edrum.listen();

let w = 35 / 2;


visualization.addElement(new ndParticleGroup({ name : 'snare', x : 0, color : 'red' }));
visualization.addElement(new ndParticleGroup({ name : 'tom1', x : -w, color : 'green' }));
visualization.addElement(new ndParticleGroup({ name : 'tom2', x : -w * 1.5, color : 'blue' }));
visualization.addElement(new ndParticleGroup({ name : 'tom3', x : -w * 2, color : 'orange' }));
visualization.addElement(new ndParticleGroup({ name : 'crash', x : -w * 2.5, color : 'yellow' }));
visualization.addElement(new ndParticleGroup({ name : 'ride', x : w, color : 'purple' }));
visualization.addElement(new ndParticleGroup({ name : 'hihat_open', x : w * 1.5, color : 'khaki' }));
visualization.addElement(new ndParticleGroup({ name : 'kick', x : w * 2, color : 'greenyellow' }));




/**
 * Update everything:
 * - canvas
 * - LED
 * - audio data
 */
let fps = 60;
let data;

function update() {
  visualization.draw();
  data = visualization.getLEDs();
  websocket.sendLEDs(data);

  // console.log(data.length, data);

  setTimeout(function() {
    window.requestAnimationFrame(update);
  }, 1000 / fps);
}

update();
