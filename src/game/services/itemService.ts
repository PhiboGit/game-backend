import { Types } from "mongoose";
import ItemModel, { Item } from "../models/item/item.js";


export async function getItem(itemId: Types.ObjectId): Promise<Item | null> {
  const itemDatabase = await ItemModel.findOne({ _id: itemId })

  if(!itemDatabase) return null

  return itemDatabase
}

export async function getItems(itemIds: Types.ObjectId[]): Promise<Item[]> {
  const itemsDatabase = await ItemModel.find({ _id: { $in: itemIds } })

  return itemsDatabase
}

 export async function createItem(itemProperties: Omit<Item, '_id'>): Promise<Types.ObjectId> {
  const item = await ItemModel.create(itemProperties)
  return item._id
}