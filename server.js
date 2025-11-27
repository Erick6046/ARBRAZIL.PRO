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

// Function to scrape odds from bookmakers
async function scrapeOdds() {
  console.log('Starting odds scraping...');
  
  try {
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    // Example scraping from a bookmaker (this is a simplified example)
    // In a real implementation, you would scrape multiple bookmakers
    await page.goto('https://www.oddschecker.com/football', { waitUntil: 'networkidle2' });
    
    // Extract match data (simplified for this example)
    const matches = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('.event'));
      return elements.map(el => {
        const teams = el.querySelector('.selection')?.textContent || '';
        const odds = Array.from(el.querySelectorAll('.odds a'))
          .map(o => parseFloat(o.textContent.replace(/\s+/g, ''))) || [];
        
        return {
          teams: teams.trim(),
          odds: odds,
          timestamp: new Date().toISOString()
        };
      });
    });
    
    // Process matches to find surebets
    matches.forEach(match => {
      if (match.odds.length >= 2) {
        const surebet = calculateSurebet(match.odds[0], match.odds[1]);
        if (surebet && surebet.profitPercentage >= 5 && surebet.profitPercentage <= 12) {
          const newSurebet = {
            id: Date.now() + Math.random(),
            teams: match.teams,
            odds: {
              option1: match.odds[0],
              option2: match.odds[1]
            },
            bookmakers: ['Bookmaker A', 'Bookmaker B'], // In real implementation, these would be actual bookmakers
            stakes: {
              option1: parseFloat((surebet.stake1 * 100).toFixed(2)),
              option2: parseFloat((surebet.stake2 * 100).toFixed(2))
            },
            profitPercentage: surebet.profitPercentage,
            guaranteedProfit: surebet.guaranteedProfit,
            timestamp: match.timestamp,
            expiration: moment().add(30, 'minutes').toISOString()
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
    });
    
    await browser.close();
    console.log(`Found ${matches.length} matches, ${surebets.length} surebets in memory`);
  } catch (error) {
    console.error('Error during scraping:', error.message);
  }
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

// Schedule scraping every 2 minutes
setInterval(async () => {
  if (!activeScrapers.has('main-scraper')) {
    activeScrapers.add('main-scraper');
    await scrapeOdds();
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