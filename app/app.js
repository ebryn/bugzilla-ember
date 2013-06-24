import 'resolver' as Resolver;

// #preload stuff not yet loaded via the container
import 'bugzilla/helpers/field' as FieldHelper;
import 'bugzilla/helpers/format_bytes' as FormatBytesHelper;

// /preload

var App = Ember.Application.create({
  LOG_ACTIVE_GENERATION: true,
  LOG_VIEW_LOOKUPS: true,
  modulePrefix: 'bugzilla', // TODO: loaded via config
  resolver: Resolver
});

// #views aren't looked up via the container, so we must place them on the app still
import 'bugzilla/views/comment' as CommentView;
App.CommentView = CommentView;

import 'bugzilla/views/attachment' as AttachmentView;
App.AttachmentView = AttachmentView;

import 'bugzilla/views/field' as FieldView;
App.FieldView = FieldView;
// #view hacks

App.Router.map(function() {
  this.route("bug", {path: "bug/:bug_id"});
  this.route("attachment", {path: "attachment/:attachment_id"});
  this.route("dashboard");
});

export = App;
