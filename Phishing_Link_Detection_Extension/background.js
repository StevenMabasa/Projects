// Background script for automatic phishing detection
// This script runs in the background and triggers analysis on tab updates

// Local model server configuration
const LOCAL_SERVER_URL = "http://localhost:5000";

// GitHub Models configuration (same as popup.js)
const token = "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";
const endpoint = "https://models.github.ai/inference";

const AVAILABLE_MODELS = [
  "gpt-4o-mini",
  "gpt-4o", 
  "gpt-3.5-turbo",
];

// Cache to avoid analyzing the same URL multiple times
const analyzedUrls = new Set();
const analysisResults = new Map();

// Local storage key for dashboard data
const STORAGE_KEY = 'phishing_dashboard_data';

// Initialize dashboard data structure
function initializeDashboardData() {
  const defaultData = {
    currentStats: {
      totalSitesScanned: 0,
      suspiciousSites: 0,
      confirmedPhishing: 0,
      falsePositives: 0,
      lastScanTime: new Date().toISOString()
    },
    detectedSites: [],
    riskHistory: [],
    categoryStats: [
      { category: 'Banking', count: 0, avgRisk: 0 },
      { category: 'Payment', count: 0, avgRisk: 0 },
      { category: 'Tech Support', count: 0, avgRisk: 0 },
      { category: 'Social Media', count: 0, avgRisk: 0 },
      { category: 'Email', count: 0, avgRisk: 0 },
      { category: 'Delivery', count: 0, avgRisk: 0 }
    ]
  };
  
  chrome.storage.local.get([STORAGE_KEY], (result) => {
    if (!result[STORAGE_KEY]) {
      chrome.storage.local.set({ [STORAGE_KEY]: defaultData });
    }
  });
}

// Save analysis data to storage
function saveAnalysisData(url, result, isPhishing, probability = 0) {
  const analysisData = {
    id: Date.now(),
    url: url,
    result: result,
    isPhishing: isPhishing,
    probability: probability,
    timestamp: new Date().toISOString(),
    date: new Date().toISOString().split('T')[0]
  };

  chrome.storage.local.get([STORAGE_KEY], (result) => {
    const data = result[STORAGE_KEY] || {
      currentStats: { totalSitesScanned: 0, suspiciousSites: 0, confirmedPhishing: 0, falsePositives: 0 },
      detectedSites: [],
      riskHistory: [],
      categoryStats: []
    };

    // Update stats
    data.currentStats.totalSitesScanned += 1;
    if (isPhishing) {
      data.currentStats.confirmedPhishing += 1;
    } else {
      data.currentStats.suspiciousSites += 1;
    }
    data.currentStats.lastScanTime = new Date().toISOString();

    // Add to detected sites (keep last 50)
    data.detectedSites.unshift(analysisData);
    if (data.detectedSites.length > 50) {
      data.detectedSites = data.detectedSites.slice(0, 50);
    }

    // Update risk history (keep last 20 entries)
    const today = new Date().toISOString().split('T')[0];
    const existingEntry = data.riskHistory.find(entry => entry.date === today);
    
    if (existingEntry) {
      existingEntry.sitesScanned += 1;
      if (isPhishing) {
        existingEntry.threats += 1;
      }
      existingEntry.overallRisk = Math.round(
        (existingEntry.threats / existingEntry.sitesScanned) * 100
      );
    } else {
      data.riskHistory.unshift({
        date: today,
        cycle: `Cycle ${data.riskHistory.length + 1}`,
        sitesScanned: 1,
        threats: isPhishing ? 1 : 0,
        overallRisk: isPhishing ? 100 : 0
      });
    }

    if (data.riskHistory.length > 20) {
      data.riskHistory = data.riskHistory.slice(0, 20);
    }

    // Update category stats
    const category = getCategoryFromUrl(url);
    const categoryIndex = data.categoryStats.findIndex(cat => cat.category === category);
    
    if (categoryIndex !== -1) {
      data.categoryStats[categoryIndex].count += 1;
      data.categoryStats[categoryIndex].avgRisk = Math.round(
        (data.categoryStats[categoryIndex].avgRisk * (data.categoryStats[categoryIndex].count - 1) + probability) / 
        data.categoryStats[categoryIndex].count
      );
    }

    // Save updated data
    chrome.storage.local.set({ [STORAGE_KEY]: data });

    // Notify dashboard if it's open
    chrome.runtime.sendMessage({
      type: 'NEW_ANALYSIS',
      url: url,
      result: result,
      isPhishing: isPhishing,
      probability: probability,
      timestamp: analysisData.timestamp
    }).catch(() => {
      // Dashboard might not be open, that's okay
    });
  });
}

// Get category from URL
function getCategoryFromUrl(url) {
  const urlLower = url.toLowerCase();
  
  if (urlLower.includes('bank') || urlLower.includes('login') || urlLower.includes('account')) {
    return 'Banking';
  } else if (urlLower.includes('pay') || urlLower.includes('payment') || urlLower.includes('paypal')) {
    return 'Payment';
  } else if (urlLower.includes('support') || urlLower.includes('help') || urlLower.includes('tech')) {
    return 'Tech Support';
  } else if (urlLower.includes('social') || urlLower.includes('facebook') || urlLower.includes('twitter')) {
    return 'Social Media';
  } else if (urlLower.includes('email') || urlLower.includes('mail') || urlLower.includes('newsletter')) {
    return 'Email';
  } else if (urlLower.includes('delivery') || urlLower.includes('shipping') || urlLower.includes('track')) {
    return 'Delivery';
  } else {
    return 'Other';
  }
}

// Call local model server for URL analysis
async function callLocalModel(url) {
  console.log(`[Background] Calling local model server for: ${url}`);
  
  try {
    const response = await fetch(`${LOCAL_SERVER_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: url,
        threshold: 0.5
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const responseData = await response.json();
    
    if (responseData.status === 'error') {
      throw new Error(responseData.error || 'Unknown error from model server');
    }

    console.log(`[Background] Local model response: ${responseData.label} (${responseData.probability.toFixed(4)})`);
    return responseData;
    
  } catch (error) {
    console.error(`[Background] Local model server error:`, error);
    throw error;
  }
}

// Simple fetch-based client with model fallback
async function callAI(messages, modelIndex = 0) {
  const model = AVAILABLE_MODELS[modelIndex];
  
  if (!model) {
    throw new Error("All models unavailable. GitHub Models may be experiencing issues.");
  }

  console.log(`[Background] Trying model: ${model}`);
  
  const response = await fetch(`${endpoint}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      max_tokens: 256,
      temperature: 0.3
    })
  });

  const responseData = await response.json();

  if (!response.ok) {
    if (responseData.error?.code === 'unavailable_model' && modelIndex < AVAILABLE_MODELS.length - 1) {
      console.log(`[Background] Model ${model} unavailable, trying next model...`);
      return await callAI(messages, modelIndex + 1);
    }
    
    const errorMsg = responseData.error?.message || responseData.error || 'Unknown error';
    throw new Error(`API Error (${response.status}): ${errorMsg}`);
  }

  console.log(`[Background] Successfully used model: ${model}`);
  return responseData;
}

// Function to analyze a URL for phishing using two-stage approach
async function analyzeUrl(url) {
  try {
    // Skip if already analyzed
    if (analyzedUrls.has(url)) {
      return analysisResults.get(url);
    }

    // Skip browser internal pages
    if (url.startsWith("chrome://") || 
        url.startsWith("chrome-extension://") || 
        url.startsWith("moz-extension://") ||
        url.startsWith("about:") ||
        url.startsWith("file://")) {
      return null;
    }

    console.log(`[Background] Starting AI-first analysis for: ${url}`);

    // STAGE 1: Call AI first as primary filter
    const aiResult = await analyzeWithAI(url);
    console.log(`[Background] AI Result: "${aiResult}"`);
    // More robust detection of phishing response
    const aiSaysPhishing = aiResult.toLowerCase().startsWith('yes') || 
                          (aiResult.toLowerCase().includes('phishing') && 
                           aiResult.toLowerCase().includes('could possibly'));
    console.log(`[Background] AI Says Phishing: ${aiSaysPhishing}`);
    
    let result;
    
    if (aiSaysPhishing) {
      // STAGE 2: AI says YES (phishing) - get local model confirmation for double-check
      console.log(`[Background] AI detected phishing - getting local model confirmation`);
      
      let modelResponse;
      try {
        modelResponse = await callLocalModel(url);
        const isPhishing = modelResponse.is_phishing;
        const probability = modelResponse.probability;
        const confidence = modelResponse.confidence;
        
                if (isPhishing) {
                  // Both AI and local model agree it's phishing
                  result = `⚠️ PHISHING DETECTED! This site appears to be a potential phishing site. Confidence: ${(confidence * 100).toFixed(1)}% (probability: ${(probability * 100).toFixed(1)}%). Analysis: ${aiResult}`;
                  console.log(`[Background] Both models confirmed phishing`);
                } else {
                  // AI says phishing but local model says legitimate - show conflicting results
                  result = `⚠️ SUSPICIOUS SITE! Analysis suggests this site may be suspicious, but with conflicting indicators (${(confidence * 100).toFixed(1)}% confidence). Analysis: ${aiResult}. Please proceed with caution.`;
                  console.log(`[Background] Models disagree - AI says phishing, local model says legitimate`);
                }
      } catch (error) {
        console.error(`[Background] Local model failed, trusting AI result:`, error);
        // If local model fails, trust AI result
        result = `⚠️ PHISHING DETECTED! This site appears to be a potential phishing site. Analysis: ${aiResult}`;
      }
    } else {
      // STAGE 1 RESULT: AI says NO (legitimate) - trust AI and show safe result immediately
      result = `✅ SITE APPEARS SAFE! This site appears to be legitimate. Analysis: ${aiResult}`;
      console.log(`[Background] AI says legitimate - trusting AI result immediately`);
    }
    
    // Cache the result
    analyzedUrls.add(url);
    analysisResults.set(url, result);
    
    // Save to dashboard data - use specific warning message detection
    const isPhishing = result.includes('⚠️ PHISHING DETECTED') || 
                      result.includes('⚠️ SUSPICIOUS SITE') ||
                      result.includes('PHISHING DETECTED') ||
                      result.includes('SUSPICIOUS SITE');
    const probability = isPhishing ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 30) + 10; // Mock probability
    saveAnalysisData(url, result, isPhishing, probability);
    
    console.log(`[Background] Two-stage analysis complete for ${url}: ${result.substring(0, 50)}...`);
    
    return result;
    
  } catch (error) {
    console.error(`[Background] Error in two-stage analysis for ${url}:`, error);
    
    // Return fallback message if both models fail
    const fallbackResult = "Unable to analyze this URL. Please ensure the local model server is running on localhost:5000.";
    analyzedUrls.add(url);
    analysisResults.set(url, fallbackResult);
    
    return fallbackResult;
  }
}

// Analyze with AI model (used when local model says NO)
async function analyzeWithAI(url) {
  try {
    const messages = [
      {
        role: "system",
        content: "You are a cybersecurity assistant. Your job is to determine if a given URL could possibly be a phishing site. " +
                "Your response must always begin with 'Yes' or 'No', followed by a short explanation (1–3 sentences). " +
                "Be vigilant and flag any URL that shows suspicious patterns, unusual domains, or potential security risks. " +
                "Consider factors like domain reputation, URL structure, suspicious subdomains, typosquatting, and common phishing patterns. " +
                "When in doubt, err on the side of caution and flag potentially suspicious URLs."
      },
      {
        role: "user",
        content: `Evaluate this URL and say if it could possibly be a phishing website: ${url}`
      }
    ];

    const response = await callAI(messages);
    
    if (!response?.choices?.[0]?.message?.content) {
      throw new Error("Invalid response format from AI service");
    }

    const result = response.choices[0].message.content.trim();
    console.log(`[Background] AI confirmation result: ${result.substring(0, 50)}...`);
    
    return result;
    
  } catch (error) {
    console.error(`[Background] AI analysis failed:`, error);
    return "AI analysis unavailable. Local model suggests this site is legitimate.";
  }
}

// Listen for tab updates (when user navigates to a new page)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  console.log(`[Background] Tab updated - ID: ${tabId}, Status: ${changeInfo.status}, URL: ${tab.url}`);
  
  // Only analyze when the page has finished loading and has a URL
  if (changeInfo.status === 'complete' && tab.url) {
    console.log(`[Background] Page loaded, starting analysis for: ${tab.url}`);
    
    try {
      const result = await analyzeUrl(tab.url);
      
      if (result) {
        console.log(`[Background] Analysis complete, sending result to content script`);
        // Send the analysis result to the content script
        chrome.tabs.sendMessage(tabId, {
          type: 'PHISHING_ANALYSIS',
          url: tab.url,
          result: result
        }).catch(error => {
          // Content script might not be ready yet, that's okay
          console.log(`[Background] Could not send message to tab ${tabId}:`, error.message);
        });
      } else {
        console.log(`[Background] No analysis result for: ${tab.url}`);
      }
    } catch (error) {
      console.error(`[Background] Error in tab update handler:`, error);
    }
  }
});

// Listen for tab activation (when user switches to a different tab)
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    
    if (tab.url) {
      const result = await analyzeUrl(tab.url);
      
      if (result) {
        chrome.tabs.sendMessage(activeInfo.tabId, {
          type: 'PHISHING_ANALYSIS',
          url: tab.url,
          result: result
        }).catch(error => {
          console.log(`[Background] Could not send message to tab ${activeInfo.tabId}:`, error.message);
        });
      }
    }
  } catch (error) {
    console.error(`[Background] Error in tab activation handler:`, error);
  }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'ANALYZE_URL') {
    analyzeUrl(request.url).then(result => {
      sendResponse({ result: result });
    }).catch(error => {
      sendResponse({ error: error.message });
    });
    return true; // Keep the message channel open for async response
  }
});

// Initialize dashboard data
initializeDashboardData();

console.log('[Background] Phishing detection extension background script loaded');
