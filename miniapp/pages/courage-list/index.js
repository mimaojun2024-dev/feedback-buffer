const { getStoredCourageList } = require('../../utils/storage');
const { formatDateTime } = require('../../utils/time');

Page({
  data: {
    items: []
  },

  onShow() {
    const items = getStoredCourageList().map((item) => ({
      id: item.id,
      title: item.title,
      createdAt: item.createdAt,
      createdAtLabel: formatDateTime(item.createdAt)
    }));

    this.setData({ items });
  }
});
