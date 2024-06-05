import { ActionObject } from "./types.js";

export default interface IAction {
  validateAction(characterName: string, actionObject: ActionObject): Promise<void>;
  
  startAction(characterName: string, actionObject: ActionObject, onCancel: ( callback: () => void) => void): Promise<void>;
}