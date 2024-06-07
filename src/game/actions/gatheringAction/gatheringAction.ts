import { dataLoader } from "../../data/dataLoader.js";
import { Resources, ResourceId } from "../../jsonValidators/dataValidator/validateResourceData.js";
import { GatheringMsg } from "../../jsonValidators/messageValidator/validateGatheringMsg.js";
import { getCharacter, updateCharacter } from "../../services/characterService.js";
import { parseLootTable } from "../../utils/lootTable.js";
import { rollRange } from "../../utils/randomDice.js";
import IAction from "../IAction.js";
import { getActionTime } from "../actionUtils.js";
import { ActionObject } from "../types.js";

export type GatheringActionObject = Omit<ActionObject, 'actionMsg'> & { actionMsg: GatheringMsg };

export default class GatheringAction implements IAction {
  async validateAction(characterName: string, actionObject: GatheringActionObject): Promise<void> {
    return new Promise(async (resolve, reject) => {
      // Validate inputs
      const nodeData = dataLoader.gatheringNodeData[actionObject.actionMsg.args.node];
      if(!nodeData) return reject('Invalid node!');
      const character = await getCharacter(characterName);
      if(!character) return reject('Character not found!');
      const professionStats = character.getProfessionStats(nodeData.profession)
      if(professionStats.level < nodeData.level) return reject('Not high enough level!')
      
      const actionTime = getActionTime(nodeData.time, professionStats.speed)
      actionObject.actionTime = actionTime;
      return resolve();
    })
  }

  async startAction(characterName: string, actionObject: GatheringActionObject, onCancel: ( callback: () => void) => void): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      // Validate inputs
      if(!actionObject.actionTime || actionObject.actionTime <= 0) return reject('Invalid actionTime passed to action!');

      const timeout = setTimeout(async() => {
        console.log('%s: timeout complete %s! Getting loot...', characterName, actionObject.actionMsg.args.node);
        await this.finishedAction(characterName, actionObject);
        console.log('%s: Action done!', characterName);
        resolve();
      }, actionObject.actionTime);

      onCancel( () => {
        clearTimeout(timeout);
        console.log('%s: clearTimeout GatheringAction', characterName);
        return reject('Action canceled!');
      });
    });
  }

  // Use the same character the action was started with. This would prevent hot swapping item/stats
  private async finishedAction(characterName: string, actionObject: GatheringActionObject) {
    const character = await getCharacter(characterName);
    const nodeData = dataLoader.gatheringNodeData[actionObject.actionMsg.args.node];
    const professionStats = character!.getProfessionStats(nodeData.profession)


    const amount = Math.floor(rollRange(nodeData.minAmount + professionStats.yieldMin, nodeData.maxAmount + professionStats.yieldMax))
    const lootBag = parseLootTable(nodeData.id, 1, professionStats.luck)

    const resources: Partial<Resources> = {}
    resources[nodeData.resource as ResourceId] = amount
    lootBag.forEach((item) => {
      resources[item.resource as ResourceId] = item.amount
    })

    const experiences = {
      [nodeData.profession]: nodeData.exp * (1 + professionStats.expBonus),
    }

    const expChar = nodeData.expChar

    await updateCharacter({characterName: character!.characterName, resources, experiences, expChar})
  }
}