/***********************************************************************
* Name: Ryan Mack
* Date: 12/5/2017
* Description: A file that contains the code for a pomodoro clock
***********************************************************************/

// stores a reference to setInterval. Initialized in the function 'timer'
let countdown;
let isTimerRunning = false;
let isBreak = false;

// DOM elements
const time     = document.querySelector('.time');
const controls = document.querySelector('.controls');
const sessionLength = document.querySelector('.session-length');
const breakLength = document.querySelector('.break-length');

/***********************************************************************
* timer function -- sets and resets the a timer saved to the variable
* countdown.
***********************************************************************/
function timer(seconds) {
  // clear any existing timer
  clearInterval(countdown);

  // get the time at which the timer will stop
  const now = Date.now();
  const then = now + (seconds * 1000);
  displayTimeLeft(Math.round((then - Date.now()) / 1000));

  countdown = setInterval(() => {
    timeLeft = Math.round((then - Date.now()) / 1000);

    if (timeLeft < 0) {
      clearInterval(countdown);
      isBreak = !isBreak;
      isTimerRunning = false;
      alert("Time's up! " + (isBreak ? "Take a break! You deserve it!" : "Break's over! Get ready for another session!"));
      time.innerText = (isBreak ? breakLength.innerText : sessionLength.innerText);
      document.title = "Pomodoro Clock"
      return;
    }
    displayTimeLeft(timeLeft);
  }, 1000);
}

// resets the timer in its entirety
function reset(e) {
  e.preventDefault();
  clearInterval(countdown);
  isTimerRunning = false;
  isBreak = false;

  document.title = 'Pomodoro Clock';
  sessionLength.innerText = '25:00';
  breakLength.innerText = '5:00';
  time.innerText = '25:00';
}


/***********************************************************************
* View functions
***********************************************************************/
// takes in a parameter in seconds and formats it in a human friendly way
function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60);
  seconds %= 60;
  const timeLeft = padTime(minutes, seconds);
  time.innerText = timeLeft;
  document.title = timeLeft;
}

// pads time so it is consistent and readable. Instead of '5:3'
// (5 minutes and 3 seconds), it returns a string '05:03'
function padTime(minutes, seconds) {
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

// gets called when user wants to modify break or session length
// takes in the DOM element and a boolean indicating whether user wants to add or sub time
// only affects the timer IF the timer is NOT running
function adjustTime(element, isIncrementing) {
  // get the length of time and modify it
  let length = element.innerText.split(':');
  length[0] = parseInt(length[0]);

  // don't allow user to make session/break length < 0
  if (length[0] === 0 && !isIncrementing) {
    return;
  }
  else {
     length[0] += (isIncrementing ? 1 : -1);
  }

  // join the time and update the view
  length = length.join(":");
  element.innerText = length;

  // if the timer isn't running change the timer's time
  // else the timer will not be affected
  if (!isTimerRunning) {
    if (isBreak && element === breakLength) {
      time.innerText = length;
    }
    else if (!isBreak && element === sessionLength){
      time.innerText = length;
    }
  }
}

/***********************************************************************
* Controller funtions
***********************************************************************/
function handleEvent(e) {
  // there is a keydown event listener. Ignore all keys except for space bar
  if (e.keyCode && e.keyCode !== 32) {
    return;
  }
  // clear the interval if the timer is running
  else if (isTimerRunning) {
    clearInterval(countdown);
  }
  else {
    // get the time remaining, in seconds and pass it to the timer function to start it
    let seconds = time.innerText.trim().split(':')
         .reduce((a, b, i) => a += (i === 0) ? parseInt(b, 10) * 60 : parseInt(b, 10), 0);
    timer(seconds);
  }
  // update flag
  isTimerRunning = !isTimerRunning;
}


// updates the break/session length.
// If true is passed to adjustTime user is incrementing, else user is decrementing
function handleControls(e) {
  const classList = e.target.classList.value;

  if (classList.includes('break-plus')) {
    adjustTime(breakLength, true);
  }
  else if (classList.includes('break-minus')) {
    adjustTime(breakLength, false);
  }
  else if (classList.includes('session-plus')) {
    adjustTime(sessionLength, true);
  }
  else if (classList.includes('session-minus')) {
    adjustTime(sessionLength, false);
  }
}

/***********************************************************************
* Event Listeners
***********************************************************************/
window.addEventListener('keydown', handleEvent);
time.addEventListener('click', handleEvent);
controls.addEventListener('click', handleControls);
document.querySelector('.reset').addEventListener('click', reset);
