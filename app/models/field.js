import camelizeKeys from 'bugzilla/utils/camelize_keys';

var Field = Ember.Object.extend({
  name: null,
  description: null,
  isCustom: null,
  isMandatory: null,
  canEdit: null,
  currentValue: null,
  values: null, // optional

  toJSON: function() {
    return this.get('currentValue');
  }
});

Field.reopenClass({
  fromJSON: function(attrs) {
    return this.create(camelizeKeys(attrs));
  }
});

export default Field;