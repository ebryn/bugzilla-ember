import getJSON from 'bugzilla/utils/get_json';
import urlFor from 'bugzilla/utils/url_for';
import getJSONWithCache from 'bugzilla/utils/get_json_with_cache';

var attr = Ember.attr;

var Product = Ember.Model.extend({
  id: attr(),
  name: attr(),
  components: attr()
});

var ProductAdapter = Ember.Adapter.extend({
  findAll: function(klass, records) {
    return this.findQuery(klass, records, {});
  },

  findQuery: function(klass, records, params) {
    return getJSONWithCache(urlFor("product"), {type: "enterable", include_fields: params.include_fields || "id, name"}).then(function(json) {
      var sortedProducts = json.products.sort(function(a, b) {
        return Ember.compare(a.name, b.name);
      });
      records.load(klass, sortedProducts);
      return records;
    });
  }
});

Product.reopenClass({
  adapter: ProductAdapter.create()
});

export default Product;
