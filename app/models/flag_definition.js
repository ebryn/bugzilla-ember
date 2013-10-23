import camelizeKeys from 'bugzilla/utils/camelize_keys';

var FlagDefinition = Ember.Object.extend({
  id: null,
  name: null,
  description: null,
  type: null,
  canRequestFlag: null,
  canSetFlag: null,
  isMultiplicable: null,
  isRequestable: null,
  isRequesteeble: null,
  values: null
});

FlagDefinition.reopenClass({
  fromJSON: function(attrs) {
    return this.create(camelizeKeys(attrs));
  }
});

export default FlagDefinition;