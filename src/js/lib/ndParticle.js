'use strict';

export default class ndParticle {
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
  }

  draw() {

    if (this.active) {
      this._y = this._y + 10;

      this.ctx.fillStyle = this.color;
      this.ctx.fillRect(this._x, this._y, this.w, this.h);

      // Outside of canvas
      if ((this._y - this.h) > this.c.height) {
        this._y = this.y - this.h;
        this.active = false;
      }
    }

  }
}
