import getJSON from 'bugzilla/utils/get_json';
import ajax from 'bugzilla/utils/ajax';
import urlFor from 'bugzilla/utils/url_for';
import Attachment from 'bugzilla/models/attachment';

var RSVP = Ember.RSVP;

var Bug = Ember.Object.extend({
  id: null,
  fields: null,
  customFields: null,
  trackingFlags: null,
  projectFlags: null,
  groups: null,

  unobsoleteAttachments: function() {
    var attachments = this.get('attachments');

    var result = attachments.filter(isntObsolete).map(toAttachment);

    Ember.set(result, '_source', attachments);
    Ember.defineProperty(result, 'isLoading', Ember.computed.alias('_source.isLoading'));

    return result;

    function isntObsolete(attachment) {
      return !attachment.is_obsolete;
    }

    function toAttachment(data) {
      return Attachment.create({
        _data: data,
        isLoaded: true
      });
    }
  }.property('attachments.@each.is_obsolete'),

  toJSON: function() {
    var fields = this.get('fields'),
      customFields = this.get('customFields'),
      values = {},
      field;

    // TODO: Flags
    for (var key in fields) {
      field = fields[key];
      if (field.can_edit === false) { continue; }
      values[key] = field.current_value;
    }

    customFields.forEach(function(field) {
      values[field.name] = field.current_value;
    });

    return values;
  },

  create: function() {
    var model = this, json = this.toJSON();
    json.product = this.get('product'); // unique to create
    json.groups = this.get('groups');

    return ajax(urlFor("bug"), {
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(json)
    }).then(function(json) {
      return json.id;
    });
  },

  update: function() {
    var model = this,
        json = this.toJSON();

    // TODO: handle comments in the same request?
    delete json.comment;

    // CC updates are handled separately
    delete json.cc;

    json.depends_on = {set: json.depends_on};
    json.blocks = {set: json.blocks};
    json.keywords = {set: json.keywords};
    // TODO: handle these hash values properly
    delete json.see_also;
    delete json.groups;

    return ajax(urlFor("bug/" + this.get('id')), {
      type: 'PUT',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(json)
    }).then(function() { return model; });
  }
});

function processAttributes(json) {
  var attrs = {id: json.id, fields: {}, customFields: [], projectFlags: [], trackingFlags: [], canEdit: false};

  json.fields.forEach(function(field) {
    if (field.can_edit && field.name !== 'longdesc') {
      attrs.canEdit = true;
    }

    if (field.is_custom) {
      if (field.name.match(/^cf_(tracking|status|relnote)_/)) {
        attrs.trackingFlags.push(field);
      } else if (field.name.match(/^cf_blocking_(b2g|basecamp|kilimanjaro)$/)) {
        attrs.projectFlags.push(field);
      } else {
        attrs.customFields.push(field);
      }
    } else {
      attrs.fields[field.name] = field;
    }
  });

  // Filter out attachment flags
  attrs.fields.flags.values = attrs.fields.flags.values.filterProperty('type', 'bug');

  attrs.attachments = json.attachments;
  attrs.comments = json.comments;

  return attrs;
}

function create(type, newAttributes) {
  return function(attrs) {
    if (newAttributes) {
      Ember.merge(attrs, newAttributes);
    }
    return type.create(attrs);
  };
}

Bug.reopenClass({
  newRecord: function(productName, attrs){
    return getJSON(urlFor('ember/create/' + productName)).
      then(processAttributes).
      then(create(this, {product: productName}));
  },

  find: function(id) {
    return getJSON(urlFor('ember/show/' + id)).
      then(processAttributes).
      then(create(this));
  },

  // FIXME
  findQuery: function(params) {
    var records = Ember.ArrayProxy.create({content: []});

    getJSON(urlFor("bug"), params).then(function(json) {
      records.pushObjects(json.bugs);
    }, function(reason) {
      alert("FAIL");
    });

    return records;
  }
});

export default Bug;
