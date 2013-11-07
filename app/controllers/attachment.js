import fmt from 'bugzilla/utils/fmt';

var AttachmentController = Ember.ObjectController.extend({
  reviewURL: fmt("%@/page.cgi?id=splinter.html&bug=%@&attachment=%@", 'config.host', 'bug_id', 'id'),
  diffURL:   fmt("%@/attachment.cgi?id=%@&action=diff", 'config.host', 'id')
});

export default AttachmentController;
