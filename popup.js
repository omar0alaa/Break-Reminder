document.getElementById('startBtn').addEventListener('click', startReminders);
document.getElementById('stopBtn').addEventListener('click', stopReminders);

// Load user settings on popup open
chrome.storage.sync.get(['breakInterval'], function(result) {
  console.log('Retrieved breakInterval:', result.breakInterval);
  const savedInterval = result.breakInterval || 30; // Default to 30 minutes
  document.getElementById('intervalInput').value = savedInterval;
});

function startReminders() {
  const breakInterval = parseInt(document.getElementById('intervalInput').value, 10) * 60 * 1000;
  console.log('Starting reminders with breakInterval:', breakInterval);

  // Save user setting
  chrome.storage.sync.set({ 'breakInterval': breakInterval });

  intervalId = setInterval(() => {
    showNotification('Take a break!', 'It\'s time to relax for a moment.');
  }, breakInterval);
}

function stopReminders() {
  clearInterval(intervalId);
  console.log('Reminders stopped.');
}

function showNotification(title, message) {
  console.log('Showing notification:', title, message);
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'images/Icon-44.png',
    title: title,
    message: message
  });
}
