import { getCharacter } from "../services/characterService.js";

import characterNotifyer from "./outgoing/characterNotifyer.js";
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
  
    characterNotifyer.notifyInitCharacter(characterName, character)
  } catch (error) {
    console.error('Error initializing connection message:', error);
  }
}


async function sendInitStatus(characterName: string){
  try {
    characterNotifyer.notifyInitStatus(characterName)
  } catch (error) {
    console.error('Error initializing connection message:', error);
  }
}

async function sendInitGameData(characterName: string) {
  try {
    characterNotifyer.notifyInitGameData(characterName)
  } catch (error) {
    console.error('Error initializing connection message:', error);
  }
}