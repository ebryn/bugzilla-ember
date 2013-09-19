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
    if (prompt != null && idx === 0) {
      this.setProperties({selection: null, value: null});
      return;
    }
    if (prompt != null) { idx -= 1; }

    var selectedObject = content.objectAt(idx),
        optionValuePath = this.get('optionValuePath'),
        optionLabelPath = this.get('optionLabelPath'),
        selectedValue = selectedObject && Ember.get(selectedObject, optionValuePath || optionLabelPath);

    this.set('selection', selectedObject);
    this.set('value', selectedValue);
  },

  // Using on('init') so bindings will be updated for the initial selection
  _didInit: function() {
    this.contentDidChange();
  }.on('init'),

  selectInitial: function() {
    var content = this.get('content'),
        valueKey = this.get('optionValuePath') || this.get('optionLabelPath'),
        value = this.get('value'),
        selection = this.get('selection'),
        valueIdx = -1, selectionIdx = -1;

    if (selection) {
      selectionIdx = content.indexOf(selection);

      if (selectionIdx !== -1) {
        this.set('value', Ember.get(selection, valueKey));
      }
    } else if (value) {
      var objectForValue = content.findProperty(valueKey, value);

      if (objectForValue) {
        this.set('selection', objectForValue);
      }
    } else { // no selection or value specified, so let's select the first value
      this.selectIndex(0);
    }
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
    this.selectInitial();
    if (this.state === 'inDOM') { this.rerender(); }
  }.observes('content'),

  arrayWillChange: function() {},
  arrayDidChange: function() {
    this.selectInitial();
    this.rerender();
  }
});

export default Select;