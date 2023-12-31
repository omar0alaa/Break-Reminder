document.addEventListener('DOMContentLoaded', function () {
  const port = chrome.runtime.connect({ name: 'popup' });
  let lastKnownNextNotificationTime;
  let intervalId;

  // Load user settings on popup open
  chrome.storage.sync.get(['breakInterval'], function (result) {
    const savedInterval = result.breakInterval || 30 * 60 * 1000; // Default to 30 minutes
    document.getElementById('intervalInput').value = savedInterval;
  });

  document.getElementById('startBtn').addEventListener('click', startReminders);
  document.getElementById('stopBtn').addEventListener('click', stopReminders);

  function startReminders() {
    const userInput = parseInt(document.getElementById('intervalInput').value, 10);
    const breakInterval = Math.max(userInput, 1) * 60 * 1000; // Enforce a minimum of 1 minute

    // Save user setting
    chrome.storage.sync.set({ 'breakInterval': breakInterval });

    // Inform the background script to start reminders
    port.postMessage({ action: 'startReminders', breakInterval });

    // Request the next notification time and start the timer
    requestNextNotificationTime();
  }

  function stopReminders() {
    // Inform the background script to stop reminders
    port.postMessage({ action: 'stopReminders' });

    // Reset the timer display
    updateNextNotificationTimer(undefined);
  }

  function requestNextNotificationTime() {
    // Request the next notification time from the background script
    port.postMessage({ action: 'getNextNotificationTime' });
  }

  // Message listener to update the next notification time and start the timer
  port.onMessage.addListener(function (msg) {
    if (msg.action === 'updateNextNotificationTime') {
      lastKnownNextNotificationTime = msg.nextNotificationTime || lastKnownNextNotificationTime;
      updateNextNotificationTimer(lastKnownNextNotificationTime);
    }
  });

  // Add an event listener for the visibilitychange event to handle popup reopening
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) {
      // If the popup is visible, request the next notification time
      requestNextNotificationTime();
    }
  });

  // Update the timer every second to achieve real-time updates
  setInterval(requestNextNotificationTime, 200);

  function updateNextNotificationTimer(time) {
    const nextNotificationElement = document.getElementById('nextNotification');

    function formatTime(time) {
      const hours = Math.floor(time / (60 * 60 * 1000));
      const minutes = Math.floor((time % (60 * 60 * 1000)) / (60 * 1000));
      const seconds = Math.floor((time % (60 * 1000)) / 1000);

      return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    if (time) {
      const timeUntilNextNotification = time - Date.now();
      const formattedTime = formatTime(Math.max(timeUntilNextNotification, 0));
      nextNotificationElement.textContent = `Next notification in: ${formattedTime}`;
    } else {
      nextNotificationElement.textContent = '';
    }
  }
});
