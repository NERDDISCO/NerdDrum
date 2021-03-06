'use strict';
/*global process*/

import config from "./config";
import ndVisualization from "./lib/ndVisualization";
import ndParticleGroup from "./lib/ndParticleGroup";
import ndStarPower from "./lib/ndStarPower";
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

const selector_container = document.createElement('div');
selector_container.classList.add('selector_container');

[1, 2, 3, 4, 5, 6, 7, 8].forEach(name => {
  selectors.push(new ndSelector({
    parent_element : selector_container,
    selector_element_name : name,
    selector_element_width : config.pixel_per_led_x * config.led_row_amount,
    selector_element_height : config.pixel_per_led_y * config.led_column_amount
  }));
});

container.appendChild(selector_container);

/**
 * Handle all visualzations on canvas
 */
const visualization = new ndVisualization({
  parent_element : container,
  drawing_activated : true,
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
  debug : true
});

const nanopad2 = new ndKorgNanoPad2();
const edrum = new ndXDrumDD530();





/*
 * Observable all the things \0_0/
 */
nanopad2.listen();
edrum.listen();

let canvas_width = container.clientWidth;
let w = canvas_width / 9;

let getPosition = (n) => w * (n - 4.5);

// x should always be on n.5 to match selectors
// w should always be w*(2n+1) to match selectors
visualization.addElement(new ndParticleGroup({ name : 'snare', x : getPosition(5), w: w, color : 'rgba(244, 67, 54, .8)' }));
visualization.addElement(new ndParticleGroup({ name : 'tom1', x : getPosition(4), w: 3*w, color : 'rgba(233, 30, 99, .8)' }));
visualization.addElement(new ndParticleGroup({ name : 'tom2', x : getPosition(3), w: 3*w, color : 'rgba(156, 39, 176, .8)' }));
visualization.addElement(new ndParticleGroup({ name : 'tom3', x : getPosition(2), w: 3*w, color : 'rgba(103, 58, 183, .8)' }));
visualization.addElement(new ndParticleGroup({ name : 'crash', x : getPosition(1), w: w, color : 'rgba(63, 81, 181, .8)' }));
visualization.addElement(new ndParticleGroup({ name : 'ride', x : getPosition(5), w: w, color : 'rgba(33, 150, 243, .8)' }));
visualization.addElement(new ndParticleGroup({ name : 'hihat_open', x : getPosition(7), w: w, color : 'rgba(0, 188, 212, .8)' }));
visualization.addElement(new ndParticleGroup({ name : 'hihat_closed', x : getPosition(8), w: w, color : 'rgba(76, 175, 80, .8)' }));
visualization.addElement(new ndParticleGroup({ name : 'kick', x : getPosition(4), w : 5*w, h : 15, color : 'rgba(255, 235, 59, .8)' }));

visualization.addElement(new ndStarPower({ color : 'rgba(255, 255, 255, .8)' }));




/**
 * Update everything:
 * - canvas
 * - LED
 * - audio data
 */
let fps = 60;
let data;
let isLEDon = false;




function update() {
  visualization.draw();


  if (isLEDon) {
    data = visualization.getLEDs();
    websocket.sendLEDs(data);
  }


  setTimeout(function() {
    window.requestAnimationFrame(update);
  }, 1000 / fps);
}

update();

document.getElementById('LEDtoggle').addEventListener('click',function(){
  isLEDon = !isLEDon;
});
