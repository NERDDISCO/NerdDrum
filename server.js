'use strict';

var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    fadecandyClient = require('nd-fadecandy-client')
;

// sendFile options
var options = {
  root: __dirname + '/public/',
  dotfiles: 'deny',
  headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
  }
};

// Enable static files
app.use(express.static('public/asset'));

// Send the index.html to new clients
app.get('/', function(req, res){
  res.sendFile('index.html', options);
});

http.listen(1337, function(){
  console.log('listening on *:1337');
});

var pixels = null;
var color = { red : 0, green : 0, blue : 0 };

// Connect to the Fadecandy Server
var client = new fadecandyClient({
  host: 'localhost',
  port: 7890,
  debug : false
});


/**
 * Connections from the browser (NERDDISCO Studio)
 */
// Create custom namespace
var socket_studio = io.of('/NERDDISCO-Studio');

// Listen to connections on this custom namespace
socket_studio.on('connection', function(socket) {
  console.log('NERD DISCO - Studio connected');

  // Received and LED array from the client
  socket.on('NERDDISCO.input', function(data) {
    pixels = data;
    draw();
  });

});





/**
 * Extract the pixel data from the given position
 *
 * @param  Interger position
 *
 * @return Object pixel
 */
function getPixel(position) {
  var pixel = {};

  var _position = position * 3;

  // Pixel exists
  if (pixels !== null && pixels[_position - 1] !== undefined) {
    // Blue
    pixel.b = pixels[_position - 1];

    // Green
    pixel.g = pixels[_position - 2];

    // Red
    pixel.r = pixels[_position - 3];
  } else {
    // Black
    pixel.a = pixel.r = pixel.g = pixel.b = 0;

  }

  return pixel;
}

function draw() {

    var amount = 64 * 5;

    for (var pixel = 0; pixel < amount; pixel++) {
      color = getPixel(pixel + 1);
      client.setPixel(pixel, color.r, color.g, color.b);
    }

    client.writePixels();
}
