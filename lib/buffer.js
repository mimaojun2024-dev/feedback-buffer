export const STORAGE_KEY = 'feedback-buffer.daily-counts';
export const PRIORITY_TASK_KEY = 'feedback-buffer.priority-task';
export const START_TASK_KEY = 'feedback-buffer.start-task';
export const STATE_CLICK_KEY = 'feedback-buffer.state-clicks';
export const TIRED_OPTION_CLICK_KEY = 'feedback-buffer.tired-option-clicks';
export const FLOW_STAT_KEY = 'feedback-buffer.flow-stats';
export const MAIN_AXIS_KEY = 'feedback-buffer.main-axis';
export const DAILY_CHECKIN_KEY = 'feedback-buffer.daily-checkins';
export const COUNTDOWN_SECONDS = 23;
export const START_COUNTDOWN_SECONDS = 2 * 60;
export const XIAOHONGSHU_URL = 'https://www.xiaohongshu.com/';
export const MAIN_AXIS_LIST_LIMIT = 3;
export const DAILY_START_HOUR = 6;
export const DAILY_START_MINUTE = 0;
export const DAILY_END_HOUR = 18;
export const DAILY_END_MINUTE = 30;

export function getTodayKey() {
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

function normalizeDailyText(value) {
  return `${value || ''}`.replace(/\s+/g, ' ').trim();
}

function normalizeDailyCheckin(value) {
  return {
    startedAt: normalizeDailyText(value?.startedAt),
    endedAt: normalizeDailyText(value?.endedAt),
    completedThing: normalizeDailyText(value?.completedThing)
  };
}

export function isDailyEndWindowOpen(now = new Date()) {
  const hour = now.getHours();
  const minute = now.getMinutes();

  return hour > DAILY_END_HOUR || (hour === DAILY_END_HOUR && minute >= DAILY_END_MINUTE);
}

export function isDailyStartWindowOpen(now = new Date()) {
  const hour = now.getHours();
  const minute = now.getMinutes();

  return hour > DAILY_START_HOUR || (hour === DAILY_START_HOUR && minute >= DAILY_START_MINUTE);
}

export function getStoredDailyCheckins() {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(DAILY_CHECKIN_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    return {};
  }
}

export function getStoredDailyCheckinForToday() {
  const today = getTodayKey();
  const storedCheckins = getStoredDailyCheckins();
  return normalizeDailyCheckin(storedCheckins[today] || {});
}

export function setStoredDailyCheckinEvent(eventId) {
  const today = getTodayKey();
  const storedCheckins = getStoredDailyCheckins();
  const todayCheckin = normalizeDailyCheckin(storedCheckins[today] || {});

  if (eventId === 'start' && !todayCheckin.startedAt) {
    todayCheckin.startedAt = new Date().toISOString();
  }

  if (eventId === 'end' && !todayCheckin.endedAt) {
    todayCheckin.endedAt = new Date().toISOString();
  }

  if (typeof window === 'undefined') {
    return todayCheckin;
  }

  try {
    const nextCheckins = {
      ...storedCheckins,
      [today]: todayCheckin
    };

    window.localStorage.setItem(DAILY_CHECKIN_KEY, JSON.stringify(nextCheckins));
  } catch (error) {
    return todayCheckin;
  }

  return todayCheckin;
}

export function setStoredDailyCheckinCompletion(value) {
  const today = getTodayKey();
  const storedCheckins = getStoredDailyCheckins();
  const todayCheckin = normalizeDailyCheckin(storedCheckins[today] || {});

  todayCheckin.completedThing = normalizeDailyText(value);

  if (typeof window === 'undefined') {
    return todayCheckin;
  }

  try {
    const nextCheckins = {
      ...storedCheckins,
      [today]: todayCheckin
    };

    window.localStorage.setItem(DAILY_CHECKIN_KEY, JSON.stringify(nextCheckins));
  } catch (error) {
    return todayCheckin;
  }

  return todayCheckin;
}

export function getStoredMonthlyDailyCheckins(now = new Date()) {
  if (typeof window === 'undefined') {
    return [];
  }

  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const monthKey = `${year}-${month}`;
  const storedCheckins = getStoredDailyCheckins();

  return Object.entries(storedCheckins)
    .filter(([dateKey]) => dateKey.startsWith(monthKey))
    .map(([dateKey, value]) => ({
      dateKey,
      ...normalizeDailyCheckin(value)
    }))
    .filter((entry) => entry.startedAt || entry.endedAt || entry.completedThing)
    .sort((left, right) => right.dateKey.localeCompare(left.dateKey));
}

export function getStoredCount() {
  if (typeof window === 'undefined') {
    return 0;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return 0;
    }

    const parsed = JSON.parse(raw);
    return parsed[getTodayKey()] || 0;
  } catch (error) {
    return 0;
  }
}

export function incrementStoredCount() {
  if (typeof window === 'undefined') {
    return 0;
  }

  const today = getTodayKey();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    const nextCount = (parsed[today] || 0) + 1;

    parsed[today] = nextCount;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));

    return nextCount;
  } catch (error) {
    return 0;
  }
}

export function getStoredPriorityTask() {
  if (typeof window === 'undefined') {
    return '';
  }

  try {
    return window.localStorage.getItem(PRIORITY_TASK_KEY) || '';
  } catch (error) {
    return '';
  }
}

export function setStoredPriorityTask(value) {
  if (typeof window === 'undefined') {
    return '';
  }

  const normalizedValue = value.replace(/\s+/g, ' ').trim();

  if (!normalizedValue) {
    return '';
  }

  try {
    window.localStorage.setItem(PRIORITY_TASK_KEY, normalizedValue);
    return normalizedValue;
  } catch (error) {
    return '';
  }
}

export function getStoredStartTask() {
  if (typeof window === 'undefined') {
    return '';
  }

  try {
    return window.localStorage.getItem(START_TASK_KEY) || '';
  } catch (error) {
    return '';
  }
}

export function setStoredStartTask(value) {
  if (typeof window === 'undefined') {
    return '';
  }

  const normalizedValue = value.replace(/\s+/g, ' ').trim();

  if (!normalizedValue) {
    return '';
  }

  try {
    window.localStorage.setItem(START_TASK_KEY, normalizedValue);
    return normalizedValue;
  } catch (error) {
    return '';
  }
}

export function getStoredStateClicks() {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(STATE_CLICK_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    return {};
  }
}

export function incrementStoredStateClick(stateId) {
  if (typeof window === 'undefined' || !stateId) {
    return 0;
  }

  try {
    const parsed = getStoredStateClicks();
    const nextCount = (parsed[stateId] || 0) + 1;

    parsed[stateId] = nextCount;
    window.localStorage.setItem(STATE_CLICK_KEY, JSON.stringify(parsed));

    return nextCount;
  } catch (error) {
    return 0;
  }
}

export function getStoredTiredOptionClicks() {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(TIRED_OPTION_CLICK_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    return {};
  }
}

export function incrementStoredTiredOptionClick(optionId) {
  if (typeof window === 'undefined' || !optionId) {
    return 0;
  }

  try {
    const parsed = getStoredTiredOptionClicks();
    const nextCount = (parsed[optionId] || 0) + 1;

    parsed[optionId] = nextCount;
    window.localStorage.setItem(TIRED_OPTION_CLICK_KEY, JSON.stringify(parsed));

    return nextCount;
  } catch (error) {
    return 0;
  }
}

export function getStoredFlowStats() {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(FLOW_STAT_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    return {};
  }
}

export function incrementStoredFlowStat(statId) {
  if (typeof window === 'undefined' || !statId) {
    return 0;
  }

  try {
    const parsed = getStoredFlowStats();
    const nextCount = (parsed[statId] || 0) + 1;

    parsed[statId] = nextCount;
    window.localStorage.setItem(FLOW_STAT_KEY, JSON.stringify(parsed));

    return nextCount;
  } catch (error) {
    return 0;
  }
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

function normalizeAxisText(value) {
  return `${value || ''}`.replace(/\s+/g, ' ').trim();
}

function normalizeAxisItem(item) {
  if (typeof item === 'string') {
    return {
      task: normalizeAxisText(item),
      owner: ''
    };
  }

  return {
    task: normalizeAxisText(item?.task),
    owner: normalizeAxisText(item?.owner)
  };
}

function normalizeAxisList(list) {
  if (Array.isArray(list)) {
    return createEmptyAxisList().map((emptyItem, index) => {
      const nextItem = list[index];
      return nextItem ? normalizeAxisItem(nextItem) : emptyItem;
    });
  }

  if (typeof list === 'string' && normalizeAxisText(list)) {
    return [
      normalizeAxisItem(list),
      ...createEmptyAxisList().slice(1)
    ];
  }

  return createEmptyAxisList();
}

function createEmptyMainAxis() {
  return {
    year: createEmptyAxisList(),
    month: createEmptyAxisList(),
    today: createEmptyAxisItem()
  };
}

export function getStoredMainAxis() {
  const emptyAxis = createEmptyMainAxis();

  if (typeof window === 'undefined') {
    return emptyAxis;
  }

  try {
    const raw = window.localStorage.getItem(MAIN_AXIS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};

    return {
      year: normalizeAxisList(parsed.year),
      month: normalizeAxisList(parsed.month),
      today: normalizeAxisItem(parsed.today)
    };
  } catch (error) {
    return emptyAxis;
  }
}

export function setStoredMainAxis(values) {
  const nextValues = {
    year: normalizeAxisList(values?.year),
    month: normalizeAxisList(values?.month),
    today: normalizeAxisItem(values?.today)
  };

  if (typeof window === 'undefined') {
    return nextValues;
  }

  try {
    window.localStorage.setItem(MAIN_AXIS_KEY, JSON.stringify(nextValues));
    return nextValues;
  } catch (error) {
    return nextValues;
  }
}

export function getStoredMainAxisSection(sectionId) {
  const axis = getStoredMainAxis();

  if (sectionId === 'today') {
    return axis.today;
  }

  if (sectionId === 'month' || sectionId === 'year') {
    return axis[sectionId];
  }

  return null;
}

export function setStoredMainAxisSection(sectionId, value) {
  const axis = getStoredMainAxis();

  if (sectionId === 'today') {
    axis.today = normalizeAxisItem(value);
  }

  if (sectionId === 'month' || sectionId === 'year') {
    axis[sectionId] = normalizeAxisList(value);
  }

  return setStoredMainAxis(axis);
}
