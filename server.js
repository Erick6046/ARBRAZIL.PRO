const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const axios = require('axios');
const moment = require('moment');
const _ = require('lodash');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory storage for surebets
let surebets = [];
let activeScrapers = new Set();

// Serve the main HTML page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// API endpoint to get current surebets
app.get('/api/surebets', (req, res) => {
  res.json(surebets);
});

// API endpoint to get statistics
app.get('/api/stats', (req, res) => {
  const totalSurebets = surebets.length;
  const avgProfit = surebets.length > 0 ? 
    surebets.reduce((sum, bet) => sum + bet.profitPercentage, 0) / surebets.length : 0;
  
  res.json({
    totalSurebets,
    avgProfit: avgProfit.toFixed(2),
    lastUpdate: new Date().toISOString()
  });
});

// Function to calculate surebet
function calculateSurebet(odds1, odds2) {
  const invOdds1 = 1 / odds1;
  const invOdds2 = 1 / odds2;
  const total = invOdds1 + invOdds2;
  
  if (total >= 1) return null; // Not a surebet
  
  const profitPercentage = ((1 / total) - 1) * 100;
  
  return {
    stake1: (1 / total) * invOdds1,
    stake2: (1 / total) * invOdds2,
    profitPercentage: parseFloat(profitPercentage.toFixed(2)),
    guaranteedProfit: (1 - total) * 100
  };
}

// Function to simulate odds scraping (since actual scraping requires puppeteer which may not be available)
function simulateScraping() {
  console.log('Simulating odds scraping...');
  
  // Generate random surebets to simulate what would be found through scraping
  const sports = ["Football", "Basketball", "Tennis", "Volleyball"];
  const teams = [
    "Manchester United vs Liverpool",
    "Real Madrid vs Barcelona", 
    "Golden State Warriors vs Lakers",
    "Miami Heat vs Celtics",
    "Novak Djokovic vs Rafael Nadal",
    "Serena Williams vs Maria Sharapova",
    "Brazil vs Argentina",
    "Germany vs France",
    "LA Lakers vs LA Clippers",
    "Chicago Bulls vs New York Knicks"
  ];
  
  const bookmakers = ["Bet365", "William Hill", "Betfair", "Pinnacle", "DraftKings", "FanDuel"];
  
  // Generate 1-3 random surebets
  const numSurebets = Math.floor(Math.random() * 3) + 1;
  
  for (let i = 0; i < numSurebets; i++) {
    const sport = sports[Math.floor(Math.random() * sports.length)];
    const teamMatch = teams[Math.floor(Math.random() * teams.length)];
    const bookmaker1 = bookmakers[Math.floor(Math.random() * bookmakers.length)];
    let bookmaker2 = bookmakers[Math.floor(Math.random() * bookmakers.length)];
    
    // Ensure different bookmakers
    while (bookmaker2 === bookmaker1) {
      bookmaker2 = bookmakers[Math.floor(Math.random() * bookmakers.length)];
    }
    
    // Generate odds that create a surebet (profit between 5-12%)
    const profitPercentage = 5 + Math.random() * 7; // Between 5% and 12%
    
    // Calculate odds that would give the desired profit
    // For a surebet: 1/odd1 + 1/odd2 < 1, profit = (1/(1/odd1 + 1/odd2) - 1) * 100
    // We'll reverse this calculation to generate appropriate odds
    const totalImpliedProb = 1 / (1 + profitPercentage/100); // This ensures desired profit
    
    // Generate first odd randomly between 1.5 and 5.0
    const odd1 = 1.5 + Math.random() * 3.5;
    // Calculate second odd to achieve the desired total implied probability
    const odd2 = 1 / (totalImpliedProb - 1/odd1);
    
    if (odd2 > 1.1) { // Valid surebet
      const surebet = calculateSurebet(odd1, odd2);
      if (surebet) {
        const newSurebet = {
          id: Date.now() + Math.random(),
          teams: teamMatch,
          odds: {
            option1: parseFloat(odd1.toFixed(2)),
            option2: parseFloat(odd2.toFixed(2))
          },
          bookmakers: [bookmaker1, bookmaker2],
          stakes: {
            option1: parseFloat((surebet.stake1 * 100).toFixed(2)),
            option2: parseFloat((surebet.stake2 * 100).toFixed(2))
          },
          profitPercentage: surebet.profitPercentage,
          guaranteedProfit: surebet.guaranteedProfit,
          timestamp: new Date().toISOString(),
          expiration: moment().add(30, 'minutes').toISOString(),
          sport: sport,
          market: "Match Winner"
        };
        
        // Check if this surebet already exists
        const existing = surebets.find(sb => 
          sb.teams === newSurebet.teams && 
          sb.odds.option1 === newSurebet.odds.option1 &&
          sb.odds.option2 === newSurebet.odds.option2
        );
        
        if (!existing) {
          surebets.unshift(newSurebet);
          
          // Keep only the last 50 surebets to prevent memory issues
          if (surebets.length > 50) {
            surebets = surebets.slice(0, 50);
          }
          
          // Emit to all connected clients
          io.emit('newSurebet', newSurebet);
        }
      }
    }
  }
  
  console.log(`Simulated scraping completed, ${surebets.length} surebets in memory`);
}

// Function to simulate surebets for demonstration (since actual scraping requires real bookmaker access)
function generateDemoSurebets() {
  const demoSurebets = [
    {
      id: Date.now() + 1,
      teams: "Manchester United vs Liverpool",
      odds: {
        option1: 3.20,
        option2: 2.85
      },
      bookmakers: ["Bet365", "William Hill"],
      stakes: {
        option1: 43.50,
        option2: 48.75
      },
      profitPercentage: 7.25,
      guaranteedProfit: 7.25,
      timestamp: new Date().toISOString(),
      expiration: moment().add(15, 'minutes').toISOString(),
      sport: "Football",
      market: "Match Winner"
    },
    {
      id: Date.now() + 2,
      teams: "Real Madrid vs Barcelona",
      odds: {
        option1: 2.90,
        option2: 3.10
      },
      bookmakers: ["Betfair", "Pinnacle"],
      stakes: {
        option1: 51.28,
        option2: 48.08
      },
      profitPercentage: 6.80,
      guaranteedProfit: 6.80,
      timestamp: new Date().toISOString(),
      expiration: moment().add(20, 'minutes').toISOString(),
      sport: "Football",
      market: "Match Winner"
    },
    {
      id: Date.now() + 3,
      teams: "Golden State Warriors vs Lakers",
      odds: {
        option1: 2.10,
        option2: 2.05
      },
      bookmakers: ["DraftKings", "FanDuel"],
      stakes: {
        option1: 48.78,
        option2: 50.00
      },
      profitPercentage: 8.45,
      guaranteedProfit: 8.45,
      timestamp: new Date().toISOString(),
      expiration: moment().add(10, 'minutes').toISOString(),
      sport: "Basketball",
      market: "Match Winner"
    }
  ];
  
  surebets = demoSurebets;
  io.emit('newSurebet', demoSurebets[0]);
  io.emit('newSurebet', demoSurebets[1]);
  io.emit('newSurebet', demoSurebets[2]);
}

// Schedule simulated scraping every 2 minutes
setInterval(() => {
  if (!activeScrapers.has('main-scraper')) {
    activeScrapers.add('main-scraper');
    simulateScraping();
    activeScrapers.delete('main-scraper');
  }
}, 120000); // 2 minutes

// Initial population of surebets
setTimeout(() => {
  generateDemoSurebets();
}, 2000);

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Send current surebets to newly connected client
  socket.emit('surebetsUpdate', surebets);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`SureBet Prophet server running on port ${PORT}`);
  console.log('Access the application at http://localhost:3000');
});