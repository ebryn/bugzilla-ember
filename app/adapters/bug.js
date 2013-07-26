import getJSON from 'bugzilla/utils/get_json';
import ajax from 'bugzilla/utils/ajax';
import urlFor from 'bugzilla/utils/url_for';
import promiseStorage from 'bugzilla/utils/promise_storage';
import unhandledRejection from 'bugzilla/utils/unhandled_rejection';

var Adapter = Ember.Adapter.extend({
  find: function(record, id) {
    var self = this;

    return promiseStorage.getItem('bug-' + id).then(function(value){
      if (value !== null) {
        record.load(id, value);

        return self._getJSON(id, {include_fields: "last_change_time"}).then(function(json) {
          if (json.bugs[0].last_change_time !== value.last_change_time) {
            self._loadFromServer(record, id);
          }
        });

      } else {
        return self._loadFromServer(record, id);
      }
    }).then(null, unhandledRejection);
  },

  findMany: function(klass, records, ids) {
    var idParams = ids.map(function(id) { return "id=" + id; }).join('&');
    return this._getJSON("", idParams).then(function(data) {
      records.load(klass, data.bugs);
    });
  },

  findQuery: function(klass, records, params) {
    this._getJSON("", params).then(function(data) {
      records.load(klass, data.bugs);
    });
  },

  createRecord: function(record) {
    var url = urlFor("bug");
    return ajax(url, {
      type: "POST",
      dataType: 'json',
      // contentType: 'application/json',
      data: record.toJSON()
    }).then(function(json) {
      // FIXME: EM should be able to load just an ID
      record.set('id', json.id);
      record.didCreateRecord();
      record.set('id', json.id);
      record.reload();

      return record;
    }, function(err) {
      var xhr = err[0],
          json = xhr.responseJSON;
      alert(json.message); // TODO: better error handling
      
      throw err;
    });
  },

  _getJSON: function(id, params) {
    return getJSON(urlFor("bug" + (id ? "/" + id : "")), params);
  },

  _loadFromServer: function(record, id) {
    this._getJSON(id).then(function(json) {
      var data = json.bugs[0];
      record.load(id, data);
    });
  }
});

export default Adapter;