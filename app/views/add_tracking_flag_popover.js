import Popover from "bugzilla/views/popover";

var AddTrackingFlagPopover = Popover.extend({
  templateName: "add_tracking_flag_popover",

  actions: {
    add: function() {
      this.get('controller').send('addNewTrackingFlag');
      this.send('close');
    }
  }
});

export default AddTrackingFlagPopover;