import { dataLoader } from "../../data/dataLoader.js";
import { ResourceId, Resources } from "../../jsonValidators/dataValidator/validateResourceData.js";
import { CraftingMsg } from "../../jsonValidators/messageValidator/validateCraftingMsg.js";
import CharacterClass from "../../models/character/CharacterClass.js";
import { getCharacter, updateCharacter } from "../../services/characterService.js";
import IAction from "../IAction.js";
import { getActionTime } from "../actionUtils.js";
import { ActionObject } from "../types.js";

export type CraftingActionObject = Omit<ActionObject, 'actionMsg'> & { actionMsg: CraftingMsg };
export default class CraftingAction implements IAction{
  validateAction(characterName: string, actionObject: CraftingActionObject): Promise<void> {
    return new Promise(async(resolve, reject) => {
      const character = await getCharacter(characterName);
      if(!character) return reject('Character not found!');

      try {
        await this.validateRecipe(character, actionObject.actionMsg.args.ingredients, actionObject.actionMsg.args.recipe)
      } catch (error) {
        return reject(error)
      }

      const recipe = dataLoader.resourceRecipeData[actionObject.actionMsg.args.recipe];
      const professionStats = character.getProfessionStats(recipe.profession)
      if(!recipe) return reject('Invalid recipe!');

      const actionTime = getActionTime(recipe.time, professionStats.speed)
      actionObject.actionTime = actionTime;
      return resolve();
    })
  }

  private validateRecipe(character: CharacterClass, selectedIngredients:ResourceId[], recipeId: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      // Validate inputs
      const recipe = dataLoader.resourceRecipeData[recipeId];
      if(!recipe) return reject('Invalid recipe!');
      const professionStats = character.getProfessionStats(recipe.profession)
      if(professionStats.level < recipe.level) return reject('Not high enough level!')

      // validate selected ingredients with recipe
      const selected: Set<ResourceId> = new Set(selectedIngredients);
      const validated: Set<ResourceId> = new Set()
      for(const ingredientSlot of recipe.ingredients) {
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
      console.log('%s Validated recipe successfully: %s', character.characterName, recipeId);
      return resolve();
    })
  }

  startAction(characterName: string, actionObject: CraftingActionObject, onCancel: (callback: () => void) => void): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      // Validate inputs
      if(!actionObject.actionTime || actionObject.actionTime <= 0) return reject('Invalid actionTime passed to action!');
      const character = await getCharacter(characterName);

      const timeout = setTimeout(async() => {
        console.log('%s: timeout complete %s! Getting loot...', characterName, actionObject.actionMsg.args.recipe);
        this.finishedAction(character!, actionObject)
          .then(() => {
            console.log('%s: Action done!', characterName);
            resolve();
          })
          .catch((error) => {
            reject(error)
          })
      }, actionObject.actionTime);

      onCancel( () => {
        clearTimeout(timeout);
        console.log('%s: clearTimeout CraftingAction', characterName);
        return reject('Action canceled!');
      });
    });
  }

  private async finishedAction(character: CharacterClass, actionObject: CraftingActionObject) {
    return new Promise<void>(async (resolve, reject) => {
      const recipe = dataLoader.resourceRecipeData[actionObject.actionMsg.args.recipe];
      const professionStats = character.getProfessionStats(recipe.profession)
  
      const resourcesUpdate: Partial<Resources> = {}
      resourcesUpdate[recipe.resource] = recipe.amount


      // validate selected ingredients again. The character need to have all ingredients now.
      for(const ingredientSlot of recipe.ingredients) {
        for(const slotItem of ingredientSlot.slot){
          if(actionObject.actionMsg.args.ingredients.includes(slotItem.resource)) {
            if(character.resources[slotItem.resource] < slotItem.amount) {
              return reject('Not enough resources!')
            }
            // deduct the amount from the character
            resourcesUpdate[slotItem.resource] = -slotItem.amount
            break
          }
        }
      }

      const experiencesUpdate = {
        [recipe.profession]: recipe.exp * (1 + professionStats.expBonus),
      }
  
      const expCharUpdate = recipe.expChar

      await updateCharacter({
        characterName: character.characterName, 
        resources: resourcesUpdate, 
        experiences: experiencesUpdate, 
        expChar: expCharUpdate
      })
      resolve()
    })
  }
}