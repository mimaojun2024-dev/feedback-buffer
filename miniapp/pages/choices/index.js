const {
  getStoredCount,
  getStoredPriorityTask,
  incrementStoredFlowStat,
  setStoredPriorityTask
} = require('../../utils/storage');
const { normalizeText } = require('../../utils/time');

Page({
  data: {
    dailyCount: 0,
    priorityTask: '',
    isFeedbackPauseVisible: false,
    isFeedbackPauseOpened: false
  },

  onLoad(options) {
    const initialTask = normalizeText(decodeTask(options && options.task));
    const storedTask = getStoredPriorityTask();
    const resolvedTask = initialTask ? setStoredPriorityTask(initialTask) : storedTask;

    this.setData({
      dailyCount: getStoredCount(),
      priorityTask: resolvedTask
    });
  },

  handleShowFeedbackPause() {
    this.setData({
      isFeedbackPauseVisible: true,
      isFeedbackPauseOpened: false
    });
  },

  handleOpenFeedbackPause() {
    if (this.data.isFeedbackPauseOpened) {
      return;
    }

    this.setData({ isFeedbackPauseOpened: true });
  },

  handleReturnAxis() {
    incrementStoredFlowStat('escape.returned-focus');
    wx.redirectTo({ url: '/pages/axis-today/index' });
  },

  handleStartFiveMinuteCountdown() {
    incrementStoredFlowStat('escape.checked-feedback');
    wx.redirectTo({ url: '/pages/feedback-five-countdown/index' });
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
