const config = {
  statusUrl: 'http://server.marceaub.lat/status',
  grafanaUrl: 'http://server.marceaub.lat:3000/api/health',
  refreshMs: 15000,
  galleryItems: [
    {
      title: 'Infrastructure',
      description: 'Overview of the IPv6 home server setup.',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Terminal View',
      description: 'The core of our operations.',
      image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80',
    },
  ],
  linkItems: [
    {
      title: 'Grafana',
      description: 'Metrics & Dashboards',
      url: 'http://server.marceaub.lat:3000',
    },
    {
      title: 'PufferPanel',
      description: 'Game Server Management',
      url: 'http://server.marceaub.lat:8080',
    },
    {
      title: 'Minecraft Server Domain',
      description: 'Get my server domain at play.marceaub.lat',
      url: 'play.marceaub.lat',
    },
    {
      title: 'Main Domain',
      description: 'Back to marceaub.lat',
      url: 'https://marceaub.lat',
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
  card.innerHTML = `
    <img class="thumb" src="${item.image}" alt="${item.title}" loading="lazy">
    <div class="meta">
      <h3>${item.title}</h3>
      <p>${item.description}</p>
    </div>
  `;
  return card;
}

function renderUI() {
  galleryGrid.innerHTML = '';
  config.galleryItems.forEach(item => {
    galleryGrid.appendChild(createGalleryCard(item));
  });

  linkGrid.innerHTML = '';
  config.linkItems.forEach(item => {
    const anchor = document.createElement('a');
    anchor.className = 'link-card';
    anchor.href = item.url;
    anchor.target = '_blank';
    anchor.rel = 'noopener';
    anchor.innerHTML = `
      <div class="meta">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      </div>
    `;
    linkGrid.appendChild(anchor);
  });
}

async function updateStatus() {
  // Server Status
  try {
    const res = await fetch(config.statusUrl, { mode: 'no-cors' });
    serverStatusElement.textContent = 'ONLINE';
    serverStatusElement.style.color = 'var(--teal)';
    statusDetailElement.textContent = 'Server is reachable at server.marceaub.lat';
  } catch (e) {
    serverStatusElement.textContent = 'OFFLINE';
    serverStatusElement.style.color = 'var(--red)';
    statusDetailElement.textContent = 'Connection timeout or server unreachable.';
  }

  // Grafana Health
  try {
    const res = await fetch(config.grafanaUrl);
    if (res.ok) {
      grafanaStatusElement.textContent = 'OK';
      grafanaStatusElement.style.color = 'var(--teal)';
    } else {
      grafanaStatusElement.textContent = 'ERR';
      grafanaStatusElement.style.color = 'var(--red)';
    }
  } catch (e) {
    grafanaStatusElement.textContent = 'DOWN';
    grafanaStatusElement.style.color = 'var(--red)';
  }
}

renderUI();
updateStatus();
setInterval(updateStatus, config.refreshMs);


