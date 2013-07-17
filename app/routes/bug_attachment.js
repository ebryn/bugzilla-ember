import 'bugzilla/models/attachment' as Attachment;

var Route = Ember.Route.extend({
  model: function(params) {
    var bug = this.modelFor('bug');
    return Attachment.create({bug_id: bug.get('id')});
  },

  events: {
    save: function() {
      // TODO: move me into the bug attachment controller
      var model = this.modelFor('bug_attachment');
      model.save();
    }
  }
});

export = Route;
