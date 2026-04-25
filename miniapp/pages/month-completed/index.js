const {
  getStoredDailyCheckinForToday,
  getStoredMonthlyDailyCheckins,
  setStoredDailyCheckinCompletion
} = require('../../utils/storage');
const { formatDateLabel, formatTime, normalizeText } = require('../../utils/time');

Page({
  data: {
    startedAtLabel: '未记录',
    endedAtLabel: '未记录',
    completedThing: '',
    monthEntries: [],
    isEditing: true,
    canSave: false,
    monthLabel: `${new Date().getMonth() + 1} 月完成记录`
  },

  onShow() {
    const todayCheckin = getStoredDailyCheckinForToday();
    const monthEntries = getStoredMonthlyDailyCheckins().map((entry) => ({
      ...entry,
      dateLabel: formatDateLabel(entry.dateKey),
      startLabel: formatTime(entry.startedAt),
      endLabel: formatTime(entry.endedAt)
    }));

    this.setData({
      startedAtLabel: formatTime(todayCheckin.startedAt),
      endedAtLabel: formatTime(todayCheckin.endedAt),
      completedThing: todayCheckin.completedThing || '',
      monthEntries,
      isEditing: !todayCheckin.completedThing,
      canSave: normalizeText(todayCheckin.completedThing).length > 0
    });
  },

  handleInput(event) {
    const completedThing = event.detail.value;

    this.setData({
      completedThing,
      canSave: normalizeText(completedThing).length > 0
    });
  },

  handleSave() {
    const completedThing = normalizeText(this.data.completedThing);

    if (!completedThing) {
      return;
    }

    const nextCheckin = setStoredDailyCheckinCompletion(completedThing);

    this.setData({
      completedThing: nextCheckin.completedThing,
      isEditing: false,
      canSave: true,
      monthEntries: getStoredMonthlyDailyCheckins().map((entry) => ({
        ...entry,
        dateLabel: formatDateLabel(entry.dateKey),
        startLabel: formatTime(entry.startedAt),
        endLabel: formatTime(entry.endedAt)
      }))
    });
  },

  handleEdit() {
    this.setData({ isEditing: true });
  }
});
