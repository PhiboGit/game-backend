import { ajv } from "../ajvInstance.js";
import { RarityType, rarities } from "./validateResourceData.js";
import ItemCraftingTableDataJSON from "../../data/gameDataJSON/itemCraftingTableData.json";
import { JTDSchemaType } from "ajv/dist/jtd.js";

export type ItemCraftingTableData = {
  rarityTable: {event: RarityType, value: number}[]
  bonusTypesPerRarity: {
    [key in RarityType]: number
  }
}

const schemaItemRecipe: JTDSchemaType<ItemCraftingTableData> =  {
  properties:{
    rarityTable: {
      elements: {
        properties: {
          event: {enum: [...rarities]},
          value: {type: "uint32"}
        }
      }
    },
    bonusTypesPerRarity: {
      properties: {
        none: {type: "uint32"},
        common: {type: "uint32"},
        uncommon: {type: "uint32"},
        rare: {type: "uint32"},
        epic: {type: "uint32"},
        legendary: {type: "uint32"}
      }
    }
  }
  
};



const validate = ajv.compile<ItemCraftingTableData>(schemaItemRecipe)

function validateItemCraftingTableData (data: any): ItemCraftingTableData {
  if (validate(data)) {
    console.log("ItemCraftingTableData is valid")
    return data as ItemCraftingTableData
  } else{
    console.error("Error validating ItemCraftingTableData: ", validate.errors);
    throw new Error("Error validating ItemCraftingTableData");
  }
}

export const itemCraftingTableData = validateItemCraftingTableData(ItemCraftingTableDataJSON)