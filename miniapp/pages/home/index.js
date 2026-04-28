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
const LOCKED_STATE_ID = 'stimulation';
const LOCKED_STATE_DEFAULT_COPY = '这格先锁着';
const LOCKED_STATE_WARNING_COPY = '都说锁着了😠';
const LOCKED_STATE_MAX_COPY = '锁孔都被你敲亮了😤';
const LOCKED_STATE_BROKEN_COPY = '咔，裂开了，别敲了😭';
const LOCKED_STATE_BROKEN_COUNT = 99;

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
    canUseHomeTestTools: isTestBuild,
    canResetTodayForTest: isTestBuild && (hasStartedToday || hasEndedToday),
    startTitle: hasStartedToday ? '今天已启动' : '启动今天',
    endTitle: hasEndedToday ? '今天已收束' : '收束今天',
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
    canUseHomeTestTools: false,
    canResetTodayForTest: false,
    inputPlaceholders: {
      todayAxis: TODAY_AXIS_PLACEHOLDER
    },
    pressedStateId: '',
    lockedStateTapCount: 0,
    lockedStateDescription: LOCKED_STATE_DEFAULT_COPY,
    startTitle: '',
    endTitle: '',
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
    this.resetLockedStateSession();
    this.refreshPage();
  },

  onUnload() {
    if (this.clockTimer) {
      clearInterval(this.clockTimer);
    }

    if (this.stateTapTimer) {
      clearTimeout(this.stateTapTimer);
    }

    if (this.lockedStateTimer) {
      clearTimeout(this.lockedStateTimer);
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

    if (id === LOCKED_STATE_ID) {
      this.handleLockedStateTap();
      return;
    }

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

  handleLockedStateTap() {
    if (this.data.lockedStateTapCount >= LOCKED_STATE_BROKEN_COUNT) {
      return;
    }

    const nextCount = this.data.lockedStateTapCount + 1;

    if (this.lockedStateTimer) {
      clearTimeout(this.lockedStateTimer);
    }

    incrementStoredStateClick(LOCKED_STATE_ID);
    this.setData({
      lockedStateTapCount: nextCount,
      lockedStateDescription: getLockedStateCopy(nextCount),
      pressedStateId: LOCKED_STATE_ID
    });

    if (nextCount < LOCKED_STATE_BROKEN_COUNT) {
      this.lockedStateTimer = setTimeout(() => {
        this.setData({ pressedStateId: '' });
      }, 180);
    }
  },

  resetLockedStateSession() {
    if (this.lockedStateTimer) {
      clearTimeout(this.lockedStateTimer);
    }

    this.setData({
      lockedStateTapCount: 0,
      lockedStateDescription: LOCKED_STATE_DEFAULT_COPY,
      pressedStateId: ''
    });
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

  handleBreakLockedStateForTest() {
    if (!this.data.canUseHomeTestTools) {
      return;
    }

    if (this.lockedStateTimer) {
      clearTimeout(this.lockedStateTimer);
    }

    this.setData({
      lockedStateTapCount: LOCKED_STATE_BROKEN_COUNT,
      lockedStateDescription: getLockedStateCopy(LOCKED_STATE_BROKEN_COUNT),
      pressedStateId: LOCKED_STATE_ID
    });
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

function getLockedStateCopy(count) {
  if (count >= LOCKED_STATE_BROKEN_COUNT) {
    return LOCKED_STATE_BROKEN_COPY;
  }

  if (count >= 10) {
    return LOCKED_STATE_MAX_COPY;
  }

  if (count >= 3) {
    return LOCKED_STATE_WARNING_COPY;
  }

  return LOCKED_STATE_DEFAULT_COPY;
}
