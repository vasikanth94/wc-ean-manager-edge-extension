// Service Worker pour gérer les événements en arrière-plan

// Installation de l'extension
chrome.runtime.onInstalled.addListener(() => {
  // Créer le menu contextuel
  chrome.contextMenus.create({
    id: 'check-ean-woocommerce',
    title: 'Vérifier "%s" dans WooCommerce',
    contexts: ['selection']
  });
  
  console.log('WC EAN Manager Extension installée');
});

// Gestion du clic sur le menu contextuel
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'check-ean-woocommerce') {
    const selectedText = info.selectionText.trim();
    
    // Envoyer le texte sélectionné au content script
    chrome.tabs.sendMessage(tab.id, {
      action: 'searchEAN',
      ean: selectedText
    });
  }
});

// Gestion des raccourcis clavier
chrome.commands.onCommand.addListener((command) => {
  if (command === 'open-scanner') {
    chrome.action.openPopup();
  } else if (command === 'quick-search') {
    chrome.action.openPopup();
  }
});

// Écouter les messages des autres scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'showNotification') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: request.title,
      message: request.message
    });
  }
  
  if (request.action === 'getSettings') {
    chrome.storage.sync.get(['apiUrl', 'apiUsername', 'apiPassword'], (settings) => {
      sendResponse(settings);
    });
    return true; // Indique une réponse asynchrone
  }
});
