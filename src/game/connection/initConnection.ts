import { connectionManager } from "../../app/websocket/WsConnectionManager.js";
import { dataLoader} from "../data/dataLoader.js";
import { getCharacter } from "../services/characterService.js";

import { InitCharacterMessage } from "./messageTypes.js";
export function initConnection(characterName: string){
  sendInitCharacter(characterName)
  sendInitGameData(characterName)
  sendInitStatus(characterName)
}


async function sendInitCharacter(characterName: string){
  try {
    const character = await getCharacter(characterName)
    if (!character) {
      throw new Error('Character not found');
    }
  
    const message: InitCharacterMessage = {
      type: 'init_character',
  
      character: character
    }
  
    connectionManager.sendMessage(characterName, JSON.stringify(message));
    
  } catch (error) {
    console.error('Error initializing connection message:', error);
  }
}


async function sendInitStatus(characterName: string){
  try {
    const message ={
      type: 'init_status',

      active_players: connectionManager.getActivePlayers(),
      time: new Date()
    }
  
    connectionManager.sendMessage(characterName, JSON.stringify(message));
    
  } catch (error) {
    console.error('Error initializing connection message:', error);
  }
}

async function sendInitGameData(characterName: string) {
  try {
    const message = {
      type: 'init_game_data',

      gatheringNodeData: dataLoader.gatheringNodeData,
      resourceData: dataLoader.resourceData
    };

    connectionManager.sendMessage(characterName, JSON.stringify(message));
  } catch (error) {
    console.error('Error initializing connection message:', error);
  }
}