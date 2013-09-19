var MultiValueTextField = Ember.TextField.extend({
  values: null,

  _valuesDidChange: function() {
    if (!this._ignoreValuesSet) {
      var values = this.get('values') || [];
      this.set('value', values.join(' '));
    }
  }.observes('values').on('init'),

  _valueDidChange: function() {
    var value = this.get('value') || "",
        values = value.trim().split(/\s+|\s*,\s*/);

    // FIXME: This feels pretty ghetto. Figure out a cleaner solution.
    this._ignoreValuesSet = true;
    this.set('values', values);
    this._ignoreValuesSet = false;
  }.observes('value')
});

export default MultiValueTextField;