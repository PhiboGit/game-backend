import { Types } from "mongoose";
import { Character } from "./character.js";
import { Currency } from "./currency.js";
import { Item } from "../item/item.js";
import { getLevel } from "../../utils/expTable.js";
import { Professions, equipmentSlots } from "./profession.js";
import { ActionObject } from "../../actions/types.js";
import { BonusTypePrefix, Resources } from "../../jsonValidators/dataValidator/validateResourceData.js";
import { itemConverterData } from "../../jsonValidators/dataValidator/validateItemConverterData.js";

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

  getItem(itemId: string): Item | null{
    if(!this.itemMap[itemId]) return null
    return this.itemMap[itemId]
  }
  
  getProfessionStats(profession: keyof Professions) {
    const stats = {
      level: getLevel(this.professions[profession].exp),

      luck: 0, // additive interger value
      speed: 0, // float multiplier; 0.5 = 50% more speed; time = (actionTime / (1+speed))  
      yieldMin: 0, // additive yield min 
      yieldMax: 0, // additive for max
      expBonus: 0 // multiplier for exp 0.5 = 50% more exp
    }

    

    equipmentSlots.forEach((slot) => {
      const itemId = this.professions[profession].equipment[slot]
      if(!itemId) return
      const item = this.getItem(itemId as unknown as string)
      if(!item) return
      stats.speed += item.baseStats?.attackSpeed ?? 0
      if(!item.bonusTypes) return
      stats.luck += convertGearScore('luck' , item.bonusTypes.luck_mining ?? 0)
      stats.speed += convertGearScore('speed' , (item.bonusTypes as any)[`speed_${profession}`] ?? 0)
      stats.yieldMin += convertGearScore('yieldMin' , (item.bonusTypes as any)[`yieldMin_${profession}`] ?? 0)
      stats.yieldMax += convertGearScore('yieldMax' , (item.bonusTypes as any)[`yieldMax_${profession}`] ?? 0)
      stats.expBonus += convertGearScore('exp' , (item.bonusTypes as any)[`exp_${profession}`] ?? 0)
    })
    console.log(profession, stats)
    return stats
  }
}

function convertGearScore(key: BonusTypePrefix, gearScore: number) {
  const percentage = (gearScore / itemConverterData.maxGearScoreStat)
  const min = itemConverterData.gearScoreConverter[key].min
  const max = itemConverterData.gearScoreConverter[key].max

  const value = min + (max - min) * percentage
  if (itemConverterData.gearScoreConverter[key]["integer/float"] === "integer") {
    return Math.floor(value)
  } else 
    return value
}