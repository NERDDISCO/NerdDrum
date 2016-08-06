"use strict";

import { ndConnector } from "./lib/ndConnector";
import { ndMidi } from "./lib/ndMidi";

const connect = new ndConnector({
  url : 'localhost:1337'
});

const midi = new ndMidi({
  debug : true
});
