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
    const entries = createEntries(getStoredMainAxisSection('year'));

    this.setData({
      entries,
      isEditing: !hasEntries(entries),
      canSave: hasEntries(entries)
    });
  },

  handleInput(event) {
    const index = Number(event.currentTarget.dataset.index);
    const entries = this.data.entries.map((entry, entryIndex) => (
      entryIndex === index ? { ...entry, task: event.detail.value } : entry
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

    const nextAxis = setStoredMainAxisSection('year', this.data.entries);

    this.setData({
      entries: createEntries(nextAxis.year),
      isEditing: false,
      canSave: true
    });
  },

  handleEdit() {
    this.setData({ isEditing: true });
  }
});
