import Bug from 'bugzilla/models/bug';
import unhandledRejection from 'bugzilla/utils/unhandled_rejection';

function cpProxySetName(dependentKey) {
  return function(key, value) {
    if (arguments.length === 2) {
      this.set('content.' + key, Ember.get(value, 'name'));
      return value;
    }
    return null;
  }.property(dependentKey);
}

var Controller = Ember.ObjectController.extend({
  needs: ['configuration'],
  configuration: Em.computed.alias('controllers.configuration'),

  products: null,
  product: cpProxySetName('products'),

  components: Em.computed.alias('product.components'),
  component: cpProxySetName('components'),

  versions: Em.computed.alias('product.versions'),
  version: cpProxySetName('versions'),

  severity: cpProxySetName(),
  platform: cpProxySetName(),
  op_sys: cpProxySetName(),
  priority: cpProxySetName(),
  status: cpProxySetName(),

  save: function() {
    var self = this,
        model = this.get('content');

    model.save().then(function() {
      self.set('content', Bug.create());
      self.transitionToRoute("bug", model);
    }).then(null, unhandledRejection);
  }
});

export default Controller;
