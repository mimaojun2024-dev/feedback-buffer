const { getStoredMonthlyDailyCheckins } = require('../../utils/storage');
const { formatDateLabel, normalizeText } = require('../../utils/time');

const MONTH_COMPLETED_LIMIT = 5;

function getMonthCompletedItems() {
  return getStoredMonthlyDailyCheckins()
    .filter((entry) => entry.completedThing)
    .slice(0, MONTH_COMPLETED_LIMIT)
    .map((entry) => ({
      ...entry,
      dateLabel: formatDateLabel(entry.dateKey)
    }));
}

Page({
  data: {
    trigger: '',
    canContinue: false,
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

  handleContinue() {
    wx.navigateTo({ url: '/pages/emotion-steady/index' });
  }
});
