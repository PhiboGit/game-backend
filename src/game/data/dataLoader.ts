import { validateGatheringNodeData } from '../jsonValidators/dataValidator/validateGatheringNodeData.js';
import { validateResourceData } from '../jsonValidators/dataValidator/validateResourceData.js';

import GatheringNodeDataJSON from '../data/gameDataJSON/gatheringNodeData.json'
import ResourceDataJSON from '../data/gameDataJSON/resourceData.json'

export const gatheringNodeData = validate(validateGatheringNodeData , GatheringNodeDataJSON);
export const resourceData = validate(validateResourceData, ResourceDataJSON);


function validate<T>(validator: (data: any) => T, data: any) {
  try {
    validator(data);
    return data as T;
  } catch (error) {
    console.error("Error validating data: ", error);
    throw new Error("Error validating data");
  }

}
