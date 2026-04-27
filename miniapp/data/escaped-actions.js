const ESCAPED_ACTIONS = [
  {
    id: 'walk-to-door',
    emoji: '👣',
    label: '走到门口再走回来',
    prompt: '那就先走到门口再走回来'
  },
  {
    id: 'turn-phone-down',
    emoji: '📵',
    label: '把手机扣在桌上',
    prompt: '那就先把手机扣在桌上'
  },
  {
    id: 'spin-in-place',
    emoji: '🔄',
    label: '站起来原地转五圈',
    prompt: '那就先站起来原地转五圈'
  },
  {
    id: 'drink-water',
    emoji: '🥛',
    label: '倒杯水喝一口',
    prompt: '那就先倒杯水喝一口'
  },
  {
    id: 'wash-face',
    emoji: '🧼',
    label: '去洗把脸',
    prompt: '那就先去洗把脸'
  },
  {
    id: 'clear-desk',
    emoji: '🧹',
    label: '清理一下桌面',
    prompt: '那就先清理一下桌面'
  },
  {
    id: 'take-out-trash',
    emoji: '🗑️',
    label: '去倒一下垃圾',
    prompt: '那就先去倒一下垃圾'
  },
  {
    id: 'open-window',
    emoji: '🪟',
    label: '打开窗户看一眼',
    prompt: '那就先打开窗户看一眼'
  }
];

function chunkEscapedActions(actions) {
  const rows = [];

  for (let index = 0; index < actions.length; index += 2) {
    rows.push(actions.slice(index, index + 2));
  }

  return rows;
}

module.exports = {
  ESCAPED_ACTIONS,
  chunkEscapedActions
};
