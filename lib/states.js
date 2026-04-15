export const LOW_QUALITY_STATES = [
  {
    id: 'escape',
    name: '我想去看反馈',
    shortLabel: '反馈依赖',
    description: '先别看回复，先过 20 秒。',
    href: '/escape/why',
    cta: '先选是哪一种'
  },
  {
    id: 'drag-start',
    name: '我不想启动',
    shortLabel: '不想启动',
    description: '不问宏大目标，只压缩到第一步。',
    href: '/drag-start/check',
    cta: '先问 2 分钟'
  },
  {
    id: 'escaped',
    name: '我逃开了',
    shortLabel: '重新接管',
    description: '我重新接管自己。',
    href: '/escaped',
    cta: '先拉回来'
  },
  {
    id: 'emotion-amplitude',
    name: '我的情绪在起伏',
    shortLabel: '情绪振幅',
    description: '我会跟着外部起起落落。',
    href: '/state/emotion-amplitude',
    cta: '先收一收'
  },
  {
    id: 'empty-dreaming',
    name: '空想落地',
    shortLabel: '空想落地',
    description: '想了很多，但还没落到地上。',
    href: '/state/empty-dreaming',
    cta: '先落一小步'
  },
  {
    id: 'tired',
    name: '我只是累了',
    shortLabel: '能量见底',
    description: '不是做不到，是电量见底了。',
    href: '/tired',
    cta: '选恢复动作'
  }
];

export function getStateById(id) {
  return LOW_QUALITY_STATES.find((state) => state.id === id) || null;
}
