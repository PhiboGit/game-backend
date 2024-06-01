

export interface IMessage{
  type: string
}
export interface InitCharacterMessage extends IMessage {
  type: 'init_character',

  character: any
}

export interface InitGameMessage extends IMessage {
  type: 'init_game',

  active_players: number
}
