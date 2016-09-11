'use strict';

// Stupid hack because I have to load rxjs in CommonJS style :(
var Observable = require('rxjs/Observable').Observable;
import 'rxjs/add/observable/fromEvent';



export default class ndKorgNanoPad2 {

  constructor(args) {
    this.device = 'nanoPAD2 MIDI';
  }


  /*
   * Listen to ndMidiEvent's
   */
  listen() {
    var midi$ =
      Observable.fromEvent(document.body, 'ndMidiEvent')

      // Only get messages from a specific device
      .filter((midiEvent, idx, obs) => {
        return midiEvent.nd.device.indexOf(this.device) > -1;
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
    console.log(midiEvent.nd);
    //console.log(midiEvent.nd.note, midiEvent.nd.type, midiEvent.nd.velocity);
  }

} // / ndKorgNanoPad2
