import Bug from "bugzilla/models/bug";

var Route = Ember.Route.extend({
  model: function(params) {
    return Bug.find(params.bug_id);
  },

  afterModel: function(model) {
    document.title = model.get('id') + ' - ' + model.get('fields.summary.current_value');
  },

  actions: {
    showAttachmentModal: function(bug) {
      this.render('bug/attachment', {
        into: 'bug',
        outlet: 'modal'
      });
    },

    showCCModal: function(bug) {
      this.render('bug/cc_modal', {
        into: 'bug',
        outlet: 'modal'
      });
    },

    hideModal: function() {
      this.disconnectOutlet({outlet: 'modal', parentView: 'bug'});
    },

    saveAttachment: function(bug) {
      var self = this,
          attachment = this.modelFor('bug_attachment');

      attachment.save().then(function() {
        self.transitionTo('bug', bug);
      });
    }
  }
});

export default Route;
