import 'resolver' as Resolver;

// #preload stuff not yet loaded via the container
import 'bugzilla/helpers/field' as FieldHelper;
import 'bugzilla/helpers/format_bytes' as FormatBytesHelper;

// /preload

var App = Ember.Application.create({
  LOG_ACTIVE_GENERATION: true,
  LOG_VIEW_LOOKUPS: true,
  modulePrefix: 'bugzilla', // TODO: loaded via config
  resolver: Resolver,

  // Enable to use the BZ sandbox at: https://landfill.bugzilla.org/bzapi_sandbox
  USE_TEST_SERVER: true
});

// #views aren't looked up via the container, so we must place them on the app still
import 'bugzilla/views/comment' as CommentView;
App.CommentView = CommentView;

import 'bugzilla/views/attachment' as AttachmentView;
App.AttachmentView = AttachmentView;

import 'bugzilla/views/field' as FieldView;
App.FieldView = FieldView;

import 'bugzilla/views/browse_column_header' as BrowseColumnHeaderView;
App.BrowseColumnHeaderView = BrowseColumnHeaderView;

import 'bugzilla/views/flag_select' as FlagSelect;
App.FlagSelect = FlagSelect;

import 'bugzilla/views/file_field' as FileField;
App.FileField = FileField;
// #view hacks

import 'bugzilla/routes' as routes;
App.Router.map(routes);

export = App;
