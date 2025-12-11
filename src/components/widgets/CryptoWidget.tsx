import { useState, useEffect } from "react";
import axios from "axios";

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
}

const CryptoWidget = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCrypto = async () => {
      try {
        setLoading(true);
        const url =
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";
        const response = await axios.get(url);
        setCryptoData(response.data);
        setError("");
      } catch (err: any) {
        console.error("Crypto API failed, using fallback:", err);
        setCryptoData([
          {
            id: "bitcoin",
            name: "Bitcoin",
            symbol: "btc",
            current_price: 45000,
            price_change_percentage_24h: 2.5,
            image: "",
          },
          {
            id: "ethereum",
            name: "Ethereum",
            symbol: "eth",
            current_price: 2800,
            price_change_percentage_24h: -1.2,
            image: "",
          },
          {
            id: "binancecoin",
            name: "BNB",
            symbol: "bnb",
            current_price: 320,
            price_change_percentage_24h: 1.8,
            image: "",
          },
          {
            id: "solana",
            name: "Solana",
            symbol: "sol",
            current_price: 95,
            price_change_percentage_24h: -0.5,
            image: "",
          },
          {
            id: "cardano",
            name: "Cardano",
            symbol: "ada",
            current_price: 0.52,
            price_change_percentage_24h: 3.2,
            image: "",
          },
          {
            id: "dogecoin",
            name: "Dogecoin",
            symbol: "doge",
            current_price: 0.08,
            price_change_percentage_24h: -2.1,
            image: "",
          },
          {
            id: "polkadot",
            name: "Polkadot",
            symbol: "dot",
            current_price: 7.2,
            price_change_percentage_24h: 1.5,
            image: "",
          },
          {
            id: "polygon",
            name: "Polygon",
            symbol: "matic",
            current_price: 0.85,
            price_change_percentage_24h: -1.0,
            image: "",
          },
        ]);
        setError("Using fallback data");
      } finally {
        setLoading(false);
      }
    };

    fetchCrypto();
    const interval = setInterval(fetchCrypto, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading && cryptoData.length === 0) {
    return <div className="p-4">Loading crypto prices...</div>;
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Crypto Prices</h3>
      {error && <p className="text-xs text-yellow-600 dark:text-yellow-400 mb-2">{error}</p>}
      <div className="space-y-3">
        {cryptoData.map((coin) => {
          const isPositive = coin.price_change_percentage_24h >= 0;
          return (
            <div key={coin.id} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {coin.image && (
                  <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                )}
                <div>
                  <div className="font-medium">{coin.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-300 uppercase">
                    {coin.symbol}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">
                  ${coin.current_price.toLocaleString()}
                </div>
                <div
                  className={`text-xs ${isPositive ? "text-green-600" : "text-red-600"}`}
                >
                  {isPositive ? "+" : ""}
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CryptoWidget;
