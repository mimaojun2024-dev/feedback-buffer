const SHARE_TITLE = '稳稳接住自己';
const SHARE_PATH = '/pages/home/index';
const SHARE_TIMELINE_TITLE = '慢半拍，就是自由开始出现的地方';

function createShareAppMessage() {
  return {
    title: SHARE_TITLE,
    path: SHARE_PATH
  };
}

function createShareTimeline() {
  return {
    title: SHARE_TIMELINE_TITLE,
    query: ''
  };
}

function enableNativeShareMenu() {
  if (typeof wx === 'undefined' || !wx.showShareMenu) {
    return;
  }

  wx.showShareMenu({
    menus: ['shareAppMessage', 'shareTimeline']
  });
}

module.exports = {
  createShareAppMessage,
  createShareTimeline,
  enableNativeShareMenu
};
