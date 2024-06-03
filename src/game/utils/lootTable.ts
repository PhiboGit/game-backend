import {rollDice, rollRange, weightedChoice} from './randomDice.js'
import { lootTableData } from '../data/dataLoader.js'
import { LootTable, LootTableRoll, LootTableWeight } from '../jsonValidators/dataValidator/validateLootTableData.js'

export type LootFromTable = {
  resource: string
  amount: number
}

function rollTable(table: LootTableRoll, luck: number): LootFromTable[] {

  const roll = rollDice(table.maxRoll) + (table.luck ? luck : 0)
  console.log('rollTable: you rolled a: %d / %d', roll, table.maxRoll + (table.luck ? luck : 0))

  const re: LootFromTable[] = []
  for (const loot of table.loot){
    console.log('rollTable: you need a: ', loot.value)
    if (roll >= loot.value){
      re.push({"resource": loot.resource, "amount": rollRange(loot.min, loot.max)})
    }
  } 
  return re
}


function weightTable(table: LootTableWeight, size: number){
  
  
  let weights: number[]  = []
  const events: LootTableWeight["loot"] = []
  for (const loot of table.loot){
    events.push(loot)
    weights.push(loot.value)
  }
  
  const results = weightedChoice(events, size, weights)

  const re = []
  for (const x of results) {
    if (x.resource == null) continue
    re.push({"resource": x.resource, "amount": rollRange(x.min, x.max)})
  }
  return re
}


export function parseLootTable(tableName: string, size: number = 1, luck: number = 0): LootFromTable[] {
  const results: LootFromTable[] = [];

  // Recursive function to parse loot tables
  // loot is either another table or the loot to collect
  function parseTable(table: LootTable, size: number, luck: number) {
    // two types of loot tables: ROLL/WEIGHT
    if (table['ROLL/WEIGHT'] === "ROLL") {
      // open the table and get the loot
      const rolls = rollTable(table, luck);
      // parse the loot and add it to the results if it is not a sub table
      // parse sub tables recursively
      for (const roll of rolls) {
        // if it is another table, start recursion
        if (roll.resource.startsWith("[LTID]")) {
          const subTable = lootTableData[roll.resource.substring(6)];
          if (subTable) {
            parseTable(subTable, roll.amount, luck);
          }
          // if not a table, just add the loot
        } else {
          results.push({ resource: roll.resource, amount: roll.amount });
        }
      }

      // if it is a weight table
    } else if (table['ROLL/WEIGHT'] === "WEIGHT") {
      // open the table and get the loot
      const rolls = weightTable(table, size);
      for (const roll of rolls) {
        // if it is another table, start recursion
        if (roll.resource.startsWith("[LTID]")) {
          const subTable = lootTableData[roll.resource.substring(6)];
          if (subTable) {
            parseTable(subTable, roll.amount, luck);
          }
          // if not a table, just add the loot
        } else {
          results.push({ resource: roll.resource, amount: roll.amount });
        }
      }
    }
  }

  // table is in the defined lootTable json
  const table: LootTable = lootTableData[tableName]
  if (!table) {
    console.error(`Couldn't find table: ${tableName}`)
    return results
  }
  // start the recursive function
  parseTable(table, size, luck);
  return results;
}
