'use strict';

// Stupid hack because I have to load rxjs in CommonJS style :(
var Observable = require('rxjs/Observable').Observable;
import 'rxjs/add/observable/fromEvent';



export default class ndKorgNanoPad2 {

  constructor(args) {
    this.device = 'nanoPAD2 PAD';

    // FAKE EDRUM Mapping of notes
    this.mapping = {
      37: 'snare',
      39: 'crash',
      41: 'ride',

      47: 'hihat_open',
      49: 'hihat_closed',
      51: 'hihatControl',

      36: 'tom1',
      38: 'tom2',
      40: 'tom3',
      42: 'kick',
    };

    // Mapping of notes
    this.mapping_real = {
      37: 'c',
      39: 'cs',
      41: 'd',
      43: 'ds',
      45: 'e',
      47: 'f',
      49: 'fs',
      51: 'g',

      36: 'gs',
      38: 'a',
      40: 'as',
      42: 'b',
      44: 'range -',
      46: 'range +',
      48: 'oct -',
      50: 'oct +',
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
