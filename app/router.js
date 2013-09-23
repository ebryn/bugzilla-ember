var Router = Ember.Router.extend();

Router.map(function(){
  this.resource("bug", {path: "bug/:bug_id"}, function() {
    this.route("edit");
  });
  this.route("bugNew", {path: "bug/new"});
  this.route("bugNew2", {path: "bug/new/:product"});
  this.route("attachment", {path: "attachment/:attachment_id"});
  this.route("dashboard");
  this.route("browse");
  this.route("login");
});

export default Router;
