const { getStoredCourageList } = require('../../utils/storage');
const { formatDateTime } = require('../../utils/time');

Page({
  data: {
    items: []
  },

  onShow() {
    const items = getStoredCourageList().map((item) => ({
      ...item,
      createdAtLabel: formatDateTime(item.createdAt)
    }));

    this.setData({ items });
  }
});
