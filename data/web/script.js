const toggleBtn = document.getElementById('toggleBtn');
const flashBtn = document.getElementById('flashBtn');
const ledState = document.getElementById('ledState');
const delayInput = document.getElementById('delayInput');

const pinBtns = [
  { id: 'pin21Btn', endpoint: 'toggle21', state: false },
  { id: 'pin22Btn', endpoint: 'toggle22', state: false },
  { id: 'pin19Btn', endpoint: 'toggle19', state: false },
  { id: 'pin23Btn', endpoint: 'toggle23', state: false }
];

let flashing = false;
let flashInterval = null;

function updateIndicator(state) {
  ledState.textContent = state ? 'ON' : 'OFF';
  ledState.className = 'indicator ' + (state ? 'on' : 'off');
}

function sendRequest(path, value) {
  const url = value !== undefined ? `/${path}?value=${value}` : `/${path}`;
  fetch(url)
    .then(res => res.json())
    .then(data => updateIndicator(data.led))
    .catch(() => {});
}

toggleBtn.onclick = () => {
  flashing = false;
  clearInterval(flashInterval);
  sendRequest('toggle');
};

flashBtn.onclick = () => {
  const delay = parseInt(delayInput.value) || 500;
  flashing = true;
  clearInterval(flashInterval);
  sendRequest('flash', delay);
  flashInterval = setInterval(() => {
    sendRequest('flash', delay);
  }, delay * 2);
};

// Pin buttons
pinBtns.forEach((pin, idx) => {
  const btn = document.getElementById(pin.id);
  btn.onclick = () => {
    fetch(`/${pin.endpoint}`)
      .then(res => res.json())
      .then(data => {
        pin.state = data.state;
        btn.className = 'pin-btn ' + (data.state ? 'on' : 'off');
        btn.textContent = `D${[21,22,19,23][idx]}: ${data.state ? 'ON' : 'OFF'}`;
      })
      .catch(console.error);
  };
});

// Hold button functionality
const holdBtn = document.getElementById('holdBtn');

holdBtn.addEventListener('mousedown', () => {
  fetch('/hold?state=true')
    .then(res => res.json())
    .then(data => updateIndicator(data.led));
});

holdBtn.addEventListener('mouseup', () => {
  fetch('/hold?state=false')
    .then(res => res.json())
    .then(data => updateIndicator(data.led));
});

// Also handle touch events for mobile devices
holdBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  fetch('/hold?state=true')
    .then(res => res.json())
    .then(data => updateIndicator(data.led));
});

holdBtn.addEventListener('touchend', (e) => {
  e.preventDefault();
  fetch('/hold?state=false')
    .then(res => res.json())
    .then(data => updateIndicator(data.led));
});

// Poll LED state every second
setInterval(() => {
  if (!flashing) fetch('/state').then(res => res.json()).then(data => updateIndicator(data.led));
}, 1000);
