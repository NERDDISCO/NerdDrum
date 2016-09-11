'use strict';

// Stupid hack because I have to load rxjs in CommonJS style :(
var Observable = require('rxjs/Observable').Observable;
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/filter';





export default class ndXDrumDD530 {

  constructor(args) {
    // Name of the MIDI device
    this.device = 'e-Drum MIDI';

    // Mapping of notes
    this.mapping = {
      38: 'snare',
      48: 'tom1',
      45: 'tom2',
      43: 'tom3',
      46: 'hihat_open',
      42: 'hihat_closed',
      44: 'hihatControl',
      49: 'crash',
      55: 'crash',
      51: 'ride',
      36: 'kick',
    };

    this.event = new CustomEvent("ndDrawingEvent", { nd : {} });
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
    this.event.nd.name = this.mapping[midiEvent.nd.note];

    console.log(midiEvent.nd);

    document.body.dispatchEvent(this.event);
  }

} // / ndKorgNanoPad2
