import AuthenticatedRouteMixin from 'bugzilla/routes/authenticated_route_mixin';

var Route = Ember.Route.extend(AuthenticatedRouteMixin, {
  model: function(params) {
    return this.controllerFor('bug').findBug(params.bug_id);
  },

  // setupController: Ember.K,

  actions: {
    showAttachmentModal: function(bug) {
      this.render('bug/attachment', {
        into: 'bug',
        outlet: 'modal'
      });
    },

    showCCModal: function(bug, a, b, c, d) {
      debugger;

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
