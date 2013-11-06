var PopoverOpenButton = Ember.View.extend({
  layoutName: 'popover_open_button',
  classNames: [],

  kind: null,

  click: function() {
    if (this._popover) { return; }

    var view = this._popover = this.container.lookup('view:' + this.get('kind')),
        controller = this.container.lookup('controller:' + this.get('kind'));
    view.setProperties(Ember.merge({opener: this, controller: controller || this.get('controller')}, this._computedPopoverPosition()));
    view.appendTo('body');

    return false;
  },

  close: function() {
    this._popover.destroy();
    this._popover = null;
  },

  _computedPopoverPosition: function() {
    var offset = this.$().offset();

    return {y: (offset.top + (this.$().height() / 2)), x: (offset.left - 15)}; // -15 for arrow
  }
});

export default PopoverOpenButton;