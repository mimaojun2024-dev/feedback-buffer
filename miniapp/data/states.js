const LOW_QUALITY_STATES = [
  {
    id: 'drag-start',
    emoji: '⏳',
    name: '启动真困难',
    shortLabel: '启动困难',
    description: '先只压到第一步',
    route: '/pages/drag-start-check/index',
    cta: '问 2 分钟'
  },
  {
    id: 'escape',
    emoji: '📥',
    name: '我想看反馈',
    shortLabel: '反馈依赖',
    description: '先缓 23 秒再看',
    route: '/pages/escape/index',
    cta: '先缓一下'
  },
  {
    id: 'empty-dreaming',
    emoji: '🔥',
    name: '我需要勇气',
    shortLabel: '需要勇气',
    description: '去碰一次难开的口',
    route: '/pages/courage/index',
    cta: '先鼓起'
  },
  {
    id: 'escaped',
    emoji: '🫣',
    name: '我正在逃避',
    shortLabel: '重新接管',
    description: '先把自己拉回来',
    route: '/pages/escaped/index',
    cta: '先拉回'
  },
  {
    id: 'emotion-amplitude',
    emoji: '🌧️',
    name: '我有点 down',
    shortLabel: '情绪振幅',
    description: '先稳住，不下坠',
    route: '/pages/emotion-amplitude/index',
    cta: '先稳住'
  },
  {
    id: 'stimulation',
    emoji: '🗝️',
    name: '暗格开发中',
    shortLabel: '暗格',
    description: '这格先锁着',
    route: '',
    cta: '晚点打开'
  }
];

function getStateById(id) {
  for (let index = 0; index < LOW_QUALITY_STATES.length; index += 1) {
    if (LOW_QUALITY_STATES[index].id === id) {
      return LOW_QUALITY_STATES[index];
    }
  }

  return null;
}

module.exports = {
  LOW_QUALITY_STATES,
  getStateById
};
