import { actionManager } from "../../actions/actionManager.js";
import { validateActionMsg } from "../../jsonValidators/messageValidator/validateActionMsg.js";
import { validateCraftingMsg } from "../../jsonValidators/messageValidator/validateCraftingMsg.js";
import { validateGatheringMsg } from "../../jsonValidators/messageValidator/validateGatheringMsg.js";
import { IMessage } from "../messageTypes.js";



export function incomingMessages(characterName: string, msg: string) {
  try {
    const message = JSON.parse(msg)
    console.log('received from %s: %s', characterName, JSON.stringify(message));
    if (!message || !message.type) {
      throw new Error('Invalid message, has no "type" property!');
    }

    routeMessage(characterName, message)
  } catch (error) {
    console.log('Incoming message, not a JSON! Should have a "type" property.');
  }
}

function routeMessage(characterName: string, msg: IMessage) {
    
  switch (msg.type) {
    case 'test':
      console.log('%s: test', characterName)
      break
    case 'action':
      if (validateGatheringMsg(msg)) {
        console.log('Valid! %s msg: %o', characterName, msg)
        actionManager.addAction(characterName, msg)
        return
      }
      if (validateCraftingMsg(msg)) {
        console.log('Valid! %s msg: %o', characterName, msg)
        return
      }
    default:
      console.log('unknown message')
  }
}