document.getElementById('startBtn').addEventListener('click', startReminders);
document.getElementById('stopBtn').addEventListener('click', stopReminders);

// Load user settings on popup open
chrome.storage.sync.get(['breakInterval'], function(result) {
  const savedInterval = result.breakInterval || 30; // Default to 30 minutes
  document.getElementById('intervalInput').value = savedInterval;
});

function startReminders() {
  const userInput = parseInt(document.getElementById('intervalInput').value, 10);
  const breakInterval = Math.max(userInput, 1) * 60 * 1000; // Enforce a minimum of 1 minute

  // Save user setting
  chrome.storage.sync.set({ 'breakInterval': breakInterval });

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
    iconUrl: 'images/icon48.png',
    title: title,
    message: message
  });
}
