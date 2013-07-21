import Attachment from 'bugzilla/models/attachment';

var AttachmentRoute = Ember.Route.extend({
  model: function(params) {
    return this.find(params.attachment_id);
  }
});

export default AttachmentRoute;
