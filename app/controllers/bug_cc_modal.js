import ajax from "bugzilla/utils/ajax";
import urlFor from "bugzilla/utils/url_for";

var Controller = Ember.Controller.extend({
  needs: ['bugIndex'],
  bug: Ember.computed.alias('controllers.bugIndex.model'),
  cc: Ember.computed.alias('bug.fields.cc.current_value'),

  newEmails: null,

  actions: {
    save: function() {
      var self = this,
          emails = [this.get('newEmails')];

      // TODO: support multiple email addresses
      // if (emails) { emails = emails.split(/\s|,/); }

      ajax(urlFor("bug/" + this.get('bug.id')), {
        type: "PUT",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({cc: {add: emails}})
      }).then(function(json) {
        self.get('cc').pushObjects(emails);
        self.set('newEmails', null);
      }, function(reason) {
        alert("Error occurred, see console");
        console.log(reason);
      });
    }
  }
});

export default Controller;