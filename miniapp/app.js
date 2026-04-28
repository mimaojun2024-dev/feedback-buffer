const {
  createShareAppMessage,
  createShareTimeline,
  enableNativeShareMenu
} = require('./utils/share');

const originalPage = Page;

// Add native WeChat share menu support to every page without touching page flows.
Page = function createShareEnabledPage(pageOptions) {
  const options = pageOptions || {};
  const originalOnShow = options.onShow;

  if (!options.onShareAppMessage) {
    options.onShareAppMessage = function onShareAppMessage() {
      return createShareAppMessage();
    };
  }

  if (!options.onShareTimeline) {
    options.onShareTimeline = function onShareTimeline() {
      return createShareTimeline();
    };
  }

  options.onShow = function onShowWithShareMenu() {
    enableNativeShareMenu();

    if (originalOnShow) {
      return originalOnShow.apply(this, arguments);
    }

    return undefined;
  };

  return originalPage(options);
};

App({});
