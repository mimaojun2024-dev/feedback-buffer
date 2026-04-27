const {
  deleteStoredStartHistoryItem,
  getStoredStartHistory,
  getStoredStartTask,
  setStoredStartTask,
  START_COUNTDOWN_SECONDS
} = require('../../utils/storage');
const { formatDateTime, normalizeText } = require('../../utils/time');

function getStartHistoryItems() {
  return getStoredStartHistory().map((item) => ({
    ...item,
    completedAtLabel: formatDateTime(item.completedAt)
  }));
}

Page({
  data: {
    startTask: '',
    draftTask: '',
    isEditingTask: true,
    isManagingHistory: false,
    startHistoryItems: [],
    hasStartHistory: false,
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
      isEditingTask: !storedTask || isEditMode,
      ...this.getHistoryState()
    });
  },

  getHistoryState(isManagingHistory = this.data.isManagingHistory) {
    const startHistoryItems = getStartHistoryItems();

    return {
      startHistoryItems,
      hasStartHistory: startHistoryItems.length > 0,
      isManagingHistory: isManagingHistory && startHistoryItems.length > 0
    };
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

  handleToggleHistoryManagement() {
    if (!this.data.hasStartHistory) {
      return;
    }

    this.setData(this.getHistoryState(!this.data.isManagingHistory));
  },

  handleDeleteHistoryItem(event) {
    const itemId = event.currentTarget.dataset.id;

    deleteStoredStartHistoryItem(itemId);
    this.setData(this.getHistoryState(true));
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
