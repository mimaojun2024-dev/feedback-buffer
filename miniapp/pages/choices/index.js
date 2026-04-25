const {
  XIAOHONGSHU_URL,
  getStoredCount,
  getStoredPriorityTask,
  incrementStoredFlowStat,
  setStoredPriorityTask
} = require('../../utils/storage');
const { normalizeText } = require('../../utils/time');

Page({
  data: {
    dailyCount: 0,
    priorityTask: ''
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

  handleOpenFeedback() {
    incrementStoredFlowStat('escape.checked-feedback');

    wx.setClipboardData({
      data: XIAOHONGSHU_URL,
      success() {
        wx.showToast({
          title: '链接已复制',
          icon: 'none'
        });
      }
    });
  },

  handleReturnFocus() {
    incrementStoredFlowStat('escape.returned-focus');
    wx.redirectTo({ url: '/pages/escape/index?focus=1' });
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
