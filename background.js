chrome.action.onClicked.addListener(function (tab) {
  chrome.desktopCapture.chooseDesktopMedia([
    "screen",
    "window",
    "tab"
    ], tab, (streamId) => {
        //check whether the user canceled the request or not
        if (streamId && streamId.length) {
            setTimeout(() => {
                chrome.tabs.sendMessage(tab.id, {name: "stream", streamId}, (response) => console.log(response))
            }, 200)
        }
    });
});
