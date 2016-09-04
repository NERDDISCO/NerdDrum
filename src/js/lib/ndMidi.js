'use strict';

export default class ndMidi {

  constructor(args) {
    // System Exclusive Support?
    this.sysex = args.sysex || false;

    // @see MIDIAccess
    this.access = args.access || null;

    // @see MIDIOutputMap
    this.outputMap = args.outputMap || null;

    // Show debugging logs?
    this.debug = args.debug || false;

    //
    this.event = new CustomEvent("ndMidiEvent", { nd : {} });
/*
    // A list of devices
    this.devices = args.devices || null;

    // Internal representation of the devices
    this._devices = new Map();

    if (this.devices !== null) {

      // Iterate over all devices to find the current input
      for (let device of this.devices) {
        // The mapping of input elements
        device.inputMapping = new Map();

        // Add the device to the Map of devices
        this._devices.set(device.name, device);
      }

    }*/

    this.connect();

  } // / constructor





  /**
   * Get permission to use MIDI devices.
   */
  connect() {

    // Get permission to use connected MIDI devices
    navigator
      .requestMIDIAccess({ sysex: this.sysex })
      .then(
        // Success
        this.connectSuccess.bind(this),
        // Failure
        this.connectFailure.bind(this)
      );

  } // / ndMidi.connect



  /**
   * Got permission to use MIDI devices.
   *
   * @param MIDIAccess access
   */
  connectSuccess(access) {

    // Save a reference to MIDIAccess
    this.access = access;

    // Get the outputs for connected MIDI devices
    this.outputMap = this.access.outputs;

    // Handle all inputs
    this.handleInputs();

    // TODO: Handle outputs

    // Listen to stateChange events
    this.access.addEventListener('statechange', this.stateChange.bind(this));

  } // / ndMidi.connectSuccess



  /**
   * Handle all input ports
   *
   */
  handleInputs() {

    // Iterate over all input ports
    for (let input of this.access.inputs.values()) {

      // Listen to MIDIMessageEvent for this input port
      input.onmidimessage = this.inputMessage.bind(this);

      // Show input information
      if (this.debug) {
        console.log("type:", input.type, "| id:", input.id, "| manufacturer:", input.manufacturer, "| name:", input.name, "| version:", input.version);
      }

/*
      // The input is a defined device
      if (this._devices.has(input.name)) {

        // Get the single device
        let device = this._devices.get(input.name);

        // Mapping for the current device exists
        if (device.mapping) {

          // Iterate over all input element mappings
          for (var key in device.mapping) {

            // Get the note for the current
            let note = device.mapping[key];

            // Add the note to the inputMapping of the device
            device.inputMapping.set(note, {
              pressed : false,
              velocity : 0
            });

          } // / Iterate over all input element mappings

        } // / Mapping for the current input exists

      } // / The input is a defined device
*/


    } // / Iterate over all input ports

  } // / ndMidi.handleInputs



  /**
   * It's not possible to use the Web MIDI API.
   */
  connectFailure(message) {

    console.error(message);

  } // / ndMidi.connectFailure



  /**
   * State of a MIDI devices changed: connected / disconnected
   *
   * @param  MIDIConnectionEvent e
   */
  stateChange(e) {

    if (this.debug) {
      console.log(e, e.port.type);
    }

    if (e.port.type == "input") {
      this.handleInputs();
    }

  } // / ndMidi.stageChange



  /**
   * Handle MIDIMessageEvent's that are send from the MIDI device to the PC.
   *
   * @param  {MIDIMessageEvent} message
   */
  inputMessage(message) {

    /**
     * @TODO: HANDLE WTF-ERROR CORRECTLY AND NOT LIKE THIS
     *
     * Reproduce
     * - Connect a MIDI device
     * - Detach MIDI device
     * - Connect MIDI device
     * ---> The "midimessage" event is fired
     */
    if (message.data.length == 1) {
      return;
    }

    // Create nd.message
    this.event.nd = {};
    this.event.nd.message = message;
    this.event.nd.command = message.data[0].toString(16).charAt(0);
    this.event.nd.channel = message.data[0].toString(16).charAt(1);
    this.event.nd.name = this.getCommandName(this.event.nd.command);
    this.event.nd.note = message.data[1];
    this.event.nd.velocity = message.data[2];
    this.event.nd.type = message.data[0];

    // Send nd.message into the world
    document.body.dispatchEvent(this.event);

  } // / ndMidi.inputMessage





  getCommandName(command) {

    switch (command) {
      case '8': return 'noteOff';
      case '9': return 'noteOn';
      case 'a': return 'aftertouch';
      case 'b': return 'continuousController';
      case 'c': return 'patchChange';
      case 'd': return 'channelPressure';
      case 'e': return 'pitchBend';
      case 'f': return 'nonMusicalCommand';
      default: break;
    }

  }

} // / ndMidi
