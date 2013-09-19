import Comment from 'bugzilla/models/comment';
import Attachment from 'bugzilla/models/attachment';
import BugAdapter from 'bugzilla/adapters/bug';

import promiseStorage from 'bugzilla/utils/promise_storage' ;

// TODO: remove app dependency
import App from 'bugzilla/app';

var attr = Ember.attr, hasMany = Ember.hasMany;

var Bug = App.Bug = Ember.Model.extend({
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
  // FIXME: can't do self-referential relationships in the body of the model definition
  depends_on: hasMany("App.Bug", {key: 'depends_on'}),
  blocks: hasMany("App.Bug", {key: 'blocks'}),
  creator: attr(), // aka reporter
  creation_time: attr(Date),
  last_change_time: attr(Date),
  cc: attr(),
  flags: attr(),

  attachments: hasMany(Attachment, {key: 'attachments', embedded: true}),
  comments: hasMany(Comment, {key: 'comments', embedded: true}),

  aliasOrId: function() {
    return this.get('alias') || this.get('id');
  }.property('alias', 'id'),

  isResolved: function() {
    return this.get('status') === "RESOLVED";
  }.property('status'),

  unobsoleteAttachments: function() {
    // EM needs a better solution for this.
    var attachments = this.get('attachments');

    if (!attachments) { return []; }

    var result = attachments.filter(isntObsolete).map(toAttachement);

    Ember.set(result, '_source', attachments);
    Ember.defineProperty(result, 'isLoading', Ember.computed.alias('_source.isLoading'));

    return result;

    function isntObsolete(attachment) {
      return !attachment.is_obsolete;
    }

    function toAttachement(data) {
      return Attachment.create({
        _data: data,
        isLoaded: true
      });
    }
  }.property('attachments.@each.is_obsolete'),

  firstComment: function() {
    // if (!this.get('comments.isLoaded')) { return; }

    return this.get('comments.firstObject');
  }.property('comments.firstObject'),

  remainingComments: function() {
    // if (!this.get('comments.isLoaded')) { return; }

    return this.get('comments').slice(1);
  }.property('comments.[]'),

  init: function() {
    this._super();

    // add records to search index
    this.on('didLoad', function() {
      this.constructor.index.add(this.attributesForIndex());
    });
  },

  load: function(id, hash) {
    this._super(id, hash);
    asyncStorage.setItem('bug-' + id, hash);
  },

  attributesForIndex: function() {
    var attrs = this.getProperties('summary');
    attrs.id = this.get('id').toString(); // lunr doesn't like numbers :/
    return attrs;
  }
});

Bug.reopenClass({
  cachedRecordForId: function(id) {
    var record = this._super(id);
    promiseStorage.getItem('bug-' + id).then(function(value){
      if (value !== null) {
        record.load(id, value);
      }
    });
    return record;
  },

  index: lunr(function() {
    this.field('summary', {boost: 10});
    this.field('id');
    this.ref('id');
  }),

  search: function(text) {
    return this.index.search(text).map(function(result) {
      result.record = Bug.find(result.ref);
      return result;
    });
  },

  adapter: BugAdapter.create(),

  toString: function() { return "Bug"; }
});

export default Bug;
