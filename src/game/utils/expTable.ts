import { dataLoader } from "../data/dataLoader.js";

export function getLevel(exp: number): number{
  let level = 0;
  const table = dataLoader.expTableData.exp
  for (const levelStr in table) {
      const expRequired = table[levelStr]
      if (exp >= expRequired) {
          level = parseInt(levelStr)
      } else {
          break
      }   
  }
  return level
}