//= require async_storage

var attr = Ember.attr;

App.Bug = Ember.Model.extend({
  id: attr(),
  status: attr(),
  summary: attr(),
  keywords: attr(),
  product: attr(),
  component: attr(),
  version: attr(),
  platform: attr(),
  op_sys: attr(),
  priority: attr(),
  severity: attr(),
  assigned_to: attr(),
  qa_contact: attr(),
  url: attr(),
  depends_on: attr(), // array
  blocks: attr(), // array
  creator: attr(), // aka reporter
  last_change_time: attr(Date),
  cc: attr(),

  comments: function() {
    return App.Comment.find({bug_id: this.get('id')});
  }.property()
});

App.Bug.adapter = Ember.Adapter.create({
  _getJSON: function(id, params) {
    return $.getJSON("https://api-dev.bugzilla.mozilla.org/latest/bug/" + id, params);
  },

  _loadFromServer: function(record, id) {
    this._getJSON(id).then(function(data) {
      record.load(id, data);
      asyncStorage.setItem('bug-' + id, data);
    });
  },

  find: function(record, id) {
    var self = this;

    asyncStorage.getItem('bug-' + id, function(value) {
      if (value !== null) {
        record.load(id, value);

        // check if data has been changed on the server
        self._getJSON(id, {include_fields: "last_change_time"}).then(function(data) {
          if (data.last_change_time !== value.last_change_time) {
            self._loadFromServer(record, id);
          }
        });
      } else {
        self._loadFromServer(record, id);
      }
    });
  }
});