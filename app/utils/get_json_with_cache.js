import getJSON from 'bugzilla/utils/get_json';
import promiseStorage from 'bugzilla/utils/promise_storage';

function getJSONWithCache(url, params) {
  var key = url + (params ? Ember.$.param(params) : '');

  return promiseStorage.getItem(key).then(function(value) {
    if (value !== null) {
      return value;
    } else {
      return getJSON(key).then(function(json) {
        promiseStorage.setItem(key, json);
        return json;
      });
    }
  });
}

export default getJSONWithCache;