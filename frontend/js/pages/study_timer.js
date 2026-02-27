// State
let mode = 'stopwatch'; // 'stopwatch' or 'study_timer'
let totalSeconds = 0;
let interval = null;
let isRunning = false;

const display = document.getElementById('timeDisplay');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const modeStopwatch = document.getElementById('modeStopwatch');
const modestudy_timer = document.getElementById('modestudy_timer');

// Formatting
function formatTime(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;

  if (mode === 'stopwatch') {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  } else {
    // study_timer typically just shows MM:SS
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
}

function updateDisplay() {
  display.innerText = formatTime(totalSeconds);
}

// Controls
function startTimer() {
  if (isRunning) return;
  isRunning = true;
  startBtn.innerText = "Pause";

  interval = setInterval(() => {
    if (mode === 'stopwatch') {
      totalSeconds++;
    } else {
      totalSeconds--;
      if (totalSeconds <= 0) {
        clearInterval(interval);
        isRunning = false;
        startBtn.innerText = "Start";
        alert("study_timer completed! Take a break.");
        totalSeconds = 25 * 60; // reset
      }
    }
    updateDisplay();
  }, 1000);
}

function pauseTimer() {
  clearInterval(interval);
  isRunning = false;
  startBtn.innerText = "Resume";
}

function stopTimer() {
  clearInterval(interval);
  isRunning = false;
  startBtn.innerText = "Start";
  totalSeconds = mode === 'study_timer' ? 25 * 60 : 0;
  updateDisplay();
}

// Event Listeners
startBtn.addEventListener('click', () => {
  if (isRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
});

stopBtn.addEventListener('click', stopTimer);

modeStopwatch.addEventListener('click', () => {
  stopTimer();
  mode = 'stopwatch';
  modeStopwatch.classList.add('active');
  modestudy_timer.classList.remove('active');
  totalSeconds = 0;
  updateDisplay();
});

modestudy_timer.addEventListener('click', () => {
  stopTimer();
  mode = 'study_timer';
  modestudy_timer.classList.add('active');
  modeStopwatch.classList.remove('active');
  totalSeconds = 25 * 60;
  updateDisplay();
});

// Init
updateDisplay();
