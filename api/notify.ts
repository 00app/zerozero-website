import { NextApiRequest, NextApiResponse } from "next";

// Stubbed notify endpoint — SMS disabled
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json({
    success: true,
    message: "SMS notifications are disabled in this MVP build."
  });
}
