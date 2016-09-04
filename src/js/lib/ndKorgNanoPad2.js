'use strict';

import Observable from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';



export default class ndKorgNanoPad2 {

  constructor(args) {
    // Stupid hack because I have to load rxjs in CommonJS style :(
    this._Observable = Observable.Observable;

    this.device = 'nanoPAD2 MIDI';
  }


  /*
   * Listen to ndMidiEvent's
   */
  listen() {

    var audio$ = this._Observable.fromEvent(document.body, 'ndMidiEvent');

    // Subscribe to the ndAudioEvent stream
    audio$.subscribe(midiEvent => {

      // Work only if it's the desired device
      if (midiEvent.nd.message.currentTarget.name.indexOf(this.device) > -1) {
        this.work(midiEvent);
      }

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
