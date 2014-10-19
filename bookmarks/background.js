var bkg = chrome.extension.getBackgroundPage();
bkg.console.log('app installed');

chrome.browserAction.onClicked.addListener(function(activeTab){
  var newURL = "http://stackoverflow.com/";
  chrome.tabs.create({ url: newURL });
});

chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    if (sender.url == blacklistedWebsite)
      return;  // don't allow this web page access
    if (request.openUrlInEditor)
      openUrl(request.openUrlInEditor);
});

function registerCallback(registrationId) {
	console.log(registrationId)
  if (chrome.runtime.lastError) {
    // When the registration fails, handle the error and retry the
    // registration later.
    return;
  }

  // Send the registration ID to your application server.
  sendRegistrationId(function(succeed) {
    // Once the registration ID is received by your server,
    // set the flag such that register will not be invoked
    // next time when the app starts up.
    console.log(succeed)
    if (succeed)
      chrome.storage.local.set({registered: true});

  });
}

function sendRegistrationId(callback) {
  console.log(callback)
  // Send the registration ID to your application server
  // in a secure way.
}

function unregisterCallback() {
  if (chrome.runtime.lastError) {
  	console.log('error');
    // When the unregistration fails, handle the error and retry
    // the unregistration later.
    return;
  }
}

chrome.runtime.onStartup.addListener(function() {
	console.log('startup');
  chrome.storage.local.get("registered", function(result) {
    // If already registered, bail out.
    if (result["registered"])
      return;

    // Up to 100 senders are allowed.
    var senderIds = ["cionrocks"];
    chrome.gcm.register(senderIds, registerCallback);
  });
});

chrome.gcm.onMessage.addListener(function(message) {
  console.log('a message was received');
});

