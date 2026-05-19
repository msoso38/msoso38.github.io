const config = {
  statusUrl: 'https://marceaub.lat/status',
  grafanaUrl: 'https://grafana.marceaub.lat/api/health',
  refreshMs: 20000,
  galleryItems: [
    {
      title: 'Server room view',
      description: 'Replace this with any photo URL you want displayed in the gallery.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Home lab snapshot',
      description: 'Add multiple photos easily by editing this list.',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    },
  ],
  linkItems: [
    {
      title: 'Grafana',
      description: 'Open your Grafana dashboard.',
      url: 'https://grafana.marceaub.lat',
    },
    {
      title: 'PufferPanel',
      description: 'Manage game servers and services.',
      url: 'https://pufferpanel.marceaub.lat',
    },
    {
      title: 'Main site',
      description: 'Return to the public domain.',
      url: 'https://www.marceaub.lat',
    },
  ],
};

const serverStatusElement = document.getElementById('server-status');
const statusDetailElement = document.getElementById('status-detail');
const grafanaStatusElement = document.getElementById('grafana-status');
const grafanaDetailElement = document.getElementById('grafana-detail');
const galleryGrid = document.getElementById('gallery-grid');
const linkGrid = document.getElementById('link-grid');

function createGalleryCard(item) {
  const card = document.createElement('article');
  card.className = 'gallery-card';

  const img = document.createElement('img');
  img.className = 'thumb';
  img.src = item.image;
  img.alt = item.title;
  img.loading = 'lazy';

  const meta = document.createElement('div');
  meta.className = 'meta';

  const title = document.createElement('h3');
  title.textContent = item.title;

  const desc = document.createElement('p');
  desc.textContent = item.description;

  meta.append(title, desc);
  card.append(img, meta);
  return card;
}

function createLinkCard(item) {
  const card = document.createElement('article');
  card.className = 'link-card';

  const anchor = document.createElement('a');
  anchor.href = item.url;
  anchor.target = '_blank';
  anchor.rel = 'noopener';

  const meta = document.createElement('div');
  meta.className = 'meta';

  const title = document.createElement('h3');
  title.textContent = item.title;

  const desc = document.createElement('p');
  desc.textContent = item.description;

  const action = document.createElement('div');
  action.className = 'link-action';
  action.textContent = 'Open';

  meta.append(title, desc, action);
  anchor.append(meta);
  card.append(anchor);
  return card;
}

function renderGallery() {
  galleryGrid.innerHTML = '';
  config.galleryItems.forEach(item => {
    galleryGrid.appendChild(createGalleryCard(item));
  });
}

function renderLinks() {
  linkGrid.innerHTML = '';
  config.linkItems.forEach(item => {
    linkGrid.appendChild(createLinkCard(item));
  });
}

function normalizeStatusText(value) {
  if (!value) return 'unknown';
  return String(value).trim().toLowerCase();
}

async function checkServerStatus() {
  serverStatusElement.textContent = 'Checking…';
  statusDetailElement.textContent = `Fetching ${config.statusUrl}`;

  try {
    const response = await fetch(config.statusUrl, { cache: 'no-store' });
    if (!response.ok) {
      serverStatusElement.textContent = 'Off';
      statusDetailElement.textContent = `Offline: ${response.status} ${response.statusText}`;
      return;
    }

    const payload = await response.json().catch(() => null);
    const statusValue = payload?.status ?? payload?.state ?? payload?.online ?? 'on';
    const normalized = normalizeStatusText(statusValue);
    const isOn = normalized === 'on' || normalized === 'up' || normalized === 'true';

    serverStatusElement.textContent = isOn ? 'On' : 'Off';
    statusDetailElement.textContent = isOn
      ? `Reachable at ${config.statusUrl}`
      : `Status returned ${String(statusValue)}`;
  } catch (error) {
    serverStatusElement.textContent = 'Off';
    statusDetailElement.textContent = `Error: ${error.message}`;
  }
}

async function checkGrafanaStatus() {
  grafanaStatusElement.textContent = 'Checking…';
  grafanaDetailElement.textContent = `Fetching ${config.grafanaUrl}`;

  try {
    const response = await fetch(config.grafanaUrl, { cache: 'no-store' });
    if (!response.ok) {
      grafanaStatusElement.textContent = 'Offline';
      grafanaDetailElement.textContent = `HTTP ${response.status}`;
      return;
    }

    const data = await response.json().catch(() => null);
    const message = data?.message ?? data?.status ?? 'OK';
    grafanaStatusElement.textContent = 'Online';
    grafanaDetailElement.textContent = String(message);
  } catch (error) {
    grafanaStatusElement.textContent = 'Offline';
    grafanaDetailElement.textContent = `Error: ${error.message}`;
  }
}

renderGallery();
renderLinks();
checkServerStatus();
checkGrafanaStatus();
setInterval(() => {
  checkServerStatus();
  checkGrafanaStatus();
}, config.refreshMs);

