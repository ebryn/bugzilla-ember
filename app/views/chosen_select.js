import Select from "bugzilla/views/select";

var ChosenSelect = Select.extend({
  didInsertElement: function() {
    this.$().chosen();
  },

  willDestroyElement: function() {
    this.$().chosen('destroy');
  }
});

export default ChosenSelect;