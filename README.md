# NerdDrum

What happens if you combine an *Electronic Drum Set* with the browser to create *visualizations* on a *LED Curtain*?

![XDrum DD-530 + Adafruit NeoPixel](https://github.com/NERDDISCO/NerdDrum/blob/master/public/asset/img/xdrum_neopixel.jpg)

_Images:_ Left - [XDrum DD-530](http://www.kirstein.de/E-Drums-Sets/XDrum-DD-530-Mesh-Heads-E-Drum-SET-mit-Hocker-und-Kopfhoerer.html); Right -  [Adafruit NeoPixel Stripe - 30 LED / m - white](https://www.adafruit.com/products/1376)



---

## LED Curtain

* 8 x [1m Adafruit *NeoPixel Stripe* (30 LED / m)](https://www.adafruit.com/products/1376)
* 1 x [Adafruit Fadecandy](https://www.adafruit.com/product/1689)

You can find the [current status on Twitter](https://twitter.com/TimPietrusky/status/759701824555225088).

## Fadecandy

### Map

```
"map": [
  [ 0, 0, 0, 30 ],
  [ 0, 30, 64, 30 ],
  [ 0, 60, 128, 30 ],
  [ 0, 90, 192, 30 ],
  [ 0, 120, 256, 30 ],
  [ 0, 150, 320, 30 ],
  [ 0, 180, 384, 30 ],
  [ 0, 210, 448, 30 ]
]
```

1. A channel number. This will always be 0 in our application.
2. A starting pixel number as we’d like to address them. For example, the first pixel of the second strand will be 30 (normally it would be 64). First pixel of the third strand will be 60. And so forth through 210, the first pixel of the last strand.
3. The corresponding pixel number as handled by this Fadecandy board. Remember, it regards every strand as 64 pixels, always, even if physically shorter. So we’ve mapped the second strand to position 64, third to 128, etc. Unlike the prior value, these numbers apply to the current board only, not globally, so they’ll always be from 0 to 511, never larger.
4. The number of pixels being remapped. 30 in this case, the length of our strips.



---

## Contributor

* [Anikó Fejes](https://twitter.com/hubudibu)



---

## Connect with NERD DISCO

[@NERDDISCO](https://twitter.com/NERDDISCO)
