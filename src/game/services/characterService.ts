import CharacterClass from "../models/character/CharacterClass.js"
import CharacterModel from "../models/character/character.js"
import ItemModel from "../models/item/item.js"


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
