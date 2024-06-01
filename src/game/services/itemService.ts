import { Types } from "mongoose";
import ItemModel, { Item } from "../models/item/item.js";


export async function getItem(itemName: string): Promise<Item | null> {
  const itemDatabase = await ItemModel.findOne({ itemName })

  if(!itemDatabase) return null

  return itemDatabase
}

export async function getItems(itemIds: Types.ObjectId[]): Promise<Item[]> {
  const itemsDatabase = await ItemModel.find({ _id: { $in: itemIds } })

  return itemsDatabase
}