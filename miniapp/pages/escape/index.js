const {
  COUNTDOWN_SECONDS,
  getStoredCount,
  getStoredMainAxisSection
} = require('../../utils/storage');
const { normalizeText } = require('../../utils/time');

function getFilledMonthEntries(entries) {
  return (entries || [])
    .map((entry, index) => ({
      index: index + 1,
      task: normalizeText(entry && entry.task)
    }))
    .filter((entry) => entry.task);
}

Page({
  data: {
    dailyCount: 0,
    showReturnMessage: false,
    todayAxisTask: '',
    hasTodayAxisTask: false,
    monthAxisEntries: [],
    hasMonthAxisEntries: false,
    countdownSeconds: COUNTDOWN_SECONDS
  },

  onLoad(options) {
    this.routeOptions = options || {};
  },

  onShow() {
    const todayAxis = getStoredMainAxisSection('today') || { task: '' };
    const monthAxisEntries = getFilledMonthEntries(getStoredMainAxisSection('month'));
    const todayAxisTask = normalizeText(todayAxis.task);
    const nextPath = this.routeOptions && this.routeOptions.next;

    this.nextPath = nextPath;

    this.setData({
      dailyCount: getStoredCount(),
      showReturnMessage: this.routeOptions && this.routeOptions.focus === '1',
      todayAxisTask,
      hasTodayAxisTask: Boolean(todayAxisTask),
      monthAxisEntries,
      hasMonthAxisEntries: monthAxisEntries.length > 0
    });
  },

  handleSteady() {
    const nextTask = normalizeText(this.data.todayAxisTask);

    if (!nextTask) {
      return;
    }

    this.navigateToCountdown(nextTask);
  },

  navigateToCountdown(task) {
    const pagePath = this.nextPath === 'choices' ? '/pages/choices/index' : '/pages/countdown/index';

    wx.navigateTo({
      url: `${pagePath}?task=${encodeURIComponent(task)}`
    });
  }
});
