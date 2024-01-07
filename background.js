chrome.action.onClicked.addListener(function (tab) {
  console.log("tab.streamId:" + tab.streamId + ', tab.id:' + tab.id);
  chrome.tabs.sendMessage(
    tab.id,
    { name: "stream", streamId: tab.streamId },
    function (response) {
      console.log('response:' + JSON.stringify(response));
    }
  );
});
