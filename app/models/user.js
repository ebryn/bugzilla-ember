import getJSON from 'bugzilla/utils/get_json';
import urlFor from 'bugzilla/utils/url_for';
import unhandledRejection from 'bugzilla/utils/unhandled_rejection';

var attr = Ember.attr;

var User = Ember.Model.extend({
  id: attr(),
  name: attr(),
  real_name: attr(),
  email: attr()
});

var UserAdapter = Ember.Adapter.extend({
  findQuery: function(klass, records, params) {
    var url = urlFor("user");

    return getJSON(url, {match: params.match}).then(function(json) {
      if (json.error) { throw new Error(json.message); }

      records.load(klass, json.users);
    }).then(null, unhandledRejection);
  }
});

User.adapter = UserAdapter.create();

export default User;