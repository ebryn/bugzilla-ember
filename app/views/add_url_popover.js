import Popover from "bugzilla/views/popover";

var AddUrlPopover = Popover.extend({
  templateName: "add_url_popover",

  actions: {
    add: function() {
      this.get('controller').send('addSeeAlsoUrl');
      this.send('close');
    }
  }
});

export default AddUrlPopover;