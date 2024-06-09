import { JTDDataType } from "ajv/dist/jtd.js";
import { ajv } from "../ajvInstance.js";

import ResourceDataJSON from "../../data/gameDataJSON/resourceData.json"

export const resourceIds = [
  "woodT1", "woodT2", "woodT3", "woodT4", "woodT5",
  "oreT1", "oreT2", "oreT3", "oreT4", "oreT5",
  "fiberT1", "fiberT2", "fiberT3", "fiberT4", "fiberT5",
  "coal",
  "ingotT1", "ingotT2", "ingotT3", "ingotT4", "ingotT5",
  "plankT1", "plankT2", "plankT3", "plankT4", "plankT5",
  "textileT1", "textileT2", "textileT3", "textileT4", "textileT5",
  "sapT1", "sapT2", "sapT3", "sapT4", "sapT5",
  "stickT1", "stickT2", "stickT3", "stickT4", "stickT5",
  "chunkT1", "chunkT2", "chunkT3", "chunkT4", "chunkT5",
  "strandT1", "strandT2", "strandT3", "strandT4", "strandT5",

  "shortHandleT1_common", "shortHandleT2_common", "shortHandleT3_common", "shortHandleT4_common", "shortHandleT5_common",
  "shortHandleT1_uncommon", "shortHandleT2_uncommon", "shortHandleT3_uncommon", "shortHandleT4_uncommon", "shortHandleT5_uncommon",
  "shortHandleT1_rare", "shortHandleT2_rare", "shortHandleT3_rare", "shortHandleT4_rare", "shortHandleT5_rare",
  "shortHandleT1_epic", "shortHandleT2_epic", "shortHandleT3_epic", "shortHandleT4_epic", "shortHandleT5_epic",
  "shortHandleT1_legendary", "shortHandleT2_legendary", "shortHandleT3_legendary", "shortHandleT4_legendary", "shortHandleT5_legendary",
  "longHandleT1_common", "longHandleT2_common", "longHandleT3_common", "longHandleT4_common", "longHandleT5_common",
  "longHandleT1_uncommon", "longHandleT2_uncommon", "longHandleT3_uncommon", "longHandleT4_uncommon", "longHandleT5_uncommon",
  "longHandleT1_rare", "longHandleT2_rare", "longHandleT3_rare", "longHandleT4_rare", "longHandleT5_rare",
  "longHandleT1_epic", "longHandleT2_epic", "longHandleT3_epic", "longHandleT4_epic", "longHandleT5_epic",
  "longHandleT1_legendary", "longHandleT2_legendary", "longHandleT3_legendary", "longHandleT4_legendary", "longHandleT5_legendary",
  "knopT1_common", "knopT2_common", "knopT3_common", "knopT4_common", "knopT5_common",
  "knopT1_uncommon", "knopT2_uncommon", "knopT3_uncommon", "knopT4_uncommon", "knopT5_uncommon",
  "knopT1_rare", "knopT2_rare", "knopT3_rare", "knopT4_rare", "knopT5_rare",
  "knopT1_epic", "knopT2_epic", "knopT3_epic", "knopT4_epic", "knopT5_epic",
  "knopT1_legendary", "knopT2_legendary", "knopT3_legendary", "knopT4_legendary", "knopT5_legendary",
  "smallBladeT1_common", "smallBladeT2_common", "smallBladeT3_common", "smallBladeT4_common", "smallBladeT5_common",
  "smallBladeT1_uncommon", "smallBladeT2_uncommon", "smallBladeT3_uncommon", "smallBladeT4_uncommon", "smallBladeT5_uncommon",
  "smallBladeT1_rare", "smallBladeT2_rare", "smallBladeT3_rare", "smallBladeT4_rare", "smallBladeT5_rare",
  "smallBladeT1_epic", "smallBladeT2_epic", "smallBladeT3_epic", "smallBladeT4_epic", "smallBladeT5_epic",
  "smallBladeT1_legendary", "smallBladeT2_legendary", "smallBladeT3_legendary", "smallBladeT4_legendary", "smallBladeT5_legendary",
  "metalHeadT1_common", "metalHeadT2_common", "metalHeadT3_common", "metalHeadT4_common", "metalHeadT5_common",
  "metalHeadT1_uncommon", "metalHeadT2_uncommon", "metalHeadT3_uncommon", "metalHeadT4_uncommon", "metalHeadT5_uncommon",
  "metalHeadT1_rare", "metalHeadT2_rare", "metalHeadT3_rare", "metalHeadT4_rare", "metalHeadT5_rare",
  "metalHeadT1_epic", "metalHeadT2_epic", "metalHeadT3_epic", "metalHeadT4_epic", "metalHeadT5_epic",
  "metalHeadT1_legendary", "metalHeadT2_legendary", "metalHeadT3_legendary", "metalHeadT4_legendary", "metalHeadT5_legendary",

  "con_charm", "int_charm", "str_charm", "dex_charm", "foc_charm",
  "speed_mining_charm", "exp_mining_charm", "luck_mining_charm", "yieldMin_mining_charm", "yieldMax_mining_charm",
  "speed_harvesting_charm", "exp_harvesting_charm", "luck_harvesting_charm", "yieldMin_harvesting_charm", "yieldMax_harvesting_charm",
  "speed_woodcutting_charm", "exp_woodcutting_charm", "luck_woodcutting_charm", "yieldMin_woodcutting_charm", "yieldMax_woodcutting_charm",
] as const

export type ResourceId = typeof resourceIds[number];
export const isResourceId = (resource: string): resource is ResourceId => resourceIds.includes(resource as ResourceId)
export type Resources = Record<ResourceId, number>;


export const bonusTypes = ["con", "int", "str", "dex", "foc",
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
        "id": { enum: resourceIds },
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

function validateResourceData (data: any): ResourceData {
  if (validate(data) 
    && Object.keys(data).every((key) => resourceIds.includes(key as ResourceId))
    && resourceIds.every((key) => Object.keys(data).includes(key))
  ) {
    console.log("ResourceData is valid")
    return data as ResourceData
  } else{
    if(!validate.errors) {
      console.error("ResourceData not valid. Both the JSON and type 'resourceIds' need to have the same keys!");
    } else {
      console.error("Error validating ResourceData: ", validate.errors);
    }
    throw new Error("Error validating ResourceData");
  }
}
export const resourceData = validateResourceData(ResourceDataJSON)