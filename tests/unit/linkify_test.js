import linkify from "bugzilla/utils/linkify";

module("linkify");

test("embedded URLs", function() {
  var text = "foo http://baz.com/zomg?wtf&bbq=yes bar";
  var html = 'foo <a href="http://baz.com/zomg?wtf&bbq=yes">http://baz.com/zomg?wtf&bbq=yes</a> bar';

  equal(linkify(text), html, "the output matches");
});

test("attachment references", function() {
  var text = "foo attachment 1 bar attachment 2 baz notanattachment 3 attachment 4qux";
  var html = 'foo <a href="/attachment/1">attachment 1</a> bar <a href="/attachment/2">attachment 2</a> baz notanattachment 3 attachment 4qux';

  equal(linkify(text), html, "the output matches");
});

test("comment references", function() {
  var text = "foo comment 1 bar comment 2 baz notacomment 3 comment 4qux";
  var html = 'foo <a href="#comment-1">comment 1</a> bar <a href="#comment-2">comment 2</a> baz notacomment 3 comment 4qux';

  equal(linkify(text), html, "the output matches");
});

