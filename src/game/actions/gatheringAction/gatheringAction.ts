import { gatheringNodeData } from "../../data/dataLoader.js";
import { GatheringMsg } from "../../jsonValidators/messageValidator/validateGatheringMsg.js";
import CharacterClass from "../../models/character/CharacterClass.js";
import { getCharacter } from "../../services/characterService.js";
import { parseLootTable } from "../../utils/lootTable.js";
import { rollRange } from "../../utils/randomDice.js";
import ITaskAction from "../ITaskAction.js";
import { getActionTime } from "../actionUtils.js";
import { ActionObject } from "../types.js";

export type GatheringActionObject = Omit<ActionObject, 'actionMsg'> & { actionMsg: GatheringMsg };

export default class GatheringAction implements ITaskAction {
  async validateAction(characterName: string, actionObject: GatheringActionObject): Promise<void> {
    return new Promise(async (resolve, reject) => {
      // Validate inputs
      const nodeData = gatheringNodeData[actionObject.actionMsg.args.node];
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
      const character = await getCharacter(characterName);

      const timeout = setTimeout(async() => {
        console.log('%s: timeout complete %s! Getting loot...', characterName, actionObject.actionMsg.args.node);
        await this.finishedAction(character!, actionObject);
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
  async finishedAction(character: CharacterClass, actionObject: GatheringActionObject) {
    const nodeData = gatheringNodeData[actionObject.actionMsg.args.node];
    const professionStats = character!.getProfessionStats(nodeData.profession)


    const amount = Math.floor(rollRange(nodeData.minAmount + professionStats.yieldMin, nodeData.maxAmount + professionStats.yieldMax))
    const lootBag = parseLootTable(nodeData.id, 1, professionStats.luck)

    const resources = lootBag.concat({ resource: nodeData.resource, amount })

    const experiences: ({profession: string, amount: number} | {exp: number})[] = [
      {profession: nodeData.profession, amount: nodeData.exp * (1 + professionStats.expBonus)},
      {exp: nodeData.expChar}
    ]

    console.log('%s: Loot:', character.characterName, resources, experiences);
  }
}