// Dashboard JavaScript for Phishing Detection Extension
// Self-contained dashboard without external dependencies

// Helper functions
const getRiskColor = (probability) => {
    if (probability >= 80) return '#dc2626';
    if (probability >= 70) return '#f87171';
    if (probability >= 50) return '#f97316';
    if (probability >= 30) return '#fb923c';
    return '#16a34a';
};

const getRiskLevel = (probability) => {
    if (probability >= 80) return 'High Risk';
    if (probability >= 70) return 'Elevated Risk';
    if (probability >= 50) return 'Medium Risk';
    if (probability >= 30) return 'Low-Medium Risk';
    return 'Low Risk';
};

// Dashboard class
class PhishingDashboard {
    constructor() {
        this.data = null;
        this.loading = true;
        this.init();
    }

    async init() {
        console.log('[Dashboard] Initializing dashboard...');
        await this.loadData();
        this.render();
        this.setupEventListeners();
    }

    async loadData() {
        return new Promise((resolve) => {
            if (typeof chrome !== 'undefined' && chrome.storage) {
                chrome.storage.local.get(['phishing_dashboard_data'], (result) => {
                    const data = result.phishing_dashboard_data;
                    if (data) {
                        console.log('[Dashboard] Loaded data from Chrome storage:', data);
                        this.data = data;
                    } else {
                        console.log('[Dashboard] No data found, using default structure');
                        this.data = {
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
                    }
                    this.loading = false;
                    resolve();
                });
            } else {
                // Fallback for non-extension environment
                this.data = {
                    currentStats: { totalSitesScanned: 0, suspiciousSites: 0, confirmedPhishing: 0, falsePositives: 0 },
                    detectedSites: [],
                    riskHistory: [],
                    categoryStats: []
                };
                this.loading = false;
                resolve();
            }
        });
    }

    render() {
        const root = document.getElementById('root');
        
        if (this.loading) {
            root.innerHTML = '<div class="loading">Loading Dashboard...</div>';
            return;
        }

        if (!this.data) {
            root.innerHTML = '<div class="no-data">No data available</div>';
            return;
        }

        const { currentStats, detectedSites, riskHistory, categoryStats } = this.data;

        // Calculate overall risk
        const currentOverallRisk = detectedSites.length > 0 
            ? Math.round(detectedSites.reduce((sum, site) => sum + (site.probability || 0), 0) / detectedSites.length)
            : 0;

        root.innerHTML = `
            <div class="phishing-dashboard">
                <div class="dashboard-header">
                    <h1>Site Detection Dashboard</h1>
                    <p>Real-time monitoring and analysis of suspicious websites</p>
                </div>

                <div class="controls">
                    <button class="btn" onclick="dashboard.refreshData()">🔄 Refresh Data</button>
                    <button class="btn btn-secondary" onclick="dashboard.exportData()">📊 Export Data</button>
                    <button class="btn btn-danger" onclick="dashboard.clearData()">🗑️ Clear All Data</button>
                </div>

                <!-- Stats Cards -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">📊</div>
                        <div class="stat-content">
                            <h3>Sites Scanned</h3>
                            <div class="stat-value">${currentStats.totalSitesScanned.toLocaleString()}</div>
                            <div class="stat-subtitle">Total scans</div>
                        </div>
                    </div>

                    <div class="stat-card safe">
                        <div class="stat-icon">🛡️</div>
                        <div class="stat-content">
                            <h3>Safe Sites</h3>
                            <div class="stat-value">${currentStats.totalSitesScanned - currentStats.confirmedPhishing}</div>
                            <div class="stat-subtitle">
                                ${currentStats.totalSitesScanned > 0 
                                    ? `${(((currentStats.totalSitesScanned - currentStats.confirmedPhishing) / currentStats.totalSitesScanned) * 100).toFixed(1)}% of total`
                                    : '0% of total'}
                            </div>
                        </div>
                    </div>

                    <div class="stat-card danger">
                        <div class="stat-icon">⚠️</div>
                        <div class="stat-content">
                            <h3>Confirmed Phishing</h3>
                            <div class="stat-value">${currentStats.confirmedPhishing}</div>
                            <div class="stat-subtitle">High confidence</div>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon">📈</div>
                        <div class="stat-content">
                            <h3>Overall Risk</h3>
                            <div class="stat-value" style="color: ${getRiskColor(currentOverallRisk)}">
                                ${currentOverallRisk}%
                            </div>
                            <div class="stat-subtitle">${getRiskLevel(currentOverallRisk)}</div>
                        </div>
                    </div>
                </div>

                <!-- Risk History Chart -->
                <div class="chart-section">
                    <h2>Overall Risk - Last 5 Detection Cycles</h2>
                    <div class="risk-history-chart">
                        ${riskHistory.slice(0, 5).map((cycle, index) => `
                            <div class="risk-bar-container">
                                <div class="risk-bar-label">${cycle.cycle || `Cycle ${index + 1}`}</div>
                                <div class="risk-bar-wrapper">
                                    <div class="risk-bar" style="
                                        height: ${(cycle.overallRisk / 100) * 200}px;
                                        background-color: ${getRiskColor(cycle.overallRisk)};
                                    ">
                                        <span class="risk-value">${cycle.overallRisk}%</span>
                                    </div>
                                </div>
                                <div class="risk-bar-info">
                                    <div>${cycle.threats || 0} threats</div>
                                    <div>${cycle.sitesScanned || 0} scanned</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Detected Sites -->
                <div class="detected-sites-section">
                    <h2>Recent Detections</h2>
                    <div class="sites-list">
                        ${detectedSites.slice(0, 10).map(site => `
                            <div class="site-item">
                                <div class="site-info">
                                    <div class="site-url" title="${site.url}">${site.url.length > 60 ? site.url.substring(0, 57) + '...' : site.url}</div>
                                    <div class="site-meta">
                                        <span class="site-category">${site.category || 'Unknown'}</span>
                                        <span class="site-time">
                                            🕐 ${new Date(site.timestamp || site.detectedAt).toLocaleTimeString()}
                                        </span>
                                    </div>
                                </div>
                                        <div class="probability-section">
                                            <div class="ai-classification ${site.isPhishing ? 'unsafe' : 'safe'}">
                                                ${site.isPhishing ? 'UNSAFE' : 'SAFE'}
                                            </div>
                                        </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Category Breakdown -->
                <div class="category-section">
                    <h2>Threats by Category</h2>
                    <div class="category-grid">
                        ${categoryStats.map(category => `
                            <div class="category-card">
                                <div class="category-header">
                                    <h4>${category.category}</h4>
                                    <span class="category-count">${category.count}</span>
                                </div>
                                <div class="category-risk">
                                    <div class="risk-indicator">
                                        <div class="risk-circle" style="background-color: ${getRiskColor(category.avgRisk)}"></div>
                                        <span>${category.avgRisk}% avg risk</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Listen for storage changes
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.onChanged.addListener((changes) => {
                if (changes.phishing_dashboard_data) {
                    console.log('[Dashboard] Storage changed, updating dashboard');
                    this.data = changes.phishing_dashboard_data.newValue;
                    this.render();
                }
            });
        }
    }

    async refreshData() {
        console.log('[Dashboard] Refreshing data...');
        await this.loadData();
        this.render();
    }

    exportData() {
        try {
            const dataStr = JSON.stringify(this.data, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `phishing-analysis-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log('[Dashboard] Data exported successfully');
        } catch (error) {
            console.error('[Dashboard] Export failed:', error);
            alert('Export failed. Please try again.');
        }
    }

    clearData() {
        if (confirm('Are you sure you want to clear all analysis data? This action cannot be undone.')) {
            this.data = {
                currentStats: { totalSitesScanned: 0, suspiciousSites: 0, confirmedPhishing: 0, falsePositives: 0 },
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
            
            if (typeof chrome !== 'undefined' && chrome.storage) {
                chrome.storage.local.set({ phishing_dashboard_data: this.data });
            }
            
            this.render();
            console.log('[Dashboard] All data cleared');
        }
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('[Dashboard] Page loaded, initializing dashboard...');
    window.dashboard = new PhishingDashboard();
});

// Handle page visibility changes to refresh data
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.dashboard) {
        console.log('[Dashboard] Page became visible, refreshing data...');
        window.dashboard.refreshData();
    }
});
