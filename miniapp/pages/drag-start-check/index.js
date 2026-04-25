const { incrementStoredFlowStat } = require('../../utils/storage');

Page({
  data: {
    selectedAnswer: ''
  },

  handleSelect(event) {
    const answer = event.currentTarget.dataset.answer;

    this.setData({ selectedAnswer: answer });
    incrementStoredFlowStat(`drag-start.check.${answer}`);

    if (answer === 'yes') {
      wx.navigateTo({ url: '/pages/drag-start/index' });
    }
  }
});
