import { getSpeedModifier } from "../globals.js";

export function getActionTime(time: number, characterSkillSpeed: number): number {
  let actionTime = Math.floor(time / (1 + characterSkillSpeed));
  console.log(`Calculated time of ${actionTime}ms.`);
  if (!actionTime || actionTime < 2000){
    actionTime = 2000;
  }
  return Math.floor(getSpeedModifier() * actionTime)
}