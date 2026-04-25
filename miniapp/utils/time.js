function pad(value) {
  return `${value}`.padStart(2, '0');
}

function normalizeText(value) {
  return `${value || ''}`.replace(/\s+/g, ' ').trim();
}

function toDate(value) {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
}

function formatTime(value) {
  const date = toDate(value);

  if (!date) {
    return '未记录';
  }

  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatDateTime(value) {
  const date = toDate(value);

  if (!date) {
    return '';
  }

  return `${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatDateLabel(dateKey) {
  const parts = `${dateKey || ''}`.split('-');

  if (parts.length !== 3) {
    return `${dateKey || ''}`;
  }

  return `${parts[1]}.${parts[2]}`;
}

function formatRemainingTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${pad(seconds)}`;
}

module.exports = {
  formatDateLabel,
  formatDateTime,
  formatRemainingTime,
  formatTime,
  normalizeText,
  pad
};
