import { ActionMsg } from "./types.js";

export default interface ITaskAction {
  validateAction(characterName: string, action: ActionMsg): Promise<void>;
  
  startAction(characterName: string, action: ActionMsg, onCancel: ( callback: () => void) => void): Promise<void>;
}