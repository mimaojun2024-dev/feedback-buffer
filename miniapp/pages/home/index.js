const { LOW_QUALITY_STATES } = require('../../data/states');
const {
  getStoredDailyCheckinForToday,
  getStoredMainAxisSection,
  incrementStoredStateClick,
  isDailyEndWindowOpen,
  isDailyStartWindowOpen,
  resetStoredDailyCheckinForToday,
  setStoredDailyCheckinEvent,
  setStoredMainAxisSection
} = require('../../utils/storage');
const {
  clearInputPlaceholder,
  restoreInputPlaceholder
} = require('../../utils/placeholders');
const { formatTime, normalizeText } = require('../../utils/time');

const TODAY_AXIS_PLACEHOLDER = '写下今天最重要的一件事';

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
  const isTestBuild = getIsTestBuild();

  return {
    dailyCheckin,
    todayAxisTask: todayAxis.task || '',
    hasTodayAxisTask: Boolean(todayAxis.task),
    hasStartedToday,
    hasEndedToday,
    canStartToday,
    canEndToday,
    canResetTodayForTest: isTestBuild && (hasStartedToday || hasEndedToday),
    startMeta: hasStartedToday
      ? formatTime(dailyCheckin.startedAt)
      : canStartToday
        ? '可开始'
        : '06:30 后',
    endMeta: hasEndedToday
      ? formatTime(dailyCheckin.endedAt)
      : canEndToday
        ? '可收束'
        : '18:30 后可收束'
  };
}

function getIsTestBuild() {
  try {
    const accountInfo = wx.getAccountInfoSync ? wx.getAccountInfoSync() : null;
    const envVersion = accountInfo && accountInfo.miniProgram && accountInfo.miniProgram.envVersion;
    return envVersion === 'develop';
  } catch (error) {
    return false;
  }
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
    canResetTodayForTest: false,
    inputPlaceholders: {
      todayAxis: TODAY_AXIS_PLACEHOLDER
    },
    pressedStateId: '',
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
    this.isNavigatingState = false;
    this.refreshPage();
  },

  onUnload() {
    if (this.clockTimer) {
      clearInterval(this.clockTimer);
    }

    if (this.stateTapTimer) {
      clearTimeout(this.stateTapTimer);
    }
  },

  refreshPage(resetDraft = true) {
    const homeState = getHomeState();
    const nextDraft = resetDraft ? homeState.todayAxisTask : this.data.todayAxisDraft;
    const nextState = {};

    Object.keys(homeState).forEach((key) => {
      nextState[key] = homeState[key];
    });

    nextState.todayAxisDraft = nextDraft;

    this.setData(nextState);
  },

  handleStateTap(event) {
    if (this.isNavigatingState) {
      return;
    }

    const dataset = event.currentTarget.dataset || {};
    const id = dataset.id;
    const route = dataset.route;

    this.isNavigatingState = true;
    this.setData({
      pressedStateId: id
    });
    incrementStoredStateClick(id);

    this.stateTapTimer = setTimeout(() => {
      wx.navigateTo({
        url: route,
        complete: () => {
          this.setData({ pressedStateId: '' });
          this.isNavigatingState = false;
        }
      });
    }, 90);
  },

  handleTodayAxisInput(event) {
    const value = event.detail.value;

    this.setData({
      todayAxisDraft: value
    });
  },

  handleInputFocus: clearInputPlaceholder,

  handleInputBlur(event) {
    restoreInputPlaceholder.call(this, event);
    this.saveTodayAxisDraft();
  },

  saveTodayAxisDraft() {
    const nextTask = normalizeText(this.data.todayAxisDraft);

    if (!nextTask) {
      return null;
    }

    const nextAxis = setStoredMainAxisSection('today', { task: nextTask });

    this.setData({
      todayAxisTask: nextAxis.today.task,
      todayAxisDraft: nextAxis.today.task,
      hasTodayAxisTask: Boolean(nextAxis.today.task)
    });

    return nextAxis.today.task;
  },

  handleStartToday() {
    if (!this.data.canStartToday || this.data.hasStartedToday) {
      return;
    }

    this.saveTodayAxisDraft();
    setStoredDailyCheckinEvent('start');
    this.refreshPage(false);
  },

  handleResetTodayForTest() {
    if (!this.data.canResetTodayForTest) {
      return;
    }

    resetStoredDailyCheckinForToday();
    this.refreshPage(false);

    if (wx.showToast) {
      wx.showToast({
        title: '已重置今日测试',
        icon: 'none'
      });
    }
  },

  handleEndToday() {
    if (!this.data.canEndToday) {
      return;
    }

    this.saveTodayAxisDraft();
    setStoredDailyCheckinEvent('end');
    wx.navigateTo({ url: '/pages/axis-today/index' });
  }
});
