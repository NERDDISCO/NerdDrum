'use strict';

export default class ndVisualization {

  constructor(args) {
    // The canvas element
    this.canvas_element = args.canvas_element || null;
    this.c = this.canvas_element;
    // Is the mouse down on the canvas_element
    this.canvas_element_is_mouse_down = false;
    // The event that is fired when the mouse is down
    this.canvas_element_mouse_down_event = null;
    // The rendering context of the canvas_element
    this.canvas_context = null;
    this.ctx = null;
    // The background color for the canvas_context
    this.canvas_context_background_color = args.canvas_context_background_color || 'rgb(0, 0, 0)';
    // The parent element for the canvas_element
    this.parent_element = args.parent_element || document.body;

    // A queue of elements which can be rendered to the canvas
    this.element_queue = [];
    // Group of ndSelector
    this.selectors = args.selectors || null;

    // Is drawing activated?
    this.drawing_activated = args.drawing_activated || false;
    // The drawing should not be removed
    this.drawing_permanent = args.drawing_permanent || false;
    // Size of one square
    this.drawing_square_size_x = args.drawing_square_size_x || 60;
    this.drawing_square_size_y = args.drawing_square_size_y || 60;
    this.color = args.color || 1;
    this.current_time = 0;

    // Amount of pixel that are used per LED (pixel_per_led * pixel_per_led)
    this.pixel_per_led_x = args.pixel_per_led_x || 10;
    this.pixel_per_led_y = args.pixel_per_led_y || 10;
    // Amount of LED in every row
    this.led_row_amount = args.led_row_amount || 8;
    // Amount of LED in every column
    this.led_column_amount = args.led_column_amount || 8;

    // Initialize this instance of ndVisualization
    this.init();
  }



  init() {
    // The canvas_element is not defined
    if (this.canvas_element === null) {
      // Create the canvas_element
      this.canvas_element = document.createElement('canvas');
      // Add the canvas_element to the parent_element
      this.parent_element.appendChild(this.canvas_element);
    }

    // Listen to "resize" events
    window.addEventListener('resize', function(event) {
      // Resize the canvas_element
      this.resize();
    }.bind(this), false); // / window.addEventListener('resize')

    // Listen to the mousedown event on the canvas_element
    this.parent_element.addEventListener('mousedown', function(event) {
      event.preventDefault();

      // Drawing is activated
      if (this.drawing_activated) {
        // Mouse is down
        this.canvas_element_is_mouse_down = true;

        // Reference to the event
        this.canvas_element_mouse_down_event = event;
      }

    }.bind(this), true); // / this.canvas_element.addEventListener('mousedown')

    // Listen to the mouseup event on the canvas_element
    this.parent_element.addEventListener('mouseup', function(event) {
      event.preventDefault();

      this.canvas_element_is_mouse_down = false;
      this.canvas_element_mouse_down_event = null;

    }.bind(this), true); // / this.canvas_element.addEventListener('mouseup')

    // Listen to the mousemove event on the canvas_element
    this.parent_element.addEventListener('mousemove', function(event) {
      // Drawing is activated
      if (this.drawing_activated && this.canvas_element_is_mouse_down) {
        event.preventDefault();

        // Update the mouse_down_event
        this.canvas_element_mouse_down_event = event;
      }
    }.bind(this), true); // / this.canvas_element.addEventListener('mousemove')

    // Set the canvas_context
    this.canvas_context = this.canvas_element.getContext('2d');
    this.ctx = this.canvas_context;
    this.c = this.canvas_element;
    // Resize the canvas_element
    this.resize();
  }



  /**
   * Resize the canvas and every ndVisualizationElement.
   *
   */
  resize() {
    // Set the width of the canvas_element using the width of the parent_element
    this.canvas_element.width = this.parent_element.clientWidth;
    // Set the height of the canvas_element using the height of the parent_element
    this.canvas_element.height = this.parent_element.clientHeight;

    // Iterate over all elements in the queue
    for (var i = 0; i < this.element_queue.length; i++) {
      // @TODO: Implement resize for every child element
      // Resize the current element
      // this.element_queue[i].resize();
    }

    // Redraw the default canvas_context
    this.drawDefaultCanvasContext();
  }





  /**
   * Draw the default canvas_context:
   * - background color
   */
  drawDefaultCanvasContext() {
    // Clear the canvas_context
    this.canvas_context.clearRect(0, 0, this.canvas_element.width, this.canvas_element.height);

    // Set the background color of the canvas_context
    this.canvas_context.fillStyle = this.canvas_context_background_color;
    this.canvas_context.fillRect(0, 0, this.canvas_element.width, this.canvas_element.height);
  }



  draw() {


    // Drawing is not permanent
    if (!this.drawing_permanent) {
      this.canvas_context.clearRect(0, 0, this.canvas_element.width, this.canvas_element.height);
      // Redraw the background
      // this.canvas_context.fillStyle = "rgba(0, 0, 0, .2)";
      // this.canvas_context.fillRect(0, 0, this.canvas_element.width, this.canvas_element.height);
    }

    if (this.drawing_activated && this.canvas_element_is_mouse_down) {
      // Draw a square at the (x, y) position of the event
      //this.drawSquare(this.canvas_element_mouse_down_event);
      this.drawCircle(this.canvas_element_mouse_down_event);
    }

    if (this.canvas_element === undefined || this.canvas_context === undefined) {
      return;
    }

    // Iterate over all elements in the queue
    for (var i = 0; i < this.element_queue.length; i++) {
      this.element_queue[i].draw();
    }
  }



  /**
   * Add an element to the element_queue.
   */
  addElement(element) {
    element.c = this.canvas_element;
    element.ctx = this.canvas_context;

    if (typeof element.init === 'function') {
      element.init();
    }

    // Add the element to the element_queue
    this.element_queue.push(element);
  }


  /**
   * Draw a square onto the canvas_context
   */
  drawSquare(event) {
    this.color = this.color + 4;

    // Random color after x ms
    if ((this.current_time - event.timeStamp) > event.timeStamp) {
      this.color = 360 / 255 * this.getRandomInt(0, 255);
      this.current_time = event.timeStamp + 500;
    }

    //this.canvas_context.fillStyle = "hsla(" + (360 / 255 * this.getRandomInt(0, 255)) + ", 100%, 60%,  .5)";
    this.canvas_context.fillStyle = "hsla(" + this.color + ", 100%, 60%,  .75)";
    this.canvas_context.fillRect(
//      event.x - this.drawing_square_size / 2 + (10 * Math.random() / 2),
//      event.y - this.drawing_square_size / 2 + (10 * Math.random() / 2),
event.x - this.drawing_square_size_x / 2,
event.y - this.drawing_square_size_y / 2,
      this.drawing_square_size_x,
      this.drawing_square_size_y
    );
  }



  /**
   * Draw a rainbow circle onto the canvas_context
   */
  drawCircle(event) {
    let r = 100;
    let x = (event.x);
    let y = (event.y);
    let factor = 1.237;
    let factor_color = 1;

    this.color = (this.color + 4) % 360;

    for (var i = 0; i < 360; i += factor_color) {
      this.canvas_context.beginPath();
      this.canvas_context.fillStyle = "hsla(" + ( i + this.color) + ", 100%, 50%, 1)";
      this.canvas_context.arc(
        (x) + (i * factor),
        y,
        r,
        0,
        2 * Math.PI,
        false
      );
      this.canvas_context.fill();
    }
  }



  getLEDs() {
    var openPixelControl = [];

    // selectors is defined
    if (this.selectors !== null) {

      // The (x, y) position of the selector
      var selector_position;
      // The image_data represented by the position / size of the selector
      var image_data;
      // The list of RGB values
      var rgb_list;
      // The position of the current pixel
      var position;
      // The current led in the specific row
      var led_row;
      // The current led in the specific column
      var led_column;
      // The RGB values for every LED
      var leds;
      // The index of the current LED
      var current_led;


      // Iterate over all selectors
      this.selectors.forEach(function(selector) {

        // Reset
        position = 0;
        current_led = 0;
        led_row = 0;
        led_column = 0;
        leds = [];

        // Get current (x, y) position from the selector
        selector_position = selector.position;

        // Get the image data from the canvas using the selector_position
        image_data = this.canvas_context.getImageData(
          selector_position.x,
          selector_position.y,
          this.pixel_per_led_x * this.led_row_amount,
          this.pixel_per_led_y * this.led_column_amount
        );

        // Get the data
        rgb_list = image_data.data;


        // For every row of pixels
        for (var row = 0; row < this.led_row_amount * this.pixel_per_led_x; row++) {
          // For every column pixels
          for (var column = 0; column < this.led_column_amount * this.pixel_per_led_y; column++) {

            // Set the LED for the current pixel
            current_led = led_row * this.led_row_amount + led_column;

            // Set the position of the current pixel
            // - current row: (row * (this.pixel_per_led * this.led_column_amount * 4))
            // - current column: (column * 4)
            position = (row * (this.pixel_per_led_y * this.led_column_amount * 4)) + (column * 4);

            // console.log(led_row, led_column, current_led, position);

            // The current_led is not defined inside leds
            if (typeof leds[current_led] === 'undefined') {
              // @TODO [TimPietrusky] jsperf about "insert array2 into array1 at position x"
              leds.splice(current_led, 0, []);

              // Initialize the 3 value array [red, green, blue] for the current_led
              leds[current_led][0] = 0;
              leds[current_led][1] = 0;
              leds[current_led][2] = 0;
            }

            // Sum up all red values
            leds[current_led][0] += rgb_list[position];

            // Sum up all green values
            leds[current_led][1] += rgb_list[position + 1];

            // Sum up all blue values
            leds[current_led][2] += rgb_list[position + 2];

            // Increase current led per column
            if ((column + 1) % this.pixel_per_led_y === 0) {
              ++led_column;
            }

          } // / for every column of LEDs

          // Reset led_column
          led_column = 0;

          // Increase current led per row
          if ((row + 1) % this.pixel_per_led_x === 0) {
            ++led_row;
          }

        } // / for every row of LEDs


        // Iterate over all leds
        for (var i = 0; i < leds.length; i++) {
          // Create a normalized value for red
          openPixelControl.push(Math.floor(leds[i][0] / (this.pixel_per_led_x * this.pixel_per_led_y)));
          // Create a normalized value for green
          openPixelControl.push(Math.floor(leds[i][1] / (this.pixel_per_led_x * this.pixel_per_led_y)));
          // Create a normalized value for blue
          openPixelControl.push(Math.floor(leds[i][2] / (this.pixel_per_led_x * this.pixel_per_led_y)));
        }

      }, this); // / this.selectors.forEach

    } // / selectors is defined


    return openPixelControl;
  }


  getRandomInt(min, max) {
    min = Math.floor(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

} // / ndVisualization
