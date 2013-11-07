import getJSON from 'bugzilla/utils/get_json';
import urlFor from 'bugzilla/utils/url_for';
import promiseStorage from 'bugzilla/utils/promise_storage';
import unhandledRejection from 'bugzilla/utils/unhandled_rejection';
import ajax from 'bugzilla/utils/ajax';
import getJSONWithCache from 'bugzilla/utils/get_json_with_cache';

var attr = Ember.attr;

var Comment = Ember.Model.extend({
  id: attr(),
  bug_id: attr(),
  text: attr(),
  creator: attr(),
  creation_time: attr(),
  is_private: attr()
});

Comment.reopenClass({
  adapter: Ember.Adapter.create({
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

      // return promiseStorage.getItem(cacheKey).then(function(cachedComments){
      //   if (cachedComments !== null) { // we've got cached comments, just look for new ones
      //     records.load(klass, cachedComments);

      //     var lastComment = cachedComments[cachedComments.length-1];

      //     return getJSON(url, {new_since: lastComment.creation_time}).then(function(json) {
      //       // TODO: Make this easier to do with EM
      //       var newComments = records.materializeData(klass, json.bugs[bugId].comments);
      //       records.pushObjects(newComments);
      //     });
      //   } else { // not cached locally, fetch all comments
          return getJSONWithCache(url).then(function(json) {
            records.load(klass, json.bugs[bugId].comments);
          });
      //   }
      // });
    },

    createRecord: function(record) {
      var bugId = record.get('bug_id'),
          url = urlFor('bug/' + bugId + '/comment'),
          data = {
            id: bugId,
            comment: record.get('text'),
          };

      // FIXME: sending false to the API sets is_private to true
      if (record.get('is_private')) { data.is_private = true; }

      return ajax(url, {
        type: 'POST',
        dataType: 'json',
        // contentType: 'application/json',
        data: data,
      }).then(function(data) {
        // FIXME: EM should be able to load just an ID
        // https://github.com/ebryn/ember-model/issues/180
        record.load(data.id, record.get('_data'));
        record.didCreateRecord();
        return record.reload(); // FIXME: hack to workaround lack of good API response (noted in API_TODOS)
      });
    }
  })
});

export default Comment;
