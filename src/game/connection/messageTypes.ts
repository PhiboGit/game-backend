import {ICharacter} from "../models/character.js"

export type InitCharacterMessage = {
  type: 'init_character',

  character: ICharacter
}