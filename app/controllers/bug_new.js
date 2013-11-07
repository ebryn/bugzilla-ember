import Bug from 'bugzilla/models/bug';
import unhandledRejection from 'bugzilla/utils/unhandled_rejection';

var Controller = Ember.ArrayController.extend({
  selectedProduct: null,
  selectedComponent: null,
  flashMessage: null,
  isSaving: false,
  showingAdvanced: false,
  newBug: null,
  newBugIsLoading: false,
  fields: Em.computed.alias('newBug.fields'),

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
      this.set('model.fields.severity.currentValue', value);
      return value;
    }

    return this.get('fields.severity.defaultValue');
  }.property('fields.severity.defaultValue'),

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
    }
  }
});

export default Controller;
