const { LOW_QUALITY_STATES } = require('../../data/states');
const { ESCAPED_ACTIONS } = require('../../data/escaped-actions');
const { TIRED_OPTIONS } = require('../../data/tired-options');
const {
  getStoredFlowStats,
  getStoredCourageList,
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

function getCount(source, key) {
  return source[key] || 0;
}

function countText(count) {
  return count > 0 ? `${count} 次` : '还没有';
}

function detail(label, value, isWide = false) {
  return {
    label,
    value,
    isWide
  };
}

function sortByCount(items) {
  return items.slice().sort((left, right) => right.count - left.count);
}

function getTopItem(items) {
  const rankedItems = sortByCount(items).filter((item) => item.count > 0);
  const topItem = rankedItems[0];
  return topItem || null;
}

function getStartDetails(flowStats, stateClicks) {
  const entryCount = getCount(stateClicks, 'drag-start');
  const attemptCount = getCount(flowStats, 'drag-start.check.yes')
    + getCount(flowStats, 'drag-start.check.retry.yes');
  const completedCount = getCount(flowStats, 'drag-start.completed');

  return [
    detail('慢下半拍', countText(entryCount)),
    detail('尝试启动', countText(attemptCount)),
    detail('启动成功', countText(completedCount))
  ];
}

function getCourageDetails(courageItems) {
  const latestCourage = courageItems[0] ? courageItems[0].title : '还没有';
  const earliestCourage = courageItems.length > 0
    ? courageItems[courageItems.length - 1].title
    : '还没有';

  return [
    detail('写下难题', courageItems.length > 0 ? `${courageItems.length} 条` : '还没有'),
    detail('最近一条', latestCourage, true),
    detail('最早一条', earliestCourage, true)
  ];
}

function getEscapedActionStats(flowStats) {
  return ESCAPED_ACTIONS.map((action) => ({
    id: action.id,
    emoji: action.emoji,
    label: action.label,
    count: getCount(flowStats, `escaped.${action.id}`)
  }));
}

function getEscapedDetails(escapedActionStats) {
  const totalActionCount = escapedActionStats.reduce((sum, action) => sum + action.count, 0);
  const rankedActions = sortByCount(escapedActionStats).filter((action) => action.count > 0);
  const topAction = rankedActions[0];
  const secondAction = rankedActions[1];

  return [
    detail('回到现实', countText(totalActionCount)),
    detail('最常动作', topAction ? `${topAction.emoji} · ${topAction.count} 次` : '还没有'),
    detail('其次动作', secondAction ? `${secondAction.emoji} · ${secondAction.count} 次` : '还没有')
  ];
}

function getFeedbackDetails(flowStats) {
  return [
    detail('等 23 秒', countText(getCount(flowStats, 'escape.waited-23-seconds'))),
    detail('回到主轴', countText(getCount(flowStats, 'escape.returned-focus'))),
    detail('看五分钟', countText(getCount(flowStats, 'escape.checked-feedback')))
  ];
}

function getTiredOptionStats(tiredOptionClicks) {
  return TIRED_OPTIONS.map((option) => ({
    id: option.id,
    emoji: option.emoji,
    label: option.label,
    count: tiredOptionClicks[option.id] || 0
  }));
}

function getEmotionDetails(tiredOptionStats, flowStats) {
  const totalCareCount = tiredOptionStats.reduce((sum, option) => sum + option.count, 0);
  const rankedOptions = sortByCount(tiredOptionStats).filter((option) => option.count > 0);
  const topOption = rankedOptions[0];

  return [
    detail('照顾自己', countText(totalCareCount)),
    detail('最常方式', topOption ? `${topOption.emoji} · ${topOption.count} 次` : '还没有'),
    detail('集气次数', countText(getCount(flowStats, 'tired-care.reassurance')))
  ];
}

function getStimulationDetails(stateClicks) {
  return [
    detail('暗格状态', '开发中'),
    detail('打开次数', countText(stateClicks.stimulation || 0)),
    detail('提出需求', '「中熊猫」公众号')
  ];
}

function getStateDetails(stateId, context) {
  switch (stateId) {
    case 'drag-start':
      return getStartDetails(context.flowStats, context.stateClicks);
    case 'empty-dreaming':
      return getCourageDetails(context.courageItems);
    case 'escaped':
      return getEscapedDetails(context.escapedActionStats);
    case 'escape':
      return getFeedbackDetails(context.flowStats);
    case 'emotion-amplitude':
      return getEmotionDetails(context.tiredOptionStats, context.flowStats);
    case 'stimulation':
      return getStimulationDetails(context.stateClicks);
    default:
      return [];
  }
}

function getStrongestState(summaries) {
  return summaries.reduce((strongest, state) => {
    if (!strongest || state.count > strongest.count) {
      return state;
    }

    return strongest;
  }, null);
}

function buildStateSummaries() {
  const stateClicks = getStoredStateClicks();
  const flowStats = getStoredFlowStats();
  const tiredOptionClicks = getStoredTiredOptionClicks();
  const context = {
    courageItems: getStoredCourageList(),
    escapedActionStats: getEscapedActionStats(flowStats),
    flowStats,
    stateClicks,
    tiredOptionStats: getTiredOptionStats(tiredOptionClicks)
  };

  const summaries = LOW_QUALITY_STATES.map((state) => ({
    id: state.id,
    emoji: state.emoji,
    name: state.name,
    shortLabel: state.shortLabel,
    count: stateClicks[state.id] || 0,
    countLabel: countText(stateClicks[state.id] || 0),
    details: getStateDetails(state.id, context)
  }));
  const totalClicks = LOW_QUALITY_STATES.reduce((sum, state) => sum + (stateClicks[state.id] || 0), 0);
  const strongestState = getStrongestState(summaries);
  const topTiredOption = getTopItem(context.tiredOptionStats);

  return {
    totalClicks,
    strongestText: strongestState && strongestState.count > 0
      ? `${strongestState.emoji} · ${strongestState.count} 次`
      : '等第一条记录',
    tiredText: topTiredOption
      ? `${topTiredOption.emoji} · ${topTiredOption.count} 次`
      : '还没有照顾记录',
    summaryRows: chunkItems(summaries),
  };
}

Page({
  data: {
    totalClicks: 0,
    strongestText: '',
    tiredText: '',
    summaryRows: [],
  },

  onShow() {
    const stats = buildStateSummaries();

    this.setData({
      totalClicks: stats.totalClicks,
      strongestText: stats.strongestText,
      tiredText: stats.tiredText,
      summaryRows: stats.summaryRows,
    });
  }
});
