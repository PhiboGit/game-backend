import { Types } from "mongoose";
import { Character } from "./character.js";
import { Currency } from "./currency.js";
import { Item } from "../item/item.js";
import { getLevel } from "../../utils/expTable.js";
import { Professions } from "./profession.js";
import { ActionObject } from "../../actions/types.js";
import { Resources } from "../../jsonValidators/dataValidator/validateResourceData.js";

export default class CharacterClass implements Character {
  _id: Types.ObjectId;
  characterName: string
  expChar: number
  currency: Currency
  items: Types.ObjectId[]
  activeAction: ActionObject | null
  actionQueue: ActionObject[]
  professions: Professions
  resources: Resources
  itemMap: Record<string, Item> = {}
  

  constructor(character: Character, itemObjects: Item[]) {
    this._id = character._id
    this.characterName = character.characterName
    this.expChar = character.expChar
    this.currency = character.currency
    this.items = character.items
    this.activeAction = character.activeAction
    this.actionQueue = character.actionQueue
    this.professions = character.professions
    this.resources = character.resources
    
    itemObjects.forEach((item) => {
      this.itemMap[item._id as unknown as string] =  item
    })
  }

  // TODO: add function: 
  // getProfessionStats(profession: string): {luck: number, speed: number, yieldMin: number, yieldMax: number, expBonus: number} ...
  getProfessionStats(profession: keyof Professions) {
    const stats = {
      level: getLevel(this.professions[profession].exp),

      luck: 0,
      speed: 0,
      yieldMin: 0,
      yieldMax: 0,
      expBonus: 0
    }

    return stats
  }
}