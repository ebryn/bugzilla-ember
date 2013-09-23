import Attachment from "bugzilla/models/attachment";

var Controller = Ember.ObjectController.extend({
  needs: ['bug'],
  bug: Em.computed.alias('controllers.bug'),
  bug_id: Emb.computed.alias('bug.id'),
  _initializeModel: function() {
    this.set('model', Attachment.create());
  }.on('init'),

  actions: {
    save: function() {
      var self = this,
          attachment = this.get('model');

      attachment.save().then(function() {
        attachment.get('bug.attachments').pushObject(attachment);
        self.send('hideAttachmentModal');
        self._initializeModel();
      }, function(reason) {
        var json = reason.responseJSON;
        if (json && json.message) {
          alert(json.message);
        } else {
          alert("Error occurred while saving attachment");
        }
      });
    }
  }
});

export default Controller;
