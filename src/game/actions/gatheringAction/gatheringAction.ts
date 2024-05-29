import { GatheringMsg } from "../../jsonValidators/messageValidator/validateGatheringMsg.js";
import ITaskAction from "../ITaskAction.js";

export default class GatheringAction implements ITaskAction {
  async validateAction(characterName: string, action: GatheringMsg): Promise<void> {
    return new Promise((resolve, reject) => {
      if(action.args.node === 'TreeT1') {
        console.log('%s met all requirements for GatheringAction', characterName)
        return resolve()
      }
      return reject('Invalid node!');
    })
  }

  async startAction(characterName: string, action: GatheringMsg, activeActionMap: Map<string, () => void>): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        console.log('%s: timeout complete %s!', characterName, action.args.node);
        resolve();
      }, 5000);

      activeActionMap.set(characterName, () => {
        clearTimeout(timeout);
        console.log('%s: clearTimeout GatheringAction', characterName);
        return reject('Action canceled!');
      });
    });
  }
}