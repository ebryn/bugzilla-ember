import 'bugzilla/models/attachment' as Attachment;

var AttachmentRoute = Ember.Route.extend({
  model: function(params) {
    return Attachment.find(params.attachment_id);
  }
});

export = AttachmentRoute;
