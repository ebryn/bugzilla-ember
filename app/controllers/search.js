import Bug from 'bugzilla/models/bug';

var SearchControler = Ember.Controller.extend({
  searchText: null,

  actions: {
    quicksearch: function() {
      window.open(this.get('config.host') + "/buglist.cgi?quicksearch=" + this.get('searchText'));
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
