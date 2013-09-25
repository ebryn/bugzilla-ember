import Bug from 'bugzilla/models/bug';
import unhandledRejection from 'bugzilla/utils/unhandled_rejection';

var Controller = Ember.ObjectController.extend({
  selectedComponent: null,
  flashMessage: null,
  isSaving: false,

  assigned_to: function(key, value) {
    if (arguments.length === 2) {
      this.set('fields.assigned_to.current_value', value);
      return value;
    }
    return this.get('fields.assigned_to.current_value') || this.get('selectedComponent.default_assignee.email');
  }.property('selectedComponent.default_assignee.email', 'fields.assigned_to.current_value'),

  qa_contact: function(key, value) {
    if (arguments.length === 2) {
      this.set('fields.qa_contact.current_value', value);
      return value;
    }
    return this.get('fields.qa_contact.current_value') || this.get('selectedComponent.default_qa_contact.email');
  }.property('selectedComponent.default_qa_contact.email', 'fields.qa_contact.current_value'),

  initial_cc: function() {
    var initial_cc = this.get('selectedComponent.initial_cc');
    return (initial_cc || []).mapProperty('email').join(', ');
  }.property('selectedComponent.initial_cc'),

  cannotEditAssignee: function() {
    return !this.get('fields.assigned_to');
  }.property('fields.assignee'),

  cannotEditQAContact: function() {
    return !this.get('fields.qa_contact');
  }.property('fields.qa_contact'),

  _setDefaults: function() {
    this.set('flashMessage', null);
    // TODO: actually detect these
    this.set('fields.platform.current_value', 'x86');
    this.set('fields.op_sys.current_value', 'Mac OS X');
  }.observes('model'),

  severity: function(key, value) {
    if (arguments.length === 2) {
      this.set('model.fields.severity.current_value', value);
      return value;
    }

    return this.get('fields.severity.default_value');
  }.property('fields.severity.default_value'),

  actions: {
    save: function() {
      var self = this,
          model = this.get('content');

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
