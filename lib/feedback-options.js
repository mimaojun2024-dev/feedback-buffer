export const FEEDBACK_OPTIONS = [
  {
    id: 'reply',
    label: '有没有人回复我',
    hint: '我想先确认外面有没有动静。'
  },
  {
    id: 'meaning',
    label: '我做的事有没有意义',
    hint: '我想从外面找一点确定感。'
  },
  {
    id: 'panic',
    label: '我只是有点慌，想看点东西',
    hint: '我并不是真的要反馈，只是想缓一下。'
  }
];

export function getFeedbackOptionById(id) {
  return FEEDBACK_OPTIONS.find((option) => option.id === id) || null;
}
