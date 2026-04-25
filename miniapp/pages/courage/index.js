const { appendStoredCourageItem } = require('../../utils/storage');
const { normalizeText } = require('../../utils/time');

Page({
  data: {
    task: '',
    canSubmit: false
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
  }
});
