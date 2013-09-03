var Route = Ember.Route.extend({
  model: function(params) {
    var bug = this.modelFor('bug');
    return this.create('attachment', {
      bug_id: bug.get('id')
    });
  },

  actions: {
    save: function() {
      var self = this,
          bug = this.modelFor('bug'),
          attachment = this.modelFor('bug_attachment');
      attachment.save().then(function() {
        self.transitionTo('bug', bug);
      });
    }
  }
});

export default Route;
