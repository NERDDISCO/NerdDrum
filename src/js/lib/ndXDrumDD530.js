'use strict';

import Observable from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/filter';



export default class ndXDrumDD530 {

  constructor(args) {
    // Stupid hack because I have to load rxjs in CommonJS style :(
    this._Observable = Observable.Observable;

    // Name of the MIDI device
    this.device = 'e-Drum MIDI';

    // Mapping of notes
    this.mapping = {
      snare : 38,
      tom1 : 48,
      tom2 : 45,
      tom3 : 43,
      hihat_open : 46,
      hihat_closed : 42,
      hihatControl : 44,
      crash : 49,
      ride : 51,
      kick : 36
    };

    this.event = new CustomEvent("ndDrawingEvent", { nd : {} });
  }


  /*
   * Listen to ndMidiEvent's
   */
  listen() {

    var midi$ =
      this._Observable.fromEvent(document.body, 'ndMidiEvent')

      // Only get messages from a specific device
      .filter((midiEvent, idx, obs) => {
        return midiEvent.nd.device.indexOf(this.device) > -1;
      })

      // Only allow "noteOn"-messages
     .filter((midiEvent, idx, obs) => {
        return midiEvent.nd.name === 'noteOn';
      })

      // Only use messages with a velocity bigger than 0
      .filter((midiEvent, idx, obs) => {
        return midiEvent.nd.velocity > 0;
      })
    ;

    // Subscribe to the ndAudioEvent stream
    midi$.subscribe(midiEvent => {
      this.work(midiEvent);
    });

  }


  /*
   * Get some work done
   */
  work(midiEvent) {
    this.event.nd = {};

    switch (midiEvent.nd.note) {
      case this.mapping.tom1: this.event.nd.name = 'tom1';
        break;

      case this.mapping.tom2:  this.event.nd.name = 'tom2';
        break;

      case this.mapping.tom3:  this.event.nd.name = 'tom3';
        break;

      case this.mapping.snare: this.event.nd.name = 'snare';
        break;

      case this.mapping.hihat_open: this.event.nd.name = 'hihat_open';
        break;

      case this.mapping.hihat_closed: this.event.nd.name = 'hihat_closed';
        break;

      case this.mapping.hihatControl: this.event.nd.name = 'hihatControl';
        break;

      case this.mapping.crash: this.event.nd.name = 'crash';
        break;

      case this.mapping.ride: this.event.nd.name = 'ride';
        break;

      case this.mapping.kick: this.event.nd.name = 'kick';
        break;

      default:

    }

    document.body.dispatchEvent(this.event);
  }

} // / ndKorgNanoPad2
