Ember.Route.reopen({
  enter: function() {
    window.scrollTo(0, 0);
    return this._super.apply(this, arguments);
  },

  create: function(name, options) {
    var model, fullName;

    fullName = 'model:' + name;

    model = this.container.lookupFactory(fullName);

    return model.create(options);
  },

  find: function(name) {
    var model, fullName;

    if (arguments.length === 1 && typeof name !== "string") {
      // this only works for named routes
      fullName = 'model:' + this.routeName;
    } else {
      fullName = 'model:' + name;
    }

    model = this.container.lookupFactory(fullName);

    var args = Array.prototype.slice.call(arguments, 1);

    return model.find.apply(model, args);
  }
});
