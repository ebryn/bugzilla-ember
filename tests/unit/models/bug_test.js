import Bug from 'bugzilla/models/bug';

module("Bug#toJSONForUpdate");

test("flags serialization", function() {
  var bug = Bug.create({
    fields: {
      flags: {
        current_value: [
          {
            "creation_date" : "2013-09-24T21:19:57Z",
            "id" : 716055,
            "modification_date" : "2013-09-24T23:11:53Z",
            "name" : "needinfo",
            "setter" : {
              "email" : "erik.bryn@gmail.com",
              "real_name" : "Erik Bryn"
            },
            "status" : "?",
            "type" : "bug",
            "type_id" : 800
          }
        ]
      }
    },
    customFields: []
  });

  var json = bug.toJSONForUpdate();
  deepEqual(json.flags, [{id: 716055, status: "?"}]);
});