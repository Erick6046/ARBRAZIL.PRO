// BetGenius Analytics Dashboard - JavaScript Functionality

// Initialize charts when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all charts
    initSportChart();
    initTrendChart();
    initBookmakerChart();
    initMarginChart();
    
    // Mobile menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });
    
    // Add smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Initialize Sport Profitability Chart
function initSportChart() {
    const ctx = document.getElementById('sportChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Football', 'Basketball', 'Tennis', 'Esports', 'American Football', 'Hockey', 'Baseball'],
            datasets: [{
                data: [35, 20, 15, 12, 8, 7, 3],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                    '#FF6384'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.parsed}%`;
                        }
                    }
                }
            }
        }
    });
}

// Initialize Daily Profit Trend Chart
function initTrendChart() {
    const ctx = document.getElementById('trendChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Daily Profit ($)',
                data: [845.20, 1120.50, 980.75, 1320.40, 1450.60, 1247.80, 1180.30],
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

// Initialize Bookmaker Reliability Chart
function initBookmakerChart() {
    const ctx = document.getElementById('bookmakerChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Pinnacle', 'Bet365', 'Betfair', 'William Hill', 'DraftKings', 'FanDuel', 'Unibet'],
            datasets: [{
                label: 'Reliability Score',
                data: [98, 95, 92, 89, 85, 82, 80],
                backgroundColor: '#764ba2',
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// Initialize Profit Margin Distribution Chart
function initMarginChart() {
    const ctx = document.getElementById('marginChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['5-6%', '6-7%', '7-8%', '8-9%', '9-10%', '10-11%', '11-12%'],
            datasets: [{
                label: 'Number of Surebets',
                data: [12, 25, 38, 42, 31, 22, 15],
                backgroundColor: '#667eea',
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Simulate live data updates
function simulateLiveUpdates() {
    setInterval(() => {
        // In a real application, this would fetch new data from an API
        console.log('Updating analytics data...');
        
        // Update the stat cards with new values
        const dailyProfit = (Math.random() * 500 + 1000).toFixed(2);
        document.querySelector('.stat-card:nth-child(1) p').textContent = `$${dailyProfit}`;
        
        const activeSurebets = Math.floor(Math.random() * 10) + 20;
        document.querySelector('.stat-card:nth-child(2) p').textContent = activeSurebets;
    }, 30000); // Update every 30 seconds
}

// Start live updates
simulateLiveUpdates();