const { incrementStoredFlowStat } = require('../../utils/storage');
const { ESCAPED_ACTIONS, chunkEscapedActions } = require('../../data/escaped-actions');

Page({
  data: {
    actionRows: chunkEscapedActions(ESCAPED_ACTIONS),
    selectedActionId: '',
    selectedActionPrompt: ''
  },

  handleSelect(event) {
    const actionId = event.currentTarget.dataset.id;
    const action = ESCAPED_ACTIONS.find((item) => item.id === actionId);

    incrementStoredFlowStat(`escaped.${actionId}`);
    this.setData({
      selectedActionId: actionId,
      selectedActionPrompt: action ? action.prompt : ''
    });
  }
});
