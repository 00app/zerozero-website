import { NextApiRequest, NextApiResponse } from "next";

// Demo replies to simulate SMS notifications
const demoNotices = [
  "📩 SMS notifications are currently disabled in this MVP.",
  "🔔 You would have received a tip here, but SMS is off for now.",
  "✅ Notifications stubbed: working without Twilio."
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Pick a random demo notice
  const notice = demoNotices[Math.floor(Math.random() * demoNotices.length)];

  res.status(200).json({
    success: true,
    message: notice
  });
}
