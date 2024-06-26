import { expTableData } from "../jsonValidators/dataValidator/validateExpTableData.js";
import { gatheringNodeData } from "../jsonValidators/dataValidator/validateGatheringNodeData.js";
import { itemConverterData } from "../jsonValidators/dataValidator/validateItemConverterData.js";
import { itemRecipeData } from "../jsonValidators/dataValidator/validateItemRecipeData.js";
import { lootTableData } from "../jsonValidators/dataValidator/validateLootTableData.js";
import { rarityResourceRecipeData } from "../jsonValidators/dataValidator/validateRarityResourceRecipeData.js";
import { resourceData } from "../jsonValidators/dataValidator/validateResourceData.js";
import { resourceRecipeData } from "../jsonValidators/dataValidator/validateResourceRecipeData.js";

class DataLoader {
  resourceData = resourceData
  gatheringNodeData = gatheringNodeData
  resourceRecipeData = resourceRecipeData
  expTableData = expTableData
  lootTableData = lootTableData
  rarityResourceRecipeData = rarityResourceRecipeData
  itemRecipeData = itemRecipeData
  itemConverterData = itemConverterData
}

export const dataLoader = new DataLoader()
