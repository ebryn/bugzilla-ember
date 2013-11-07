var FlagController = Ember.ObjectController.extend({
  values: function() {
    return ['X'].concat(this.get('model.values'));
  }.property('model.values'),

  showRequestee: function() {
    return this.get('definition.isRequesteeble') && this.get('status') === "?";
  }.property('definition.isRequesteeble', 'status')
});

export default FlagController;