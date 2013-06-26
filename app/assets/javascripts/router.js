App.Router.map(function() {
  this.route("bug", {path: "bug/:bug_id"});
  this.route("attachment", {path: "attachment/:attachment_id"});
  this.route("dashboard");
  this.route("browse");
});
