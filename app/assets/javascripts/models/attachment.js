var attr = Ember.attr;

App.Attachment = Ember.Model.extend({
  id: attr(),
  description: attr(),
});

App.Attachment.adapter = Ember.Adapter.create({
  find: function(record, id) {
    $.getJSON("https://api-dev.bugzilla.mozilla.org/latest/attachment/" + id).then(function(data) {
      record.load(id, data);
    });
  }
});