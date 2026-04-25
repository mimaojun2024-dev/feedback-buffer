const { incrementStoredFlowStat } = require('../../utils/storage');
const { normalizeText } = require('../../utils/time');

Page({
  data: {
    initialTask: ''
  },

  onLoad(options) {
    this.setData({
      initialTask: normalizeText(decodeTask(options && options.task))
    });

    incrementStoredFlowStat('drag-start.completed');
  },

  handleRestart() {
    const task = this.data.initialTask;

    wx.redirectTo({
      url: task
        ? `/pages/drag-start-countdown/index?task=${encodeURIComponent(task)}`
        : '/pages/drag-start/index'
    });
  }
});

function decodeTask(value) {
  const rawValue = normalizeText(value);

  if (!rawValue) {
    return '';
  }

  try {
    return decodeURIComponent(rawValue);
  } catch (error) {
    return rawValue;
  }
}
