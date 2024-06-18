import { dataLoader } from "../../data/dataLoader.js";
import { RarityType, ResourceId, Resources } from "../../jsonValidators/dataValidator/validateResourceData.js";
import CharacterClass from "../../models/character/CharacterClass.js";
import { getCharacter, updateCharacter } from "../../services/characterService.js";
import { rollDice, rollRange } from "../../utils/randomDice.js";
import IAction from "../IAction.js";
import { getActionTime } from "../actionUtils.js";
import { CraftingActionObject, deductResourceIngredients, validateIngredients } from "./craftingUtils.js";

export default class CraftingRarityResourceAction implements IAction{
  validateAction(characterName: string, actionObject: CraftingActionObject): Promise<void> {
    return new Promise(async(resolve, reject) => {
      const character = await getCharacter(characterName);
      if(!character) return reject('Character not found!');
      const recipe = dataLoader.rarityResourceRecipeData[actionObject.actionMsg.args.recipe]
      if(!recipe) return reject('Invalid recipe!');
      // Validate inputs
      const professionStats = character.getProfessionStats(recipe.profession)
      if(professionStats.level < recipe.level) return reject('Not high enough level!')
      try {
        await validateIngredients(character, actionObject.actionMsg.args.ingredients, recipe.ingredients)
      } catch (error) {
        return reject(error)
      }

      const actionTime = getActionTime(recipe.time, professionStats.speed)
      actionObject.actionTime = actionTime;
      return resolve();
    })
  }

  startAction(characterName: string, actionObject: CraftingActionObject, onCancel: (callback: () => void) => void): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      // Validate inputs
      if(!actionObject.actionTime || actionObject.actionTime <= 0) return reject('Invalid actionTime passed to action!');

      const timeout = setTimeout(async() => {
        console.log('%s: timeout complete %s! Getting loot...', characterName, actionObject.actionMsg.args.recipe);
        this.finishedAction(characterName, actionObject)
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

  private async finishedAction(characterName: string, actionObject: CraftingActionObject) {
    return new Promise<void>(async (resolve, reject) => {
      const character = await getCharacter(characterName);
      if(!character) return reject('Character not found!');
      const recipeId = actionObject.actionMsg.args.recipe
      const selectedIngredients:ResourceId[] = actionObject.actionMsg.args.ingredients
      const recipe = dataLoader.rarityResourceRecipeData[recipeId]
      const professionStats = character.getProfessionStats(recipe.profession)
  
      // Update character with new values. mostly the increments   
      const experiencesUpdate = {[recipe.profession]: recipe.exp * (1 + professionStats.expBonus)}
      const expCharUpdate = recipe.expChar
      let resourcesUpdate: Partial<Resources> = {}
      try {
        const consumedResources = await deductResourceIngredients(character, selectedIngredients, recipe.ingredients)
        resourcesUpdate = {...resourcesUpdate, ...consumedResources}
      } catch (error) {
        return reject(error)
      }

      // and finally the resource that was crafted
      const rarity = this.getRartiy( character, recipeId, selectedIngredients)
      const rarityResource = recipe.resource_rarity[rarity]
      if(!rarityResource) return reject('Invalid rarity!')
      resourcesUpdate[rarityResource] = recipe.amount

      await updateCharacter({
        characterName: character.characterName, 
        resources: resourcesUpdate, 
        experiences: experiencesUpdate, 
        expChar: expCharUpdate
      })
      resolve()
    })
  }

  private getRartiy(character: CharacterClass, recipeId: string, selectedIngredients: ResourceId[]): RarityType {
    const recipe = dataLoader.rarityResourceRecipeData[recipeId]
    const events = recipe.rarityRoll
    let bonus = 0
    //TODO: add value to the rolledValue based on selected ingredients and level
    const rolledValue = rollRange(bonus ,recipe.maxRoll)
    let rarity: RarityType = 'none'
    for( const event of events) {
      if(rolledValue >= event.value ){
        rarity = event.rarity
      }
    }
    console.log('%s: Crafting rolled %d rarity: %s', character.characterName, rolledValue, rarity)
    return rarity
  }

}