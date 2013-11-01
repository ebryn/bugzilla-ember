import Popover from "bugzilla/views/popover";

var AddProjectFlagPopover = Popover.extend({
  templateName: "add_project_flag_popover",

  actions: {
    add: function() {
      this.get('controller').send('addNewProjectFlag');
      this.send('close');
    }
  }
});

export default AddProjectFlagPopover;