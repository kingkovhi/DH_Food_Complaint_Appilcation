// ============================================================
// pwa.js – Progressive Web App setup for Campus Food Voice
// ============================================================

// ---------- 1. REGISTER SERVICE WORKER ----------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('✅ Service Worker registered successfully!');
        console.log('Scope:', registration.scope);
      })
      .catch(error => {
        console.error('❌ Service Worker registration failed:', error);
      });
  });
}

// ---------- 2. INSTALL PROMPT ----------
let installPromptEvent = null;
let installButton = null;

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  installPromptEvent = event;
  createInstallButton();
});

function createInstallButton() {
  // Check if button already exists
  if (document.getElementById('installAppBtn')) {
    document.getElementById('installAppBtn').style.display = 'inline-block';
    return;
  }
  
  installButton = document.createElement('button');
  installButton.id = 'installAppBtn';
  installButton.className = 'install-btn';
  installButton.innerHTML = '<i class="fas fa-download"></i> Install App';
  installButton.style.cssText = `
    display: none;
    background: #BED7E8;
    border: none;
    padding: 0.4rem 1rem;
    border-radius: 2rem;
    font-weight: 600;
    cursor: pointer;
    color: #1A4A5F;
    font-size: 0.85rem;
    transition: 0.2s;
  `;
  
  installButton.addEventListener('mouseenter', () => {
    installButton.style.background = '#A8C9DF';
  });
  installButton.addEventListener('mouseleave', () => {
    installButton.style.background = '#BED7E8';
  });
  
  // Append to top bar
  const topBar = document.querySelector('.top-bar > div:last-child') || document.querySelector('.top-bar');
  if (topBar) {
    topBar.appendChild(installButton);
  } else {
    document.body.appendChild(installButton);
  }
  
  installButton.style.display = 'inline-block';
  installButton.addEventListener('click', handleInstallClick);
}

async function handleInstallClick() {
  if (!installPromptEvent) {
    console.log('No install prompt available.');
    return;
  }
  installPromptEvent.prompt();
  const choiceResult = await installPromptEvent.userChoice;
  if (choiceResult.outcome === 'accepted') {
    console.log('✅ User accepted install');
    document.getElementById('installAppBtn').style.display = 'none';
  } else {
    console.log('❌ User dismissed install');
  }
  installPromptEvent = null;
}

window.addEventListener('appinstalled', () => {
  console.log('✅ App installed successfully!');
  const btn = document.getElementById('installAppBtn');
  if (btn) btn.style.display = 'none';
});

function isInStandaloneMode() {
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.navigator.standalone === true;
}

if (isInStandaloneMode()) {
  console.log('📱 App running in standalone mode');
} else {
  console.log('🌐 App running in browser mode');
}