var Route = Ember.Route.extend({
  model: function(params) {
    this.controllerFor('bug').findBug(params.bug_id);

    // to prevent serialize from blowing up
    return {id: params.bug_id};
  },

  setupController: Ember.K,

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
