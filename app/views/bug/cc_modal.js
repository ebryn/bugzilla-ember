import Popover from "bugzilla/views/popover";

var CcModal = Popover.extend({
  templateName: "bug/cc_modal",
  classNames: ['cc-popover']
});

export default CcModal;