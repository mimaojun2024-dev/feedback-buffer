const {
  getStoredMainAxisSection,
  getStoredMonthlyDailyCheckins,
  setStoredMainAxisSection
} = require('../../utils/storage');
const { formatDateLabel, formatTime, normalizeText } = require('../../utils/time');

Page({
  data: {
    task: '',
    recentCompletions: [],
    isEditing: true,
    canSave: false
  },

  onShow() {
    const storedToday = getStoredMainAxisSection('today') || { task: '' };
    const recentCompletions = getStoredMonthlyDailyCheckins()
      .filter((entry) => entry.completedThing)
      .slice(0, 15)
      .map((entry) => ({
        ...entry,
        dateLabel: formatDateLabel(entry.dateKey),
        startLabel: formatTime(entry.startedAt),
        endLabel: formatTime(entry.endedAt)
      }));

    this.setData({
      task: storedToday.task || '',
      recentCompletions,
      isEditing: !storedToday.task,
      canSave: normalizeText(storedToday.task).length > 0
    });
  },

  handleTaskInput(event) {
    const task = event.detail.value;

    this.setData({
      task,
      canSave: normalizeText(task).length > 0
    });
  },

  handleSave() {
    const task = normalizeText(this.data.task);

    if (!task) {
      return;
    }

    const nextAxis = setStoredMainAxisSection('today', { task });

    this.setData({
      task: nextAxis.today.task,
      isEditing: false,
      canSave: true
    });
  },

  handleEdit() {
    this.setData({ isEditing: true });
  }
});
