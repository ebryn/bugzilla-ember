import ajax from "bugzilla/utils/ajax";
import urlFor from "bugzilla/utils/url_for";

var BugController = Ember.ObjectController.extend({
  needs: ['user', 'bug'],
  user: Em.computed.alias('controllers.user'),
  canEdit: Ember.computed.alias('controllers.bug.canEdit'),
  isEditing: null,

  isShowingRemainingComments: false,
  newCommentText: null,
  flashMessage: null,

  keywords: function() {
    var keywords = this.get('content.keywords');
    return keywords && keywords.join(', ');
  }.property('content.keywords'),

  currentUserInCCList: function() {
    var email = this.get('user.username'),
        ccList = this.get('fields.cc.current_value');

    return ccList.contains(email);
  }.property('user.username', 'fields.cc.current_value.[]'),

  isResolved: function() {
    return this.get('fields.status.current_value') === 'RESOLVED';
  }.property('fields.status.current_value'),

  actions: {
    save: function() {
      var self = this,
          bug = this.get('model');

      bug.update().then(function(model) {
        self.set('flashMessage', null);
        self.transitionToRoute('bug');
      }, function(reason) {
        // FIXME: unify error handling

        var json = reason.responseJSON;
        if (json && json.message) {
          self.set('flashMessage', json.message);
        } else {
          alert("Error occurred while saving bug");
          console.log(reason);
        }
      });
    },

    addCurrentUserToCCList: function() {
      var self = this,
          currentUserEmail = this.get('user.username');

      ajax(urlFor("bug/" + this.get('id')), {
        type: "PUT",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({cc: {add: [currentUserEmail]}})
      }).then(function(json) {
        self.get("fields.cc.current_value").pushObject(currentUserEmail);
      }, function(reason) {
        alert("Error occurred, see console");
        console.log(reason);
      });
    },

    removeCurrentUserFromCCList: function() {
      var self = this,
          currentUserEmail = this.get('user.username');

      ajax(urlFor("bug/" + this.get('id')), {
        type: "PUT",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({cc: {remove: [currentUserEmail]}})
      }).then(function(json) {
        self.get("fields.cc.current_value").removeObject(currentUserEmail);
      }, function(reason) {
        alert("Error occurred, see console");
        console.log(reason);
      });
    }
  },

  _pollingInterval: 30 * 1000,
  _pollingTimer: null,

  _startPolling: function() {
    if (Ember.testing || this._pollingTimer) { return; }

    // this._pollingTimer = Ember.run.later(this, function() {
    //   var content = this.get('content');
    //   content.reload();
    //   this._pollingTimer = null;
    //   this._startPolling();
    // }, this._pollingInterval);
  },

  _stopPolling: function() {
    if (this._pollingTimer) {
      Ember.run.cancel(this._pollingTimer);
      this._pollingTimer = null;
    }
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
    this.set('flashMessage', null);
  }.observes('content')
});

export default BugController;
