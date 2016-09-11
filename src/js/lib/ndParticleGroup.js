'use strict';

import ndParticle from "./ndParticle";
// Stupid hack because I have to load rxjs in CommonJS style :(
var Observable = require('rxjs/Observable').Observable;
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/filter';





export default class ndParticleGroup {
  constructor(args) {
    this.name = args.name;

    this.particles = [];
    this.ctx = null;
    this.c = null;

    this.x = args.x;
    this.color = args.color;

    this.w = args.w || 45;
    this.h = args.h || 10;
  }



  init() {
    this._x = (this.c.width / 2) + this.x;

    this.particles.push(new ndParticle({ c : this.c, ctx : this.ctx, x : this._x, y : 0, w : this.w, h : this.h, color : this.color }));
    this.particles.push(new ndParticle({ c : this.c, ctx : this.ctx, x : this._x, y : 0, w : this.w, h : this.h, color : this.color }));
    this.particles.push(new ndParticle({ c : this.c, ctx : this.ctx, x : this._x, y : 0, w : this.w, h : this.h, color : this.color }));
    this.particles.push(new ndParticle({ c : this.c, ctx : this.ctx, x : this._x, y : 0, w : this.w, h : this.h, color : this.color }));
    this.particles.push(new ndParticle({ c : this.c, ctx : this.ctx, x : this._x, y : 0, w : this.w, h : this.h, color : this.color }));
    this.particles.push(new ndParticle({ c : this.c, ctx : this.ctx, x : this._x, y : 0, w : this.w, h : this.h, color : this.color }));
    this.particles.push(new ndParticle({ c : this.c, ctx : this.ctx, x : this._x, y : 0, w : this.w, h : this.h, color : this.color }));
    this.particles.push(new ndParticle({ c : this.c, ctx : this.ctx, x : this._x, y : 0, w : this.w, h : this.h, color : this.color }));
    this.particles.push(new ndParticle({ c : this.c, ctx : this.ctx, x : this._x, y : 0, w : this.w, h : this.h, color : this.color }));
    this.particles.push(new ndParticle({ c : this.c, ctx : this.ctx, x : this._x, y : 0, w : this.w, h : this.h, color : this.color }));
    this.particles.push(new ndParticle({ c : this.c, ctx : this.ctx, x : this._x, y : 0, w : this.w, h : this.h, color : this.color }));
    this.particles.push(new ndParticle({ c : this.c, ctx : this.ctx, x : this._x, y : 0, w : this.w, h : this.h, color : this.color }));
    this.particles.push(new ndParticle({ c : this.c, ctx : this.ctx, x : this._x, y : 0, w : this.w, h : this.h, color : this.color }));

    this.listen();
  }



  draw() {
    this.particles.forEach(particle => {
      particle.draw();
    });
  }



  listen() {
    var drawing$ =
      Observable.fromEvent(document.body, 'ndDrawingEvent')

      // Only allow "noteOn"-messages
     .filter((drawingEvent, idx, obs) => {
        return drawingEvent.nd.name === this.name;
      })
    ;

    // Subscribe to the ndAudioEvent stream
    drawing$.subscribe(drawingEvent => {
      this.work(drawingEvent);
    });
  }



  work(event) {
    this.particles.every(particle => {
      // Find a particle that is not activated yet
      if (!particle.active) {
        particle.active = true;
        return false;
      }

      return true;
    });
  }


}
