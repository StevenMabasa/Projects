// Test script for unsafe sites
// Run this in the browser console to test unsafe site detection

console.log('=== Testing Unsafe Site Detection ===');

// Test URLs that should trigger phishing warnings
const testUrls = [
  'https://paypal-security-alert.com',  // Suspicious PayPal clone
  'https://facebook-login-verification.net',  // Suspicious Facebook clone
  'https://amazon-account-suspended.org',  // Suspicious Amazon clone
  'https://google-security-check.ml',  // Suspicious Google clone
  'https://apple-id-verification.tk',  // Suspicious Apple clone
  'https://microsoft-account-locked.com',  // Suspicious Microsoft clone
  'https://bank-of-america-security.net',  // Suspicious bank clone
  'https://chase-bank-verification.org',  // Suspicious Chase clone
  'https://wells-fargo-security.com',  // Suspicious Wells Fargo clone
  'https://paypal-account-limited.net'  // Another suspicious PayPal clone
];

// Function to test a URL
function testUrl(url) {
  console.log(`Testing: ${url}`);
  
  if (typeof chrome !== 'undefined' && chrome.runtime) {
    chrome.runtime.sendMessage({
      type: 'ANALYZE_URL',
      url: url
    }, (response) => {
      if (response && response.result) {
        const isPhishing = response.result.toLowerCase().startsWith('yes');
        console.log(`${isPhishing ? '🚨 UNSAFE' : '✅ SAFE'}: ${response.result.substring(0, 100)}...`);
      } else {
        console.log('❌ No response received');
      }
    });
  } else {
    console.log('❌ Chrome extension API not available');
  }
}

// Test all URLs
console.log('Testing multiple suspicious URLs...');
testUrls.forEach((url, index) => {
  setTimeout(() => {
    testUrl(url);
  }, index * 2000); // Test one every 2 seconds
});

console.log('=== Test Complete ===');
console.log('Check the console for results. Unsafe sites should show red warnings!');
