import { connectionManager } from "../../app/websocket/WsConnectionManager.js";
import Character, { ICharacter } from "../models/character.js";
import { InitCharacterMessage } from "./messageTypes.js";
export function initConnection(characterName: string){
  sendInitCharacter(characterName)
}


async function sendInitCharacter(characterName: string){
  try {
    const character = await Character.findOne({ characterName }).lean<ICharacter>()
    console.log(character)
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