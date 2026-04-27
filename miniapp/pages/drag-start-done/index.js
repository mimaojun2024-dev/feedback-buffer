const { appendStoredStartHistory, incrementStoredFlowStat } = require('../../utils/storage');
const { normalizeText } = require('../../utils/time');

Page({
  data: {
    initialTask: '',
    doneTitle: '这两分钟已经算数'
  },

  onLoad(options) {
    const initialTask = normalizeText(decodeTask(options && options.task));
    const duration = normalizeText(options && options.duration);

    this.setData({
      initialTask,
      doneTitle: duration === 'half-hour' ? '这半小时已经算数' : '这两分钟已经算数'
    });

    incrementStoredFlowStat('drag-start.completed');

    if (initialTask) {
      appendStoredStartHistory(initialTask);
    }
  },

  handleStartHalfHour() {
    const task = this.data.initialTask;

    wx.redirectTo({
      url: task
        ? `/pages/drag-start-countdown/index?task=${encodeURIComponent(task)}&duration=half-hour`
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
