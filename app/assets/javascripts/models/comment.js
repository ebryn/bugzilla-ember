App.Comment = Ember.Model.extend({
  id: attr(),
  text: attr(),
  creator: attr(),
  creation_time: attr(Date)
});

App.Comment.adapter = Ember.Adapter.create({
  findQuery: function(klass, records, params) {
    $.getJSON("https://api-dev.bugzilla.mozilla.org/latest/bug/" + params.bug_id + "/comment").then(function(data) {
      records.load(klass, data.comments);
    });
  }
});