const {
  COUNTDOWN_SECONDS,
  getStoredCount,
  getStoredPriorityTask,
  incrementStoredCount,
  setStoredPriorityTask
} = require('../../utils/storage');
const { normalizeText } = require('../../utils/time');

Page({
  data: {
    remainingSeconds: COUNTDOWN_SECONDS,
    progressPercent: 100,
    dailyCount: 0,
    priorityTask: ''
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
  },

  onShow() {
    if (!this.priorityTask) {
      return;
    }

    if (!this.hasIncrementedCount) {
      this.hasIncrementedCount = true;
      this.dailyCount = incrementStoredCount();
    } else {
      this.dailyCount = getStoredCount();
    }

    this.setData({
      remainingSeconds: COUNTDOWN_SECONDS,
      progressPercent: 100,
      priorityTask: this.priorityTask,
      dailyCount: this.dailyCount
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
        clearInterval(this.timer);
        wx.redirectTo({
          url: `/pages/choices/index?task=${encodeURIComponent(this.priorityTask)}`
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
