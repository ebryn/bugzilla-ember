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

Ember.Handlebars.helper('select', Ember.Select);
// #view hacks

import routes from 'bugzilla/routes';
App.Router.map(routes);

export default App;
