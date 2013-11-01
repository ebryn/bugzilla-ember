var Popover = Ember.View.extend({
  layoutName: 'popover',
  classNames: ['keywords-popover', 'popover'],
  attributeBindings: ['style'],

  opener: null, // the view that opened us
  x: null,
  y: null,

  style: function() {
    // figure out anchor point - depends on height of the popover
    if (this.state !== 'inDOM') { return; }

    var height = this.$().height();

    return "display: block; top: %@px; left: %@px".fmt(this.get('y') - (height / 2), this.get('x') - this.$().width());
  }.property('x', 'y'),

  didInsertElement: function() {
    var self = this;

    this.notifyPropertyChange('style'); // megahack

    // TODO: resize handler too

    this._bodyHandler = function(e) {
      // ignore clicks inside the popover
      var $target = $(e.target);
      if ($target.closest('.popover').length) { return; }

      self.send('close');
    };

    Ember.$(document).on('click', this._bodyHandler);
  },

  willDestroyElement: function() {
    Ember.$(document).off('click', this._bodyHandler);
  },

  actions: {
    close: function() {
      this.get('opener').close();
    },

    add: function() {
      this.get('controller').send('addNewFlag');
      this.send('close');
    }
  }
});

export default Popover;