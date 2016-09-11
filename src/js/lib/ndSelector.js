'use strict';

import interact from "interact.js";





/**
 * Select an area on canvas.
 */
export default class ndSelector {

  constructor(args) {
    // Element which holds the selector (e.g. canvas)
    this.parent_element = args.parent_element || null;

    // The selector element
    this.selector_element = null;

    // The name of the selector (which gets saved into the "data-name" attribute)
    this.selector_element_name = args.selector_element_name || 'A';

    // The CSS class for the selector_element
    this.selector_element_class = args.selector_element_class || 'ndSelector';

    // The width of the selector_element (default: 10 real pixel / LED (8 LEDs per row))
    this.selector_element_width = args.selector_element_width || 10 * 8;

    // The height of the selector_element (default: 10 real pixel / LED (8 LEDs per row))
    this.selector_element_height = args.selector_element_height || 10 * 8;

    // The visibility of the selector_element
    this.selector_element_visible = args.selector_element_visible || true;

    // Initialize the selector
    this.init();
  }


  /**
   * Initialize the selector:
   * - create the selector_element (div)
   * - set default position
   * - add the selector_element to its parent_element
   */
  init() {
    // Parent element is defined
    if (this.parent_element !== null) {

      // Create the selector_element using a div
      this.selector_element = document.createElement('div');

      // Set the name of the selector_element using a data attribute
      this.selector_element.setAttribute('data-name', this.selector_element_name);

      // Set the CSS class of the selector_element
      this.selector_element.className = this.selector_element_class;

      // Set the width of the selector_element
      this.selector_element.style.width = this.selector_element_width + 'px';

      // Set the height of the selector_element
      this.selector_element.style.height = this.selector_element_height + 'px';

      // Set the initial visibility of the selector_element
      this.setVisible();

      // Add the selecotr_element to the parent_element
      this.parent_element.appendChild(this.selector_element);
    }

  } // / ndSelector.init



  /**
   * Get the current position of the selector_element
   */
  get position() {
    // Return the current (x, y) position, width and height
    return {
      x : this.selector_element.offsetLeft,
      y : this.selector_element.offsetTop
    };
  }



  /**
   * Set the visibility of the selector_element.
   */
  setVisible(visible) {
    // Parameter "visible" is not defined
    if (typeof visible === 'undefined') {
      // Use the default value
      visible = this.selector_element_visible;
    }

    // Set the visiblity for the selector_element
    this.selector_element_visible = visible;

    // Set the data-attribute "data-visible" for the selector_element to use it in CSS
    this.selector_element.setAttribute('data-visible', this.selector_element_visible);
  } // / setVisible




  /**
   * Is the selector_element visible?
   */
  isVisible() {
    return this.selector_element_visible;
  } // / inVisible

} // / ndSelector
