var FlagController = Ember.ObjectController.extend({
  needs: ['bug'],

  bugFlags: Em.computed.alias('controllers.bug.bugFlags'),

  flag: function() {
    var bugFlags = this.get('bugFlags');
    return bugFlags.findProperty('name', this.get('name'));
  }.property('bugFlags', 'name'),

  values: function() {
    return ['X'].concat(this.get('flag.values'));
  }.property('flag.values'),

  showRequestee: function() {
    return this.get('flag.isRequesteeble') && this.get('status') === "?";
  }.property('flag.isRequesteeble', 'status')
});

export default FlagController;