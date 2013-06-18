App.BugController = Ember.ObjectController.extend({
  isShowingRemainingComments: false,

  keywords: function() {
    return this.get('content.keywords').join(', ')
  }.property('content.keywords'),

  showRemainingComments: function() {
    this.set('isShowingRemainingComments', true);
  },

  _pollingInterval: 30 * 1000,
  _pollingTimer: null,

  _contentWillChange: function() {
    if (this._pollingTimer) { Ember.run.cancel(this._pollingTimer); }
  }.observesBefore('content'),

  _contentDidChange: function() {
    if (Ember.testing) { return; }

    this._pollingTimer = Ember.run.later(this, function() {
      this.get('content').reload();
      this._contentDidChange();
    }, this._pollingInterval);
  }.observes('content')
});
