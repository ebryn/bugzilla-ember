document.write('<div id="ember-testing-container"><div id="ember-testing"></div></div>');
document.write('<style>#ember-testing-container { position: absolute; background: white; bottom: 0; right: 0; width: 640px; height: 384px; overflow: auto; z-index: 9999; border: 1px solid #ccc; } #ember-testing { zoom: 50%; }</style>');

Ember.testing = true;

var App = requireModule('bugzilla/app').create();

App.rootElement = '#ember-testing';
App.setupForTesting();
App.injectTestHelpers();

function exists(selector, message) {
  ok(!!find(selector).length, message);
}

function doesntExist(selector, message) {
 ok(!find(selector).length, message);
}

window.exists = exists;
window.doesntExist = doesntExist;

$(function(){
  $('html').addClass('testing');
});

Ember.Container.prototype.stub = function(fullName, instance) {
  instance.destroy = instance.destroy || function() {};
  this.cache.dict[fullName] = instance;
};

Factory.define('product').
  sequence('id').
  sequence('name', function(i) { return 'Product #' + i; }).
  attr('components', function() {
    return [
      Factory.attributes('component')
    ];
  });

Factory.define('component').
  sequence('id').
  sequence('name', function(i) { return 'Component #' + i; });

Factory.define('field').
  sequence('id').
  attr('api_name', null).
  attr('display_name', null);