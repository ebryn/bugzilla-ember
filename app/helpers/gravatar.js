Ember.Handlebars.helper('gravatar', function(email) {
  var md5 = CryptoJS.MD5(email);
  return new Handlebars.SafeString('<img src="//www.gravatar.com/avatar/' + md5 + '&size=32&d=mm" width="32" height="32">');
});