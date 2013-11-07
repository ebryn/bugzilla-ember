import Select from "bugzilla/views/select";

var ChosenSelect = Select.extend({
  didInsertElement: function() {
    this.$().chosen();
  }
});

export default ChosenSelect;