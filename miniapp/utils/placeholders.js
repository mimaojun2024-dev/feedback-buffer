function clearInputPlaceholder(event) {
  const dataset = event.currentTarget.dataset || {};
  const key = dataset.placeholderKey;

  if (!key) {
    return;
  }

  this.setData({
    [`inputPlaceholders.${key}`]: ''
  });
}

function restoreInputPlaceholder(event) {
  const dataset = event.currentTarget.dataset || {};
  const key = dataset.placeholderKey;
  const text = dataset.placeholderText || '';

  if (!key) {
    return;
  }

  this.setData({
    [`inputPlaceholders.${key}`]: text
  });
}

module.exports = {
  clearInputPlaceholder,
  restoreInputPlaceholder
};
