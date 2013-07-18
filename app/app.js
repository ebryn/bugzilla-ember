import Resolver from 'resolver';

// #preload stuff not yet loaded via the container
import FieldHelper from 'bugzilla/helpers/field';
import FormatBytesHelper from 'bugzilla/helpers/format_bytes';

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
import CommentView from 'bugzilla/views/comment';
App.CommentView = CommentView;

import AttachmentView from 'bugzilla/views/attachment';
App.AttachmentView = AttachmentView;

import FieldView from 'bugzilla/views/field';
App.FieldView = FieldView;

import BrowseColumnHeaderView from 'bugzilla/views/browse_column_header';
App.BrowseColumnHeaderView = BrowseColumnHeaderView;

import FlagSelect from 'bugzilla/views/flag_select';
App.FlagSelect = FlagSelect;

import FileField from 'bugzilla/views/file_field';
App.FileField = FileField;

Ember.Handlebars.helper('select', Ember.Select);
// #view hacks

import routes from 'bugzilla/routes';
App.Router.map(routes);

export default App;
