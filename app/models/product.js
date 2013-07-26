import getJSON from 'bugzilla/utils/get_json';
import urlFor from 'bugzilla/utils/url_for';

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

    return getJSON(url, {type: "accessible"}).then(function(json) {
      var sortedProducts = json.products.sort(function(a, b) {
        return Ember.compare(a.name, b.name);
      });
      records.load(klass, sortedProducts);
    });
  }
});

Product.adapter = ProductAdapter.create();

export default Product;
