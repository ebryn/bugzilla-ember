var Controller = Ember.ArrayController.extend({
  init: function(){
    this._super();
    this.set('sortProperties', ['id']);
    this.set('sortAscending', true);
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

export default Controller;
