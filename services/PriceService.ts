
export const fetchLivePrice = async (ticker: string, type: string): Promise<number> => {
  const cleanTicker = ticker.toUpperCase().trim();
  
  // Crypto logic using Binance Public API (No Key Required)
  if (type === 'Crypto') {
    try {
      // Binance uses pairs like BTCUSDT
      const symbol = cleanTicker.endsWith('USDT') ? cleanTicker : `${cleanTicker}USDT`;
      const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
      const data = await response.json();
      if (data.price) return parseFloat(data.price);
    } catch (e) {
      console.error("Binance API Error:", e);
    }
  }

  // Stock logic (Most Stock APIs require keys, so we provide a realistic simulation for now)
  // In a real production environment, you would use Finnhub or TwelveData here with an API Key.
  if (type === 'US Stock') {
    // Simulated "Live" prices for demo purposes
    const mockPrices: Record<string, number> = {
      'TSLA': 190.45 + (Math.random() * 2),
      'AAPL': 182.10 + (Math.random() * 1.5),
      'NVDA': 720.12 + (Math.random() * 5),
      'MSFT': 405.30 + (Math.random() * 2),
      'GOOGL': 145.20 + (Math.random() * 1),
    };
    return mockPrices[cleanTicker] || 100.00 + (Math.random() * 50);
  }

  return 0;
};
