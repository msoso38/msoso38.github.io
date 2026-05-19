const config = {
  statusUrl: 'https://marceaub.lat/status',
  refreshMs: 20000,
};

const statusLabel = document.getElementById('server-status');
const statusDetail = document.getElementById('status-detail');
const statusCard = document.querySelector('.status-card');

async function checkServerStatus() {
  statusLabel.textContent = 'Checking…';
  statusDetail.textContent = `Checking ${config.statusUrl}`;
  statusCard.dataset.state = 'loading';

  try {
    const response = await fetch(config.statusUrl, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-store',
    });

    if (!response.ok) {
      statusLabel.textContent = 'Off';
      statusCard.dataset.state = 'off';
      statusDetail.textContent = `HTTP ${response.status} ${response.statusText}`;
      return;
    }

    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    const isOn = data?.status
      ? String(data.status).toLowerCase().includes('on')
      : true;

    statusLabel.textContent = isOn ? 'On' : 'Off';
    statusCard.dataset.state = isOn ? 'on' : 'off';
    statusDetail.textContent = isOn
      ? `Reachable at ${config.statusUrl}`
      : `Server responded but status is not "on"`;
  } catch (error) {
    statusLabel.textContent = 'Off';
    statusCard.dataset.state = 'off';
    statusDetail.textContent = `Offline or blocked (${error.message})`;
  }
}

checkServerStatus();
setInterval(checkServerStatus, config.refreshMs);

