import mongoose, { Types } from "mongoose";
import { EquipmentSlot, ProfessionId } from "../character/profession.js";
import { BonusType, RarityType } from "../../jsonValidators/dataValidator/validateResourceData.js";


export type Item = {
  _id: Types.ObjectId;
  item_id: string,
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
  item_id: {type: String, default: "no_item_id"},
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
    speed: {type: Number},
    armor: {type: Number},
    attack: {type: Number},
    attackSpeed: {type: Number},
  },

  bonusTypes: {
    con: {type: Number},
    int: {type: Number},
    str: {type: Number},
    dex: {type: Number},
    foc: {type: Number},

    speed_mining: {type: Number},
    exp_mining: {type: Number},
    luck_mining: {type: Number},
    yieldMin_mining: {type: Number},
    yieldMax_mining: {type: Number},

    speed_harvesting: {type: Number},
    exp_harvesting: {type: Number},
    luck_harvesting: {type: Number},
    yieldMin_harvesting: {type: Number},
    yieldMax_harvesting: {type: Number},

    speed_woodcutting: {type: Number},
    exp_woodcutting: {type: Number},
    luck_woodcutting: {type: Number},
    yieldMin_woodcutting: {type: Number},
    yieldMax_woodcutting: {type: Number},
  },
},
{ collection: 'items' })

const ItemModel = mongoose.model('Item', itemSchema)

export default ItemModel