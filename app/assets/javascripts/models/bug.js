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
  creation_time: attr(Date),
  last_change_time: attr(Date),
  cc: attr(),
  flags: attr(),
  attachments: attr(),

  aliasOrId: function() {
    return this.get('alias') || this.get('id');
  }.property('alias', 'id'),

  isResolved: function() {
    return this.get('status') === "RESOLVED";
  }.property('status'),

  unobsoleteAttachments: function() {
    return this.get('attachments').filter(function(attachment) {
      return !attachment.is_obsolete;
    }).map(function(attachment) {
      var record = App.Attachment.create({data: attachment, isLoaded: true});
      record.then = null; // FIXME: We need to get rid of records-as-promises :(
      return record;
    });
  }.property('attachments.@each.is_obsolete'),

  comments: function() {
    return App.Comment.find({bug_id: this.get('id')});
  }.property(),

  firstComment: function() {
    if (!this.get('comments.isLoaded')) { return; }

    return this.get('comments.firstObject');
  }.property('comments.isLoaded'),

  remainingComments: function() {
    if (!this.get('comments.isLoaded')) { return; }

    return this.get('comments').slice(10);
  }.property('comments.isLoaded', 'comments.[]'),

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
  }.property('blocks'),

  init: function() {
    this._super();

    // add records to search index
    this.on('didLoad', function() {
      this.constructor.index.add(this.attributesForIndex());
    });
  },

  attributesForIndex: function() {
    var attrs = this.getProperties('summary');
    attrs.id = this.get('id').toString(); // lunr doesn't like numbers :/
    return attrs;
  },

  reload: function() {
    this._super();

    // Check for new comments. TODO: This can be made cleaner.
    var existingComments = this.get('comments'),
        latestComments = App.Comment.find({bug_id: this.get('id')});

    latestComments.forEach(function(comment) {
      if (!existingComments.contains(comment)) {
        existingComments.pushObject(comment);
      }
    });
  }
});

App.Bug.reopenClass({
  index: lunr(function() {
    this.field('summary', {boost: 10});
    this.field('id')
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
      return App.getJSON("https://api-dev.bugzilla.mozilla.org/latest/bug/" + id, params);
    },

    _loadFromServer: function(record, id) {
      this._getJSON(id).then(function(data) {
        record.load(id, data);
        asyncStorage.setItem('bug-' + id, data);
      });
    },

    find: function(record, id) {
      var self = this;

      return App.promiseStorage.getItem('bug-' + id).then(function(value){
        if (value !== null) {
          record.load(id, value);

          return self._getJSON(id, {include_fields: "last_change_time"}).then(function(data) {
            if (data.last_change_time !== value.last_change_time) {
              self._loadFromServer(record, id);
            }
          });

        } else {
          return self._loadFromServer(record, id);
        }
      }).then(null, Ember.unhandledRejection);
    },

    findMany: function(klass, records, ids) {
      return this._getJSON("", {id: ids.join(',')}).then(function(data) {
        records.load(klass, data.bugs);
      });
    },

    findQuery: function(klass, records, params) {
      this._getJSON("", params).then(function(data) {
        records.load(klass, data.bugs);
      });
    }
  })
});
