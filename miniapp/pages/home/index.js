const { LOW_QUALITY_STATES } = require('../../data/states');
const {
  getStoredDailyCheckinForToday,
  getStoredMainAxisSection,
  incrementStoredStateClick,
  isDailyEndWindowOpen,
  isDailyStartWindowOpen,
  setStoredDailyCheckinEvent,
  setStoredMainAxisSection
} = require('../../utils/storage');
const { formatTime, normalizeText } = require('../../utils/time');

function chunkStates(states) {
  const rows = [];

  for (let index = 0; index < states.length; index += 2) {
    rows.push(states.slice(index, index + 2));
  }

  return rows;
}

function getHomeState() {
  const now = new Date();
  const dailyCheckin = getStoredDailyCheckinForToday();
  const todayAxis = getStoredMainAxisSection('today') || { task: '' };
  const hasStartedToday = Boolean(dailyCheckin.startedAt);
  const hasEndedToday = Boolean(dailyCheckin.endedAt);
  const canStartToday = isDailyStartWindowOpen(now);
  const canEndToday = isDailyEndWindowOpen(now);

  return {
    dailyCheckin,
    todayAxisTask: todayAxis.task || '',
    hasTodayAxisTask: Boolean(todayAxis.task),
    hasStartedToday,
    hasEndedToday,
    canStartToday,
    canEndToday,
    startMeta: hasStartedToday
      ? formatTime(dailyCheckin.startedAt)
      : canStartToday
        ? '可开始'
        : '06:00 后',
    endMeta: hasEndedToday
      ? formatTime(dailyCheckin.endedAt)
      : canEndToday
        ? '可收束'
        : '18:30 后'
  };
}

Page({
  data: {
    states: LOW_QUALITY_STATES,
    stateRows: chunkStates(LOW_QUALITY_STATES),
    dailyCheckin: {
      startedAt: '',
      endedAt: '',
      completedThing: ''
    },
    todayAxisTask: '',
    todayAxisDraft: '',
    hasTodayAxisTask: false,
    hasStartedToday: false,
    hasEndedToday: false,
    canStartToday: false,
    canEndToday: false,
    canSaveTodayAxis: false,
    startMeta: '',
    endMeta: ''
  },

  onLoad() {
    this.refreshPage();
    this.clockTimer = setInterval(() => {
      this.refreshPage(false);
    }, 30000);
  },

  onShow() {
    this.refreshPage();
  },

  onUnload() {
    if (this.clockTimer) {
      clearInterval(this.clockTimer);
    }
  },

  refreshPage(resetDraft = true) {
    const homeState = getHomeState();
    const nextDraft = resetDraft ? homeState.todayAxisTask : this.data.todayAxisDraft;

    this.setData({
      ...homeState,
      todayAxisDraft: nextDraft,
      canSaveTodayAxis: normalizeText(nextDraft).length > 0
    });
  },

  handleStateTap(event) {
    const { id, route } = event.currentTarget.dataset;

    incrementStoredStateClick(id);
    wx.navigateTo({ url: route });
  },

  handleTodayAxisInput(event) {
    const value = event.detail.value;

    this.setData({
      todayAxisDraft: value,
      canSaveTodayAxis: normalizeText(value).length > 0
    });
  },

  handleSaveTodayAxis() {
    const nextTask = normalizeText(this.data.todayAxisDraft);

    if (!nextTask) {
      return;
    }

    const nextAxis = setStoredMainAxisSection('today', { task: nextTask });

    this.setData({
      todayAxisTask: nextAxis.today.task,
      todayAxisDraft: nextAxis.today.task,
      hasTodayAxisTask: Boolean(nextAxis.today.task),
      canSaveTodayAxis: true
    });
  },

  handleStartToday() {
    if (!this.data.canStartToday || this.data.hasStartedToday) {
      return;
    }

    setStoredDailyCheckinEvent('start');
    wx.navigateTo({ url: '/pages/axis-today/index' });
  },

  handleEndToday() {
    if (!this.data.canEndToday || this.data.hasEndedToday) {
      return;
    }

    setStoredDailyCheckinEvent('end');
    wx.navigateTo({ url: '/pages/month-completed/index' });
  }
});
