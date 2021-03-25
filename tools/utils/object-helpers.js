export const renameKeys = (obj, key, replaceVal) => {
  obj[key] = obj[replaceVal];
  delete obj[replaceVal];
  return obj;
}

export const replacePropertyValues = (obj, searchVal, replaceVal) => {
  const newObject = !Array.isArray(obj) ? {
    ...obj
  } : [...obj];

  for (let key of Object.keys(obj)) {
    if (typeof (obj[key]) === 'object') {
      newObject[key] = replacePropertyValues(obj[key], searchVal, replaceVal);
    } else if (typeof obj[key] == 'string' && obj[key].indexOf(searchVal) > -1) {
      newObject[key] = obj[key].replace(new RegExp(searchVal, "g"), replaceVal);
    }
  }

  return newObject
}

export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
}

export const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
}

// Omit an array of keys
export const omit = (keys, obj) => {
  return keys.reduce((a, e) => {
    const {
      // eslint-disable-next-line no-unused-vars
      [e]: omit, ...rest
    } = a;
    return rest;
  }, obj)
}

export const merge = (customizer, ...args) => {
  // create a new object
  let target = {};

  // deep merge the object into the target object
  const merger = (obj) => {
    for (let prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        if (Object.prototype.toString.call(obj[prop]) === '[object Object]') {
          target[prop] = merge(null, target[prop], obj[prop]);
        } else {
          if (!customizer) {
            target[prop] = obj[prop];
          } else {
            target[prop] = customizer(target[prop], obj[prop]);
          }
        }
      }
    }
  };

  // iterate through all objects and 
  // deep merge them with target
  for (let i = 0; i < args.length; i++) {
    merger(args[i]);
  }

  return target;
};

export const extend = (target, ...sources) => {
  const length = sources.length;

  if (length < 1 || target == null) return target;
  for (let i = 0; i < length; i++) {
    const source = sources[i];

    for (const key in source) {
      target[key] = source[key];
    }
  }
  return target;
};

export const union = (arr, ...args) => [
  ...new Set(arr.concat(...args))
]
