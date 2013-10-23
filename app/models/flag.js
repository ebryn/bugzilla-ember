import camelizeKeys from 'bugzilla/utils/camelize_keys';
import underscoreKeys from 'bugzilla/utils/underscore_keys';

var Flag = Ember.Object.extend({
  id: null,
  typeId: null,
  type: null,
  status: null,
  name: null,
  requestee: null,
  setter: null,
  creationDate: null,
  modificationDate: null,

  toJSON: function() {
    var json = this.getProperties('status'),
        requestee = this.get('requestee.email');

    if (requestee) { json.requestee = requestee; }

    if (this.get('id')) { // isSaved
      json.id = this.get('id');
    } else { // isNew
      json.typeId = this.get('typeId');
    }

    return underscoreKeys(json);
  }
});

Flag.reopenClass({
  fromJSON: function(attrs) {
    // TODO?
    // attrs.requestee = attrs.requestee.email;
    // attrs.setter = attrs.setter.email;

    return this.create(camelizeKeys(attrs));
  },

  fromDefinition: function(definition, attrs) {
    return this.create(Ember.merge(attrs, {typeId: definition.get('id'), name: definition.get('name'), values: definition.get('values')}));
  }
});

export default Flag;