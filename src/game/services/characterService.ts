import { Types } from "mongoose"
import CharacterModel, { Character } from "../models/character/character.js"
import { Currency } from "../models/character/currency.js"
import { Profession } from "../models/character/profession.js"
import { Resources } from "../models/character/resources.js"
import { Item } from "../models/item/item.js"
import { getItems } from "./itemService.js"


export async function createCharacter(characterName: string){

  return CharacterModel.create({characterName})
}
export async function getCharacter(characterName: string): Promise<CharacterClass | null> {
  const characterDatabase = await CharacterModel.findOne({ characterName })

  if(!characterDatabase) return null

  const character = new CharacterClass(characterDatabase)

  console.log(character)
  return character
}


class CharacterClass implements Character {
  _id: Types.ObjectId;
  characterName: string
  exp: number
  currency: Currency
  items: Types.ObjectId[]
  activeAction: object | null
  actionQueue: object[]
  professions: { woodcutting: Profession; mining: Profession; harvesting: Profession }
  resources: Resources
  itemMap: Map<Types.ObjectId, Item> = new Map()
  

  constructor(character: Character) {
    this._id = character._id
    this.characterName = character.characterName
    this.exp = character.exp
    this.currency = character.currency
    this.items = character.items
    this.activeAction = character.activeAction
    this.actionQueue = character.actionQueue
    this.professions = character.professions
    this.resources = character.resources

    const itemsDatabase = getItems(character.items)

    itemsDatabase.then((items) => {
      items.forEach((item) => {
        this.itemMap.set(item._id, item)
      })
    })
  }

}