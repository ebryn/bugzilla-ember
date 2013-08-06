import linkify from "bugzilla/utils/linkify";

Ember.Handlebars.helper('linkify', function(value) {
  // FIXME: Is the backend sanitizing for HTML? If not, we shouldn't be marking this whole string as safe.
  return new Handlebars.SafeString(linkify(value));
});
