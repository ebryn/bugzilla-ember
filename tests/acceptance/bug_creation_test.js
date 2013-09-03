var container, xhr, requests;

function respondWithJSON(req, json) {
  req.respond(200, { "Content-Type": "application/json" }, JSON.stringify(json));
}

module("bug creation", {
  setup: function() {
    xhr = sinon.useFakeXMLHttpRequest();
    xhr.onCreate = function(req) {
      req.onSend = function() {
        var url = this.url;

        if (url.match(/\/rest\/ember\/show/)) {
          respondWithJSON(req, {});
        } else if (url.match(/\/rest\/product/)) {
          respondWithJSON(req, {
            products: [
              Factory.attributes('product'),
              Factory.attributes('product')
            ]
          });
        } else if (url.match(/\/rest\/ember\/create/)) {
          respondWithJSON(req, {
            fields: [
              Factory.build('field', {api_name: "summary", display_name: "Summary"})
            ],

            product: Factory.attributes('product')
          });
        } else {
          console.error("Unhandled XHR: " + url);
        }
      };
    };

    App.reset();
    container = App.__container__;
  },

  teardown: function() {
    xhr.restore();
  }
});

test("basic flow", function() {
  expect(4);

  visit("/").then(function() {
    return click(".nav a:contains(New)");
  }).then(function() {
    exists("h1:contains(Choose a product)", "Product list shown");

    return click(".products li:first a");
  }).then(function() {
    exists("h1:contains(New bug)", "New bug form shown");
    exists("label:contains(Summary)", "Summary field shown");
    exists("input[type=text][name=summary]", "Summary field input shown");
  });
});