import Resolver from 'resolver';

// #preload stuff not yet loaded via the container
import EmailToUsernameHelper from 'bugzilla/helpers/email_to_username';
import FieldHelper from 'bugzilla/helpers/field';
import FormatBytesHelper from 'bugzilla/helpers/format_bytes';
import GravatarHelper from 'bugzilla/helpers/gravatar';
import LinkifyHelper from 'bugzilla/helpers/linkify';
import Router from 'bugzilla/router';
// /preload

var App = Ember.Application.extend({
  LOG_ACTIVE_GENERATION: true,
  LOG_VIEW_LOOKUPS: true,
  modulePrefix: 'bugzilla', // TODO: loaded via config
  Resolver: Resolver,
  Router: Router
});

import _ from 'bugzilla/ext/route';

// maybe load this by convention?
import config from 'bugzilla/config';

import Select from 'bugzilla/views/select';
Ember.Handlebars.helper('select', Select);

import MultiValueTextField from 'bugzilla/views/multi_value_text_field';
Ember.Handlebars.helper('multi-value', MultiValueTextField);

Ember.RSVP.configure('onerror', function(error) {
  Ember.Logger.assert(false, error);
});

Ember.LinkView.reopen({attributeBindings: ['style']});
Ember.TextSupport.reopen({attributeBindings: ['style']});

export default App;
