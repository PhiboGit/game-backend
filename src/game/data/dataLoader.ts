import { validateGatheringNodeData } from '../jsonValidators/dataValidator/validateGatheringNodeData.js';
import { validateResourceData } from '../jsonValidators/dataValidator/validateResourceData.js';
import { validateResourceRecipeData } from '../jsonValidators/dataValidator/validateResourceRecipeData.js';
import { validateExpTableData } from '../jsonValidators/dataValidator/validateExpTableData.js';
import { validateLootTableData } from '../jsonValidators/dataValidator/validateLootTableData.js';

import GatheringNodeDataJSON from '../data/gameDataJSON/gatheringNodeData.json'
import ResourceDataJSON from '../data/gameDataJSON/resourceData.json'
import ResourceRecipeDataJSON from '../data/gameDataJSON/resourceRecipeData.json'
import ExpTableDataJSON from '../data/gameDataJSON/expTableData.json'
import LootTableDataJSON from '../data/gameDataJSON/lootTableData.json'

export const gatheringNodeData = validate(validateGatheringNodeData , GatheringNodeDataJSON);
export const resourceData = validate(validateResourceData, ResourceDataJSON);
export const resourceRecipeData = validate(validateResourceRecipeData, ResourceRecipeDataJSON);
export const expTableData = validate(validateExpTableData, ExpTableDataJSON);
export const lootTableData = validate(validateLootTableData, LootTableDataJSON);


function validate<T>(validator: (data: any) => T, data: any) {
  try {
    validator(data);
    return data as T;
  } catch (error) {
    console.error("Error validating data: ", error);
    throw new Error("Error validating data");
  }

}
