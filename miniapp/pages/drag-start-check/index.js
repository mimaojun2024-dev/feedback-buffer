const { incrementStoredFlowStat } = require('../../utils/storage');

Page({
  data: {
    selectedAnswer: '',
    encouragementOpened: false,
    retryAnswer: ''
  },

  handleSelect(event) {
    const answer = event.currentTarget.dataset.answer;

    incrementStoredFlowStat(`drag-start.check.${answer}`);

    if (answer === 'yes') {
      wx.navigateTo({ url: '/pages/drag-start/index' });
      return;
    }

    this.setData({
      selectedAnswer: answer,
      encouragementOpened: false,
      retryAnswer: ''
    });
  },

  handleOpenEncouragement() {
    if (this.data.encouragementOpened) {
      return;
    }

    this.setData({ encouragementOpened: true });
    incrementStoredFlowStat('drag-start.check.encouragement-opened');
  },

  handleRetrySelect(event) {
    const answer = event.currentTarget.dataset.answer;

    this.setData({ retryAnswer: answer });
    incrementStoredFlowStat(`drag-start.check.retry.${answer}`);

    if (answer === 'yes') {
      wx.navigateTo({ url: '/pages/drag-start/index' });
    }
  }
});
