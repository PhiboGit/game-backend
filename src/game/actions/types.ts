import { CraftingMsg } from "../jsonValidators/messageValidator/validateCraftingMsg.js"
import { GatheringMsg } from "../jsonValidators/messageValidator/validateGatheringMsg.js"

export type ActionObject = {
  counter: number
  actionTime: number | null
  actionMsg: ActionMsg
}

export type ActionMsg = GatheringMsg | CraftingMsg