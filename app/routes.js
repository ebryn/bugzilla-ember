var Routes = function() {
  this.resource("bug", {path: "bug/:bug_id"}, function() {
    this.route("attachment");
  });
  this.route("bugNew", {path: "bug/new"});
  this.route("attachment", {path: "attachment/:attachment_id"});
  this.route("dashboard");
  this.route("browse");
};

export default Routes;
