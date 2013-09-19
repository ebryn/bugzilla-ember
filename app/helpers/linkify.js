import linkify from "bugzilla/utils/linkify";

var escape = Handlebars.Utils.escapeExpression;

Ember.Handlebars.helper('linkify', function(value) {
  return new Handlebars.SafeString(linkify(escape(value) || ""));
});
