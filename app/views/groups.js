// For bug editing, we're going to need to diff to submit add/remove separately

var GroupsView = Ember.View.extend({
  groups: null,
  selectedGroups: null,

  _setDefaults: function() {
    var selectedGroups = this.get('selectedGroups');
    if (!selectedGroups) {
      this.set('selectedGroups', []);
    }
  }.on('init'),

  groupWasChecked: function(name) {
    this.get('selectedGroups').pushObject(name);
  },

  groupWasUnchecked: function(name) {
    this.get('selectedGroups').removeObject(name);
  }
});

export default GroupsView;