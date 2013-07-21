import getJSON from 'bugzilla/utils/get_json';
import urlFor from 'bugzilla/utils/url_for';
import ajax from 'bugzilla/utils/ajax';
import unhandledRejection from 'bugzilla/utils/unhandled_rejection';

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
  contentType: attr(),
  encodedData: attr(),

  decodedData: function() {
    var encodedData = this.get('encodedData');
    if (encodedData) { return atob(encodedData); }
 }.property('encodedData')

});

Attachment.reopenClass({
  adapter: Ember.Adapter.create({
    find: function(record, id) {
      var url = urlFor("bug/attachment/" + id);

      getJSON(url).then(function(json) {
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

      getJSON(url).then(function(json) {
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
        contentType: 'application/json',
        data: JSON.stringify({ids: [data.bug_id], data: data.encodedData, file_name: data.file_name, summary: data.description, content_type: data.contentType})
      }).then(function(json) {
        var id = json.ids[0];
        var url = urlFor("bug/attachment/" + id);

        return getJSON(url).then(function(json) {
          var attachmentJson = json.attachments[id];
          // FIXME: workaround data being a special property in EM
          attachmentJson.encodedData = attachmentJson.data;
          delete attachmentJson.data;
          record.didCreateRecord();
          record.load(id, attachmentJson);
        });
      });
    }
  })
});

export default Attachment;
