const { getStoredMainAxisSection, setStoredMainAxisSection } = require('../../utils/storage');
const { normalizeText } = require('../../utils/time');

function createEntries(entries) {
  return (entries || []).map((entry) => ({
    task: entry.task || ''
  }));
}

function hasEntries(entries) {
  return entries.some((entry) => normalizeText(entry.task));
}

Page({
  data: {
    entries: [{ task: '' }, { task: '' }, { task: '' }],
    isEditing: true,
    canSave: false
  },

  onShow() {
    const entries = createEntries(getStoredMainAxisSection('month'));

    this.setData({
      entries,
      isEditing: !hasEntries(entries),
      canSave: hasEntries(entries)
    });
  },

  handleInput(event) {
    const index = Number(event.currentTarget.dataset.index);
    const entries = this.data.entries.map((entry, entryIndex) => (
      entryIndex === index ? { task: event.detail.value } : entry
    ));

    this.setData({
      entries,
      canSave: hasEntries(entries)
    });
  },

  handleSave() {
    if (!hasEntries(this.data.entries)) {
      return;
    }

    const nextAxis = setStoredMainAxisSection('month', this.data.entries);

    this.setData({
      entries: createEntries(nextAxis.month),
      isEditing: false,
      canSave: true
    });
  },

  handleEdit() {
    this.setData({ isEditing: true });
  }
});
