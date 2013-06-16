App.ApplicationController = Ember.Controller.extend({
  needs: ['user', 'login'],

  user: Ember.computed.alias('controllers.user'),
  searchText: null,

  searchResults: function() {
    var searchText = this.get('searchText');
    return App.Bug.search(searchText);
  }.property('searchText'),

  clearSearchText: function() {
    this.set('searchText', null);
  }
});
