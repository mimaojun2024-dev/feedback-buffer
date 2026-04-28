const {
  getStoredDailyCheckinForToday,
  getStoredMainAxisSection,
  isDailyEndWindowOpen,
  isDailyStartWindowOpen,
  setStoredDailyCheckinCompletion,
  setStoredDailyCheckinEvent,
  setStoredMainAxisSection
} = require('../../utils/storage');
const { formatTime, normalizeText } = require('../../utils/time');

const COMPLETION_PREVIEW_MODES = ['actual', 'empty', 'filled'];
const PREVIEW_COMPLETION = '把今天的主轴往前推了一步';

function getCompletionState(previewMode = 'actual') {
  const dailyCheckin = getStoredDailyCheckinForToday();
  const canWriteCompletion = isDailyEndWindowOpen();
  const actualCompletedThing = dailyCheckin.completedThing || '';
  const completedThing = getPreviewCompletedThing(previewMode, actualCompletedThing);
  const isPreviewMode = previewMode !== 'actual';
  const hasStartedToday = Boolean(dailyCheckin.startedAt);
  const hasEndedToday = Boolean(dailyCheckin.endedAt);
  const canStartToday = isDailyStartWindowOpen();
  const canEndToday = isDailyEndWindowOpen();

  return {
    startedAtLabel: formatTime(dailyCheckin.startedAt),
    endedAtLabel: formatTime(dailyCheckin.endedAt),
    completedThing,
    hasStartedToday,
    hasEndedToday,
    canStartToday,
    canEndToday,
    startMeta: hasStartedToday
      ? formatTime(dailyCheckin.startedAt)
      : canStartToday
        ? '可开始'
        : '06:30 后',
    endMeta: hasEndedToday
      ? formatTime(dailyCheckin.endedAt)
      : canEndToday
        ? '可收束'
        : '18:30 后',
    isCompletionEditing: previewMode === 'empty' || (!completedThing && previewMode === 'actual'),
    canSaveCompletion: !isPreviewMode && canWriteCompletion && normalizeText(completedThing).length > 0,
    canWriteCompletion,
    canToggleCompletionPreviewForTest: getIsTestBuild(),
    completionPreviewButtonLabel: getCompletionPreviewButtonLabel(previewMode)
  };
}

Page({
  data: {
    task: '',
    isEditing: true,
    canSave: false,
    startedAtLabel: '未记录',
    endedAtLabel: '未记录',
    completedThing: '',
    hasStartedToday: false,
    hasEndedToday: false,
    canStartToday: false,
    canEndToday: false,
    startMeta: '',
    endMeta: '',
    isCompletionEditing: true,
    canSaveCompletion: false,
    canWriteCompletion: false,
    canToggleCompletionPreviewForTest: false,
    completionPreviewButtonLabel: '预览无记录'
  },

  onLoad() {
    this.completionPreviewMode = 'actual';
  },

  onShow() {
    this.refreshPage();
  },

  refreshPage() {
    const storedToday = getStoredMainAxisSection('today') || { task: '' };
    const nextState = getCompletionState(this.completionPreviewMode);

    nextState.task = storedToday.task || '';
    nextState.isEditing = !storedToday.task;
    nextState.canSave = normalizeText(storedToday.task).length > 0;

    this.setData(nextState);
  },

  handleTaskInput(event) {
    const task = event.detail.value;

    this.setData({
      task,
      canSave: normalizeText(task).length > 0
    });
  },

  handleSave() {
    const task = normalizeText(this.data.task);

    if (!task) {
      return;
    }

    const nextAxis = setStoredMainAxisSection('today', { task });

    this.setData({
      task: nextAxis.today.task,
      isEditing: false,
      canSave: true
    });
  },

  handleEdit() {
    this.setData({ isEditing: true });
  },

  handleStartToday() {
    if (!this.data.canStartToday || this.data.hasStartedToday) {
      return;
    }

    setStoredDailyCheckinEvent('start');
    this.refreshPage();
  },

  handleEndToday() {
    if (!this.data.canEndToday) {
      return;
    }

    setStoredDailyCheckinEvent('end');
    this.refreshPage();
  },

  handleCompletionInput(event) {
    const completedThing = event.detail.value;

    this.setData({
      completedThing,
      canSaveCompletion: this.completionPreviewMode === 'actual'
        && this.data.canWriteCompletion
        && normalizeText(completedThing).length > 0
    });
  },

  handleSaveCompletion() {
    if (this.completionPreviewMode !== 'actual') {
      if (wx.showToast) {
        wx.showToast({
          title: '预览不保存',
          icon: 'none'
        });
      }
      return;
    }

    if (!this.data.canWriteCompletion) {
      return;
    }

    const completedThing = normalizeText(this.data.completedThing);

    if (!completedThing) {
      return;
    }

    const nextCheckin = setStoredDailyCheckinCompletion(completedThing);

    this.setData({
      completedThing: nextCheckin.completedThing,
      isCompletionEditing: false,
      canSaveCompletion: true
    });
  },

  handleEditCompletion() {
    if (!this.data.canWriteCompletion) {
      return;
    }

    this.setData({ isCompletionEditing: true });
  },

  handleToggleCompletionPreviewForTest() {
    if (!this.data.canToggleCompletionPreviewForTest) {
      return;
    }

    this.completionPreviewMode = getNextCompletionPreviewMode(this.completionPreviewMode);
    this.setData(getCompletionState(this.completionPreviewMode));
  }
});

function getPreviewCompletedThing(previewMode, actualCompletedThing) {
  if (previewMode === 'empty') {
    return '';
  }

  if (previewMode === 'filled') {
    return actualCompletedThing || PREVIEW_COMPLETION;
  }

  return actualCompletedThing;
}

function getNextCompletionPreviewMode(previewMode) {
  const currentIndex = COMPLETION_PREVIEW_MODES.indexOf(previewMode);
  return COMPLETION_PREVIEW_MODES[(currentIndex + 1) % COMPLETION_PREVIEW_MODES.length];
}

function getCompletionPreviewButtonLabel(previewMode) {
  if (previewMode === 'actual') {
    return '预览无记录';
  }

  if (previewMode === 'empty') {
    return '预览有记录';
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
