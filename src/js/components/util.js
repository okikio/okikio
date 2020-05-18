export let assign = Object.assign;
export let values = Object.values;
export let keys = Object.keys;

export let isArray = Array.isArray;

// Fastest way to clear an array and use less memory: [stackoverflow.com/questions/1232040/how-do-i-empty-an-array-in-javascript]
// Clear images array efficiently [smashingmagazine.com/2012/11/writing-fast-memory-efficient-javascript/]
export let clear = arr => {
	while (arr.length) arr.pop();
};

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
// From davidwalsh: davidwalsh.name/javascript-debounce-function
export let debounce = (fn, wait, immediate) => {
	let timeout, later, context, callNow;
	return function (...args) {
		context = this;
		later = () => {
			timeout = null;
			if (!immediate) fn.apply(context, args);
		};

		callNow = immediate && !timeout;
		window.clearTimeout(timeout);
		timeout = window.setTimeout(later, wait);
		if (callNow) fn.apply(context, args);
	};
};

// Based on [growingwiththeweb.com/2017/12/fast-simple-js-fps-counter.html]
// Determines the maximum frame rate the current device can reach
// For determining when to use cool animations
let fps = 0;
const times = [];
export let fpsCounter = () => {
	window.requestAnimationFrame(() => {
		const now = performance.now();
		while (times.length > 0 && times[0] <= now - 1000) {
			times.shift();
		}
		times.push(now);
		fps = times.length;
		if (fps > (fpsCounter.fps || 0)) fpsCounter.fps = fps;
		fpsCounter();
	});
};

// Remove certain properties
export let _removeProps = (prop, obj) => {
	let newObj = { ...obj };
	prop.forEach(key => delete newObj[key]);
	return newObj;
};

// Limits a number to a max, and a min value
export let _constrain = (v, a, b) => (v > b ? b : v < a ? a : v);

// Re-maps a number from one range to another. Numbers outside the range are not clamped to 0 and 1, because out-of-range values are often intentional and useful.
export let _map = (e, t, n, r, i) => (r + (i - r) * ((e - t) / (n - t)));

// Log values
export let _log = (...args) => args.forEach(v => console.log(v));

// Capitalize strings
export let _capital = val => val[0].toUpperCase() + val.slice(1);

// Test the type of a value
export let _is = (val, type) => (typeof val === type);

// Does the object contain the given key ? Identical to object.hasOwnProperty(key), but uses a safe reference to the hasOwnProperty function, in case it's been overridden
export let has = (obj, path) => {
	return obj != null && ({}).hasOwnProperty.call(obj, path);
};

// Is Instance Of
let _isInst = (ctor, obj) => (ctor instanceof obj);
let _type = type => { // Tweak of _is
	return val => _is(val, type);
};

_is.el = el => _isInst(el, Element) || _isInst(el, Document);
_is.arrlike = obj => {
	let len = _is(obj.length, "number") && obj.length;
	return len === 0 || len > 0 && (len - 1) in obj;
};
_is.usable = v => !_is(v, "undefined") && v !== null;
_is.num = val => !isNaN(val) && _type("number") (val);
_is.not = (type, ...args) => !_is[type](...args);
_is.doc = ctor => _isInst(ctor, Document);
_is.def = v => !_is(v, "undefined");
_is.undef = _type("undefined");
_is.win = v => v && v.window;
_is.bool = _type("boolean");
_is.fn = _type("function");
_is.null = v => v === null;
_is.str = _type("string");
_is.obj = _type("object");
_is.nul = v => v === null;
_is.inst = _isInst;
_is.arr = isArray;
_is.type = _type;

// The (I was using the native .toFixed method, now I am using Math.floor "~~"), but if the digits parameter is either undefined or null, return the initial value
// I am using ~~ instead of Math.round because it's faster [measurethat.net/Benchmarks/Show/7756/0/tofixed-vs-toprecision-vs-mathround-vs-mathfloorfast-vs]
export let toFixed = (num, digits) => _is.usable(digits) ? ( digits == 0 ? Math.round(num) : ~~(num * Math.pow(10, digits)) / Math.pow(10, digits)) : num;

/**
 * @param  {Function} fn
 * @param  {Array<any>} args
 * @param  {Object} ctxt
 */
export let _fnval = (fn, args, ctxt) => {
	if (!_is.fn(fn) ||
		keys(fn.prototype || {}).length > 0)
		{ return fn; }
	return fn.apply(ctxt, args);
};

export default { _capital, _is, _constrain, _map, _fnval, assign, keys, values, _log, clear };
