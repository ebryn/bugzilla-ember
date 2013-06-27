App.BrowseController = Ember.ArrayController.extend({
  init: function(){
    this._super();
    this.set('sortProperties', ['last_change_time']);
    this.set('sortAscending', false);
  },
  changeSort: function(property) {
    if (this.get('sortProperties').contains(property)) {
      var newSortDirection = this.get('sortAscending') ? false : true;
      this.set('sortAscending', newSortDirection);
    } else {
      this.set('sortProperties', [property]);
    }
  }
});
