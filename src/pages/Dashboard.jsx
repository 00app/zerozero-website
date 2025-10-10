import { useEffect, useState } from "react";

export default function Dashboard() {
  const [tips, setTips] = useState([]);
  const [offers, setOffers] = useState([]);
  const [live, setLive] = useState(null);

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL;

    async function fetchData() {
      try {
        const [tipsRes, offersRes, liveRes] = await Promise.all([
          fetch(`${API}/tips`),
          fetch(`${API}/offers?lat=51.5074&lng=-0.1278`),
          fetch(`${API}/live?lat=51.5074&lng=-0.1278`),
        ]);

        const [tipsData, offersData, liveData] = await Promise.all([
          tipsRes.json(),
          offersRes.json(),
          liveRes.json(),
        ]);

        setTips(tipsData);
        setOffers(offersData);
        setLive(liveData);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }

    fetchData();
  }, []);

  if (!live) return <p className="text-white">Loading dashboard...</p>;

  return (
    <div className="p-6 space-y-6 text-white">
      <section className="bg-white/10 p-4 rounded-2xl">
        <h2 className="text-xl font-bold mb-3">Live Data</h2>
        <p>🌤 Temperature: {live.weather.temperature}°C</p>
        <p>💨 Wind Speed: {live.weather.windspeed} km/h</p>
        <p>♻️ Carbon Intensity: {live.carbonIntensity} gCO₂/kWh</p>
        <p>💡 Tip: {live.tipOfTheDay}</p>
      </section>

      <section className="bg-white/10 p-4 rounded-2xl">
        <h2 className="text-xl font-bold mb-3">Smart Tips</h2>
        <ul className="space-y-2">
          {tips.map((t, i) => (
            <li key={i}>
              <a href={t.href} target="_blank" className="underline">
                {t.text}
              </a>
              <p className="text-sm opacity-80">
                💰 Save £{t.moneySaved} · 🌍 {t.carbonSaved}kg CO₂
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white/10 p-4 rounded-2xl">
        <h2 className="text-xl font-bold mb-3">Local Offers</h2>
        <ul className="space-y-2">
          {offers.map((o, i) => (
            <li key={i}>
              <a href={o.href} target="_blank" className="underline">
                {o.text}
              </a>
              <p className="text-sm opacity-80">
                💰 Save £{o.moneySaved} · 🌍 {o.carbonSaved}kg CO₂
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

