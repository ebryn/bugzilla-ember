App.BrowseColumnHeaderView = Ember.View.extend({
  tagName: 'th',
  templateName:'browse_column_header',
  sortClass: function(){
    var sortedBy = this.get('controller.sortProperties');
    if (!sortedBy.contains(this.get('column'))) return '';
    return this.get('controller.sortAscending') ? 'sortUp' : 'sortDown';
  }.property('controller.sortProperties', 'controller.sortAscending'),
  click: function() {
    this.get('controller').send('changeSort', this.get('column'));
  }
});
