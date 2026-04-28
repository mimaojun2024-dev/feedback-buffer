const {
  appendStoredCourageItem,
  deleteStoredCourageItem,
  getStoredCourageList
} = require('../../utils/storage');
const { formatDateTime, normalizeText } = require('../../utils/time');

function getCourageItems() {
  return getStoredCourageList().map((item) => ({
    id: item.id,
    title: item.title,
    createdAt: item.createdAt,
    createdAtLabel: formatDateTime(item.createdAt)
  }));
}

Page({
  data: {
    task: '',
    canSubmit: false,
    needsTime: false,
    encouragementOpened: false,
    courageItems: [],
    hasCourageItems: false,
    isManagingCourage: false,
    canToggleCouragePreviewForTest: false,
    isPreviewingEmptyCourageForTest: false
  },

  onShow() {
    this.refreshCourageList(this.data.isManagingCourage, this.data.isPreviewingEmptyCourageForTest);
  },

  refreshCourageList(
    isManagingCourage = this.data.isManagingCourage,
    isPreviewingEmptyCourageForTest = this.data.isPreviewingEmptyCourageForTest
  ) {
    const storedCourageItems = getCourageItems();
    const courageItems = isPreviewingEmptyCourageForTest ? [] : storedCourageItems;
    const hasCourageItems = courageItems.length > 0;

    this.setData({
      courageItems,
      hasCourageItems,
      isManagingCourage: isManagingCourage && hasCourageItems,
      canToggleCouragePreviewForTest: getIsTestBuild() && storedCourageItems.length > 0,
      isPreviewingEmptyCourageForTest
    });
  },

  handleInput(event) {
    const task = event.detail.value;

    this.setData({
      task,
      canSubmit: normalizeText(task).length > 0
    });
  },

  handleSubmit() {
    const task = normalizeText(this.data.task);

    if (!task) {
      return;
    }

    appendStoredCourageItem(task);
    wx.navigateTo({ url: '/pages/courage-done/index' });
  },

  handleNeedTime() {
    this.setData({
      needsTime: true,
      encouragementOpened: false
    });
  },

  handleOpenEncouragement() {
    if (this.data.encouragementOpened) {
      return;
    }

    this.setData({ encouragementOpened: true });
  },

  handleToggleCourageManagement() {
    if (!this.data.hasCourageItems) {
      return;
    }

    this.refreshCourageList(!this.data.isManagingCourage);
  },

  handleDeleteCourageItem(event) {
    const itemId = event.currentTarget.dataset.id;

    deleteStoredCourageItem(itemId);
    this.refreshCourageList(true);
  },

  handleToggleCouragePreviewForTest() {
    if (!this.data.canToggleCouragePreviewForTest) {
      return;
    }

    this.refreshCourageList(false, !this.data.isPreviewingEmptyCourageForTest);
  }
});

function getIsTestBuild() {
  try {
    const accountInfo = wx.getAccountInfoSync ? wx.getAccountInfoSync() : null;
    const envVersion = accountInfo && accountInfo.miniProgram && accountInfo.miniProgram.envVersion;
    return envVersion === 'develop' || envVersion === 'trial';
  } catch (error) {
    return false;
  }
}
