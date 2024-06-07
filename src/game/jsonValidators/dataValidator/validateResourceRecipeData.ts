import { ajv } from "../ajvInstance.js";
import { ResourceId, resourceIds } from "./validateResourceData.js";
import ResourceRecipeDataJSON from "../../data/gameDataJSON/resourceRecipeData.json";
import { ProfessionId, professionIds } from "../../models/character/profession.js";

const schemaResourceRecipe = {
  "values": { "ref": "ResourceRecipe" },

  "definitions": {
    "ResourceRecipe": {
      "properties": {
        "id": { "type": "string" },
        "displayName": { "type": "string" },
        "description": { "type": "string" },

        "profession": { enum: professionIds },

        "resource": { enum: resourceIds },
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

export type ResourceRecipe = {
  id: string
  displayName: string
  description: string
  profession: ProfessionId
  resource: ResourceId
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

export type ResourceRecipeData = Record<string, ResourceRecipe>
const validate = ajv.compile<ResourceRecipeData>(schemaResourceRecipe)

function validateResourceRecipeData (data: any): ResourceRecipeData {
  if (validate(data)) {
    console.log("ResourceRecipeData is valid")
    return data as ResourceRecipeData
  } else{
    console.error("Error validating ResourceRecipeData: ", validate.errors);
    throw new Error("Error validating ResourceRecipeData");
  }
}

export const resourceRecipeData = validateResourceRecipeData(ResourceRecipeDataJSON)