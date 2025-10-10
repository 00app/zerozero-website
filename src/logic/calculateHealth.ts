import { JourneyResult } from "./types";
import { getTips } from "./index";

type Inputs = {
  stepsPerDay?: number;
  sleepHours?: number;
  highMeat?: boolean;
  exerciseFrequency?: string;
  dietQuality?: string;
};

export async function calculateHealth(i: Inputs): Promise<JourneyResult> {
  const steps = i.stepsPerDay ?? 4000;
  const sleep = i.sleepHours ?? 6.5;
  const score = Math.min(100, Math.round((steps / 100) + (sleep * 5) - (i.highMeat ? 5 : 0)));
  const message = `well-being score ~${score}/100. more walking and plant-forward meals help health and carbon.`;

  return {
    category: "health",
    message,
    tips: await getTips("health"),
  };
}
