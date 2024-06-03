import { JTDDataType } from "ajv/dist/jtd.js";
import { ajv } from "../ajvInstance.js";

const schemaResourceRecipe = {
  "values": { "ref": "ResourceRecipe" },

  "definitions": {
    "ResourceRecipe": {
      "properties": {
        "id": { "type": "string" },
        "displayName": { "type": "string" },
        "description": { "type": "string" },

        "profession": { "enum": ["weaving", "smelting", "woodworking"] },

        "resource": { "type": "string" },
        "amount": { "type": "int32" },
        "level": { "type": "int32" },
        "time": { "type": "int32" },
        "exp": { "type": "int32" },
        "expChar": { "type": "int32" },

        "ingredients": {
          "elements": {
            "properties": {
              "required": { "type": "boolean" },
              "slot": {
                "elements": {
                  "properties": {
                    "resource": { "type": "string" },
                    "amount": { "type": "int32" }
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