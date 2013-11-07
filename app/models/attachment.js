import getJSON from 'bugzilla/utils/get_json';
import urlFor from 'bugzilla/utils/url_for';
import ajax from 'bugzilla/utils/ajax';
import unhandledRejection from 'bugzilla/utils/unhandled_rejection';
import getJSONWithCache from 'bugzilla/utils/get_json_with_cache';

var attr = Ember.attr;

var Attachment = Ember.Model.extend({
  id: attr(),
  bug_id: attr(),
  description: attr(),
  file_name: attr(),
  size: attr(),
  is_obsolete: attr(),
  is_patch: attr(),
  attacher: attr(),
  flags: attr(),
  last_change_time: attr(),
  content_type: attr(),
  encodedData: attr(),

  decodedData: function() {
    var encodedData = this.get('encodedData');
    if (encodedData) { return atob(encodedData); }
  }.property('encodedData'),

  isDeleted: function() {
    return this.get('size') === 0;
  }.property('size'),

  isText: function() {
    var content_type = this.get('content_type');
    return this.get('is_patch') || (content_type && !content_type.match('image'));
  }.property('is_patch', 'content_type'),

  dataUri: function() {
    return 'data:%@;base64,%@'.fmt(this.get('content_type'), this.get('encodedData'));
  }.property('content_type', 'encodedData')
});

Attachment.reopenClass({
  adapter: Ember.Adapter.create({
    find: function(record, id) {
      var url = urlFor("bug/attachment/" + id);

      return getJSON(url).then(function(json) {
        var attachmentJson = json.attachments[id];
        // FIXME: workaround data being a special property in EM
        attachmentJson.encodedData = attachmentJson.data;
        delete attachmentJson.data;
        record.load(id, attachmentJson);
      }).then(null, unhandledRejection);
    },

    findQuery: function(klass, records, params) {
      var bugId = params.bug_id,
          url = urlFor("bug/" + bugId + "/attachment");

      getJSONWithCache(url).then(function(json) {
        var attachmentsJson = json.bugs[bugId];

        // FIXME: workaround data being a special property in EM
        for (var i = 0, l = attachmentsJson.length; i < l; i++) {
          attachmentsJson[i].encodedData = attachmentsJson[i].data;
          delete attachmentsJson[i].data;
        }

        records.load(klass, attachmentsJson);
      }).then(null, unhandledRejection);
    },

    createRecord: function(record) {
      var adapter = this,
          data = record.toJSON(),
          url = urlFor("bug/" + data.bug_id + "/attachment");

      return ajax(url, {
        type: "POST",
        dataType: 'json',
        // contentType: 'application/json',
        data: {ids: [data.bug_id], data: data.encodedData, file_name: data.file_name, summary: data.description, content_type: data.content_type}
      }).then(function(json) {
        var id = Object.keys(json.attachments)[0],
            attachmentJson = json.attachments[id];

        // FIXME: workaround data being a special property in EM
        attachmentJson.encodedData = attachmentJson.data;
        delete attachmentJson.data;
        record.didCreateRecord();
        record.load(id, attachmentJson);
      }, function(reason) {
        record.set('isSaving', false);
        throw reason;
      });
    }
  })
});

export default Attachment;
