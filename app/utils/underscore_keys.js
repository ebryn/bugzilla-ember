function underscoreKeys(obj) {
  var ret, value;

  if (obj === null || typeof obj !== 'object') {
    return obj;
  } else if (Ember.typeOf(obj) === 'array') {
    ret = [];
    for (var i = 0, l = obj.length; i < l; i++) {
      ret.push(underscoreKeys(obj[i]));
    }
  } else {
    ret = {};
    for (var key in obj) {
      value = obj[key];
      ret[key.underscore()] = underscoreKeys(value);
    }
  }

  return ret;
}

export default underscoreKeys;