const { incrementStoredFlowStat } = require('../../utils/storage');
const { ESCAPED_ACTIONS, chunkEscapedActions } = require('../../data/escaped-actions');

Page({
  data: {
    actionRows: chunkEscapedActions(ESCAPED_ACTIONS),
    selectedActionId: ''
  },

  handleSelect(event) {
    const actionId = event.currentTarget.dataset.id;

    incrementStoredFlowStat(`escaped.${actionId}`);
    this.setData({ selectedActionId: actionId });
  }
});
