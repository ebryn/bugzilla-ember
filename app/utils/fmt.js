var map = Ember.EnumerableUtils.map;

function fmt() {
  var args = Array.prototype.slice.call(arguments);
  var template = args[0];
  var dependentKeys = args.slice(1);

  var computed = Ember.computed(function(){
    var values = map(dependentKeys, function(key) {
      return Ember.get(this, key);
    }, this);

    return Ember.String.fmt(template, values);
  });

  computed.property.apply(computed, dependentKeys);

  return computed;
}

export default fmt;
