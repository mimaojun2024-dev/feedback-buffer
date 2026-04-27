const {
  START_COUNTDOWN_SECONDS,
  getStoredStartTask,
  incrementStoredFlowStat,
  setStoredStartTask
} = require('../../utils/storage');
const { formatRemainingTime, normalizeText } = require('../../utils/time');

const HALF_HOUR_COUNTDOWN_SECONDS = 30 * 60;
const HALF_HOUR_DURATION = 'half-hour';

Page({
  data: {
    remainingSeconds: START_COUNTDOWN_SECONDS,
    progressPercent: 100,
    startTask: '',
    timeLabel: formatRemainingTime(START_COUNTDOWN_SECONDS),
    canSkipCountdownForTest: false
  },

  onLoad(options) {
    const initialTask = normalizeText(decodeTask(options && options.task));
    const storedTask = getStoredStartTask();
    const resolvedTask = initialTask ? setStoredStartTask(initialTask) : storedTask;

    if (!resolvedTask) {
      wx.redirectTo({ url: '/pages/drag-start/index?edit=1' });
      return;
    }

    this.duration = normalizeText(options && options.duration);
    this.countdownSeconds = getCountdownSeconds(this.duration);
    this.startTask = resolvedTask;
    this.hasTrackedStart = false;
    this.hasCompletedCountdown = false;
  },

  onShow() {
    if (!this.startTask) {
      return;
    }

    this.setData({
      remainingSeconds: this.countdownSeconds,
      progressPercent: 100,
      startTask: this.startTask,
      timeLabel: formatRemainingTime(this.countdownSeconds),
      canSkipCountdownForTest: getIsTestBuild()
    });

    if (!this.hasTrackedStart) {
      this.hasTrackedStart = true;
      incrementStoredFlowStat('drag-start.started');
    }

    const startAt = Date.now();

    this.timer = setInterval(() => {
      const elapsed = Date.now() - startAt;
      const millisecondsLeft = Math.max(0, this.countdownSeconds * 1000 - elapsed);
      const nextSeconds = Math.max(0, Math.ceil(millisecondsLeft / 1000));
      const nextProgress = (millisecondsLeft / (this.countdownSeconds * 1000)) * 100;

      this.setData({
        remainingSeconds: nextSeconds,
        progressPercent: nextProgress,
        timeLabel: formatRemainingTime(nextSeconds)
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
      url: `/pages/drag-start-done/index?task=${encodeURIComponent(this.startTask)}&duration=${this.duration}`
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

function getCountdownSeconds(duration) {
  return duration === HALF_HOUR_DURATION ? HALF_HOUR_COUNTDOWN_SECONDS : START_COUNTDOWN_SECONDS;
}

function getIsTestBuild() {
  try {
    const accountInfo = wx.getAccountInfoSync ? wx.getAccountInfoSync() : null;
    const envVersion = accountInfo && accountInfo.miniProgram && accountInfo.miniProgram.envVersion;
    return envVersion === 'develop' || envVersion === 'trial';
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
