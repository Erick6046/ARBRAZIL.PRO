// BetGenius Surebets Platform - JavaScript Functionality

// Sample surebets data
const sampleSurebets = [
    {
        id: 1,
        sport: 'Football',
        event: 'Real Madrid vs Barcelona',
        bookmakerA: 'Bet365',
        oddsA: 2.10,
        bookmakerB: 'William Hill',
        oddsB: 2.05,
        profit: '11.2%',
        timeLeft: '12:45',
        stakeA: 100,
        stakeB: 105.26,
        totalInvested: 205.26,
        potentialProfit: 22.85
    },
    {
        id: 2,
        sport: 'Basketball',
        event: 'Lakers vs Celtics',
        bookmakerA: 'DraftKings',
        oddsA: 1.95,
        bookmakerB: 'FanDuel',
        oddsB: 2.15,
        profit: '9.8%',
        timeLeft: '08:22',
        stakeA: 110,
        stakeB: 95.65,
        totalInvested: 205.65,
        potentialProfit: 20.15
    },
    {
        id: 3,
        sport: 'Tennis',
        event: 'Djokovic vs Nadal',
        bookmakerA: 'Pinnacle',
        oddsA: 2.25,
        bookmakerB: 'Betfair',
        oddsB: 1.90,
        profit: '7.3%',
        timeLeft: '23:10',
        stakeA: 85,
        stakeB: 100.53,
        totalInvested: 185.53,
        potentialProfit: 13.56
    },
    {
        id: 4,
        sport: 'Football',
        event: 'Bayern Munich vs Dortmund',
        bookmakerA: 'Unibet',
        oddsA: 2.40,
        bookmakerB: '888sport',
        oddsB: 1.75,
        profit: '8.5%',
        timeLeft: '05:15',
        stakeA: 72.5,
        stakeB: 98.57,
        totalInvested: 171.07,
        potentialProfit: 14.54
    },
    {
        id: 5,
        sport: 'Esports',
        event: 'G2 vs Fnatic (CS2)',
        bookmakerA: 'GG.bet',
        oddsA: 1.80,
        bookmakerB: 'Betsafe',
        oddsB: 2.35,
        profit: '12.1%',
        timeLeft: '02:30',
        stakeA: 115,
        stakeB: 87.89,
        totalInvested: 202.89,
        potentialProfit: 24.55
    },
    {
        id: 6,
        sport: 'American Football',
        event: 'Cowboys vs Patriots',
        bookmakerA: 'Caesars',
        oddsA: 2.15,
        bookmakerB: 'BetMGM',
        oddsB: 2.00,
        profit: '6.7%',
        timeLeft: '18:45',
        stakeA: 93.5,
        stakeB: 100,
        totalInvested: 193.5,
        potentialProfit: 12.96
    },
    {
        id: 7,
        sport: 'Hockey',
        event: 'Rangers vs Bruins',
        bookmakerA: 'BetRivers',
        oddsA: 2.30,
        bookmakerB: 'PointsBet',
        oddsB: 1.85,
        profit: '9.4%',
        timeLeft: '14:20',
        stakeA: 78.5,
        stakeB: 97.30,
        totalInvested: 175.8,
        potentialProfit: 16.59
    },
    {
        id: 8,
        sport: 'Baseball',
        event: 'Yankees vs Red Sox',
        bookmakerA: 'WynnBET',
        oddsA: 2.05,
        bookmakerB: 'BetOnline',
        oddsB: 2.10,
        profit: '5.2%',
        timeLeft: '09:10',
        stakeA: 102.5,
        stakeB: 97.62,
        totalInvested: 200.12,
        potentialProfit: 10.41
    }
];

// DOM Elements
const surebetsBody = document.getElementById('surebets-body');
const sportFilter = document.getElementById('sport-filter');
const profitFilter = document.getElementById('profit-filter');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Function to render surebets
function renderSurebets(surebets) {
    surebetsBody.innerHTML = '';
    
    surebets.forEach(bet => {
        const row = document.createElement('tr');
        
        // Determine profit class based on percentage
        let profitClass = 'profit-low';
        if (parseFloat(bet.profit) >= 10) {
            profitClass = 'profit-high';
        } else if (parseFloat(bet.profit) >= 7) {
            profitClass = 'profit-medium';
        }
        
        row.innerHTML = `
            <td>${bet.sport}</td>
            <td>${bet.event}</td>
            <td>${bet.bookmakerA} (${bet.oddsA})</td>
            <td>${bet.bookmakerB} (${bet.oddsB})</td>
            <td><span class="${profitClass}">${bet.profit}</span></td>
            <td>${bet.timeLeft}</td>
            <td>
                <button class="btn" onclick="placeBet(${bet.id})">
                    <i class="fas fa-bolt"></i> Place Bet
                </button>
            </td>
        `;
        
        surebetsBody.appendChild(row);
    });
}

// Function to filter surebets
function filterSurebets() {
    const sportValue = sportFilter.value;
    const profitValue = profitFilter.value;
    
    let filtered = sampleSurebets;
    
    // Filter by sport
    if (sportValue !== 'all') {
        filtered = filtered.filter(bet => bet.sport.toLowerCase().includes(sportValue));
    }
    
    // Filter by profit
    if (profitValue !== 'all') {
        const [min, max] = profitValue.split('-').map(Number);
        filtered = filtered.filter(bet => {
            const profit = parseFloat(bet.profit);
            return profit >= min && profit <= max;
        });
    }
    
    renderSurebets(filtered);
}

// Function to simulate placing a bet
function placeBet(betId) {
    const bet = sampleSurebets.find(b => b.id === betId);
    if (bet) {
        alert(`Surebet placed successfully!\nEvent: ${bet.event}\nBookmakers: ${bet.bookmakerA} & ${bet.bookmakerB}\nExpected Profit: ${bet.profit}`);
    }
}

// Function to update time left (simulated)
function updateTimeLeft() {
    const rows = surebetsBody.querySelectorAll('tr');
    rows.forEach((row, index) => {
        // In a real app, this would come from server
        // For demo, we'll just add some dynamic effect
        const timeCell = row.cells[5];
        const currentText = timeCell.textContent;
        const [minutes, seconds] = currentText.split(':').map(Number);
        
        // Simulate countdown
        let newSeconds = seconds - 1;
        let newMinutes = minutes;
        
        if (newSeconds < 0) {
            newSeconds = 59;
            newMinutes = Math.max(0, minutes - 1);
        }
        
        timeCell.textContent = `${newMinutes.toString().padStart(2, '0')}:${newSeconds.toString().padStart(2, '0')}`;
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Render initial surebets
    renderSurebets(sampleSurebets);
    
    // Add event listeners for filters
    sportFilter.addEventListener('change', filterSurebets);
    profitFilter.addEventListener('change', filterSurebets);
    
    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });
    
    // Simulate live updates
    setInterval(updateTimeLeft, 1000);
    
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
    
    // Add animation for feature cards when they come into view
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.feature-card, .analytics-card, .testimonial-card').forEach(card => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// Function to handle CTA buttons
document.querySelector('.btn-primary').addEventListener('click', function() {
    alert('Thank you for your interest! Starting your free trial of BetGenius Premium Surebets service.');
});

document.querySelector('.btn-secondary').addEventListener('click', function() {
    document.getElementById('surebets').scrollIntoView({ behavior: 'smooth' });
});

// Additional utility functions
function calculateSurebet(oddsA, oddsB) {
    // Calculate if there's a surebet opportunity
    const returnA = 1 / oddsA;
    const returnB = 1 / oddsB;
    const total = returnA + returnB;
    
    if (total < 1) {
        const profit = (1 / total - 1) * 100;
        return {
            isSurebet: true,
            profit: profit.toFixed(1) + '%',
            stakeA: (100 * returnA / total).toFixed(2),
            stakeB: (100 * returnB / total).toFixed(2)
        };
    }
    
    return {
        isSurebet: false,
        profit: '0%'
    };
}

// Simulate real-time surebet discovery
function simulateNewSurebets() {
    // In a real application, this would connect to a WebSocket or API
    // For demo purposes, we'll just randomly add a new surebet occasionally
    setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance every 10 seconds
            const sports = ['Football', 'Basketball', 'Tennis', 'Esports', 'American Football', 'Hockey', 'Baseball'];
            const bookmakers = ['Bet365', 'William Hill', 'DraftKings', 'FanDuel', 'Pinnacle', 'Betfair', 'Unibet', '888sport', 'GG.bet', 'Betsafe'];
            
            const newBet = {
                id: sampleSurebets.length + 1,
                sport: sports[Math.floor(Math.random() * sports.length)],
                event: `Team A vs Team B`,
                bookmakerA: bookmakers[Math.floor(Math.random() * bookmakers.length)],
                oddsA: (Math.random() * 2 + 1.5).toFixed(2),
                bookmakerB: bookmakers[Math.floor(Math.random() * bookmakers.length)],
                oddsB: (Math.random() * 2 + 1.5).toFixed(2),
                profit: (Math.random() * 7 + 5).toFixed(1) + '%',
                timeLeft: `${Math.floor(Math.random() * 24).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
                stakeA: (Math.random() * 150 + 50).toFixed(2),
                stakeB: (Math.random() * 150 + 50).toFixed(2),
                totalInvested: (Math.random() * 300 + 100).toFixed(2),
                potentialProfit: (Math.random() * 50 + 10).toFixed(2)
            };
            
            // Add to beginning of array to show newest first
            sampleSurebets.unshift(newBet);
            
            // Keep only the latest 20 surebets
            if (sampleSurebets.length > 20) {
                sampleSurebets.pop();
            }
            
            // Re-render with current filters
            filterSurebets();
            
            console.log('New surebet discovered:', newBet);
        }
    }, 10000); // Check every 10 seconds
}

// Start the simulation
simulateNewSurebets();

// Add a function to show surebet details in a modal
function showSurebetDetails(betId) {
    const bet = sampleSurebets.find(b => b.id === betId);
    if (bet) {
        // Create a modal or show details in a new section
        alert(`Surebet Details:\nEvent: ${bet.event}\nBookmakers: ${bet.bookmakerA} vs ${bet.bookmakerB}\nOdds: ${bet.oddsA} vs ${bet.oddsB}\nProfit: ${bet.profit}\nStake A: $${bet.stakeA}\nStake B: $${bet.stakeB}`);
    }
}