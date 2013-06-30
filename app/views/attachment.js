var AttachmentView = Ember.View.extend({
  templateName: 'attachment',

  controllerDecodedDataDidChange: function() {
    if (this.state !== 'inDOM') { return; }

    var $codeEl = this.$('code');
    if (!$codeEl.length) { return; }

    Ember.run.schedule('afterRender', this, function() {
      hljs.highlightBlock($codeEl[0]);
    });

  }.observes('controller.decodedData'),

  didInsertElement: function() {
    this.controllerDecodedDataDidChange();
  }
});

export = AttachmentView;
