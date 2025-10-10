export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // --- ROOT ---
    if (pathname === "/") {
      return new Response(JSON.stringify({ ok: true, msg: "ZeroZero Free API Active 🌍" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // --- CHAT ---
    if (pathname === "/chat") {
      try {
        const { prompt } = await request.json();
        const res = await fetch("https://api-inference.huggingface.co/models/gpt2", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.HF_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: prompt }),
        });
        const data = await res.json();
        const reply = data?.[0]?.generated_text || "Zai couldn’t reply this time 😅";
        return new Response(JSON.stringify({ reply }), { headers: { "Content-Type": "application/json" } });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { headers: { "Content-Type": "application/json" } });
      }
    }

    // --- TIPS ---
    if (pathname === "/tips") {
      const tips = [
        { category: "Energy", text: "Unplug devices at night — save £60/year.", href: "https://energysavingtrust.org.uk", moneySaved: 60, carbonSaved: 120 },
        { category: "Food", text: "Store veg in paper — lasts 3 days longer.", href: "https://lovefoodhatewaste.com", moneySaved: 80, carbonSaved: 25 },
        { category: "Travel", text: "Cycle 5 miles a day — save £500/year.", href: "https://cyclinguk.org", moneySaved: 500, carbonSaved: 350 },
      ];
      return new Response(JSON.stringify(tips), { headers: { "Content-Type": "application/json" } });
    }

    // --- OFFERS ---
    if (pathname === "/offers") {
      const lat = url.searchParams.get("lat") || "51.5074";
      const lng = url.searchParams.get("lng") || "-0.1278";
      const radius = 3000;
      const query = `
        [out:json];
        (
          node["shop"="organic"](around:${radius},${lat},${lng});
          node["shop"="health_food"](around:${radius},${lat},${lng});
          node["amenity"="cafe"](around:${radius},${lat},${lng});
          node["amenity"="restaurant"](around:${radius},${lat},${lng});
        );
        out body;
      `;
      const res = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query,
      });
      const data = await res.json();
      const offers = (data.elements || []).slice(0, 10).map((p) => ({
        category: p.tags.shop || p.tags.amenity || "Local",
        text: `${p.tags.name || "Sustainable spot"} — ${p.tags["addr:street"] || "Nearby"}`,
        href: `https://www.openstreetmap.org/node/${p.id}`,
        moneySaved: Math.floor(Math.random() * 200) + 50,
        carbonSaved: Math.floor(Math.random() * 400) + 100,
      }));
      return new Response(JSON.stringify(offers), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // --- LIVE ---
    if (pathname === "/live") {
      const lat = url.searchParams.get("lat") || "51.5074";
      const lng = url.searchParams.get("lng") || "-0.1278";
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`
      );
      const weather = (await weatherRes.json()).current_weather;
      const live = {
        carbonIntensity: Math.floor(Math.random() * 300) + 150,
        weather: {
          temperature: weather.temperature,
          windspeed: weather.windspeed,
        },
        tipOfTheDay: "Choose local cafés with organic options ☕️",
      };
      return new Response(JSON.stringify(live), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // --- DEFAULT ---
    return new Response(JSON.stringify({ error: "Unknown route" }), {
      headers: { "Content-Type": "application/json" },
    });
  },
};

