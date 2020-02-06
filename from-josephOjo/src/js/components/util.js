// export let { assign, keys, values } = Object;
// export let { isArray, from, of } = Array;
export let assign = Object.assign;
export let values = Object.values;
export let keys = Object.keys;

export let isArray = Array.isArray;
export let from = Array.from;
export let of = Array.of;

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

assign(_is, {
    el: el => _isInst(el, Element) || _isInst(el, Document),
    arrlike (obj) {
        let len = _is(obj.length, "number") && obj.length;
        return len === 0 || len > 0 && (len - 1) in obj;
    },
    num: val => !isNaN(val) && _type("number") (val),
    usable: v => !_is(v, "undefined") && v !== null,
    class: obj => obj && obj._method && obj._class,
    not: (type, ...args) => !_is[type](...args),
    doc: ctor => _isInst(ctor, Document),
    def: v => !_is(v, "undefined"),
    undef: _type("undefined"),
    win: v => v && v.window,
    bool: _type("boolean"),
    fn: _type("function"),
    null: v => v === null,
    str: _type("string"),
    obj: _type("object"),
    nul: v => v === null,
    inst: _isInst,
    arr: isArray,
    _type
});

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

let STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
let ARGUMENT_NAMES = /(?:^|,)\s*([^\s,=]+)/g;

// Argument names
export let _argNames = fn => {
    let fnStr = fn.toString().replace(STRIP_COMMENTS, '');
    let argsList = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')'));
    let result = argsList.match( ARGUMENT_NAMES ), stripped = [];

    if (_is.nul(result)) return [];
    else {
        for (let i = 0; i < result.length; i ++) {
            stripped.push( result[i].replace(/[\s,]/g, '') );
        }

        return stripped;
    }
};

export default { _capital, _is, _constrain, _map, _fnval, _argNames, assign, keys, values, from, of, _log };
