export const STORAGE_KEY = 'feedback-buffer.daily-counts';
export const PRIORITY_TASK_KEY = 'feedback-buffer.priority-task';
export const COUNTDOWN_SECONDS = 23;
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
