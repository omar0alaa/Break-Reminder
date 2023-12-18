document.addEventListener('DOMContentLoaded', function () {
  // Load user settings on popup open
  chrome.storage.sync.get(['breakInterval'], function (result) {
    const savedInterval = result.breakInterval || 30 * 60 * 1000; // Default to 30 minutes
    // Convert milliseconds to minutes for display
    const savedIntervalMinutes = savedInterval / (60 * 1000);
    document.getElementById('intervalInput').value = savedIntervalMinutes;
  });

  document.getElementById('startBtn').addEventListener('click', startReminders);
  document.getElementById('stopBtn').addEventListener('click', stopReminders);

  function startReminders() {
    const userInput = parseInt(document.getElementById('intervalInput').value, 10);
    const breakInterval = Math.max(userInput, 1) ;//* 60 * 1000; // Enforce a minimum of 1 minute

    // Save user setting
    chrome.storage.sync.set({ 'breakInterval': breakInterval });

    // Inform the background script to start reminders
    chrome.runtime.sendMessage({ action: 'startReminders', breakInterval });
  }

  function stopReminders() {
    // Inform the background script to stop reminders
    chrome.runtime.sendMessage({ action: 'stopReminders' });
  }
});
