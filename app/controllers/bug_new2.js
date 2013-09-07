import Bug from 'bugzilla/models/bug';
import unhandledRejection from 'bugzilla/utils/unhandled_rejection';

var Controller = Ember.ObjectController.extend({
  selectedComponent: null,
  fields: null,
  customFields: null,

  // Prevent these from being set on the model
  assigned_to: null,
  cc: null,
  qa_contact: null,

  selectedComponentDidChange: function() {
    var selectedComponent = this.get('selectedComponent');
    if (!selectedComponent) { return; }

    // TODO: change real_name to email when create API is fixed for login
    this.set('assigned_to', selectedComponent.default_assignee.real_name);
    this.set('cc', (selectedComponent.initial_cc || []).mapProperty('real_name').join(', '));
    this.set('qa_contact', selectedComponent.default_qa_contact.real_name);
  }.observes('selectedComponent'),

  save: function() {
    var self = this,
        model = this.get('content');

    model.save().then(function() {
      self.set('content', Bug.create());
      self.transitionToRoute("bug", model);
    }); // errors being handled inside adapter for now
  }
});

export default Controller;
