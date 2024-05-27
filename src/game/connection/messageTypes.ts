import {ICharacter} from "../models/character.js"

export type InitCharacterMessage = {
  type: 'init_character',

  character: ICharacter
}

export type InitGameMessage = {
  type: 'init_game',

  active_players: number
}