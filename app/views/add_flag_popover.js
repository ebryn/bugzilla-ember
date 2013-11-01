import Popover from "bugzilla/views/popover";

var AddFlagPopover = Popover.extend({
  templateName: 'add_flag_popover',

  actions: {
    add: function() {
      this.get('controller').send('addNewFlag');
      this.send('close');
    }
  }
});

export default AddFlagPopover;