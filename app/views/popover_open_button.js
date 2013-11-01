var PopoverOpenButton = Ember.View.extend({
  layoutName: 'popover_open_button',
  classNames: ['label-btn', 'with-table'],

  kind: null,

  click: function() {
    if (this._popover) { return; }

    var view = this._popover = this.container.lookup('view:' + this.get('kind'));
    view.setProperties(Ember.merge({opener: this, controller: this.get('controller')}, this._computedPopoverPosition()));
    view.appendTo('body');

    return false;
  },

  close: function() {
    this._popover.destroy();
    this._popover = null;
  },

  _computedPopoverPosition: function() {
    var offset = this.$().offset();

    return {y: (offset.top + (this.$().height() / 2)), x: offset.left};
  }
});

export default PopoverOpenButton;