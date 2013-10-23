import Attachment from "bugzilla/models/attachment";

var Controller = Ember.ObjectController.extend({
  needs: ['bug'],
  bug: Em.computed.alias('controllers.bug'),

  _initializeModel: function() {
    this.set('model', Attachment.create());
  }.on('init'),

  actions: {
    save: function() {
      var self = this,
          attachment = this.get('model');

      attachment.setProperties({
        bug: this.get('bug'),
        bug_id: this.get('bug.id')
      });
      attachment.save().then(function() {
        attachment.get('bug.attachments').pushObject(attachment);
        self.send('hideModal');
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
