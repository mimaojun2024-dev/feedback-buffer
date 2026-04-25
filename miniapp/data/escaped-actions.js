const ESCAPED_ACTIONS = [
  {
    id: 'stand-up',
    label: '站起来',
    hint: '换个姿势'
  },
  {
    id: 'drink-water',
    label: '喝一口水',
    hint: '打断滑走'
  },
  {
    id: 'back-to-desktop',
    label: '回到桌面',
    hint: '回到界面'
  },
  {
    id: 'write-next-step',
    label: '写下一步',
    hint: '只写动作'
  },
  {
    id: 'close-tabs',
    label: '收起窗口',
    hint: '关掉入口'
  },
  {
    id: 'two-minute-touch',
    label: '碰两分钟',
    hint: '先碰事情'
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
