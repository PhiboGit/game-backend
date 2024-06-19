import { Types } from "mongoose"
import { dataLoader } from "../../data/dataLoader.js"
import { BonusType, RarityType, ResourceId } from "../../jsonValidators/dataValidator/validateResourceData.js"
import CharacterClass from "../../models/character/CharacterClass.js"
import { createItem } from "../../services/itemService.js"
import { rollDice, weightedChoiceRemoved } from "../../utils/randomDice.js"
import { ItemRecipe } from "../../jsonValidators/dataValidator/validateItemRecipeData.js"
import { Item } from "../../models/item/item.js"



export async function craftItem(recipe: ItemRecipe, character: CharacterClass, selectedIngredients: ResourceId[]): Promise<Types.ObjectId>{
  
  const gearScore = getGearScore(selectedIngredients, character, recipe)
  const rarity = getRarity(recipe, gearScore)
  console.log("rarity: ", rarity)
  const bonusTypes = getBonusTypes(selectedIngredients, recipe, gearScore)
  // TODO add bonusTypes
  const bonusValues: Partial<{[key in BonusType]: number}> = {}
  bonusTypes.every(bonusType => {
    bonusValues[bonusType]= gearScore
  })

  console.log("bonusValues: ", bonusValues)

  // construct the Item based on the recipe and rolled values
  const itemProperties: Omit<Item, '_id'> = {
    displayName: "Crafted Item Name Placeholder",
    description: "Crafted Item Description Placeholder",
    level: recipe.equipLevel,
    equipmentProfessions: recipe.equipmentProfessions,
    equipmentSlot: recipe.equipmentSlot,
    tier: recipe.tier,
    enchantingLevel: 0,
    
    rarity: rarity,
    craftedGearScore: gearScore,
    baseStats: {
      ...recipe.baseStats
    },

    bonusTypes: {
      ...bonusValues
    }
  }
  const itemId = await createItem(itemProperties)

  return itemId

}

function getGearScore(selectedIngredients: ResourceId[], character: CharacterClass, recipe: ItemRecipe): number {
  const professionStats = character.getProfessionStats(recipe.profession)
  const levelBonus = Math.floor(professionStats.level * 0.1)
  const baseGearScore = recipe.baseGearScore
  const rolledBonus = rollDice(100)
  let ingredientsBonus = 0
  for(const resourceId of selectedIngredients) {
    const craftingBonus = dataLoader.resourceData[resourceId].craftingBonus || 0
    ingredientsBonus += craftingBonus
  }
  const sum = baseGearScore + levelBonus + ingredientsBonus + rolledBonus
  console.log(`gearScore: ${sum}; base: ${baseGearScore}, level: ${levelBonus}, ingredients: ${ingredientsBonus}, rolled: ${rolledBonus}`)
  return sum
}

function getRarity(recipe: ItemRecipe, gearScore: number): RarityType {
  let gearScoreRarity = (gearScore - recipe.baseGearScore) / 60
  if (gearScoreRarity < 1) return "common"
  if (gearScoreRarity < 2) return "uncommon"
  if (gearScoreRarity < 3) return "rare"
  if (gearScoreRarity < 4) return "epic"
  else return "legendary"
}

function getBonusTypes(selectedIngredients: ResourceId[], recipe: ItemRecipe, gearScore: number): BonusType[] {
  let rollableBonusTypes: {event: BonusType, weight: number}[] = recipe.availableBoni.map(boni => {return {event: boni.bonusType, weight: boni.weight}})
  const rolledBonusTypes: BonusType[] = []
  // filter pre-selected bonusTypes
  for(const resourceId of selectedIngredients) {
    if(dataLoader.resourceData[resourceId].bonusType){
      rollableBonusTypes = rollableBonusTypes.filter(entry => entry.event !== dataLoader.resourceData[resourceId].bonusType)
      rolledBonusTypes.push(dataLoader.resourceData[resourceId].bonusType!)
    }
  }

  const weights: number[] = []
  const events: BonusType[] = []
  for(const entry of rollableBonusTypes) {
    weights.push(entry.weight)
    events.push(entry.event)
  }
  const numberOfBonusTypes = gearScore < 100 ? 0 : gearScore < 250 ? 1 : gearScore < 450 ? 2 : gearScore < 700 ? 3 : 4
  console.log("bonusTypeDebug: ", numberOfBonusTypes, weights, events)
  const results = weightedChoiceRemoved(events,numberOfBonusTypes - rolledBonusTypes.length, weights)

  return [...rolledBonusTypes, ...results]
}