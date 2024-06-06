import { JTDDataType } from "ajv/dist/jtd.js";
import { ajv } from "../ajvInstance.js";
import { resourceIds } from "../../models/character/resources.js";

const bonusTypes = ["con", "int", "str", "dex", "foc",
"speed_mining", "exp_mining", "luck_mining", "yieldMin_mining", "yieldMax_mining",
"speed_harvesting", "exp_harvesting", "luck_harvesting", "yieldMin_harvesting", "yieldMax_harvesting",
"speed_woodcutting", "exp_woodcutting", "luck_woodcutting", "yieldMin_woodcutting", "yieldMax_woodcutting",
] as const

export type BonusType = typeof bonusTypes[number]

export const rarities = ["none", "common", "uncommon", "rare", "epic", "legendary"] as const
export type RarityType = typeof rarities[number]

const schemaResource = {
  "values": { "ref": "Resource" },

  "definitions": {
    "Resource": {
      "properties": {
        "id": { "enum": resourceIds },
        "displayName": { "type": "string" },
        "description": { "type": "string" },
        "rarity": { enum: rarities },
        "tier": { "type": "uint32" },
        "sellValue": { "type": "uint32" },
      },
      "optionalProperties": {
        "bonusType": { enum: bonusTypes },
        "craftingBonus": { "type": "uint32" },
        "gearScoreBonus": { "type": "uint32" },
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