import { ResourceId, Resources } from "../../jsonValidators/dataValidator/validateResourceData.js";
import CharacterClass from "../../models/character/CharacterClass.js";

export function deductResourceIngredients(
  character: CharacterClass,
  selectedIngredients:ResourceId[],
  recipeIngredients: ({ required: boolean; slot: { resource: ResourceId; amount: number }[] })[]
): Promise<Partial<Resources>> {
  return new Promise(async (resolve, reject) => {
    const resourcesUpdate: Partial<Resources> = {}
      // validate selected ingredients again. The character need to have all ingredients now.
      for(const ingredientSlot of recipeIngredients) {
        for(const slotItem of ingredientSlot.slot){
          if(selectedIngredients.includes(slotItem.resource)) {
            if(character.resources[slotItem.resource] < slotItem.amount) {
              return reject('Not enough resources!')
            }
            // deduct the amount from the character
            resourcesUpdate[slotItem.resource] = -slotItem.amount
            break
          }
        }
      }
    resolve(resourcesUpdate)
  })
}

export function validateIngredients(
  character: CharacterClass,
  selectedIngredients:ResourceId[],
  recipeIngredients: ({ required: boolean; slot: { resource: ResourceId; amount: number }[] })[] 
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    // validate selected ingredients with recipe
    const selected: Set<ResourceId> = new Set(selectedIngredients);
    const validated: Set<ResourceId> = new Set()
    for(const ingredientSlot of recipeIngredients) {
      // found is important to validate that a required ingredient is selected
      let found = false
      for(const slotItem of ingredientSlot.slot){
        if(selected.has(slotItem.resource)) {
          if(character.resources[slotItem.resource] < slotItem.amount) {
            return reject('Not enough resources!')
          }
          found = true
          validated.add(slotItem.resource)
          selected.delete(slotItem.resource)
          break
        }
      }

      // either a ingredient for this slot was found or was not required
      if(!found && ingredientSlot.required) {
        return reject('A required ingredient was not selected!')
      }
    }
    if(selected.size > 0) {
      return reject('Some selected ingredients are invalid!')
    }
    console.log('%s Validated recipe ingredients successfully: %s', character.characterName);
    return resolve();
  })
}