import 'bugzilla/utils/get_json' as getJSON;
import 'bugzilla/utils/url_for' as urlFor;
import 'bugzilla/utils/promise_storage' as promiseStorage;
import 'bugzilla/utils/unhandled_rejection' as unhandledRejection;

var attr = Ember.attr;

var Comment = Ember.Model.extend({
  id: attr(),
  bug_id: attr(),
  text: attr(),
  creator: attr(),
  creation_time: attr(Date),
  is_private: attr()
});

Comment.reopenClass({
  adapter: Ember.Adapter.create({
    // FIXME: The API should support fetching a single comment (noted in API_TODOS)
    // Instead, we have to fetch all comments and find the one we're looking for
    find: function(record, id) {
      var url = urlFor("bug/comment/" + id);

      return getJSON(url).then(function(json) {
        record.load(id, json.comments[id]);
      });
    },

    findQuery: function(klass, records, params) {
      var bugId = params.bug_id,
          cacheKey = "bug-" + bugId + "-comments",
          url = urlFor("bug/" + bugId + "/comment");

      return promiseStorage.getItem(cacheKey).then(function(cachedComments){
        if (cachedComments !== null) { // we've got cached comments, just look for new ones
          records.load(klass, cachedComments);

          var lastComment = cachedComments[cachedComments.length-1];

          return getJSON(url, {new_since: lastComment.creation_time}).then(function(json) {
            // TODO: Make this easier to do with EM
            var newComments = records.materializeData(klass, json.bugs[bugId].comments);
            records.pushObjects(newComments);
          });
        } else { // not cached locally, fetch all comments
          return getJSON(url).then(function(json) {
            records.load(klass, json.bugs[bugId].comments);
            asyncStorage.setItem(cacheKey, json.bugs[bugId].comments);
          });
        }
      }).then(null, unhandledRejection);
    },

    createRecord: function(record) {
      var bugId = record.get('bug_id'),
          url = urlFor("bug/" + bugId + "/comment");

      return $.ajax(url, {
        type: "POST",
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({id: bugId, comment: record.get('text')})
      }).then(function(data) {
        Ember.run(function() {
          record.set('id', parseInt(data.id, 10)); // FIXME (in EM): shouldn't have to parseInt here
          record.didCreateRecord();
          record.reload(); // FIXME: hack to workaround lack of good API response (noted in API_TODOS)
        });
      }, function(xhr) {
        // TODO: better error handling
        alert(xhr.responseJSON.message);
      });
    }
  })
});

export = Comment;
