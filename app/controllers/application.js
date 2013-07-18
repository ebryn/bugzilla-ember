import Bug from 'bugzilla/models/bug';

var ApplicationController = Ember.Controller.extend({
  needs: ['user', 'login'],

  user: Ember.computed.alias('controllers.user'),
  searchText: null,

  searchResults: function() {
    var searchText = this.get('searchText');
    return Bug.search(searchText);
  }.property('searchText'),

  clearSearchText: function() {
    this.set('searchText', null);
  }
});

export default ApplicationController;
