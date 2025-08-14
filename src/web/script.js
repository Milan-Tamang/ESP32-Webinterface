
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

function sendRequest(path, value, cb) {
  fetch(`/${path}${value !== undefined ? `?value=${value}` : ''}`)
    .then(res => res.json())
    .then(data => cb && cb(data))
    .catch(() => {});
}

toggleBtn.onclick = () => {
  flashing = false;
  clearInterval(flashInterval);
  sendRequest('toggle', '', data => updateIndicator(data.led));
};

flashBtn.onclick = () => {
  const delay = parseInt(delayInput.value) || 500;
  flashing = true;
  clearInterval(flashInterval);
  sendRequest('flash', delay, data => updateIndicator(data.led));
  flashInterval = setInterval(() => {
    sendRequest('flash', delay, data => updateIndicator(data.led));
  }, delay * 2);
};

// Pin buttons
pinBtns.forEach((pin, idx) => {
  const btn = document.getElementById(pin.id);
  btn.onclick = () => {
    sendRequest(pin.endpoint, '', data => {
      pin.state = data.state;
      btn.className = 'pin-btn ' + (pin.state ? 'on' : 'off');
      btn.textContent = `D${[21,22,19,23][idx]}: ${pin.state ? 'ON' : 'OFF'}`;
    });
  };
});

// Poll LED state every second
setInterval(() => {
  if (!flashing) fetch('/state').then(res => res.json()).then(data => updateIndicator(data.led));
}, 1000);
