// Test script to debug extension functionality
// Run this in the browser console to test if the extension is working

console.log('=== Extension Debug Test ===');

// Test 1: Check if content script is loaded
console.log('1. Content script loaded:', typeof chrome !== 'undefined' && chrome.runtime);

// Test 2: Check if background script is responding
if (typeof chrome !== 'undefined' && chrome.runtime) {
  chrome.runtime.sendMessage({type: 'ANALYZE_URL', url: window.location.href}, (response) => {
    console.log('2. Background script response:', response);
  });
}

// Test 3: Check if overlay elements exist
const overlay = document.getElementById('phishing-analysis-overlay');
const indicator = document.getElementById('phishing-extension-indicator');
console.log('3. Overlay element exists:', !!overlay);
console.log('4. Indicator element exists:', !!indicator);

// Test 4: Manual trigger test
console.log('5. Testing manual analysis...');
if (typeof chrome !== 'undefined' && chrome.runtime) {
  chrome.runtime.sendMessage({
    type: 'ANALYZE_URL',
    url: 'https://example.com'
  }, (response) => {
    console.log('6. Manual test result:', response);
  });
}

console.log('=== End Debug Test ===');
