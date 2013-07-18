import Attachment from 'bugzilla/models/attachment';

var AttachmentRoute = Ember.Route.extend({
  model: function(params) {
    return Attachment.find(params.attachment_id);
  }
});

export default AttachmentRoute;
