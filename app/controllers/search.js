import Bug from 'bugzilla/models/bug';

var SearchControler = Ember.Controller.extend({
  searchText: null,

  searchResults: function() {
    var searchText = this.get('searchText');
    return Bug.search(searchText);
  }.property('searchText'),

  clearSearchText: function() {
    this.set('searchText', null);
  }
});

export default SearchControler;
