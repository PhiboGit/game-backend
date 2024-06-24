import { getSpeedModifier } from "../globals.js";
import { ProfessionStats } from "../models/character/CharacterClass.js";
import { rollRange } from "../utils/randomDice.js";

export function getActionTime(time: number, characterSkillSpeed: number): number {
  let actionTime = characterSkillSpeed >= 0 ? Math.floor(time / (1 + characterSkillSpeed)) : Math.floor(time * (1 - characterSkillSpeed))
  console.log(`Calculated time of ${actionTime}ms.`);
  if (!actionTime || actionTime < 2000){
    actionTime = 2000;
  }
  return Math.floor(getSpeedModifier() * actionTime)
}

export function getAmount(minAmount: number, maxAmount: number, professionStats: ProfessionStats): number {
  return Math.max(0, Math.floor(rollRange(minAmount + professionStats.yieldMin, maxAmount + professionStats.yieldMax)))
}

export function getExp(exp: number, professionStats: ProfessionStats): number {
  return Math.max(0, professionStats.expBonus >= 0 ? Math.floor(exp * (1 + professionStats.expBonus)) : Math.floor(exp / (1 - professionStats.expBonus)))
}