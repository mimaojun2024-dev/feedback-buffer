const { getStoredMonthlyDailyCheckins } = require('../../utils/storage');
const {
  clearInputPlaceholder,
  restoreInputPlaceholder
} = require('../../utils/placeholders');
const { formatDateLabel, normalizeText } = require('../../utils/time');

const MONTH_COMPLETED_LIMIT = 5;
const TRIGGER_PLACEHOLDER = '一句话，一个消息，还是其他什么？';

function getMonthCompletedItems() {
  return getStoredMonthlyDailyCheckins()
    .filter((entry) => entry.completedThing)
    .slice(0, MONTH_COMPLETED_LIMIT)
    .map((entry) => ({
      dateKey: entry.dateKey,
      startedAt: entry.startedAt,
      endedAt: entry.endedAt,
      completedThing: entry.completedThing,
      dateLabel: formatDateLabel(entry.dateKey)
    }));
}

Page({
  data: {
    trigger: '',
    canContinue: false,
    inputPlaceholders: {
      trigger: TRIGGER_PLACEHOLDER
    },
    monthCompletedItems: [],
    hasMonthCompletedItems: false
  },

  onShow() {
    this.refreshMonthCompleted();
  },

  refreshMonthCompleted() {
    const monthCompletedItems = getMonthCompletedItems();

    this.setData({
      monthCompletedItems,
      hasMonthCompletedItems: monthCompletedItems.length > 0
    });
  },

  handleInput(event) {
    const trigger = event.detail.value;

    this.setData({
      trigger,
      canContinue: normalizeText(trigger).length > 0
    });
  },

  handleInputFocus: clearInputPlaceholder,

  handleInputBlur: restoreInputPlaceholder,

  handleContinue() {
    wx.navigateTo({ url: '/pages/emotion-steady/index' });
  }
});
