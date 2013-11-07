import Bug from 'bugzilla/models/bug';
import unhandledRejection from 'bugzilla/utils/unhandled_rejection';
import Flag from 'bugzilla/models/flag';

var Controller = Ember.ArrayController.extend({
  selectedProduct: null,
  selectedComponent: null,
  flashMessage: null,
  isSaving: false,
  showingAdvanced: false,
  newBug: null,
  newBugIsLoading: false,
  fields: Em.computed.alias('newBug.fields'),
  projectFlags: Em.computed.alias('newBug.projectFlags'),
  trackingFlags: Em.computed.alias('newBug.trackingFlags'),

  _selectedProductDidChange: function() {
    var selectedProduct = this.get('selectedProduct.name'),
        self = this;

    this.set('newBug', null);

    if (!selectedProduct) {
      return;
    }

    this.set('newBugIsLoading', true);

    Bug.newRecord(selectedProduct).then(function(bug) {
      self.set('newBug', bug);
      self.set('newBugIsLoading', false);
    }, function(reason) {
      self.set('newBugIsLoading', false);
      alert("Failed to create new bug object");
    });
  }.observes('selectedProduct'),

  assignedTo: function(key, value) {
    if (arguments.length === 2) {
      this.set('fields.assignedTo.currentValue', value);
      return value;
    }
    return this.get('fields.assignedTo.currentValue') || this.get('selectedComponent.defaultAssignee.email');
  }.property('selectedComponent.defaultAssignee.email', 'fields.assignedTo.currentValue'),

  qaContact: function(key, value) {
    if (arguments.length === 2) {
      this.set('fields.qaContact.currentValue', value);
      return value;
    }
    return this.get('fields.qaContact.currentValue') || this.get('selectedComponent.defaultQaContact.email');
  }.property('selectedComponent.defaultQaContact.email', 'fields.qaContact.currentValue'),

  initialCc: function() {
    var initialCc = this.get('selectedComponent.initialCc');
    return (initialCc || []).mapProperty('email').join(', ');
  }.property('selectedComponent.initialCc'),

  cannotEditAssignee: function() {
    return !this.get('fields.assignedTo');
  }.property('fields.assignee'),

  cannotEditQAContact: function() {
    return !this.get('fields.qaContact');
  }.property('fields.qaContact'),

  _setDefaults: function() {
    this.set('flashMessage', null);
    // TODO: actually detect these
    // this.set('fields.platform.currentValue', 'x86');
    // this.set('fields.opSys.currentValue', 'Mac OS X');
  }.observes('model'),

  severity: function(key, value) {
    if (arguments.length === 2) {
      this.set('fields.severity.currentValue', value);
      return value;
    }

    return this.get('fields.severity.defaultValue');
  }.property('fields.severity.defaultValue'),

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

  actions: {
    toggleAdvanced: function() {
      this.toggleProperty('showingAdvanced');
    },

    save: function() {
      var self = this,
          model = this.get('newBug');

      this.set('isSaving', true);

      model.create().then(function(newBugId) {
        self.set('isSaving', false);
        self.set('flashMessage', null);
        // self.set('selectedProduct', null);
        self.transitionToRoute("bug", newBugId);
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

    addNewGroup: function() {
      var group = this.get('newGroup');

      if (!group) { return; }

      var currentGroups = this.get('fields.groups.currentValue');
      currentGroups.pushObject(group);

      this.setProperties({newGroup: null});
    },
  }
});

export default Controller;
