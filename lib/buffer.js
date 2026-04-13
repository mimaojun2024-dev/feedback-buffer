export const STORAGE_KEY = 'feedback-buffer.daily-counts';
export const PRIORITY_TASK_KEY = 'feedback-buffer.priority-task';
export const START_TASK_KEY = 'feedback-buffer.start-task';
export const STATE_CLICK_KEY = 'feedback-buffer.state-clicks';
export const TIRED_OPTION_CLICK_KEY = 'feedback-buffer.tired-option-clicks';
export const FLOW_STAT_KEY = 'feedback-buffer.flow-stats';
export const COUNTDOWN_SECONDS = 23;
export const START_COUNTDOWN_SECONDS = 5 * 60;
export const XIAOHONGSHU_URL = 'https://www.xiaohongshu.com/';

export function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const day = `${now.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
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
