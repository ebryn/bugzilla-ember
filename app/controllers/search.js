import Bug from 'bugzilla/models/bug';

var SearchControler = Ember.Controller.extend({
  searchText: null,

  actions: {
    quicksearch: function() {
      var searchText = this.get('searchText');
      this.transitionToRoute('searchResults', {queryParams: {q: searchText}});
      this.clearSearchText();
    }
  },

  // searchResults: function() {
  //   var searchText = this.get('searchText');
  //   return Bug.search(searchText);
  // }.property('searchText'),

  clearSearchText: function() {
    this.set('searchText', null);
  }
});

export default SearchControler;
