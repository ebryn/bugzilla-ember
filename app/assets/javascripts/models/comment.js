App.Comment = Ember.Model.extend({
  id: attr(),
  text: attr(),
  creator: attr(),
  creation_time: attr(Date)
});

App.Comment.reopenClass({
  adapter: Ember.Adapter.create({
    findQuery: function(klass, records, params) {
      var bugId = params.bug_id,
          cacheKey = "bug-" + bugId + "-comments",
          url = "https://api-dev.bugzilla.mozilla.org/latest/bug/" + bugId + "/comment";

      return App.promiseStorage.getItem(cacheKey).then(function(cachedComments){
        if (cachedComments !== null) { // we've got cached comments, just look for new ones
          records.load(klass, cachedComments);

          var lastComment = cachedComments[cachedComments.length-1];

          return App.getJSON(url, {new_since: lastComment.creation_time}).then(function(data) {
            // TODO: Make this easier to do with EM
            var newComments = records.materializeData(klass, data.comments);
            records.pushObjects(newComments);
          });
        } else { // not cached locally, fetch all comments
          return App.getJSON(url).then(function(data) {
            records.load(klass, data.comments);
            asyncStorage.setItem(cacheKey, data.comments);
          });
        }
      }).then(null, Ember.unhandledRejection);
    }
  })
});