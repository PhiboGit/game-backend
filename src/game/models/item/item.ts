import mongoose, { Types } from "mongoose";
import { EquipmentSlot, ProfessionId } from "../character/profession.js";
import { BonusType, RarityType } from "../../jsonValidators/dataValidator/validateResourceData.js";


export interface Item {
  _id: Types.ObjectId;
  displayName: string;
  equipmentProfessions: ProfessionId[];
  equipmentSlot: EquipmentSlot;
  level: number;
  tier: number;
  rarity: RarityType;
  description: string;
  enchantingLevel: number;
  craftedGearScore: number;

  baseStats: {
    speed?: number;
    armor?: number;
    attack?: number;
    attackSpeed?: number;
  }

  bonusTypes: Partial<{[key in BonusType]: number}>;
}

const itemSchema = new mongoose.Schema<Item>({
  displayName: {type: String, default: "item"},
  equipmentProfessions: [{type: String}],
  equipmentSlot: {type: String},
  level: {type: Number, default: 0},
  tier: {type: Number, default: 1},
  rarity: {type: String, default: "none"},
  description: {type: String, default: "no description"},
  enchantingLevel: {type: Number, default: 0},
  craftedGearScore: {type: Number, default: 0},

  baseStats: {
    
    speed: {type: Number, default: 0},
    armor: {type: Number, default: 0},
    attack: {type: Number, default: 0},
    attackSpeed: {type: Number, default: 0},
    
  },

  bonusTypes: {
   
    con: {type: Number, default: 0},
    int: {type: Number, default: 0},
    str: {type: Number, default: 0},
    dex: {type: Number, default: 0},
    foc: {type: Number, default: 0},

    speed_mining: {type: Number, default: 0},
    exp_mining: {type: Number, default: 0},
    luck_mining: {type: Number, default: 0},
    yieldMin_mining: {type: Number, default: 0},
    yieldMax_mining: {type: Number, default: 0},

    speed_harvesting: {type: Number, default: 0},
    exp_harvesting: {type: Number, default: 0},
    luck_harvesting: {type: Number, default: 0},
    yieldMin_harvesting: {type: Number, default: 0},
    yieldMax_harvesting: {type: Number, default: 0},

    speed_woodcutting: {type: Number, default: 0},
    exp_woodcutting: {type: Number, default: 0},
    luck_woodcutting: {type: Number, default: 0},
    yieldMin_woodcutting: {type: Number, default: 0},
    yieldMax_woodcutting: {type: Number, default: 0},
    
  },
},
{ collection: 'items' })

const ItemModel = mongoose.model('Item', itemSchema)

export default ItemModel