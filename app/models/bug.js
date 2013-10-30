import getJSON from 'bugzilla/utils/get_json';
import ajax from 'bugzilla/utils/ajax';
import urlFor from 'bugzilla/utils/url_for';
import Attachment from 'bugzilla/models/attachment';
import Flag from 'bugzilla/models/flag';
import FlagDefinition from 'bugzilla/models/flag_definition';
import camelizeKeys from 'bugzilla/utils/camelize_keys';
import underscoreKeys from 'bugzilla/utils/underscore_keys';

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
      trackingFlagValues = this.get('trackingFlags.currentValue'),
      projectFlagValues = this.get('projectFlags.currentValue'),
      values = {},
      field;

    for (var key in fields) {
      field = fields[key];
      if (field.canEdit === false) { continue; }
      values[key] = field.currentValue;
    }

    values.flags = values.flags.map(function(flag) {
      return flag.toJSON();
    });

    trackingFlagValues.forEach(function(flag) {
      values[flag.name] = flag.currentValue;
    });

    projectFlagValues.forEach(function(flag) {
      values[flag.name] = flag.currentValue;
    });

    customFields.forEach(function(field) {
      values[field.name] = field.currentValue;
    });

    values.groups = fields.groups.currentValue.mapProperty('name');

    return underscoreKeys(values);
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

  toJSONForUpdate: function() {
    var json = this.toJSON();

    // TODO: handle comments in the same request?
    delete json.comment;

    // CC updates are handled separately
    delete json.cc;

    json.depends_on = {set: json.depends_on};
    json.blocks = {set: json.blocks};
    json.keywords = {set: json.keywords};
    json.see_also = serializeSeeAlsoForUpdate(this.get('fields.seeAlso'));
    json.groups = serializeGroupsForUpdate(this.get('fields.groups'));

    return json;
  },

  update: function() {
    var model = this,
        json = this.toJSONForUpdate();


    return ajax(urlFor("bug/" + this.get('id')), {
      type: 'PUT',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(json)
    }).then(function() { return model.reload(); });
  },

  reload: function() {
    var self = this;

    return getJSON(urlFor('ember/show/' + this.get('id'))).
      then(processAttributes).
      then(function(attrs) {
        self.setProperties(attrs);
      });
  }
});

function processAttributes(json) {
  var attrs = {
    id: json.id,
    fields: {},
    customFields: [],
    projectFlags: {currentValue: [], values: []},
    trackingFlags: {currentValue: [], values: []},
    canEdit: false
  };

  json.fields.forEach(function(field) {
    field = camelizeKeys(field);

    if (field.canEdit && field.name !== 'longdesc') {
      attrs.canEdit = true;
    }

    if (field.isCustom) {
      if (field.description.match(/^blocking-(b2g|basecamp|kilimanjaro)$/)) {
        attrs.projectFlags.values.push(field);
        if (field.currentValue !== "---") {
          attrs.projectFlags.currentValue.push(field);
        }
      } else if (field.description.match(/^(tracking|status|relnote|blocking)-/)) {
        attrs.trackingFlags.values.push(field);
        if (field.currentValue !== "---") {
          attrs.trackingFlags.currentValue.push(field);
        }
      } else {
        attrs.customFields.push(field);
      }
    } else {
      attrs.fields[field.name.camelize()] = field;
    }
  });

  // hack - API doesn't return can_edit for dupe_of field. filed as #932034.
  attrs.fields.dupeOf.canEdit = true;

  attrs.fields.flags = processFlags(attrs.fields.flags);
  attrs.fields.groups = processGroups(attrs.fields.groups);

  attrs.fields.seeAlso = camelizeKeys(attrs.fields.seeAlso);
  attrs.fields.seeAlso.originalValue = (attrs.fields.seeAlso.currentValue || []).slice();

  // attrs.attachments = json.attachments;
  // attrs.comments = json.comments;

  return attrs;
}

function processFlags(flagsField) {
  flagsField = camelizeKeys(flagsField, true);

  // Filter out attachment flags
  var bugFlags = flagsField.values.filterProperty('type', 'bug');

  flagsField.values = bugFlags.map(function(attrs) {
    return FlagDefinition.fromJSON(attrs);
  });

  flagsField.currentValue = (flagsField.currentValue || []).map(function(attrs) {
    return Flag.fromJSON(attrs);
  });

  return flagsField;
}

function processGroups(groupsField) {
  groupsField = camelizeKeys(groupsField);

  // convert group names into group objects
  groupsField.currentValue = (groupsField.currentValue || []).map(function(groupName) {
    return groupsField.values.findProperty('name', groupName);
  });

  // dupe values for later comparison when serializing changes
  groupsField.originalValue = (groupsField.currentValue || []).slice();

  return groupsField;
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
    return getJSON(urlFor("bug"), params).then(function(json) {
      return json.bugs;
    }, function(reason) {
      alert("FAIL");
    });
  }
});

function serializeGroupsForUpdate(groupsField) {
  var groups = {
    add: [],
    remove: []
  };

  var currentGroups = groupsField.currentValue,
      originalGroups = groupsField.originalValue;

  currentGroups.forEach(function(group) {
    if (!originalGroups.contains(group)) {
      groups.add.push(group.name);
    }
  });

  originalGroups.forEach(function(group) {
    if (!currentGroups.contains(group)) {
      groups.remove.push(group.name);
    }
  });

  return groups;
}

function serializeSeeAlsoForUpdate(seeAlsoField) {
  var changes = {
    add: [],
    remove: []
  };

  var currentUrls = seeAlsoField.currentValue,
      originalUrls = seeAlsoField.originalValue;

  currentUrls.forEach(function(url) {
    if (!originalUrls.contains(url)) {
      changes.add.push(url);
    }
  });

  originalUrls.forEach(function(url) {
    if (!currentUrls.contains(url)) {
      changes.remove.push(url);
    }
  });

  return changes;
}

export default Bug;
