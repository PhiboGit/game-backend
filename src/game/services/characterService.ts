import { Types } from "mongoose"
import { connectionManager } from "../../app/websocket/WsConnectionManager.js"
import { ActionObject } from "../actions/types.js"
import { Resources, ResourceId } from "../jsonValidators/dataValidator/validateResourceData.js"
import CharacterClass from "../models/character/CharacterClass.js"
import CharacterModel from "../models/character/character.js"
import { Currency, CurrencyId } from "../models/character/currency.js"
import { EquipmentSlot, ProfessionId } from "../models/character/profession.js"
import ItemModel, { Item } from "../models/item/item.js"
import { getItem } from "./itemService.js"


export async function createCharacter(characterName: string){

  return CharacterModel.create({characterName})
}
export async function getCharacter(characterName: string): Promise<CharacterClass | null> {
  const characterDatabase = await CharacterModel.findOne({ characterName })

  if(!characterDatabase) return null

  const itemDatabase = await ItemModel.find({ _id: { $in: characterDatabase.items } })

  const character = new CharacterClass(characterDatabase, itemDatabase)

  return character
}

export async function getAllCharacters(): Promise<CharacterClass[]> {
  const characterDatabases = await CharacterModel.find()
  const characters: CharacterClass[] = []

  await Promise.all(characterDatabases.map(async(characterDatabase) => {
    const itemDatabase = await ItemModel.find({ _id: { $in: characterDatabase.items } })
    const character = new CharacterClass(characterDatabase, itemDatabase)
    characters.push(character)
  }))
  return characters
}

type UpdateParameters = {
  characterName: string,
  resources?: Partial<Resources>,
  experiences?: Partial<Record<ProfessionId, number>>,
  expChar?: number,
  currency?: Partial<Currency>
  activeAction?: ActionObject | null,
  actionQueue?: ActionObject[]
  itemId_push?: Types.ObjectId
  itemId_pull?: Types.ObjectId
  equipment?: {
    profession: ProfessionId
    equipmentSlot: EquipmentSlot
    itemId: Types.ObjectId | null
  }
}
export async function updateCharacter(
  updateParameters: UpdateParameters
): Promise<void> {
  const {characterName, resources, experiences, expChar, currency, activeAction, actionQueue, itemId_push, itemId_pull, equipment} = updateParameters

  // increments
  const $inc: any = {}
  if(expChar) $inc['expChar'] = updateParameters.expChar
  if(resources){
    Object.entries(resources).forEach(([resource, amount]) => {
      $inc[`resources.${resource as ResourceId}`] = amount
    })
  } 

  if(experiences) {
    Object.entries(experiences).forEach(([profession, amount]) => {
      $inc[`professions.${profession as ProfessionId}.exp`] = amount
    })
  }

  if(currency) {
    Object.entries(currency).forEach(([currency, amount]) => {
      $inc[`currency.${currency as CurrencyId}`] = amount
    })
  }

  // sets
  const $set: any  = {}
  if(activeAction || activeAction === null) $set['activeAction'] = activeAction
  if(actionQueue) $set['actionQueue'] = actionQueue

  if(equipment) {
    $set[`professions.${equipment.profession}.equipment.${equipment.equipmentSlot}`] = equipment.itemId
  }


  // push
  const $push: any = {}
  if(itemId_push) $push['items'] = itemId_push

  // pull
  const $pull: any = {}
  if(itemId_pull) $pull['items'] = itemId_pull


  const update = {
    $inc,
    $set,
    $push,
    $pull
  }
  console.log('%s: updates: ', characterName, update)
  
  try {
    await CharacterModel.updateOne(
      { characterName },
      update 
    )
    // data send to the client
    const updatedData: Omit<UpdateParameters, 'itemId_push'> & {item?: Item} = {...updateParameters}
      
    if(itemId_push) {
      const item = await getItem(itemId_push)
      if(item) updatedData['item'] = item
    }
    connectionManager.sendMessage(characterName, JSON.stringify({type: 'update_character', updatedData}))
  } catch (error) {
    
  }
}
