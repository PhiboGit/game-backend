import { connectionManager } from "../../app/websocket/WsConnectionManager.js";
import { getCharacter } from "../services/characterService.js";

import { InitCharacterMessage, InitGameMessage } from "./messageTypes.js";
export function initConnection(characterName: string){
  sendInitCharacter(characterName)
  sendInitGame(characterName)
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


async function sendInitGame(characterName: string){
  try {
    const message: InitGameMessage = {
      type: 'init_game',

      active_players: connectionManager.getActivePlayers()
    }
  
    connectionManager.sendMessage(characterName, JSON.stringify(message));
    
  } catch (error) {
    console.error('Error initializing connection message:', error);
  }
}