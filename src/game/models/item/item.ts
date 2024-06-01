import mongoose, { Types } from "mongoose";

export interface Item {
  _id: Types.ObjectId;
  name: string;
  equipmentProfessions: string[];
  equipmentType: string;
  level: number;
  tier: number;
  rarity: string;
  description: string;
  enchantingLevel: number;
}

const itemSchema = new mongoose.Schema<Item>({
  name: {type: String, default: "item"},
  equipmentProfessions: [{type: String}],
  equipmentType: {type: String, default: "none"},
  level: {type: Number, default: 0},
  tier: {type: Number, default: 1},
  rarity: {type: String, default: "common"},
  description: {type: String, default: "no description"},
  enchantingLevel: {type: Number, default: 0},


},
{ collection: 'items' })

const ItemModel = mongoose.model('Item', itemSchema)

export default ItemModel