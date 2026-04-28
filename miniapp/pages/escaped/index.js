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
    const action = getEscapedActionById(actionId);

    incrementStoredFlowStat(`escaped.${actionId}`);
    this.setData({
      selectedActionId: actionId,
      selectedActionPrompt: action ? action.prompt : ''
    });
  }
});

function getEscapedActionById(actionId) {
  for (let index = 0; index < ESCAPED_ACTIONS.length; index += 1) {
    if (ESCAPED_ACTIONS[index].id === actionId) {
      return ESCAPED_ACTIONS[index];
    }
  }

  return null;
}
