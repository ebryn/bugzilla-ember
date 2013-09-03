var escape = Handlebars.Utils.escapeExpression;

var Select = Ember.View.extend({
  tagName: 'select',

  prompt: null,
  content: null,
  value: null,
  selection: null,
  optionLabelPath: null,
  optionValuePath: null,
  disabled: false,

  attributeBindings: ['disabled'],

  change: function(e) {
    this.selectIndex(e.target.selectedIndex);
  },

  selectIndex: function(idx) {
    var content = this.get('content'),
        prompt = this.get('prompt');
    if (!content) { return; }
    if (prompt != null && idx === 0) { return; }

    var selectedObject = content.objectAt(idx),
        optionValuePath = this.get('optionValuePath'),
        optionLabelPath = this.get('optionLabelPath'),
        selectedValue = selectedObject && Ember.get(selectedObject, optionValuePath || optionLabelPath);

    this.set('selection', selectedObject);
    this.set('value', selectedValue);
  },

  init: function() {
    this._super();
    this.contentDidChange();
    this.selectIndex(0); // TODO: set selected option by value
  },

  render: function(buffer) {
    var content = this.get('content'),
        contentLength = this.get('content.length'),
        optionValuePath = this.get('optionValuePath'),
        optionLabelPath = this.get('optionLabelPath'),
        selectedValue = this.get('value'),
        selectedObject = this.get('selection'),
        prompt = this.get('prompt');
    if (!content) { return; }

    if (prompt != null) {
      buffer.push('<option>%@</option>'.fmt(prompt));
    }

    var item, value, label, isSelected;
    for (var i = 0, l = contentLength; i < l; i++) {
      item = content.objectAt(i);
      value = Ember.get(item, optionValuePath || optionLabelPath);
      label = Ember.get(item, optionLabelPath);
      isSelected = value === selectedValue || selectedObject === item;
      buffer.push('<option value="%@"'.fmt(escape(value)));
      if (isSelected) {
        buffer.push(' selected');
        this.set('selection', item);
        this.set('value', value);
      }
      buffer.push('>%@</option>'.fmt(escape(label)));
    }
  },

  contentWillChange: function() {
    var content = this.get('content');
    if (!content) { return; }
    content.removeArrayObserver(this);
  }.observesBefore('content'),

  contentDidChange: function() {
    var content = this.get('content');
    if (!content) { return; }
    content.addArrayObserver(this);
    this.selectIndex(0);
    if (this.state === 'inDOM') { this.rerender(); }
  }.observes('content'),

  arrayWillChange: function() {},
  arrayDidChange: function() {
    this.selectIndex(0);
    this.rerender();
  }
});

export default Select;