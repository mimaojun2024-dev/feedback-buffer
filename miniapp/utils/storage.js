const { normalizeText } = require('./time');

const STORAGE_KEY = 'feedback-buffer.daily-counts';
const PRIORITY_TASK_KEY = 'feedback-buffer.priority-task';
const START_TASK_KEY = 'feedback-buffer.start-task';
const START_HISTORY_KEY = 'feedback-buffer.start-history';
const STATE_CLICK_KEY = 'feedback-buffer.state-clicks';
const TIRED_OPTION_CLICK_KEY = 'feedback-buffer.tired-option-clicks';
const FLOW_STAT_KEY = 'feedback-buffer.flow-stats';
const MAIN_AXIS_KEY = 'feedback-buffer.main-axis';
const DAILY_CHECKIN_KEY = 'feedback-buffer.daily-checkins';
const COURAGE_LIST_KEY = 'feedback-buffer.courage-list';
const COUNTDOWN_SECONDS = 23;
const START_COUNTDOWN_SECONDS = 2 * 60;
const XIAOHONGSHU_URL = 'https://www.xiaohongshu.com/';
const MAIN_AXIS_LIST_LIMIT = 3;
const START_HISTORY_LIMIT = 5;
const COURAGE_LIST_LIMIT = 5;
const DAILY_START_HOUR = 6;
const DAILY_START_MINUTE = 30;
const DAILY_END_HOUR = 18;
const DAILY_END_MINUTE = 30;

function safeGetStorage(key, fallbackValue) {
  try {
    const value = wx.getStorageSync(key);
    return value === '' || value === undefined ? fallbackValue : value;
  } catch (error) {
    return fallbackValue;
  }
}

function safeSetStorage(key, value) {
  try {
    wx.setStorageSync(key, value);
  } catch (error) {
    return value;
  }

  return value;
}

function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const day = `${now.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function createEmptyDailyCheckin() {
  return {
    startedAt: '',
    endedAt: '',
    completedThing: ''
  };
}

function normalizeDailyCheckin(value) {
  return {
    startedAt: normalizeText(value && value.startedAt),
    endedAt: normalizeText(value && value.endedAt),
    completedThing: normalizeText(value && value.completedThing)
  };
}

function isDailyEndWindowOpen(now = new Date()) {
  const hour = now.getHours();
  const minute = now.getMinutes();
  return hour > DAILY_END_HOUR || (hour === DAILY_END_HOUR && minute >= DAILY_END_MINUTE);
}

function isDailyStartWindowOpen(now = new Date()) {
  const hour = now.getHours();
  const minute = now.getMinutes();
  return hour > DAILY_START_HOUR || (hour === DAILY_START_HOUR && minute >= DAILY_START_MINUTE);
}

function getStoredDailyCheckins() {
  const stored = safeGetStorage(DAILY_CHECKIN_KEY, {});
  return stored && typeof stored === 'object' ? stored : {};
}

function getStoredDailyCheckinForToday() {
  const today = getTodayKey();
  const storedCheckins = getStoredDailyCheckins();
  return normalizeDailyCheckin(storedCheckins[today] || createEmptyDailyCheckin());
}

function setStoredDailyCheckinEvent(eventId) {
  const today = getTodayKey();
  const storedCheckins = getStoredDailyCheckins();
  const todayCheckin = normalizeDailyCheckin(storedCheckins[today] || createEmptyDailyCheckin());

  if (eventId === 'start' && !todayCheckin.startedAt) {
    todayCheckin.startedAt = new Date().toISOString();
  }

  if (eventId === 'end' && !todayCheckin.endedAt) {
    todayCheckin.endedAt = new Date().toISOString();
  }

  safeSetStorage(DAILY_CHECKIN_KEY, {
    ...storedCheckins,
    [today]: todayCheckin
  });

  return todayCheckin;
}

function resetStoredDailyCheckinForToday() {
  const today = getTodayKey();
  const storedCheckins = getStoredDailyCheckins();

  if (!storedCheckins[today]) {
    return createEmptyDailyCheckin();
  }

  const nextCheckins = { ...storedCheckins };
  delete nextCheckins[today];
  safeSetStorage(DAILY_CHECKIN_KEY, nextCheckins);

  return createEmptyDailyCheckin();
}

function setStoredDailyCheckinCompletion(value) {
  const today = getTodayKey();
  const storedCheckins = getStoredDailyCheckins();
  const todayCheckin = normalizeDailyCheckin(storedCheckins[today] || createEmptyDailyCheckin());

  todayCheckin.completedThing = normalizeText(value);

  safeSetStorage(DAILY_CHECKIN_KEY, {
    ...storedCheckins,
    [today]: todayCheckin
  });

  return todayCheckin;
}

function getStoredMonthlyDailyCheckins(now = new Date()) {
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const monthKey = `${year}-${month}`;
  const storedCheckins = getStoredDailyCheckins();

  return Object.keys(storedCheckins)
    .filter((dateKey) => dateKey.indexOf(monthKey) === 0)
    .map((dateKey) => ({
      dateKey,
      ...normalizeDailyCheckin(storedCheckins[dateKey])
    }))
    .filter((entry) => entry.startedAt || entry.endedAt || entry.completedThing)
    .sort((left, right) => right.dateKey.localeCompare(left.dateKey));
}

function getStoredCount() {
  const stored = safeGetStorage(STORAGE_KEY, {});
  return stored[getTodayKey()] || 0;
}

function incrementStoredCount() {
  const today = getTodayKey();
  const stored = safeGetStorage(STORAGE_KEY, {});
  const nextCount = (stored[today] || 0) + 1;
  stored[today] = nextCount;
  safeSetStorage(STORAGE_KEY, stored);
  return nextCount;
}

function getStoredPriorityTask() {
  return normalizeText(safeGetStorage(PRIORITY_TASK_KEY, ''));
}

function setStoredPriorityTask(value) {
  const normalizedValue = normalizeText(value);

  if (!normalizedValue) {
    return '';
  }

  safeSetStorage(PRIORITY_TASK_KEY, normalizedValue);
  return normalizedValue;
}

function getStoredStartTask() {
  return normalizeText(safeGetStorage(START_TASK_KEY, ''));
}

function setStoredStartTask(value) {
  const normalizedValue = normalizeText(value);

  if (!normalizedValue) {
    return '';
  }

  safeSetStorage(START_TASK_KEY, normalizedValue);
  return normalizedValue;
}

function normalizeStartHistoryItem(item) {
  return {
    id: normalizeText(item && item.id),
    task: normalizeText(item && item.task),
    completedAt: normalizeText(item && item.completedAt)
  };
}

function getStoredStartHistory() {
  const stored = safeGetStorage(START_HISTORY_KEY, []);

  if (!Array.isArray(stored)) {
    return [];
  }

  return stored
    .map((item) => normalizeStartHistoryItem(item))
    .filter((item) => item.id && item.task && item.completedAt)
    .sort((left, right) => right.completedAt.localeCompare(left.completedAt))
    .slice(0, START_HISTORY_LIMIT);
}

function appendStoredStartHistory(task) {
  const normalizedTask = normalizeText(task);

  if (!normalizedTask) {
    return null;
  }

  const nextItem = {
    id: `start-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    task: normalizedTask,
    completedAt: new Date().toISOString()
  };

  safeSetStorage(START_HISTORY_KEY, [nextItem, ...getStoredStartHistory()].slice(0, START_HISTORY_LIMIT));
  return nextItem;
}

function deleteStoredStartHistoryItem(itemId) {
  const normalizedId = normalizeText(itemId);

  if (!normalizedId) {
    return getStoredStartHistory();
  }

  const nextHistory = getStoredStartHistory().filter((item) => item.id !== normalizedId);
  safeSetStorage(START_HISTORY_KEY, nextHistory);
  return nextHistory;
}

function getStoredStateClicks() {
  const stored = safeGetStorage(STATE_CLICK_KEY, {});
  return stored && typeof stored === 'object' ? stored : {};
}

function incrementStoredStateClick(stateId) {
  if (!stateId) {
    return 0;
  }

  const stored = getStoredStateClicks();
  const nextCount = (stored[stateId] || 0) + 1;
  stored[stateId] = nextCount;
  safeSetStorage(STATE_CLICK_KEY, stored);
  return nextCount;
}

function getStoredTiredOptionClicks() {
  const stored = safeGetStorage(TIRED_OPTION_CLICK_KEY, {});
  return stored && typeof stored === 'object' ? stored : {};
}

function incrementStoredTiredOptionClick(optionId) {
  if (!optionId) {
    return 0;
  }

  const stored = getStoredTiredOptionClicks();
  const nextCount = (stored[optionId] || 0) + 1;
  stored[optionId] = nextCount;
  safeSetStorage(TIRED_OPTION_CLICK_KEY, stored);
  return nextCount;
}

function getStoredFlowStats() {
  const stored = safeGetStorage(FLOW_STAT_KEY, {});
  return stored && typeof stored === 'object' ? stored : {};
}

function incrementStoredFlowStat(statId) {
  if (!statId) {
    return 0;
  }

  const stored = getStoredFlowStats();
  const nextCount = (stored[statId] || 0) + 1;
  stored[statId] = nextCount;
  safeSetStorage(FLOW_STAT_KEY, stored);
  return nextCount;
}

function normalizeCourageItem(item) {
  return {
    id: normalizeText(item && item.id),
    title: normalizeText(item && item.title),
    createdAt: normalizeText(item && item.createdAt)
  };
}

function getStoredCourageList() {
  const stored = safeGetStorage(COURAGE_LIST_KEY, []);

  if (!Array.isArray(stored)) {
    return [];
  }

  return stored
    .map((item) => normalizeCourageItem(item))
    .filter((item) => item.id && item.title && item.createdAt)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .slice(0, COURAGE_LIST_LIMIT);
}

function appendStoredCourageItem(title) {
  const normalizedTitle = normalizeText(title);

  if (!normalizedTitle) {
    return null;
  }

  const nextItem = {
    id: `courage-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: normalizedTitle,
    createdAt: new Date().toISOString()
  };

  safeSetStorage(COURAGE_LIST_KEY, [nextItem, ...getStoredCourageList()].slice(0, COURAGE_LIST_LIMIT));
  return nextItem;
}

function deleteStoredCourageItem(itemId) {
  const normalizedId = normalizeText(itemId);

  if (!normalizedId) {
    return getStoredCourageList();
  }

  const nextItems = getStoredCourageList().filter((item) => item.id !== normalizedId);
  safeSetStorage(COURAGE_LIST_KEY, nextItems);
  return nextItems;
}

function createEmptyAxisItem() {
  return {
    task: '',
    owner: ''
  };
}

function createEmptyAxisList() {
  return Array.from({ length: MAIN_AXIS_LIST_LIMIT }, () => createEmptyAxisItem());
}

function normalizeAxisItem(item) {
  if (typeof item === 'string') {
    return {
      task: normalizeText(item),
      owner: ''
    };
  }

  return {
    task: normalizeText(item && item.task),
    owner: normalizeText(item && item.owner)
  };
}

function normalizeAxisList(list) {
  if (Array.isArray(list)) {
    return createEmptyAxisList().map((emptyItem, index) => {
      const nextItem = list[index];
      return nextItem ? normalizeAxisItem(nextItem) : emptyItem;
    });
  }

  if (typeof list === 'string' && normalizeText(list)) {
    return [normalizeAxisItem(list), ...createEmptyAxisList().slice(1)];
  }

  return createEmptyAxisList();
}

function createEmptyTodayAxisItem() {
  return {
    ...createEmptyAxisItem(),
    dateKey: getTodayKey()
  };
}

function normalizeTodayAxisItem(item) {
  return {
    ...normalizeAxisItem(item),
    dateKey: normalizeText(item && item.dateKey) || getTodayKey()
  };
}

function createEmptyMainAxis() {
  return {
    year: createEmptyAxisList(),
    month: createEmptyAxisList(),
    today: createEmptyTodayAxisItem()
  };
}

function getStoredMainAxis() {
  const emptyAxis = createEmptyMainAxis();
  const stored = safeGetStorage(MAIN_AXIS_KEY, {});
  const normalizedToday = normalizeTodayAxisItem(stored.today);

  return {
    year: normalizeAxisList(stored.year),
    month: normalizeAxisList(stored.month),
    today: normalizedToday.dateKey === getTodayKey() ? normalizedToday : createEmptyTodayAxisItem()
  };
}

function setStoredMainAxis(values) {
  const nextValues = {
    year: normalizeAxisList(values && values.year),
    month: normalizeAxisList(values && values.month),
    today: normalizeTodayAxisItem(values && values.today)
  };

  safeSetStorage(MAIN_AXIS_KEY, nextValues);
  return nextValues;
}

function getStoredMainAxisSection(sectionId) {
  const axis = getStoredMainAxis();

  if (sectionId === 'today') {
    return axis.today;
  }

  if (sectionId === 'month' || sectionId === 'year') {
    return axis[sectionId];
  }

  return null;
}

function setStoredMainAxisSection(sectionId, value) {
  const axis = getStoredMainAxis();

  if (sectionId === 'today') {
    axis.today = normalizeTodayAxisItem(value);
  }

  if (sectionId === 'month' || sectionId === 'year') {
    axis[sectionId] = normalizeAxisList(value);
  }

  return setStoredMainAxis(axis);
}

module.exports = {
  COUNTDOWN_SECONDS,
  COURAGE_LIST_KEY,
  COURAGE_LIST_LIMIT,
  DAILY_CHECKIN_KEY,
  DAILY_END_HOUR,
  DAILY_END_MINUTE,
  DAILY_START_HOUR,
  DAILY_START_MINUTE,
  FLOW_STAT_KEY,
  MAIN_AXIS_KEY,
  MAIN_AXIS_LIST_LIMIT,
  PRIORITY_TASK_KEY,
  START_COUNTDOWN_SECONDS,
  START_HISTORY_KEY,
  START_HISTORY_LIMIT,
  START_TASK_KEY,
  STATE_CLICK_KEY,
  STORAGE_KEY,
  TIRED_OPTION_CLICK_KEY,
  XIAOHONGSHU_URL,
  appendStoredStartHistory,
  deleteStoredStartHistoryItem,
  appendStoredCourageItem,
  deleteStoredCourageItem,
  getStoredCount,
  getStoredCourageList,
  getStoredDailyCheckinForToday,
  getStoredFlowStats,
  getStoredMainAxis,
  getStoredMainAxisSection,
  getStoredMonthlyDailyCheckins,
  getStoredPriorityTask,
  getStoredStartTask,
  getStoredStartHistory,
  getStoredStateClicks,
  getStoredTiredOptionClicks,
  getTodayKey,
  incrementStoredCount,
  incrementStoredFlowStat,
  incrementStoredStateClick,
  incrementStoredTiredOptionClick,
  isDailyEndWindowOpen,
  isDailyStartWindowOpen,
  resetStoredDailyCheckinForToday,
  setStoredDailyCheckinCompletion,
  setStoredDailyCheckinEvent,
  setStoredMainAxis,
  setStoredMainAxisSection,
  setStoredPriorityTask,
  setStoredStartTask
};
