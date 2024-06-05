import { CraftingMsg } from "../../jsonValidators/messageValidator/validateCraftingMsg.js";
import IAction from "../IAction.js";
import { ActionObject } from "../types.js";

export type CraftingActionObject = Omit<ActionObject, 'actionMsg'> & { actionMsg: CraftingMsg };
export default class CraftingAction implements IAction{
  validateAction(characterName: string, actionObject: ActionObject): Promise<void> {
    throw new Error("Method not implemented.");
  }
  startAction(characterName: string, actionObject: ActionObject, onCancel: (callback: () => void) => void): Promise<void> {
    throw new Error("Method not implemented.");
  }

}