import Bug from "bugzilla/models/bug";
import Comment from 'bugzilla/models/comment';
import Attachment from 'bugzilla/models/attachment';
import Flag from 'bugzilla/models/flag';
import unhandledRejection from 'bugzilla/utils/unhandled_rejection';
import ajax from "bugzilla/utils/ajax";
import urlFor from "bugzilla/utils/url_for";

var COMMENTS_SHOWN_BY_DEFAULT = 3;

var BugController = Ember.ObjectController.extend({
  needs: ['user', 'bug', 'application'],
  recentBugs: Em.computed.alias('controllers.application.recentBugs'),
  user: Em.computed.alias('controllers.user'),
  canEdit: Ember.computed.and('model.canEdit', 'user.isLoggedIn'),
  isLoaded: Ember.computed.bool('model'),
  isLoading: Ember.computed.not('isLoaded'),
  isEditing: null,
  showingObsoleteAttachments: false,
  isShowingRemainingComments: false,
  newCommentText: null,
  newCommentIsPrivate: false,
  newCommentIsSaving: false,
  errorMessage: null,
  flashMessage: null,
  newFlagDefinition: null,
  newFlagStatus: null,
  newFlagRequestee: null,
  newTrackingFlag: null,
  newTrackingFlagStatus: null,
  newProjectFlag: null,
  newProjectFlagStatus: null,
  newGroup: null,
  newSeeAlsoUrl: null,

  findBug: function(bugId) {
    var self = this;

    return Bug.find(bugId).then(function(bug) {
      document.title = bug.get('id') + ' - ' + bug.get('fields.summary.currentValue');
      return bug;
    }, function(reason) {
      var json = reason.responseJSON,
          errorCode = json && json.code,
          errorMessage = json && json.message;

      if (errorMessage) {
        self.set('errorMessage', errorMessage);
      } else {
        self.set('errorMessage', "An unknown error occurred while loading bug #" + bugId);
        console.log(reason);
      }
    });
  },

  attachments: function() {
    var bugId = this.get('model.id');
    if (!bugId) { return {isLoading: true, isLoaded: false}; }

    return Attachment.find({bug_id: bugId});
  }.property('model'),

  comments: function() {
    var bugId = this.get('model.id');
    if (!bugId) { return {isLoading: true, isLoaded: false}; }

    return Comment.find({bug_id: bugId});
  }.property('model'),

  oldUIURL: function() {
    return this.get('config.host') + '/show_bug.cgi?id=' + this.get('id');
  }.property('id', 'config.host'),

  keywords: function() {
    var keywords = this.get('content.keywords');
    return keywords && keywords.join(', ');
  }.property('content.keywords'),

  currentUserInCCList: function() {
    var email = this.get('user.username'),
        ccList = this.get('fields.cc.currentValue') || [];

    if (!ccList) { return false; }

    return ccList.contains(email);
  }.property('user.username', 'fields.cc.currentValue.[]'),

  isResolved: function() {
    return this.get('fields.status.currentValue') === 'RESOLVED';
  }.property('fields.status.currentValue'),

  isResolvedAsDuplicate: function() {
    return this.get('isResolved') && this.get('fields.resolution.currentValue') === 'DUPLICATE';
  }.property('isResolved', 'fields.resolution.currentValue'),

  filteredAttachments: function() {
    var attachments = this.get('attachments') || [];

    if (!attachments) { return []; }

    var filter = this.get('showingObsoleteAttachments') ? Ember.K : isntObsolete;
    var result = attachments.filter(filter);

    Ember.set(result, '_source', attachments);
    Ember.defineProperty(result, 'isLoading', Ember.computed.alias('_source.isLoading'));

    return result;

    function isntObsolete(attachment) {
      return !attachment.get('is_obsolete');
    }

    function toAttachment(data) {
      return Attachment.create({
        _data: data,
        isLoaded: true
      });
    }
  }.property('attachments.@each.is_obsolete', 'showingObsoleteAttachments'),

  firstComment: function() {
    return this.get('comments.firstObject');
  }.property('comments.firstObject'),

  lastFewComments: function() {
    var comments = this.get('comments');

    if (!comments) { return []; }

    var commentsLength = comments.get('length');

    if (commentsLength <= 1) {
      return [];
    } else {
      var numberToShow = Math.min(commentsLength - 1, COMMENTS_SHOWN_BY_DEFAULT);
      return comments.slice(commentsLength - numberToShow);
    }
  }.property('comments.[]'),

  remainingComments: function() {
    var comments = this.get('comments');

    if (!comments) { return []; }

    var commentsLength = comments.get('length');

    // if we have enough comments to display
    if (commentsLength < (COMMENTS_SHOWN_BY_DEFAULT + 1)) { return []; }

    var lastShownIndex = commentsLength - Math.min(commentsLength - 1, COMMENTS_SHOWN_BY_DEFAULT);
    return comments.slice(1, lastShownIndex);
  }.property('comments.[]'),

  newFlags: function() {
    var allFlags = this.get('fields.flags.values'),
        existingFlags = this.get('fields.flags.currentValue'),
        settableFlags = [];

    allFlags.forEach(function(flag) {
      var flagExists = existingFlags.findProperty('name', flag.get('name'));
      // if flag exists and !is_multiplicable
      if (flagExists && !flag.get('isMultiplicable')) {
        // not settable
      } else {
        // convert flags into a model?
        settableFlags.push(flag);
      }
    });

    return settableFlags;
  }.property('fields.flags.values.[]', 'fields.flags.currentValue.[]'),

  allFlags: Em.computed.alias('fields.flags.values'),

  bugFlags: Em.computed.filter('allFlags', function(flag) {
    return flag.type === 'bug';
  }),

  currentFlags: function() {
    var currentFlags = this.get('fields.flags.currentValue'),
        bugFlags = this.get('bugFlags');

    currentFlags.forEach(function(flag) {
      flag.values = bugFlags.findProperty('name', flag.name).values;
      if (!flag.requestee) { flag.requestee = {}; }
    });

    return currentFlags;
  }.property('fields.flags.currentValue'),

  shouldShowNewFlagRequestee: function() {
    return this.get('newFlagDefinition.isRequesteeble') && this.get('newFlagStatus') === "?";
  }.property('newFlagDefinition.isRequesteeble', 'newFlagStatus'),

  newTrackingFlags: function() {
    var allFlags = this.get('trackingFlags.values'),
        existingFlags = this.get('trackingFlags.currentValue'),
        settableFlags = [];

    allFlags.forEach(function(flag) {
      var flagExists = existingFlags.findProperty('name', flag.name);
      // all tracking flags are not multiplicable
      if (!flagExists) {
        settableFlags.push(flag);
      }
    });

    return settableFlags;
  }.property('trackingFlags.values.[]', 'trackingFlags.currentValue.[]'),

  newProjectFlags: function() {
    var allFlags = this.get('projectFlags.values'),
        existingFlags = this.get('projectFlags.currentValue'),
        settableFlags = allFlags.slice();

    existingFlags.forEach(function(group) {
      settableFlags.removeObject(group);
    });

    return settableFlags;
  }.property('projectFlags.values.[]', 'projectFlags.currentValue.[]'),

  newGroups: function() {
    var allGroups = this.get('fields.groups.values'),
        existingGroups = this.get('fields.groups.currentValue'),
        settableGroups = allGroups.slice();

    existingGroups.forEach(function(group) {
      settableGroups.removeObject(group);
    });

    return settableGroups;
  }.property('fields.groups.values.[]', 'fields.groups.currentValue.[]'),

  isPrivate: function() {
    return !!this.get('fields.groups.currentValue.length');
  }.property('fields.groups.currentValue.[]'),

  actions: {
    addSeeAlsoUrl: function() {
      var newUrl = this.get('newSeeAlsoUrl');

      if (!newUrl) { return; }

      this.get('fields.seeAlso.currentValue').pushObject(newUrl);

      this.set('newSeeAlsoUrl', null);
    },

    removeSeeAlsoUrl: function(url) {
       // TODO: look into why url is getting passed in as a String object. We have to coerce right now to make this work.
      this.get('fields.seeAlso.currentValue').removeObject(url + '');
    },

    addNewGroup: function() {
      var group = this.get('newGroup');

      if (!group) { return; }

      var currentGroups = this.get('fields.groups.currentValue');
      currentGroups.pushObject(group);

      this.setProperties({newGroup: null});
    },

    removeGroup: function(group) {
      var currentGroups = this.get('fields.groups.currentValue');
      currentGroups.removeObject(group);
    },

    addNewFlag: function() {
      var flagDefinition = this.get('newFlagDefinition'),
          flagStatus = this.get('newFlagStatus');

      if (!flagDefinition || !flagStatus) { return; }

      var currentFlags = this.get('fields.flags.currentValue'),
          newFlag = Flag.fromDefinition(flagDefinition, {
            status: flagStatus,
            requestee: {email: this.get('newFlagRequestee')}
          });

      currentFlags.pushObject(newFlag);

      this.setProperties({
        newFlagDefinition: null,
        newFlagStatus: null,
        newFlagRequestee: null
      });
    },

    addNewTrackingFlag: function() {
      var flagDefinition = this.get('newTrackingFlag'),
          flagStatus = this.get('newTrackingFlagStatus');

      if (!flagDefinition || !flagStatus) { return; }

      var currentFlags = this.get('trackingFlags.currentValue'),
          newFlag = Ember.merge(flagDefinition, {currentValue: flagStatus});

      currentFlags.pushObject(newFlag);

      this.setProperties({
        newTrackingFlag: null,
        newTrackingFlagStatus: null
      });
    },

    addNewProjectFlag: function() {
      var flagDefinition = this.get('newProjectFlag'),
          flagStatus = this.get('newProjectFlagStatus');

      if (!flagDefinition || !flagStatus) { return; }

      var currentFlags = this.get('projectFlags.currentValue'),
          newFlag = Ember.merge(flagDefinition, {currentValue: flagStatus});

      currentFlags.pushObject(newFlag);

      this.setProperties({
        newProjectFlag: null,
        newProjectFlagStatus: null
      });
    },


    save: function() {
      var self = this,
          bug = this.get('model'),
          currentFlags = this.get('fields.flags.currentValue'),
          newFlags = this.get('newFlags');

      newFlags.forEach(function(flag) {
        if (Ember.get(flag, 'value')) {
          currentFlags.push({type_id: Ember.get(flag, 'id'), status: Ember.get(flag, 'value')});
        }
      });

      this.set('isSaving', true);

      bug.update().then(function(model) {
        self.set('isSaving', false);
        self.set('flashMessage', null);
        self.transitionToRoute('bug');
      }, function(reason) {
        self.set('isSaving', false);

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
        self.get("fields.cc.currentValue").pushObject(currentUserEmail);
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
        self.get("fields.cc.currentValue").removeObject(currentUserEmail);
      }, function(reason) {
        alert("Error occurred, see console");
        console.log(reason);
      });
    },

    toggleObsoleteAttachments: function() {
      this.toggleProperty('showingObsoleteAttachments');
    },

    showRemainingComments: function() {
      this.set('isShowingRemainingComments', true);
    },

    saveComment: function() {
      var newComment = Comment.create({
        text: this.get('newCommentText'),
        is_private: this.get('newCommentIsPrivate'),
        bug_id: this.get('id')
      });

      var self = this;
      this.set('newCommentIsSaving', true);
      newComment.save().then(function() {
        // FIXME: Comments is an array of POJOs initially. We push a Comment object when created on the client.
        self.get('comments').pushObject(newComment);
        self.set('newCommentText', null);
        self.set('newCommentIsPrivate', false);
        self.set('newCommentIsSaving', false);
      }, function(reason) {
        alert("Unexpected error occurred while saving comment");
        console.log(reason);
        self.set('newCommentIsSaving', false);
      });
    },

    reply: function(comment) {
      var newCommentText = this.get('newCommentText') || "",
          commentIndex = this.get('comments').indexOf(comment);

      newCommentText += "(In reply to %@ from comment #%@)\n".fmt(Ember.get(comment, 'creator'), commentIndex);
      newCommentText += Ember.get(comment, "text").replace(/^/mg, "> ");
      newCommentText += "\n\n";

      this.set('newCommentText', newCommentText);

      // FIXME: hacks
      var $newCommentEl = Ember.$('.new-comment textarea');
      $newCommentEl.focus();
      $newCommentEl[0].scrollIntoViewIfNeeded();
    },

    reload: function() {
      var self = this,
          bug = this.get('model'),
          attachments = this.get('attachments'),
          comments = this.get('comments');

      this.set('isReloading', true);
      return Ember.RSVP.hash({bug: bug.reload(), attachments: attachments.reload(), comments: comments.reload()}).
        then(function(hash) {
          self.set('isReloading', false);
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
    this.set('isShowingRemainingComments', false);

    var bug = this.get('content');

    if (!bug) { return; }

    var recentBugs = this.get('recentBugs');
    if (!recentBugs.findProperty('id', bug.get('id'))) {
      recentBugs.unshiftObject({
        id: bug.get('id'),
        summary: bug.get('fields.summary.currentValue')
      });
    }
  }.observes('content')
});

export default BugController;