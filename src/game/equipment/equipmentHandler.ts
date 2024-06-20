import { EquipItemMsg } from "../jsonValidators/messageValidator/equipItemMsg.js";
import { getCharacter, updateCharacter } from "../services/characterService.js";
import { getLevel } from "../utils/expTable.js";

export async function handleEquipItem(characterName: string, msg: EquipItemMsg){
  const character = await getCharacter(characterName)
  if(!character){
    return
  }

  if(character.activeAction){
    console.log(`${characterName}: Cannot equip item while an action is in progress!`)
    return
  }

  if(msg.itemId === null){
    updateCharacter({characterName, equipment: {profession: msg.profession, equipmentSlot: msg.equipmentSlot, itemId: null}})
    return
  }

  const item = character.itemMap[msg.itemId]
  if(!item){
    console.log(`${characterName}: Item ${msg.itemId} not found!`)
    return
  }

  if(item.equipmentSlot !== msg.equipmentSlot || item.equipmentProfessions.indexOf(msg.profession) === -1){
    console.log(`${characterName}: Cannot equip item at ${msg.profession} ${msg.equipmentSlot}!`)
    return
  }

  if(item.level > getLevel(character.professions[msg.profession].exp)){
    console.log(`${characterName}: Cannot equip item at level ${item.level}!`)
    return
  }

  updateCharacter({characterName, equipment: {profession: msg.profession, equipmentSlot: msg.equipmentSlot, itemId: item._id}})
}