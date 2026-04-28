const {
  getStoredMainAxisSection,
  incrementStoredFlowStat
} = require('../../utils/storage');
const { formatRemainingTime, normalizeText } = require('../../utils/time');

const FIVE_MINUTE_SECONDS = 5 * 60;
const YEAR_AXIS_PREVIEW_ENTRIES = [
  { index: 1, task: '把最重要的方向留在手边' },
  { index: 2, task: '少被即时反馈牵走一点' },
  { index: 3, task: '慢慢把自己带回主轴' }
];
const PREVIEW_MODES = ['actual', 'empty', 'filled'];

Page({
  data: {
    remainingSeconds: FIVE_MINUTE_SECONDS,
    progressPercent: 100,
    timeLabel: formatRemainingTime(FIVE_MINUTE_SECONDS),
    yearAxisEntries: [],
    hasYearAxisEntries: false,
    canUseTestTools: false,
    axisPreviewButtonLabel: '预览未填写',
    isComplete: false
  },

  onLoad() {
    this.previewMode = 'actual';
    this.hasTrackedStart = false;
    this.hasCompletedCountdown = false;
  },

  onShow() {
    this.hasCompletedCountdown = false;
    const nextState = buildYearAxisState(this.previewMode);

    nextState.remainingSeconds = FIVE_MINUTE_SECONDS;
    nextState.progressPercent = 100;
    nextState.timeLabel = formatRemainingTime(FIVE_MINUTE_SECONDS);
    nextState.canUseTestTools = getIsTestBuild();
    nextState.isComplete = false;

    this.setData(nextState);

    if (!this.hasTrackedStart) {
      this.hasTrackedStart = true;
      incrementStoredFlowStat('escape.five-minute.started');
    }

    this.startCountdown();
  },

  startCountdown() {
    if (this.timer) {
      clearInterval(this.timer);
    }

    const startAt = Date.now();

    this.timer = setInterval(() => {
      const elapsed = Date.now() - startAt;
      const millisecondsLeft = Math.max(0, FIVE_MINUTE_SECONDS * 1000 - elapsed);
      const nextSeconds = Math.max(0, Math.ceil(millisecondsLeft / 1000));
      const nextProgress = (millisecondsLeft / (FIVE_MINUTE_SECONDS * 1000)) * 100;

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

    incrementStoredFlowStat('escape.five-minute.completed');
    this.setData({
      remainingSeconds: 0,
      progressPercent: 0,
      timeLabel: formatRemainingTime(0),
      isComplete: true
    });
  },

  handleToggleYearAxisPreviewForTest() {
    if (!this.data.canUseTestTools) {
      return;
    }

    this.previewMode = getNextPreviewMode(this.previewMode);
    this.setData(buildYearAxisState(this.previewMode));
  },

  handleSkipCountdownForTest() {
    if (!this.data.canUseTestTools) {
      return;
    }

    this.completeCountdown();
  },

  onHide() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },

  onUnload() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
});

function buildYearAxisState(previewMode) {
  const actualEntries = getYearAxisEntries();
  const yearAxisEntries = getPreviewEntries(previewMode, actualEntries);

  return {
    yearAxisEntries,
    hasYearAxisEntries: yearAxisEntries.length > 0,
    axisPreviewButtonLabel: getAxisPreviewButtonLabel(previewMode)
  };
}

function getYearAxisEntries() {
  return (getStoredMainAxisSection('year') || [])
    .map((entry) => normalizeText(entry && entry.task))
    .filter(Boolean)
    .map((task, index) => ({
      index: index + 1,
      task
    }));
}

function getPreviewEntries(previewMode, actualEntries) {
  if (previewMode === 'empty') {
    return [];
  }

  if (previewMode === 'filled') {
    return actualEntries.length ? actualEntries : YEAR_AXIS_PREVIEW_ENTRIES;
  }

  return actualEntries;
}

function getNextPreviewMode(previewMode) {
  const currentIndex = PREVIEW_MODES.indexOf(previewMode);
  return PREVIEW_MODES[(currentIndex + 1) % PREVIEW_MODES.length];
}

function getAxisPreviewButtonLabel(previewMode) {
  if (previewMode === 'actual') {
    return '预览未填写';
  }

  if (previewMode === 'empty') {
    return '预览已填写';
  }

  return '恢复实际状态';
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
