chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(
    "sender:" +
      JSON.stringify(sender) +
      ", message:" +
      JSON.stringify(message) +
      "sendResponse:" +
      JSON.stringify(sendResponse)
  );

  if (message.name === "download" && message.url) {
    chrome.downloads.download(
      {
        filename: "screenshot.png",
        url: message.url,
      },
      (downloadId) => {
        sendResponse({ success: true });
      }
    );
  }

  return true;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(
    "sender:" +
      JSON.stringify(sender) +
      ", message:" +
      JSON.stringify(message) +
      "sendResponse:" +
      JSON.stringify(sendResponse)
  );
  
  const { targetTabId, consumerTabId } = request;
  if (message.name === "capture" && message.tabId) {
    chrome.tabCapture.capture({}, function (mediaStream) {
      console.log("mediaStream:" + JSON.stringify(mediaStream));
      let track, canvas;
      navigator.mediaDevices
        .getUserMedia({
          video: {
            mandatory: {
              chromeMediaSource: "desktop",
              chromeMediaSourceId: streamId,
            },
          },
        })
        .then((stream) => {
          track = stream.getVideoTracks()[0];
          const imageCapture = new ImageCapture(track);
          return imageCapture.grabFrame();
        })
        .then((bitmap) => {
          track.stop();
          canvas = document.createElement("canvas");
          canvas.width = bitmap.width;
          canvas.height = bitmap.height;
          let context = canvas.getContext("2d");
          context.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height);
          return canvas.toDataURL();
        })
        .then((url) => {
          console.log("url: " + url);
          chrome.runtime.sendMessage(
            { name: "download", url: url },
            function (response) {
              console.log("response:" + JSON.stringify(response));
              if (response.success) {
                alert("Screenshot saved");
              } else {
                alert("Could not save screenshot");
              }
              canvas.remove();
              sendResponse({ success: true });
            }
          );
        })
        .catch((err) => {
          alert("Could not take screenshot, err:", +err);
          sendResponse({ success: false, message: err });
        });
    });
  }
});