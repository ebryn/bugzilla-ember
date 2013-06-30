import 'bugzilla/utils/get_json' as getJSON;

var AttachmentController = Ember.ObjectController.extend({
  contentDidChange: function() {
    var content = this.get('content');

    // Load attachment data if we don't have it. FIXME: This can be improved.
    if (!content.get('decodedData')) {
      var url = "https://api-dev.bugzilla.mozilla.org/latest/attachment/%@?attachmentdata=1".fmt(this.get('id'));

      getJSON(url).then(function(data) {
        content.set('data.data', data.data);
      });
    }
  }.observes('content')
});

export = AttachmentController;
