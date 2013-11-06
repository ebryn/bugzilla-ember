function camelizeKeys(obj, shallow) {
  var ret, value;

  if (obj === null || typeof obj !== 'object') {
    return obj;
  } else if (Ember.typeOf(obj) === 'array') {
    if (shallow) { return obj; }

    ret = [];
    for (var i = 0, l = obj.length; i < l; i++) {
      ret.push(camelizeKeys(obj[i]));
    }
  } else {
    ret = {};
    for (var key in obj) {
      value = obj[key];
      ret[key.camelize()] = shallow ? value : camelizeKeys(value);
    }
  }

  return ret;
}

export default camelizeKeys;