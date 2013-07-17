var FlagSelect = Ember.Select.extend({
  prompt: " ",
  
  content: function() {
    return ["?", "+", "-"];
  }.property()
});

export = FlagSelect;