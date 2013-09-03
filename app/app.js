import Resolver from 'resolver';

// #preload stuff not yet loaded via the container
import FieldHelper from 'bugzilla/helpers/field';
import FormatBytesHelper from 'bugzilla/helpers/format_bytes';
import LinkifyHelper from 'bugzilla/helpers/linkify';

// /preload

var App = Ember.Application.create({
  LOG_ACTIVE_GENERATION: true,
  LOG_VIEW_LOOKUPS: true,
  modulePrefix: 'bugzilla', // TODO: loaded via config
  Resolver: Resolver
});

import _ from 'bugzilla/ext/route';

// maybe load this by convention?
import config from 'bugzilla/config';

import Select from 'bugzilla/views/select';
Ember.Handlebars.helper('select', Select);
// #view hacks

import routes from 'bugzilla/routes';
App.Router.map(routes);

export default App;
