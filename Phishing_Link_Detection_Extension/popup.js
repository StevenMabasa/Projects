// === Replace with your real GitHub Models token ===
// Make sure your token has the 'models:read' permission!
const token = "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";

// GitHub Models inference endpoint
const endpoint = "https://models.github.ai/inference";

// Available models to try in order of preference
const AVAILABLE_MODELS = [
  "gpt-4o-mini",      // Most commonly available
  "gpt-4o",           // Backup option
  "gpt-3.5-turbo",    // Fallback
];

let currentModelIndex = 0;

// Simple fetch-based client with model fallback
async function callAI(messages, modelIndex = 0) {
  const model = AVAILABLE_MODELS[modelIndex];
  
  if (!model) {
    throw new Error("All models unavailable. GitHub Models may be experiencing issues.");
  }

  console.log(`Trying model: ${model}`);
  
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
    // If model is unavailable, try the next one
    if (responseData.error?.code === 'unavailable_model' && modelIndex < AVAILABLE_MODELS.length - 1) {
      console.log(`Model ${model} unavailable, trying next model...`);
      return await callAI(messages, modelIndex + 1);
    }
    
    const errorMsg = responseData.error?.message || responseData.error || 'Unknown error';
    throw new Error(`API Error (${response.status}): ${errorMsg}`);
  }

  console.log(`Successfully used model: ${model}`);
  return responseData;
}

// Utility function to safely get DOM elements
function getElement(id) {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Element with id '${id}' not found`);
  }
  return element;
}

// Utility function to validate token
function validateToken(token) {
  if (!token || token === "github_pat_YOUR_ACTUAL_TOKEN_HERE" || token === "ghp_your_real_token_here") {
    throw new Error("Please set a valid GitHub Models token with 'models:read' permission");
  }
  if (!token.startsWith("github_pat_") && !token.startsWith("ghp_")) {
    throw new Error("Invalid GitHub token format. Fine-grained tokens start with 'github_pat_'");
  }
  return true;
}

// Utility function to validate URL
function validateUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    throw new Error("Invalid URL format");
  }
}

// Main function with comprehensive error handling
document.addEventListener("DOMContentLoaded", () => {
  try {
    const button = getElement("getUrlBtn");
    const output = getElement("output");

    // Add loading state management
    function setLoading(loading) {
      button.disabled = loading;
      button.textContent = loading ? "Analyzing..." : "Analyze Current URL";
      if (loading) {
        output.className = "loading";
      }
    }

    // Dashboard button functionality
    const dashboardBtn = document.getElementById("dashboardBtn");
    if (dashboardBtn) {
      dashboardBtn.addEventListener("click", () => {
        // Open dashboard in new tab
        chrome.tabs.create({ url: chrome.runtime.getURL("dashboard.html") });
      });
    }

    button.addEventListener("click", async () => {
      setLoading(true);
      output.textContent = "Checking current tab URL...";
      output.className = "loading";
      
      try {
        // Validate token first
        validateToken(token);

        // Check if chrome.tabs API is available
        if (!chrome || !chrome.tabs) {
          throw new Error("Chrome tabs API not available. Make sure this is running as a browser extension.");
        }

        // Get the active tab with timeout
        const tabs = await Promise.race([
          chrome.tabs.query({ active: true, currentWindow: true }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Timeout getting active tab")), 5000)
          )
        ]);

        if (!tabs || tabs.length === 0) {
          throw new Error("No active tab found");
        }

        const tab = tabs[0];
        if (!tab.url) {
          throw new Error("Active tab has no URL");
        }

        // Validate the URL
        validateUrl(tab.url);

        const url = tab.url;
        console.log("Active tab URL:", url);

        // Check for restricted URLs that extensions can't access
        if (url.startsWith("chrome://") || 
            url.startsWith("chrome-extension://") || 
            url.startsWith("moz-extension://") ||
            url.startsWith("about:") ||
            url.startsWith("file://")) {
          throw new Error("Cannot analyze browser internal pages or local files");
        }

        output.textContent = "Connecting to AI service...";

        // Create messages for the AI
        const messages = [
          {
            role: "system",
            content:
              "You are a cybersecurity assistant. Your job is to determine if a given URL could possibly be a phishing site. " +
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

        output.textContent = "Analyzing URL for phishing indicators...";

        // Call AI with timeout
        const response = await Promise.race([
          callAI(messages),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error("AI request timeout (30s)")), 30000)
          )
        ]);

        // Validate response structure
        if (!response?.choices?.[0]?.message?.content) {
          throw new Error("Invalid response format from AI service");
        }

        const result = response.choices[0].message.content.trim();
        
        // Validate that response starts with Yes/No as expected
        if (!result.toLowerCase().startsWith('yes') && !result.toLowerCase().startsWith('no')) {
          console.warn("AI response doesn't follow expected format:", result);
        }

        // Display result
        output.className = "success";
        output.textContent = `Analysis for: ${url}\n\n${result}`;

      } catch (error) {
        console.error("Error in URL analysis:", error);
        
        // Provide user-friendly error messages
        let userMessage = "Analysis failed: ";
        
        if (error.message.includes("Extension context invalidated")) {
          userMessage += "Extension was reloaded. Please close and reopen the popup.";
        } else if (error.message.includes("timeout") || error.message.includes("Timeout")) {
          userMessage += "Request timed out. Please try again.";
        } else if (error.message.includes("network") || error.message.includes("fetch") || error.message.includes("NetworkError")) {
          userMessage += "Network error. Check your internet connection.";
        } else if (error.message.includes("token") || error.message.includes("authentication") || error.message.includes("401")) {
          userMessage += "Authentication failed. Check your GitHub token.";
        } else if (error.message.includes("quota") || error.message.includes("rate limit") || error.message.includes("429")) {
          userMessage += "API quota exceeded. Please wait before trying again.";
        } else if (error.message.includes("unavailable_model")) {
          userMessage += "Model not available. The extension will automatically try other models.";
        } else if (error.message.includes("404")) {
          userMessage += "Service not found. Check if GitHub Models is available in your region.";
        } else {
          userMessage += error.message;
        }
        
        output.className = "error";
        output.textContent = `❌ ${userMessage}`;
      } finally {
        setLoading(false);
      }
    });

  } catch (initError) {
    console.error("Initialization error:", initError);
    const output = document.getElementById("output");
    if (output) {
      output.className = "error";
      output.textContent = `❌ Extension initialization failed: ${initError.message}`;
    }
  }
});

// Optional: Add a connection test function for debugging
window.testConnection = async function() {
  try {
    validateToken(token);
    
    console.log("Testing available models...");
    
    // Test each model to see which ones work
    for (let i = 0; i < AVAILABLE_MODELS.length; i++) {
      try {
        const response = await callAI([
          { role: "user", content: "Respond with just 'OK'" }
        ], i);
        
        console.log(`✅ Model ${AVAILABLE_MODELS[i]} works!`);
        return true;
      } catch (error) {
        console.log(`❌ Model ${AVAILABLE_MODELS[i]} failed:`, error.message);
        continue;
      }
    }
    
    console.error("❌ No models available");
    return false;
  } catch (error) {
    console.error("Connection test failed:", error);
    return false;
  }
};

// Function to list available models (for debugging)
window.listAvailableModels = async function() {
  console.log("Checking which models are available...");
  
  for (const model of AVAILABLE_MODELS) {
    try {
      const response = await fetch(`${endpoint}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: "user", content: "test" }],
          max_tokens: 1
        })
      });
      
      if (response.ok) {
        console.log(`✅ ${model} - Available`);
      } else {
        const error = await response.json();
        console.log(`❌ ${model} - ${error.error?.message || 'Unavailable'}`);
      }
    } catch (error) {
      console.log(`❌ ${model} - Network error`);
    }
  }
};
