var FlagController = Ember.ObjectController.extend({
  value: null, // ? + -
  requestee: null,

  showRequestee: function() {
    return this.get('is_requesteeble') && this.get('value') === "?";
  }.property('is_requesteeble', 'value')
});

export default FlagController;