App.ApplicationController = Ember.Controller.extend({
  searchText: null,

  searchResults: function() {
    var searchText = this.get('searchText');
    return App.Bug.search(searchText);
  }.property('searchText'),

  clearSearchText: function() {
    this.set('searchText', null);
  }
});