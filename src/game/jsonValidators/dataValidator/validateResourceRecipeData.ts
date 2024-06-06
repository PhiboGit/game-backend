import { JTDDataType } from "ajv/dist/jtd.js";
import { ajv } from "../ajvInstance.js";
import { resourceIds } from "../../models/character/resources.js";

const schemaResourceRecipe = {
  "values": { "ref": "ResourceRecipe" },

  "definitions": {
    "ResourceRecipe": {
      "properties": {
        "id": { "type": "string" },
        "displayName": { "type": "string" },
        "description": { "type": "string" },

        "profession": { "enum": ["weaving", "smelting", "woodworking"] },

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

export type ResourceRecipeData = JTDDataType<typeof schemaResourceRecipe>
const validate = ajv.compile<ResourceRecipeData>(schemaResourceRecipe)

export function validateResourceRecipeData (data: any): ResourceRecipeData {
  if (validate(data)) {
    console.log("ResourceRecipeData is valid")
    return data as ResourceRecipeData
  } else{
    console.error("Error validating ResourceRecipeData: ", validate.errors);
    throw new Error("Error validating ResourceRecipeData");
  }
}