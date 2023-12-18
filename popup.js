let intervalId;

document.getElementById("startBtn").addEventListener("click", startReminders);
document.getElementById("stopBtn").addEventListener("click", stopReminders);

function startReminders() {
  intervalId = setInterval(() => {
    showNotification("Take a break!", "It's time to relax for a moment.");
  }, 30 * 60 * 1000); // Remind every 30 minutes
}

function stopReminders() {
  clearInterval(intervalId);
}

function showNotification(title, message) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "images/icon-44.png",
    title: title,
    message: message,
  });
}
