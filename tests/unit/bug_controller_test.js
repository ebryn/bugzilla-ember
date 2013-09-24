import BugController from 'bugzilla/controllers/bug';

module("BugController - comment-related computed properties");

test("single comment", function() {
  var comments = [{id: 1}];
  var controller = BugController.create({comments: comments});

  equal(controller.get('firstComment'), comments[0]);
  deepEqual(controller.get('lastFewComments'), []);
  deepEqual(controller.get('remainingComments'), []);
});

test("two comments", function() {
  var comments = [{id: 1}, {id: 2}];
  var controller = BugController.create({comments: comments});

  equal(controller.get('firstComment'), comments[0]);
  deepEqual(controller.get('lastFewComments'), [comments[1]]);
  deepEqual(controller.get('remainingComments'), []);
});

test("four comments", function() {
  var comments = [{id: 1}, {id: 2}, {id: 3}, {id: 4}];
  var controller = BugController.create({comments: comments});

  equal(controller.get('firstComment'), comments[0]);
  deepEqual(controller.get('lastFewComments'), [comments[1], comments[2], comments[3]]);
  deepEqual(controller.get('remainingComments'), []);
});


test("five comments", function() {
  var comments = [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}];
  var controller = BugController.create({comments: comments});

  equal(controller.get('firstComment'), comments[0]);
  deepEqual(controller.get('lastFewComments'), [comments[2], comments[3], comments[4]]);
  deepEqual(controller.get('remainingComments'), [comments[1]]);
});