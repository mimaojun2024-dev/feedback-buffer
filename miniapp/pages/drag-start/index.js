const {
  getStoredStartTask,
  setStoredStartTask,
  START_COUNTDOWN_SECONDS
} = require('../../utils/storage');
const { normalizeText } = require('../../utils/time');

Page({
  data: {
    startTask: '',
    draftTask: '',
    isEditingTask: true,
    countdownMinutes: Math.floor(START_COUNTDOWN_SECONDS / 60)
  },

  onLoad(options) {
    this.routeOptions = options || {};
  },

  onShow() {
    const storedTask = getStoredStartTask();
    const isEditMode = this.routeOptions && this.routeOptions.edit === '1';

    this.setData({
      startTask: storedTask,
      draftTask: storedTask,
      isEditingTask: !storedTask || isEditMode
    });
  },

  handleInput(event) {
    this.setData({ draftTask: event.detail.value });
  },

  handleSubmit() {
    const nextTask = setStoredStartTask(this.data.draftTask);

    if (!nextTask) {
      return;
    }

    this.setData({
      startTask: nextTask,
      draftTask: nextTask,
      isEditingTask: false
    });

    wx.navigateTo({
      url: `/pages/drag-start-countdown/index?task=${encodeURIComponent(nextTask)}`
    });
  },

  handleEdit() {
    this.setData({ isEditingTask: true });
  },

  handleStartCountdown() {
    const nextTask = normalizeText(this.data.startTask);

    if (!nextTask) {
      return;
    }

    wx.navigateTo({
      url: `/pages/drag-start-countdown/index?task=${encodeURIComponent(nextTask)}`
    });
  }
});
