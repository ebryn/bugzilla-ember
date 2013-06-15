var attr = Ember.attr;

App.Bug = Ember.Model.extend({
  id: attr(),
  status: attr(),
  summary: attr(),
  keywords: attr(),
  product: attr(),
  component: attr(),
  version: attr(),
  platform: attr(),
  op_sys: attr(),
  priority: attr(),
  severity: attr(),
  assigned_to: attr(),
  qa_contact: attr(),
  url: attr(),
  depends_on: attr(), // array
  blocks: attr(), // array
  creator: attr(), // aka reporter
  last_change_time: attr(Date),
  cc: attr(),

  comments: function() {
    return App.Comment.find({bug_id: this.get('id')});
  }.property()
});

App.Bug.adapter = Ember.Adapter.create({
  find: function(record, id) {
    $.getJSON("https://api-dev.bugzilla.mozilla.org/latest/bug/" + id).then(function(data) {
      record.load(id, data);
    });
  }
});