chrome.runtime.onInstalled.addListener(function () {
  chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.create({ 'url': chrome.extension.getURL('popup.html'), 'selected': true });
  });

  let intervalId;
  let nextNotificationTime;

  function startReminders(breakInterval) {
    intervalId = setInterval(() => {
      showNotification('Take a break!', 'It\'s time to relax for a moment.');
      nextNotificationTime = Date.now() + breakInterval;
      updateNextNotificationTime(); // Notify popup about the next notification time
    }, breakInterval);
    nextNotificationTime = Date.now() + breakInterval;
    updateNextNotificationTime(); // Notify popup about the initial next notification time
  }

  function stopReminders() {
    clearInterval(intervalId);
    nextNotificationTime = undefined;
    updateNextNotificationTime(); // Notify popup that reminders are stopped
  }

  function showNotification(title, message) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'images/Icon-44.png',
      title: title,
      message: message
    });
  }

  function updateNextNotificationTime() {
    chrome.runtime.sendMessage({ action: 'updateNextNotificationTime', nextNotificationTime });
  }

  // Message listener to start/stop reminders and get next notification time
  chrome.runtime.onConnect.addListener(function (port) {
    port.onMessage.addListener(function (msg) {
      if (msg.action === 'startReminders') {
        startReminders(msg.breakInterval);
      } else if (msg.action === 'stopReminders') {
        stopReminders();
      } else if (msg.action === 'getNextNotificationTime') {
        port.postMessage({ action: 'updateNextNotificationTime', nextNotificationTime });
      }
    });
  });
});
