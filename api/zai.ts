import { NextApiRequest, NextApiResponse } from "next";

// Stubbed Zai assistant — OpenAI disabled
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.body || {};
  return res.status(200).json({
    success: true,
    message: `Zai is offline for now. You asked: "${query || "no query"}".`
  });
}
