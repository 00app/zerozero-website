import { NextApiRequest, NextApiResponse } from "next";

const demoReplies = [
  "👋 Hi, I’m Zai. This is a demo response while we set things up!",
  "💡 Tip: Try checking your energy usage — small changes can save money.",
  "🌍 I’m still learning! Full AI will be enabled soon."
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.body || {};

  // Pick a random demo reply
  const reply = demoReplies[Math.floor(Math.random() * demoReplies.length)];

  res.status(200).json({
    success: true,
    message: reply,
    echo: query || "No query provided"
  });
}
