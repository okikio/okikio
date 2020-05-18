// import { _is, keys, _argNames } from "./util";
/*
// A small event emitter
export default class _event {
    constructor() {
        this._events = {}; // Event info.
        this._emit = [];  // Store events set to be emitted
    }

    // Prepare the event
    _preEvent(evt) {
        if (!this._events[evt]) // List of event's
            { this._events[evt] = []; }
        return this._events[evt];
    }

    // Apply event as object
    _eventApp(callback, scope, event) {
        return {
            callback: callback,
            scope: scope,
            event: event
        };
    }

    // Add a listener for a given event
    on(evt, callback, scope) {
        let $EvtApp, $evt;
        if (_is.undef(evt)) { return; } // If there is no event break
        if (_is.str(evt)) { evt = evt.split(/\s/g); }
        if (!_is.arr(evt) && !_is.obj(evt)) { evt = [evt]; } // Set evt to an array

        // Loop through the list of events
        keys(evt).forEach(function (key) {
            $evt = evt[key];
            if (_is.obj(evt) && !_is.arr(evt)) {
                $EvtApp = this._eventApp($evt, callback || this, key);
                this._preEvent(key).push($EvtApp); // Set event list
            } else {
                $EvtApp = this._eventApp(callback, scope, $evt);
                this._preEvent($evt).push($EvtApp); // Set event list
            }
        }, this);
        return this;
    }

    // Removes a listener for a given event
    off(evt, callback, scope) {
        let $evt;
        if (_is.undef(evt)) { return; } // If there is no event break
        if (_is.str(evt)) { evt = evt.split(/\s/g); }
        if (!_is.arr(evt) && !_is.obj(evt)) { evt = [evt]; } // Set evt to an array

        let _off = function ($evt, callback, scope) {
            let _Evt = this._preEvent($evt);

            if (callback) {
                let i = 0, val, app = this._eventApp(callback, scope, $evt);
                for (; i < _Evt.length; i ++) {
                    val = _Evt[i];
                    if (val.callback === app.callback &&
                         val.scope === app.scope)
                         { break; }
                }

                _Evt.splice(i, 1);
            } else { this._events[$evt] = undefined; }
        };

        keys(evt).forEach(function (key) {
            $evt = evt[key];
            if (_is.obj(evt) && !_is.obj(evt)) {
                _off.call(this, key, $evt, scope);
            } else { _off.call(this, $evt, callback, scope); }
        }, this);
        return this;
    }

    // Adds a one time event listener for a given event
    once(evt, callback, scope) {
        if (_is.undef(evt)) { return; } // If there is no event break
        if (_is.str(evt)) { evt = evt.split(/\s/g); }
        if (!_is.arr(evt) && !_is.obj(evt)) { evt = [evt]; } // Set evt to an array

        let $Fn = function (...args) {
            this.off(evt, $Fn, scope);
            callback.apply(scope, args);
        };

        this.on(evt, $Fn, scope);
        return this;
    }

    // Call all function(s) within an event
    emit(evt, args, scope) {
        let $Evt, $args = args;
        if (_is.undef(evt)) { return; } // If there is no event break
        if (_is.str(evt)) { evt = evt.split(/\s/g); }
        if (!_is.arr(evt)) { evt = [evt]; } // Set evt to an array

        // Loop through the list of events
        evt.forEach(function ($evt) {
            $Evt = this._preEvent($evt);
            if (!this._emit.includes($evt))
                { this._emit.push($evt); }

            $Evt.forEach(_evt => {
                $args = args;
                // Check to see if first param is $evt, if so give details about event
                if (_argNames(_evt.callback)[0] === "$evt")
                    { $args = [_evt, ...args]; }

                _evt.callback
                    .apply(_is.undef(_evt.scope) ? scope : _evt.scope, $args);
            }, this);
        }, this);
        return this;
    }

    // List's all listeners for a given event
    listeners(evt) {
        let $Evt = this._preEvent(evt);
        if (!$Evt.length) { return []; }
        return $Evt.map(val => val.callback);
    }

    // List's all listener values for a given event
    listenerValues(evt, ...args) {
        let $Evt = this._preEvent(evt);
        if (!$Evt.length) { return []; }
        return $Evt.map(val => val.callback.call(val.scope, ...args));
    }

    // Clear all events
    clear()
        { this._eventCount = 0; this._events = {}; return this; }

    // Clear all events
    clearListeners(evt)
        { this._events[evt] = []; return this; }

    // Name of all event's
    get _names() { return keys(this._events); }

    // Number of events
    get _eventCount() { return this._names.length; }

    // Alias for the `on` method
    add(...args) { return this.on(...args); }
    bind(...args) { return this.on(...args); }

    // Alias for the `off` method
    remove(...args) { return this.off(...args); }
    unbind(...args) { return this.off(...args); }

    // Alias for the `emit` method
    fire(...args) { return this.emit(...args); }
    trigger(...args) { return this.emit(...args); }

    // Alias for the `listeners` method
    callbacks(...args) { return this.listeners(...args); }
}*/

/**
 * Represents a new event listener consisting of properties like: callback, scope, name
 *
 * @export
 * @class Listener
 * @extends {BasicClass}
 */
export class Listener {
    /**
     * Creates a new instance of a Listener
     *
     * @param    {Object}
     *    - callback = [Function]
     *    - scope = [Object*]
     *    - name = [String]
     * @memberof Listener
     * @constructor
     */
    constructor ({ callback = null, scope = null, name = null }) {

        /**
         * The current listener data
         *
         * @type {Object}
         */
        this.listener = { callback, scope, name };
    }

    /**
     * Returns the callback Function of the Listener
     *
     * @public
     * @returns Function
     */
    getCallback () {
        return this.listener.callback;
    }

    /**
     * Returns the scope as an Object, from the Listener
     *
     * @public
     * @returns Function
     */
    getScope () {
        return this.listener.scope;
    }

    /**
     * Returns the event as a String, from the Listener
     *
     * @public
     * @returns Function
     */
    getEventName () {
        return this.listener.name;
    }

    /**
     * Returns the listener as an Object
     *
     * @public
     * @returns Object
     */
    toJSON () {
        return this.listener;
    }
}

/**
 * An event emitter
 *
 * @export
 * @class EventEmitter
 * @extends {Manager}
 */
// A small event emitter
export default class EventEmitter {
    /**
     * Creates an instance of an EventEmitter
     *
     * @memberof EventEmitter
     * @constructor
     */
    constructor() {
        /**
         * The complex list of named data, to which the EventEmitter controls
         *
         * @type {Map}
         */
        this.list = new Map();
    }

    /**
     * Get the value stored in the EventEmitters
     *
     * @public
     * @param  {any*} key
     * @returns Array
     */
    get (key) {
        return this.list.get(key);
    }

    /**
     * Set a value stored in the EventEmitters
     *
     * @public
     * @param  {any*} key
     * @param  {any*} value
     * @returns EventEmitters
     */
    set (key, value) {
        this.list.set(key, value);
        return this;
    }

    /**
     * Returns the keys of all items stored in the EventEmitters
     *
     * @public
     * @returns Array
     */
    keys () {
        return this.list.keys();
    }

    /**
     * Returns the total number of events stored in the EventEmitters
     *
     * @public
     * @returns Number
     */
    size () {
        return this.list.size;
    }

    /**
     * Removes a value stored in the EventEmitters, via the key
     *
     * @public
     * @param  {any*} key
     * @returns EventEmitters
     */
    remove (key) {
        this.list.delete(key);
        return this;
    }

    /**
     * Clear the EventEmitters of all its contents
     *
     * @public
     * @returns EventEmitters
     */
    clear () {
        this.list.clear();
        return this;
    }

    /**
     * Checks if the EventEmitters contains a certain key
     *
     * @public
     * @param {any*} key
     * @returns Boolean
     */
    has (key) {
        return this.list.has(key);
    }

    /**
     * Iterates through the EventEmitters contents, calling a function every iteration
     *
     * @public
     * @param {Function} fn
     * @param {Object* | EventEmitters} [context=this]
     * @returns EventEmitters
     */
    each (fn, context = this) {
        this.list.forEach(fn, context);
        return this;
    }

    /**
     * Gets events, if event doesn't exist create a new Array for the event
     *
     * @public
     * @param {String} name
     * @returns Array
     */
    // Get event, ensure event is valid
    getEvent (name) {
        let event = this.get(name);
        if (!Array.isArray(event)) {
            this.set(name, []);
            return this.get(name);
        }

        return event;
    }

    /**
     * Creates a new listener and adds it to the event
     *
     * @public
     * @param {String} name
     * @param {Function} callback
     * @param {Object*} scope
     * @returns Array
     */
    // New event listener
    newListener (name, callback, scope) {
        let event = this.getEvent(name);
        event.push(new Listener({ name, callback, scope }));
        return event;
    }

    /**
     * Adds a listener for a given event
     *
     * @param {String|Object|Array} events
     * @param {Function*} callback
     * @param {Object*} scope
     */
    on (events, callback, scope) {
        // If there is no event break
        if (typeof events == "undefined") return this;

         // Create a new event every space
        if (typeof events == "string") events = events.split(/\s/g);

        let event;
        // Loop through the list of events
        Object.keys(events).forEach(key => {
            // Select the name of the event from the list
            // Remember events can be {String | Object | Array}
            event = events[key];

            // Check If events is an Object (JSON like Object, and not an Array)
            if (typeof events == "object" && !Array.isArray(events)) {
                this.newListener(key, event, callback);
            } else {
                this.newListener(event, callback, scope);
            }
        }, this);
        return this;
    }

    /**
     * Removes an event listener from an event
     *
     * @public
     * @param {String} name
     * @param {Function} callback
     * @param {Object*} scope
     * @returns Array
     */
    // Remove an event listener
    removeListener (name, callback, scope) {
        let event = this.getEvent(name);

        if (callback) {
            let i = 0, len = event.length, value;
            let listener = new Listener({ name, callback, scope });
            for (; i < len; i ++) {
                value = event[i];
                if (value.callback === listener.callback &&
                    value.scope === listener.scope)
                    break;
            }

            event.splice(i, 1);
        } else this.remove(name);
        return event;
    }

    /**
     * Removes a listener for a given event
     *
     * @param {String|Object|Array} events
     * @param {Function*} callback
     * @param {Object*} scope
     */
    off (events, callback, scope) {
        // If there is no event break
        if (typeof events == "undefined") return this;

         // Create a new event every space
        if (typeof events == "string") events = events.split(/\s/g);

        let event;
        // Loop through the list of events
        Object.keys(events).forEach(key => {
            // Select the name of the event from the list
            // Remember events can be {String | Object | Array}
            event = events[key];

            // Check If events is an Object (JSON like Object, and not an Array)
            if (typeof events == "object" && !Array.isArray(events)) {
                this.removeListener(key, event, callback);
            } else {
                this.removeListener(event, callback, scope);
            }
        }, this);
        return this;
    }

    /**
     * Adds a one time event listener for an event
     *
     * @param {String|Object|Array} events
     * @param {Function*} callback
     * @param {Object*} scope
     */
    once (events, callback, scope) {
        // If there is no event break
        if (typeof events == "undefined") return this;

         // Create a new event every space
        if (typeof events == "string") events = events.split(/\s/g);

        let onceFn = (...args) => {
            this.off(events, onceFn, scope);
            callback.apply(scope, args);
        };

        this.on(events, onceFn, scope);
        return this;
    }

    /**
     * Call all listener within an event
     *
     * @param {String|Array} events
     * @param {Array} [args = []]
     */
    emit (events, args = []) {
        // If there is no event break
        if (typeof events == "undefined") return this;

         // Create a new event every space
        if (typeof events == "string") events = events.split(/\s/g);

        // Loop through the list of events
        events.forEach(event => {
            let listeners = this.getEvent(event);
            listeners.forEach(listener => {
                let { callback, scope } = listener.toJSON();
                callback.apply(scope, args);
            });
        }, this);
        return this;
    }
}