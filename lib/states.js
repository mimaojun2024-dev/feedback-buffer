export const LOW_QUALITY_STATES = [
  {
    id: 'drag-start',
    name: '我在拖启动',
    shortLabel: '启动阻力',
    description: '手还没真正落下去。',
    href: '/drag-start',
    cta: '写下这一步'
  },
  {
    id: 'escape',
    name: '我在想逃开',
    shortLabel: '逃开冲动',
    description: '我想先从这件事里撤开。',
    href: '/escape',
    cta: '先去命名'
  },
  {
    id: 'no-feedback',
    name: '我在等反馈',
    shortLabel: '等反馈',
    description: '没回音时，我会慢慢泄气。',
    href: '/state/no-feedback',
    cta: '先认出来'
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
