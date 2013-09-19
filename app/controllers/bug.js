import Comment from 'bugzilla/models/comment';
import Attachment from 'bugzilla/models/attachment';
import unhandledRejection from 'bugzilla/utils/unhandled_rejection';

var Controller = Ember.ObjectController.extend({
  needs: ['user'],
  user: Ember.computed.alias('controllers.user'),
  canEdit: Ember.computed.and('model.canEdit', 'user.isLoggedIn'),
  showingObsoleteAttachments: false,

  filteredAttachments: function() {
    var attachments = this.get('attachments');

    var filter = this.get('showingObsoleteAttachments') ? Ember.K : isntObsolete;
    var result = attachments.filter(filter).map(toAttachment);

    Ember.set(result, '_source', attachments);
    Ember.defineProperty(result, 'isLoading', Ember.computed.alias('_source.isLoading'));

    return result;

    function isntObsolete(attachment) {
      return !attachment.is_obsolete;
    }

    function toAttachment(data) {
      return Attachment.create({
        _data: data,
        isLoaded: true
      });
    }
  }.property('attachments.@each.is_obsolete', 'showingObsoleteAttachments'),


  actions: {
    toggleObsoleteAttachments: function() {
      this.toggleProperty('showingObsoleteAttachments');
    },

    showRemainingComments: function() {
      this.set('isShowingRemainingComments', true);
    },

    saveComment: function() {
      var newComment = Comment.create({
        text: this.get('newCommentText'),
        bug_id: this.get('id')
      });

      var self = this;
      newComment.save().then(function() {
        // FIXME: Comments is an array of POJOs initially. We push a Comment object when created on the client.
        self.get('comments').pushObject(newComment);
        self.set('newCommentText', null);
      }).then(null, unhandledRejection);
    },

    reply: function(comment) {
      var newCommentText = this.get('newCommentText') || "",
          commentIndex = this.get('comments').indexOf(comment);

      newCommentText += "(In reply to %@ from comment #%@)\n".fmt(Ember.get(comment, 'creator'), commentIndex);
      newCommentText += Ember.get(comment, "text").replace(/^/m, "> ");
      newCommentText += "\n\n";

      this.set('newCommentText', newCommentText);
    }
  }
});

export default Controller;
