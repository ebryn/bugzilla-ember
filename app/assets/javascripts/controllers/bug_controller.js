//= require visibility

App.BugController = Ember.ObjectController.extend({
  isShowingRemainingComments: false,

  keywords: function() {
    var keywords = this.get('content.keywords');
    return keywords && keywords.join(', ')
  }.property('content.keywords'),

  showRemainingComments: function() {
    this.set('isShowingRemainingComments', true);
  },

  _pollingInterval: 30 * 1000,
  _pollingTimer: null,

  _startPolling: function() {
    if (Ember.testing) { return; }

    this._pollingTimer = Ember.run.later(this, function() {
      this.get('content').reload();
      this._contentDidChange();
    }, this._pollingInterval);
  },

  _stopPolling: function() {
    if (this._pollingTimer) { Ember.run.cancel(this._pollingTimer); }
  },

  init: function() {
    this._visibility = new Visibility({
      onHidden: this._stopPolling.bind(this),
      onVisible: this._startPolling.bind(this)
    });
  },

  willDestroy: function() {
    this._visibility.destroy();
  },

  _contentWillChange: function() {
    this._stopPolling();
  }.observesBefore('content'),

  _contentDidChange: function() {
    this._startPolling();
  }.observes('content')
});
