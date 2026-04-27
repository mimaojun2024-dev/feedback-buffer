const {
  getStoredMonthlyDailyCheckins
} = require('../../utils/storage');
const { formatDateLabel } = require('../../utils/time');

function getMonthEntries() {
  return getStoredMonthlyDailyCheckins().map((entry) => ({
    ...entry,
    dateLabel: formatDateLabel(entry.dateKey)
  }));
}

Page({
  data: {
    monthEntries: [],
    monthLabel: `${new Date().getMonth() + 1} 月完成记录`
  },

  onShow() {
    this.setData({
      monthEntries: getMonthEntries()
    });
  }
});
