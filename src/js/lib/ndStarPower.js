'use strict';

var Observable = require('rxjs/Observable').Observable;
import 'rxjs/add/observable/fromEvent';

export default class ndStarPower {
  constructor(args) {
    this.ctx = args.ctx;
    this.c = args.c;

    this.active = false;

    this.color = args.color;
    this.w = args.w;
    this.h = args.h;
    this.x = args.x;
    this.y = args.y;

    this._x = this.x - (this.w / 2);
    this._y = this.y - this.h;

    this.counter = 0;
  }

  listen() {
    var drawing$ =
      Observable.fromEvent(document.body, 'ndStarPowerEvent')
    ;

    // Subscribe to the ndAudioEvent stream
    drawing$.subscribe(starPowerEvent => {
      this.work(starPowerEvent);
    });
  }



  work(event) {
    // Find a particle that is not activated yet
    if (!this.active) {
      this.counter = 0;
      this.active = true;
      return false;
    }

    return true;
  }



  draw() {

    if (this.active) {
      this.counter++;
      this.ctx.fillStyle = this.color;
      this.ctx.fillRect(0, 0, this.c.width, this.c.height);

      // Outside of canvas
      if (this.counter > 60) {
        this.active = false;
      }
    }

  }
}
