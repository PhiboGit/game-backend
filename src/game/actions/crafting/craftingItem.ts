import { Types } from "mongoose"
import { dataLoader } from "../../data/dataLoader.js"
import { BonusType, RarityType, ResourceId } from "../../jsonValidators/dataValidator/validateResourceData.js"
import CharacterClass from "../../models/character/CharacterClass.js"
import { createItem } from "../../services/itemService.js"
import { rollDice, weightedChoiceRemoved } from "../../utils/randomDice.js"
import { ItemRecipe } from "../../jsonValidators/dataValidator/validateItemRecipeData.js"
import { Item } from "../../models/item/item.js"



export async function craftItem(recipe: ItemRecipe, character: CharacterClass, selectedIngredients: ResourceId[]): Promise<Types.ObjectId>{
  
  const rarity = getRarity(selectedIngredients, character, recipe)
  const bonusTypes = getBonusTypes(selectedIngredients, recipe, rarity)
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

function getRarity(selectedIngredients: ResourceId[], character: CharacterClass, recipe: ItemRecipe): RarityType {
  const professionStats = character.getProfessionStats(recipe.profession)
  const levelRollBonus = professionStats.level * 10

  let rollBonus = levelRollBonus
  for(const resourceId of selectedIngredients) {
    const craftingBonus = dataLoader.resourceData[resourceId].craftingBonus || 0
    rollBonus += craftingBonus
  }

  const rolled = rollDice(10000) + rollBonus

  let rolledRarity: RarityType = "common"
  for(const entry of dataLoader.itemCraftingTableData.rarityTable) {
    if (rolled >= entry.value) {
      rolledRarity = entry.event
    }
  }

  return rolledRarity
}

function getBonusTypes(selectedIngredients: ResourceId[], recipe: ItemRecipe, rarity: RarityType) {
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
  const numberOfBonusTypes = dataLoader.itemCraftingTableData.bonusTypesPerRarity[rarity]
  const results = weightedChoiceRemoved(events,numberOfBonusTypes - rolledBonusTypes.length, weights)

  return [...rolledBonusTypes, ...results]
}