import { Types } from "mongoose"
import { dataLoader } from "../../data/dataLoader.js"
import { RarityType, ResourceId } from "../../jsonValidators/dataValidator/validateResourceData.js"
import CharacterClass from "../../models/character/CharacterClass.js"
import { createItem } from "../../services/itemService.js"
import { rollDice } from "../../utils/randomDice.js"
import { ItemRecipe } from "../../jsonValidators/dataValidator/validateItemRecipeData.js"
import { Item } from "../../models/item/item.js"



export async function craftItem(recipe: ItemRecipe, character: CharacterClass, selectedIngredients: ResourceId[]): Promise<Types.ObjectId>{
  
  const rarity = getRarity(selectedIngredients, character, recipe)

  // TODO add gearScore
  // TODO add bonusTypes
  const gearScore = recipe.baseGearScore

  // construct the Item based on the recipe and rolled values
  const itemProperties: Omit<Item, '_id'> = {
    name: "Crafted Item Name Placeholder",
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
      
    }
  }
  const itemId = await createItem(itemProperties)

  return itemId

}

export function getRarity(selectedIngredients: ResourceId[], character: CharacterClass, recipe: ItemRecipe): RarityType {
  const professionStats = character.getProfessionStats(recipe.profession)
  const levelRollBonus = professionStats.level * 10

  let rollBonus = levelRollBonus
  for(const resourceId of selectedIngredients) {
    const craftingBonus = dataLoader.resourceData[resourceId].craftingBonus || 0
    rollBonus += craftingBonus
  }

  const rolled = rollDice(10000) + rollBonus

  const rarityTable: {event: RarityType, value: number}[] = [
    {event: "common", value: 0},
    {event: "uncommon", value: 41000},
    {event: "rare", value: 53000},
    {event: "epic", value: 71000},
    {event: "legendary", value: 92000}
  ]

  let rolledRarity: RarityType = "common"
  for(const entry of rarityTable) {
    if (rolled >= entry.value) {
      rolledRarity = entry.event
    }
  }

  return rolledRarity
}