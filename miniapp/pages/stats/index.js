const { LOW_QUALITY_STATES } = require('../../data/states');
const { ESCAPED_ACTIONS } = require('../../data/escaped-actions');
const { TIRED_OPTIONS } = require('../../data/tired-options');
const {
  getStoredFlowStats,
  getStoredStateClicks,
  getStoredTiredOptionClicks
} = require('../../utils/storage');

function chunkItems(items) {
  const rows = [];

  for (let index = 0; index < items.length; index += 2) {
    rows.push(items.slice(index, index + 2));
  }

  return rows;
}

function buildStateSummaries() {
  const stateClicks = getStoredStateClicks();
  const flowStats = getStoredFlowStats();
  const tiredOptionClicks = getStoredTiredOptionClicks();

  const sortedTiredOptions = [...TIRED_OPTIONS]
    .map((option) => ({
      ...option,
      count: tiredOptionClicks[option.id] || 0
    }))
    .sort((left, right) => right.count - left.count);

  const escapedActions = ESCAPED_ACTIONS
    .map((action) => ({
      label: action.label,
      count: flowStats[`escaped.${action.id}`] || 0
    }))
    .sort((left, right) => right.count - left.count);

  const stateDetails = {
    'drag-start': [
      `已经开始 ${flowStats['drag-start.started'] || 0} 次`,
      `走完 2 分钟 ${flowStats['drag-start.completed'] || 0} 次`
    ],
    escape: [
      `还是去看 ${flowStats['escape.checked-feedback'] || 0} 次`,
      `先回去做 ${flowStats['escape.returned-focus'] || 0} 次`
    ],
    escaped: [
      escapedActions[0] && escapedActions[0].count > 0 ? `最常做 ${escapedActions[0].label} · ${escapedActions[0].count} 次` : '最常做 还没有',
      escapedActions[1] && escapedActions[1].count > 0 ? `其次 ${escapedActions[1].label} · ${escapedActions[1].count} 次` : '其次 还没有'
    ],
    'empty-dreaming': ['细分记录 还没接上', '流程状态 先留在这里'],
    'emotion-amplitude': ['细分记录 还没接上', '流程状态 先留在这里'],
    stimulation: ['细分记录 还没接上', '流程状态 先留在这里']
  };

  const summaries = LOW_QUALITY_STATES.map((state) => ({
    id: state.id,
    emoji: state.emoji,
    name: state.name,
    shortLabel: state.shortLabel,
    count: stateClicks[state.id] || 0,
    details: stateDetails[state.id] || []
  }));

  return {
    totalClicks: LOW_QUALITY_STATES.reduce((sum, state) => sum + (stateClicks[state.id] || 0), 0),
    summaryRows: chunkItems(summaries),
    tiredSummary: sortedTiredOptions[0] && sortedTiredOptions[0].count > 0
      ? `最常选 ${sortedTiredOptions[0].label} · ${sortedTiredOptions[0].count} 次`
      : '最常选 还没有'
  };
}

Page({
  data: {
    totalClicks: 0,
    summaryRows: [],
    tiredSummary: ''
  },

  onShow() {
    const stats = buildStateSummaries();

    this.setData({
      totalClicks: stats.totalClicks,
      summaryRows: stats.summaryRows,
      tiredSummary: stats.tiredSummary
    });
  }
});
