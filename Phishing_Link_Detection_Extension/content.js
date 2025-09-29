// Content script for displaying phishing analysis results
// This script runs on web pages and shows analysis results

let analysisOverlay = null;
let isOverlayVisible = false;

// Create the analysis overlay
function createOverlay() {
  if (analysisOverlay) {
    return analysisOverlay;
  }

  const overlay = document.createElement('div');
  overlay.id = 'phishing-analysis-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    width: 350px;
    max-height: 200px;
    background: white;
    border: 2px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    line-height: 1.4;
    padding: 0;
    overflow: hidden;
    transition: all 0.3s ease;
    transform: translateX(100%);
  `;

  const header = document.createElement('div');
  header.style.cssText = `
    background: #f8f9fa;
    padding: 12px 16px;
    border-bottom: 1px solid #e9ecef;
    font-weight: 600;
    color: #495057;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `;
  header.innerHTML = `
    <span>🛡️ Phishing Analysis</span>
    <button id="close-overlay" style="
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      color: #6c757d;
      padding: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    ">×</button>
  `;

  const content = document.createElement('div');
  content.id = 'analysis-content';
  content.style.cssText = `
    padding: 16px;
    max-height: 120px;
    overflow-y: auto;
  `;

  const footer = document.createElement('div');
  footer.style.cssText = `
    background: #f8f9fa;
    padding: 8px 16px;
    border-top: 1px solid #e9ecef;
    font-size: 12px;
    color: #6c757d;
    text-align: center;
  `;
  footer.textContent = 'Auto-analyzed by Phishing Detection Extension';

  overlay.appendChild(header);
  overlay.appendChild(content);
  overlay.appendChild(footer);

  // Add close button functionality
  header.querySelector('#close-overlay').addEventListener('click', hideOverlay);

  document.body.appendChild(overlay);
  analysisOverlay = overlay;
  return overlay;
}

// Show the overlay with analysis result
function showOverlay(url, result) {
  const overlay = createOverlay();
  const content = overlay.querySelector('#analysis-content');
  
  // Determine if it's a potential phishing site based on the specific warning messages
  const isPhishing = result.includes('⚠️ PHISHING DETECTED') || 
                     result.includes('⚠️ SUSPICIOUS SITE') ||
                     result.includes('PHISHING DETECTED') ||
                     result.includes('SUSPICIOUS SITE');
  const statusColor = isPhishing ? '#dc3545' : '#28a745';
  const statusIcon = isPhishing ? '⚠️' : '✅';
  const textColor = isPhishing ? '#dc3545' : '#6c757d';
  
  console.log(`[Content] Showing overlay - isPhishing: ${isPhishing}, result: ${result.substring(0, 50)}...`);
  
  content.innerHTML = `
    <div style="margin-bottom: 8px;">
      <strong style="color: ${statusColor};">${statusIcon} ${isPhishing ? '⚠️ POTENTIAL PHISHING SITE' : '✅ Site Appears Safe'}</strong>
    </div>
    <div style="color: #495057; margin-bottom: 8px;">
      <strong>URL:</strong> ${url.length > 50 ? url.substring(0, 50) + '...' : url}
    </div>
    <div style="color: ${textColor}; font-size: 13px; font-weight: ${isPhishing ? 'bold' : 'normal'};">
      ${result}
    </div>
  `;

  // Update overlay styling for unsafe sites
  if (isPhishing) {
    overlay.style.border = '3px solid #dc3545';
    overlay.style.boxShadow = '0 4px 20px rgba(220, 53, 69, 0.3)';
  } else {
    overlay.style.border = '2px solid #ddd';
    overlay.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  }

  // Show the overlay with animation
  overlay.style.transform = 'translateX(0)';
  isOverlayVisible = true;

  // Update indicator color based on safety
  updateIndicatorColor(isPhishing);

  // Auto-hide after 10 seconds ONLY for safe sites
  if (!isPhishing) {
    console.log('[Content] Safe site detected, will auto-hide in 10 seconds');
    setTimeout(() => {
      if (isOverlayVisible) {
        hideOverlay();
      }
    }, 10000);
  } else {
    console.log('[Content] Unsafe site detected, overlay will stay visible');
  }
}

// Update indicator color based on site safety
function updateIndicatorColor(isPhishing) {
  const indicator = document.getElementById('phishing-extension-indicator');
  if (indicator) {
    if (isPhishing) {
      indicator.style.background = '#dc3545';
      indicator.style.boxShadow = '0 2px 12px rgba(220, 53, 69, 0.4)';
      indicator.title = '⚠️ UNSAFE SITE DETECTED - Click to re-analyze';
    } else {
      indicator.style.background = '#28a745';
      indicator.style.boxShadow = '0 2px 8px rgba(40, 167, 69, 0.3)';
      indicator.title = '✅ Safe Site - Click to re-analyze';
    }
  }
}

// Hide the overlay
function hideOverlay() {
  if (analysisOverlay && isOverlayVisible) {
    analysisOverlay.style.transform = 'translateX(100%)';
    isOverlayVisible = false;
  }
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[Content] Received message:', request);
  
  if (request.type === 'PHISHING_ANALYSIS') {
    console.log('[Content] Showing phishing analysis overlay');
    showOverlay(request.url, request.result);
  }
});

// Add keyboard shortcut to toggle overlay (Ctrl+Shift+P)
document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.shiftKey && event.key === 'P') {
    event.preventDefault();
    if (isOverlayVisible) {
      hideOverlay();
    } else {
      // Request fresh analysis
      chrome.runtime.sendMessage({
        type: 'ANALYZE_URL',
        url: window.location.href
      }, (response) => {
        if (response && response.result) {
          showOverlay(window.location.href, response.result);
        }
      });
    }
  }
});

// Add a subtle indicator when the extension is active
function addExtensionIndicator() {
  const indicator = document.createElement('div');
  indicator.id = 'phishing-extension-indicator';
  indicator.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    background: #007bff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 16px;
    cursor: pointer;
    z-index: 9999;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
    opacity: 0.7;
  `;
  indicator.innerHTML = '🛡️';
  indicator.title = 'Phishing Detection Active - Click to analyze this page';
  
  indicator.addEventListener('click', () => {
    chrome.runtime.sendMessage({
      type: 'ANALYZE_URL',
      url: window.location.href
    }, (response) => {
      if (response && response.result) {
        showOverlay(window.location.href, response.result);
      }
    });
  });

  indicator.addEventListener('mouseenter', () => {
    indicator.style.opacity = '1';
    indicator.style.transform = 'scale(1.1)';
  });

  indicator.addEventListener('mouseleave', () => {
    indicator.style.opacity = '0.7';
    indicator.style.transform = 'scale(1)';
  });

  document.body.appendChild(indicator);
}

// Initialize when the page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addExtensionIndicator);
} else {
  addExtensionIndicator();
}

console.log('[Content] Phishing detection extension content script loaded on:', window.location.href);
