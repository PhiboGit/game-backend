import { IMessage } from "../messageTypes.js";


export function incomingMessages(characterName: string, msg: string) {
  try {
    const message = JSON.parse(msg)
    console.log('received from %s: %s', characterName, JSON.stringify(message));
    if (!message || !message.type) {
      throw new Error('Invalid message');
    }

    routeMessage(characterName, message)
  } catch (error) {
    console.log('Incoming message, not a JSON!');
  }
}

function routeMessage(characterName: string, msg: IMessage) {
  
    switch (msg.type) {
      case 'test':
        console.log('%s: test', characterName)
        break
      default:
        console.log('unknown message')
    }
}