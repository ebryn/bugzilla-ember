import 'bugzilla/utils/get_json' as getJSON;
import 'bugzilla/utils/url_for' as urlFor;
import 'bugzilla/utils/promise_storage' as promiseStorage;
import 'bugzilla/utils/unhandled_rejection' as unhandledRejection;

var attr = Ember.attr;

var Comment = Ember.Model.extend({
  id: attr(),
  text: attr(),
  creator: attr(),
  creation_time: attr(Date)
});

Comment.reopenClass({
  adapter: Ember.Adapter.create({
    findQuery: function(klass, records, params) {
      var bugId = params.bug_id,
          cacheKey = "bug-" + bugId + "-comments",
          url = urlFor("bug/" + bugId + "/comment");

      return promiseStorage.getItem(cacheKey).then(function(cachedComments){
        if (cachedComments !== null) { // we've got cached comments, just look for new ones
          records.load(klass, cachedComments);

          var lastComment = cachedComments[cachedComments.length-1];

          return getJSON(url, {new_since: lastComment.creation_time}).then(function(data) {
            // TODO: Make this easier to do with EM
            var newComments = records.materializeData(klass, data.comments);
            records.pushObjects(newComments);
          });
        } else { // not cached locally, fetch all comments
          return getJSON(url).then(function(data) {
            records.load(klass, data.comments);
            asyncStorage.setItem(cacheKey, data.comments);
          });
        }
      }).then(null, unhandledRejection);
    }
  })
});

export = Comment;
