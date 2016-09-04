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

    this.init();
  } // / constructor



  /**
   * Get permission to use MIDI devices.
   */
  init() {
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

    let command = message.data[0].toString(16).charAt(0);
    let channel = message.data[0].toString(16).charAt(1);

    // Create nd.message
    this.event.nd = {};
    this.event.nd.name = this.getCommandName(command);
    this.event.nd.note = message.data[1];
    this.event.nd.velocity = message.data[2];
    //this.event.nd.type = message.data[0];
    //this.event.nd.command = command;
    //this.event.nd.channel = channel;
    this.event.nd.device = message.currentTarget.name;
    this.event.nd.timeStamp = message.timeStamp;
    //this.event.nd.message = message;

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
