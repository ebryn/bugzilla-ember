import Bug from 'bugzilla/models/bug';
import unhandledRejection from 'bugzilla/utils/unhandled_rejection';

var Controller = Ember.ObjectController.extend({
  needs: ['configuration'],
  configuration: Em.computed.alias('controllers.configuration'),

  products: null,
  selectedProduct: null,

  components: Em.computed.alias('selectedProduct.components'),
  selectedComponent: null,

  versions: Em.computed.alias('selectedProduct.versions'),

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
