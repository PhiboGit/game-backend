import { JTDDataType } from "ajv/dist/jtd.js";
import { ajv } from "../ajvInstance.js";
import { RarityType, ResourceId, rarities, resourceIds } from "./validateResourceData.js";
import RarityResourceRecipeDataJSON from "../../data/gameDataJSON/rarityResourceRecipe.json";

const schemaRarityResourceRecipe = {
  "values": { "ref": "RarityResourceRecipe" },

  "definitions": {
    "RarityResourceRecipe": {
      "properties": {
        "id": { "type": "string" },
        "profession": { "enum": ["weaving", "smelting", "woodworking", "engineer", "smith", "artificer"] },
        "displayName": { "type": "string" },
        "description": { "type": "string" },


        "resource_rarity": { 
          "optionalProperties": {
            "none": { enum: resourceIds },
            "common": { enum: resourceIds },
            "uncommon": { enum: resourceIds },
            "rare": { enum: resourceIds },
            "epic": { enum: resourceIds },
            "legendary": { enum: resourceIds }
          },
          "additionalProperties": false
        },

        "maxRoll": { "type": "uint32" },
        "rarityRoll": {
          "elements": {
            "properties": {
              "value": { "type": "uint32" },
              "rarity": { "enum": rarities }
            },
            "additionalProperties": false
          }
        },
        "amount": { "type": "uint32" },
        "level": { "type": "uint32" },
        "time": { "type": "uint32" },
        "exp": { "type": "uint32" },
        "expChar": { "type": "uint32" },

        "ingredients": {
          "elements": {
            "properties": {
              "required": { "type": "boolean" },
              "slot": {
                "elements": {
                  "properties": {
                    "resource": { enum: resourceIds },
                    "amount": { "type": "uint32" }
                  },
                  "additionalProperties": false
                }
              }
            },
            "additionalProperties": false
          }
        }

      },
      "optionalProperties": {
        
      },
      "additionalProperties": false
    }
  }
} as const

export type RarityResourceRecipe = {
  id: string
  displayName: string
  description: string
  profession: "weaving" | "smelting" | "woodworking"
  resource_rarity: {
    none?: ResourceId
    common?: ResourceId
    uncommon?: ResourceId
    rare?: ResourceId
    epic?: ResourceId
    legendary?: ResourceId
  }
  maxRoll: number
  rarityRoll: { value: number, rarity: RarityType }[]
  amount: number
  level: number
  time: number
  exp: number
  expChar: number
  ingredients: {
    required: boolean
    slot: {
      resource: ResourceId
      amount: number
    }[]
  }[]
}

export type RarityResourceRecipeData = Record<string, RarityResourceRecipe>
const validate = ajv.compile<RarityResourceRecipeData>(schemaRarityResourceRecipe)

function validateRarityResourceRecipeData (data: any): RarityResourceRecipeData {
  if (validate(data)) {
    console.log("ResourceRarityRecipeData is valid")
    return data as RarityResourceRecipeData
  } else{
    console.error("Error validating ResourceRarityRecipeData: ", validate.errors);
    throw new Error("Error validating ResourceRarityRecipeData");
  }
}

export const rarityResourceRecipeData = validateRarityResourceRecipeData(RarityResourceRecipeDataJSON)