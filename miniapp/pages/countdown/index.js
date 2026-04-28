const {
  COUNTDOWN_SECONDS,
  getStoredCount,
  getStoredPriorityTask,
  incrementStoredCount,
  incrementStoredFlowStat,
  setStoredPriorityTask
} = require('../../utils/storage');
const { normalizeText } = require('../../utils/time');

Page({
  data: {
    remainingSeconds: COUNTDOWN_SECONDS,
    progressPercent: 100,
    dailyCount: 0,
    priorityTask: '',
    canSkipCountdownForTest: false
  },

  onLoad(options) {
    const initialTask = normalizeText(decodeTask(options && options.task));
    const storedTask = getStoredPriorityTask();
    const resolvedTask = initialTask ? setStoredPriorityTask(initialTask) : storedTask;

    if (!resolvedTask) {
      wx.redirectTo({ url: '/pages/escape/index?edit=1' });
      return;
    }

    this.priorityTask = resolvedTask;
    this.hasIncrementedCount = false;
    this.hasCompletedCountdown = false;
  },

  onShow() {
    if (!this.priorityTask) {
      return;
    }

    if (!this.hasIncrementedCount) {
      this.hasIncrementedCount = true;
      this.dailyCount = incrementStoredCount();
      incrementStoredFlowStat('escape.waited-23-seconds');
    } else {
      this.dailyCount = getStoredCount();
    }

    this.setData({
      remainingSeconds: COUNTDOWN_SECONDS,
      progressPercent: 100,
      priorityTask: this.priorityTask,
      dailyCount: this.dailyCount,
      canSkipCountdownForTest: getIsTestBuild()
    });

    const startAt = Date.now();

    this.timer = setInterval(() => {
      const elapsed = Date.now() - startAt;
      const millisecondsLeft = Math.max(0, COUNTDOWN_SECONDS * 1000 - elapsed);
      const nextSeconds = Math.max(0, Math.ceil(millisecondsLeft / 1000));
      const nextProgress = (millisecondsLeft / (COUNTDOWN_SECONDS * 1000)) * 100;

      this.setData({
        remainingSeconds: nextSeconds,
        progressPercent: nextProgress
      });

      if (nextSeconds === 0) {
        this.completeCountdown();
      }
    }, 100);
  },

  completeCountdown() {
    if (this.hasCompletedCountdown) {
      return;
    }

    this.hasCompletedCountdown = true;

    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    wx.redirectTo({
      url: `/pages/choices/index?task=${encodeURIComponent(this.priorityTask)}`
    });
  },

  handleSkipCountdownForTest() {
    if (!this.data.canSkipCountdownForTest) {
      return;
    }

    this.completeCountdown();
  },

  onHide() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },

  onUnload() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
});

function getIsTestBuild() {
  try {
    const accountInfo = wx.getAccountInfoSync ? wx.getAccountInfoSync() : null;
    const envVersion = accountInfo && accountInfo.miniProgram && accountInfo.miniProgram.envVersion;
    return envVersion === 'develop';
  } catch (error) {
    return false;
  }
}

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
