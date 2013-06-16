//= require async_storage

var attr = Ember.attr;

App.Bug = Ember.Model.extend({
  id: attr(),
  alias: attr(),
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

  aliasOrId: function() {
    return this.get('alias') || this.get('id');
  }.property('alias', 'id'),

  isResolved: function() {
    return this.get('status') === "RESOLVED";
  }.property('status'),

  comments: function() {
    return App.Comment.find({bug_id: this.get('id')});
  }.property(),

  depends_on_bugs: function() {
    var depends_on = this.get('depends_on') || [];
    return depends_on.map(function(id) {
      var bug = App.Bug.find(id);
      bug.set('id', id); // FIXME
      return bug;
    });
  }.property('depends_on'),

  blocks_bugs: function() {
    var blocks = this.get('blocks') || [];
    return blocks.map(function(id) {
      var bug = App.Bug.find(id);
      bug.set('id', id); // FIXME
      return bug;
    });
  }.property('blocks')

});

App.Bug.reopenClass({
  index: lunr(function() {
    this.field('summary', {boost: 10});
    this.ref('id')
  }),

  search: function(text) {
    return this.index.search(text).map(function(result) {
      result.record = App.Bug.find(result.ref);
      return result;
    });
  },

  adapter: Ember.Adapter.create({
    _getJSON: function(id, params) {
      return $.getJSON("https://api-dev.bugzilla.mozilla.org/latest/bug/" + id, params);
    },

    _loadFromServer: function(record, id) {
      this._getJSON(id).then(function(data) {
        App.Bug.index.add(data);
        record.load(id, data);
        asyncStorage.setItem('bug-' + id, data);
      });
    },

    find: function(record, id) {
      var self = this;

      asyncStorage.getItem('bug-' + id, function(value) {
        if (value !== null) {
          App.Bug.index.add(value);
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
    },

    findMany: null // FIXME
  })
});