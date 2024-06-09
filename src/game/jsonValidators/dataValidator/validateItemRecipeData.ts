import { ajv } from "../ajvInstance.js";
import { BonusType, ResourceId, bonusTypes, resourceIds } from "./validateResourceData.js";
import ItemRecipeDataJSON from "../../data/gameDataJSON/itemRecipeData.json";
import { EquipmentSlot, ProfessionId, equipmentSlots, professionIds } from "../../models/character/profession.js";

export type ItemRecipe = {
  id: string
  displayName: string
  description: string
  profession: ProfessionId
  level: number
  time: number
  exp: number
  expChar: number

  equipmentSlot: EquipmentSlot
  equipmentProfessions: ProfessionId[]
  tier: number
  equipLevel: number

  baseGearScore: number
  availableBoni: BonusType[]
  ingredients: {
    required: boolean
    slot: {
      resource: ResourceId
      amount: number
    }[]
  }[]
}
export type ItemRecipeData = {[x: string]: ItemRecipe}

const schemaItemRecipe= {
  values: {
    properties: {
      id: { type: "string" },
      displayName: { type: "string" },
      description: { type: "string" },
      profession: { enum: professionIds },
      level: { type: "uint32" },
      time: { type: "uint32" },
      exp: { type: "uint32" },
      expChar: { type: "uint32" },
      equipmentSlot: { enum: equipmentSlots },
      equipmentProfessions: {
        elements: { enum: professionIds }
      },
      tier: { type: "uint32" },
      equipLevel: { type: "uint32" },
      baseGearScore: { type: "uint32" },
      availableBoni: {
        elements: { enum: bonusTypes }
      },
      ingredients: {
        elements: {
          properties: {
            required: { type: "boolean" },
            slot: {
              elements: {
                properties: {
                  resource: { enum: resourceIds },
                  amount: { type: "uint32" }
                },
                additionalProperties: false
              }
            }
          },
          additionalProperties: false
        }
      }
    },
    additionalProperties: false
  }
};



const validate = ajv.compile<ItemRecipeData>(schemaItemRecipe)

function validateItemRecipeData (data: any): ItemRecipeData {
  if (validate(data)) {
    console.log("ItemRecipeData is valid")
    return data as ItemRecipeData
  } else{
    console.error("Error validating ItemRecipeData: ", validate.errors);
    throw new Error("Error validating ItemRecipeData");
  }
}

export const itemRecipeData = validateItemRecipeData(ItemRecipeDataJSON)