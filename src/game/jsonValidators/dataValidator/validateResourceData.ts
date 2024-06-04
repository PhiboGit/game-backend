import { JTDDataType } from "ajv/dist/jtd.js";
import { ajv } from "../ajvInstance.js";
import { resourceIds } from "../../models/character/resources.js";

const schemaResource = {
  "values": { "ref": "Resource" },

  "definitions": {
    "Resource": {
      "properties": {
        "id": { "enum": resourceIds },
        "displayName": { "type": "string" },
        "description": { "type": "string" },
        "rarity": { enum: ["none", "common", "uncommon", "rare", "epic", "legendary"] },
        "tier": { "type": "int32" },
        "sellValue": { "type": "int32" },
      },
      "optionalProperties": {
        "bonusType": { enum: ["con", "int", "str", "dex", "foc",
           "speed_mining", "exp_mining", "luck_mining", "yieldMin_mining", "yieldMax_mining",
           "speed_harvesting", "exp_harvesting", "luck_harvesting", "yieldMin_harvesting", "yieldMax_harvesting",
           "speed_woodcutting", "exp_woodcutting", "luck_woodcutting", "yieldMin_woodcutting", "yieldMax_woodcutting",
        ] },
        "craftingBonus": { "type": "int32" },
        "gearScoreBonus": { "type": "int32" },
      },
      "additionalProperties": false
    }
  }
} as const

export type ResourceData = JTDDataType<typeof schemaResource>
const validate = ajv.compile<ResourceData>(schemaResource)

export function validateResourceData (data: any): ResourceData {
  if (validate(data)) {
    console.log("ResourceData is valid")
    return data as ResourceData
  } else{
    console.error("Error validating ResourceData: ", validate.errors);
    throw new Error("Error validating ResourceData");
  }
}