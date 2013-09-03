import Bug from 'bugzilla/models/bug';
import unhandledRejection from 'bugzilla/utils/unhandled_rejection';

var Controller = Ember.ObjectController.extend({
  product: null,
  selectedProduct: null,

  components: Em.computed.alias('product.components'),
  selectedComponent: null,

  versions: Em.computed.alias('product.versions'),

  // fields: function(key, fields) {
  //   if (arguments.length === 2) {
  //     var obj = {}, field;
  //     for (var i = 0, l = fields.length; i < l; i++) {
  //       field = fields[i];
  //       obj[field.name] = field; // not sure whether we should use name or api_name here
  //     }
  //     return obj;
  //   }
  // }.property('fields'),

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
