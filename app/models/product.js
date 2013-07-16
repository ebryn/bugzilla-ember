import 'bugzilla/utils/get_json'  as getJSON;
import 'bugzilla/utils/url_for'   as urlFor;
import 'bugzilla/utils/promise_storage'  as promiseStorage;

var attr = Ember.attr;

var Product = Ember.Model.extend({
  id: attr(),
  name: attr(),
  description: attr(),
  classification: attr(),
  components: attr(),
  default_milestone: attr(),
  has_unconfirmed: attr(),
  is_active: attr(),
  milestones: attr(),
  versions: attr()
});

var ProductAdapter = Ember.Adapter.extend({
  findAll: function(klass, records) {
    var url = urlFor("product");

    return getJSON(url).then(function(json) {
      var promises = [];
      var ids = json.ids;

      promises = ids.map(function(id) {
        var url = urlFor("product/" + id);
        return getJSON(url).then(function(json) {
          return json.products[0];
        });
      });

      Ember.RSVP.all(promises).then(function(data) {
        records.load(klass, data);
      });
    });
  }
});

Product.adapter = ProductAdapter.create();

export = Product;