import { resourceData } from "../data/dataLoader.js";
import { ResourceId } from "../models/character/resources.js";
import { getCharacter, updateCharacter } from "../services/characterService.js";

export default async function sellResources(characterName: string, resource: ResourceId, amount: number){
  const character = await getCharacter(characterName);

  if(!character){
    return
  }

  if(character.resources[resource] < amount){
    console.log(`${characterName}: Not enough ${resource} to sell!`)
    return
  }

  const gold = resourceData[resource].sellValue * amount

  await updateCharacter({characterName, resources: {[resource]: -amount}, currency: {gold: gold}})
  return
}