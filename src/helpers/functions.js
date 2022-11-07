var set = require('lodash.set');

export const setObjectValue = (object, key, value) => {
    let k = Array.isArray(key) ? k = key.join(".") : key;
    set(object, k, value);
}