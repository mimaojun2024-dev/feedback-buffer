const {
  START_COUNTDOWN_SECONDS,
  getStoredStartTask,
  incrementStoredFlowStat,
  setStoredStartTask
} = require('../../utils/storage');
const { formatRemainingTime, normalizeText } = require('../../utils/time');

Page({
  data: {
    remainingSeconds: START_COUNTDOWN_SECONDS,
    progressPercent: 100,
    startTask: '',
    timeLabel: formatRemainingTime(START_COUNTDOWN_SECONDS)
  },

  onLoad(options) {
    const initialTask = normalizeText(decodeTask(options && options.task));
    const storedTask = getStoredStartTask();
    const resolvedTask = initialTask ? setStoredStartTask(initialTask) : storedTask;

    if (!resolvedTask) {
      wx.redirectTo({ url: '/pages/drag-start/index?edit=1' });
      return;
    }

    this.startTask = resolvedTask;
    this.hasTrackedStart = false;
  },

  onShow() {
    if (!this.startTask) {
      return;
    }

    this.setData({
      remainingSeconds: START_COUNTDOWN_SECONDS,
      progressPercent: 100,
      startTask: this.startTask,
      timeLabel: formatRemainingTime(START_COUNTDOWN_SECONDS)
    });

    if (!this.hasTrackedStart) {
      this.hasTrackedStart = true;
      incrementStoredFlowStat('drag-start.started');
    }

    const startAt = Date.now();

    this.timer = setInterval(() => {
      const elapsed = Date.now() - startAt;
      const millisecondsLeft = Math.max(0, START_COUNTDOWN_SECONDS * 1000 - elapsed);
      const nextSeconds = Math.max(0, Math.ceil(millisecondsLeft / 1000));
      const nextProgress = (millisecondsLeft / (START_COUNTDOWN_SECONDS * 1000)) * 100;

      this.setData({
        remainingSeconds: nextSeconds,
        progressPercent: nextProgress,
        timeLabel: formatRemainingTime(nextSeconds)
      });

      if (nextSeconds === 0) {
        clearInterval(this.timer);
        wx.redirectTo({
          url: `/pages/drag-start-done/index?task=${encodeURIComponent(this.startTask)}`
        });
      }
    }, 100);
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
