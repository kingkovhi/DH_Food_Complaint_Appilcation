// ============================================================
// pwa.js – Progressive Web App setup for Campus Food Voice
// Handles service worker registration + install prompt
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

// ---------- 2. INSTALL PROMPT (custom install button) ----------
let deferredPrompt = null;
let installButton = null;

// Listen for the beforeinstallprompt event (Chrome/Edge)
window.addEventListener('beforeinstallprompt', (event) => {
  // Prevent the default mini-infobar from appearing on mobile
  event.preventDefault();
  
  // Stash the event so it can be triggered later
  deferredPrompt = event;
  
  // Create or show the install button
  createInstallButton();
});

// Create the install button dynamically if it doesn't exist
function createInstallButton() {
  // Check if button already exists
  if (document.getElementById('installAppBtn')) {
    document.getElementById('installAppBtn').style.display = 'inline-block';
    return;
  }
  
  // Create the button
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
  
  // Add hover effect
  installButton.addEventListener('mouseenter', () => {
    installButton.style.background = '#A8C9DF';
  });
  installButton.addEventListener('mouseleave', () => {
    installButton.style.background = '#BED7E8';
  });
  
  // Find a suitable place to insert the button
  // Option 1: Append to the top bar (right side)
  const topBar = document.querySelector('.top-bar > div:last-child') || document.querySelector('.top-bar');
  if (topBar) {
    topBar.appendChild(installButton);
  } else {
    // Fallback: append to body
    document.body.appendChild(installButton);
  }
  
  // Show the button
  installButton.style.display = 'inline-block';
  
  // Attach click handler
  installButton.addEventListener('click', handleInstallClick);
}

// Handle install button click
async function handleInstallClick() {
  if (!deferredPrompt) {
    console.log('No install prompt available. Try opening in Chrome or Edge.');
    return;
  }
  
  // Show the install prompt
  deferredPrompt.prompt();
  
  // Wait for the user's response
  const choiceResult = await deferredPrompt.userChoice;
  
  if (choiceResult.outcome === 'accepted') {
    console.log('✅ User accepted the install prompt');
    // Hide the button after successful installation
    const btn = document.getElementById('installAppBtn');
    if (btn) btn.style.display = 'none';
  } else {
    console.log('❌ User dismissed the install prompt');
  }
  
  // Clear the deferred prompt (it can only be used once)
  deferredPrompt = null;
}

// ---------- 3. APP INSTALLED EVENT ----------
window.addEventListener('appinstalled', () => {
  console.log('✅ App installed successfully!');
  // Hide the install button if it exists
  const btn = document.getElementById('installAppBtn');
  if (btn) btn.style.display = 'none';
  
  // Optional: Show a thank you message
  // You could show a toast or alert here
});

// ---------- 4. DETECT STANDALONE MODE (launched from home screen) ----------
// This helps identify if the user is using the installed app
function isInStandaloneMode() {
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.navigator.standalone === true;
}

// Log if the app is running in standalone mode
if (isInStandaloneMode()) {
  console.log('📱 App is running in standalone mode (launched from home screen)');
} else {
  console.log('🌐 App is running in browser mode');
}