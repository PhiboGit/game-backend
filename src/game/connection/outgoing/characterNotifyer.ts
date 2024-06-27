import { Types } from "mongoose"
import { ActionObject } from "../../actions/types.js"
import { Resources } from "../../jsonValidators/dataValidator/validateResourceData.js"
import { Currency } from "../../models/character/currency.js"
import { ProfessionId, EquipmentSlot } from "../../models/character/profession.js"
import { Item } from "../../models/item/item.js"
import { connectionManager } from "../../../app/websocket/WsConnectionManager.js"
import CharacterClass, { ProfessionStats } from "../../models/character/CharacterClass.js"
import { dataLoader } from "../../data/dataLoader.js"


export type CharacterUpdate = {
  resources?: Partial<Resources>,
  experiences?: Partial<Record<ProfessionId, number>>,
  expChar?: number,
  currency?: Partial<Currency>
  activeAction?: ActionObject | null,
  actionQueue?: ActionObject[]
  updateItem?: Item
  removeItem?: Types.ObjectId
  equipment?: {
    profession: ProfessionId
    equipmentSlot: EquipmentSlot
    itemId: Types.ObjectId | null
  }
}
class CharacterNotifyer {
  
  notifyInitCharacter(characterName: string, character: CharacterClass) {

    connectionManager.sendMessage(characterName, JSON.stringify({type: 'init_character', character}))
  }

  notifyInitStatus(characterName: string) {
    const active_players = connectionManager.getActivePlayers()
    connectionManager.sendMessage(characterName, JSON.stringify({type: 'init_status', active_players, time: new Date()  }))
  }

  notifyInitGameData(characterName: string) {

    const message = {
      type: 'init_game',

      gatheringNodeData: dataLoader.gatheringNodeData,
      resourceData: dataLoader.resourceData,
      expTableData: dataLoader.expTableData,
      itemRecipeData: dataLoader.itemRecipeData,
      resourceRecipeData: dataLoader.resourceRecipeData,
      rarityResourceRecipeData: dataLoader.rarityResourceRecipeData,
      itemConverterData: dataLoader.itemConverterData
    };

    connectionManager.sendMessage(characterName, JSON.stringify(message));
  }

  notifyCharacterUpdate(characterName: string, update: CharacterUpdate) {

    connectionManager.sendMessage(characterName, JSON.stringify({type: 'update_character', update}))
  }

  notifyProfessionStats(characterName: string, professionId: ProfessionId, professionStats: ProfessionStats) {

    connectionManager.sendMessage(characterName, JSON.stringify({ type: 'request_professionStats', professionId, stats: professionStats}))
  }
}

export default new CharacterNotifyer() 