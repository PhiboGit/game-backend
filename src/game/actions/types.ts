import { CraftingMsg } from "../jsonValidators/messageValidator/validateCraftingMsg.js"
import { GatheringMsg } from "../jsonValidators/messageValidator/validateGatheringMsg.js"

export type ActionObject = {
  counter: number
  actionMsg: GatheringMsg | CraftingMsg
}

export type ActionMsg = GatheringMsg | CraftingMsg