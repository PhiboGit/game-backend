import { expTableData } from "../jsonValidators/dataValidator/validateExpTableData.js";
import { gatheringNodeData } from "../jsonValidators/dataValidator/validateGatheringNodeData.js";
import { lootTableData } from "../jsonValidators/dataValidator/validateLootTableData.js";
import { resourceData } from "../jsonValidators/dataValidator/validateResourceData.js";
import { resourceRecipeData } from "../jsonValidators/dataValidator/validateResourceRecipeData.js";

class DataLoader {
  resourceData = resourceData
  gatheringNodeData = gatheringNodeData
  resourceRecipeData = resourceRecipeData
  expTableData = expTableData
  lootTableData = lootTableData
}

export const dataLoader = new DataLoader()
