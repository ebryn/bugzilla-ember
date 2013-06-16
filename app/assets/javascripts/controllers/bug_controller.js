App.BugController = Ember.ObjectController.extend({
  pollingInterval: 30 * 1000,

  _pollingTimer: null,

  _contentWillChange: function() {
    if (this._pollingTimer) { Ember.run.cancel(this._pollingTimer); }
  }.observesBefore('content'),

  _contentDidChange: function() {
    this._pollingTimer = Ember.run.later(this, function() {
      this.get('content').reload();
      this._contentDidChange();
    }, this.pollingInterval);
  }.observes('content')
});