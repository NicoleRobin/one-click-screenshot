chrome.contextMenus.onClicked.addListener(async (info) => {
  const screenShotUrl = await chrome.tabs.captureVisibleTab();
  console.log('screenShotUrl:' + screenShotUrl);
  chrome.downloads.download(
    {
      filename: "screenshot.png",
      url: screenShotUrl,
    },
    (downloadId) => {
      // chrome.downloads.open(downloadId);
    }
  );
});

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    title: "一键截图",
    id: "root",
  });
});