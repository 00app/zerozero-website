import { useState } from "react";

export default function ChatPage() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");
  const API = import.meta.env.VITE_API_URL;

  async function sendPrompt() {
    try {
      const res = await fetch(`${API}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setReply(data.reply);
    } catch {
      setReply("Error: Couldn’t reach Zai 😅");
    }
  }

  return (
    <div className="p-6 text-white space-y-4">
      <h1 className="text-2xl font-bold mb-4">Ask Zai 🌿</h1>
      <textarea
        className="w-full p-3 rounded bg-white/10"
        placeholder="Ask me something about saving money or carbon..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        onClick={sendPrompt}
        className="bg-white text-black px-4 py-2 rounded-full"
      >
        Send
      </button>
      {reply && <p className="mt-4 text-white/80">{reply}</p>}
    </div>
  );
}

