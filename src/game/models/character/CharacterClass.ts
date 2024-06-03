import { Types } from "mongoose";
import { Character } from "./character.js";
import { Currency } from "./currency.js";
import { Profession } from "./profession.js";
import { Resources } from "./resources.js";
import { Item } from "../item/item.js";

export default class CharacterClass implements Character {
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
  

  constructor(character: Character, itemObjects: Item[]) {
    this._id = character._id
    this.characterName = character.characterName
    this.exp = character.exp
    this.currency = character.currency
    this.items = character.items
    this.activeAction = character.activeAction
    this.actionQueue = character.actionQueue
    this.professions = character.professions
    this.resources = character.resources
    
    itemObjects.forEach((item) => {
      this.itemMap.set(item._id, item)
    })
  }

  // TODO: add function: 
  // getProfessionStats(profession: string): {luck: number, speed: number, yieldMin: number, yieldMax: number, expBonus: number} ...

}