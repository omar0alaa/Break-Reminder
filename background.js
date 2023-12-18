chrome.runtime.onInstalled.addListener(function () {
  chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.create({ 'url': chrome.extension.getURL('popup.html'), 'selected': true });
  });

  // Move the interval setup to the background script
  let intervalId;

  function startReminders(breakInterval) {
    intervalId = setInterval(() => {
      showNotification('Take a break!', 'It\'s time to relax for a moment.');
    }, breakInterval);
  }

  function stopReminders() {
    clearInterval(intervalId);
  }

  function showNotification(title, message) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'images/Icon-44.png',
      title: title,
      message: message
    });
  }

  // Message listener to start/stop reminders
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'startReminders') {
      startReminders(request.breakInterval);
    } else if (request.action === 'stopReminders') {
      stopReminders();
    }
  });
});
