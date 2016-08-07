'use strict';

import io from "socket.io-client";

export class ndConnector {

  constructor(args) {
    this.url = args.url || 'http://nerddisco.master:1337';

    // The socket namespace
    this.namespace = args.namespace || 'NERDDISCO-Studio';

    // Create a new Web Socket client using the socket.io-client
    this.webSocket = io(this.url + '/' + this.namespace);
  }

  sendLEDs(leds) {
    this.webSocket.emit('NERDDISCO.input', leds);
  }

}
