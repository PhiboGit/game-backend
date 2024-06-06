import { actionManager } from "../../actions/actionManager.js";
import { validateCancelActionMsg } from "../../jsonValidators/messageValidator/cancelActionMsg.js";
import { validateSellResourceMsg } from "../../jsonValidators/messageValidator/sellResource.js";
import { validateCraftingMsg } from "../../jsonValidators/messageValidator/validateCraftingMsg.js";
import { validateGatheringMsg } from "../../jsonValidators/messageValidator/validateGatheringMsg.js";
import sellResources from "../../marketplace/sellResources.js";
import { IMessage } from "../messageTypes.js";



export function incomingMessages(characterName: string, msg: string) {
  let validMsg: IMessage | undefined = undefined
  try {
    const message = JSON.parse(msg)
    console.log('received from %s: %s', characterName, JSON.stringify(message));
    if (!message || !message.type) {
      throw new Error('Invalid message, has no "type" property!');
    }
    validMsg = message
  } catch (error) {
    console.log('Incoming message, not a JSON! Should have a "type" property.');
  }
  if(validMsg){
    routeMessage(characterName, validMsg)
  }
}

function routeMessage(characterName: string, msg: IMessage) {
    
  switch (msg.type) {
    case 'gathering':
      const gatheringMsg = validateGatheringMsg(msg)
      if (gatheringMsg) {
        console.log('Valid! %s msg: %o', characterName, gatheringMsg)
        actionManager.addAction(characterName, gatheringMsg)
      }
      break
    case 'crafting':
      const craftingMsg = validateCraftingMsg(msg)
      if (craftingMsg) {
        console.log('Valid! %s msg: %o', characterName, craftingMsg)
        actionManager.addAction(characterName, craftingMsg)
      }
      break
    case 'cancelAction':
      if(validateCancelActionMsg(msg)) {
        console.log('Valid! %s msg: %o', characterName, msg)
        actionManager.cancelAction(characterName, msg.index)
      }
      break
    case 'sell_resource':
      const sellResourceMsg = validateSellResourceMsg(msg)
      if(sellResourceMsg) {
        console.log('Valid! %s msg: %o', characterName, msg)
        sellResources(characterName, sellResourceMsg.resource, sellResourceMsg.amount)
      }
      break
    default:
      console.log('unknown message')
  }
}