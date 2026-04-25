Page({
  data: {
    trigger: '',
    canContinue: false
  },

  handleInput(event) {
    const trigger = event.detail.value;

    this.setData({
      trigger,
      canContinue: trigger.trim().length > 0
    });
  },

  handleContinue() {
    wx.navigateTo({ url: '/pages/emotion-steady/index' });
  }
});
