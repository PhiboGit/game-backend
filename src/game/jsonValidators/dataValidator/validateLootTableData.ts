import { JTDDataType } from "ajv/dist/jtd.js";
import { ajv } from "../ajvInstance.js";

import LootTableDataJSON from "../../data/gameDataJSON/lootTableData.json"

const schemaLootTable = {
  "values": { "ref": "LootTable" },

  "definitions": {
    "LootTable": {
      "discriminator": "ROLL/WEIGHT",
      "mapping": {
        "ROLL": {
          "properties": {
            "AND/OR": {enum: ["AND", "OR"]},
            "maxRoll": {type: "uint32"},
            "luck": {type: "boolean"},
            "loot": {"elements": {
              "properties": {
                "value": {type: "uint32"},
                "resource": {type: "string"},
                "min": {type: "uint32"},
                "max": {type: "uint32"}
              }
            }}
          },
          "optionalProperties": {},
          "additionalProperties": false
        },
        "WEIGHT": {
          "properties": {
            "loot": {"elements": {
              "properties": {
                "value": {type: "uint32"},
                "resource": {type: "string"},
                "min": {type: "uint32"},
                "max": {type: "uint32"}
              }
            }}
          },
          "optionalProperties": {},
          "additionalProperties": false
        }
      },
    },
  }
} as const

export type LootTableData = JTDDataType<typeof schemaLootTable>
export type LootTable = JTDDataType<typeof schemaLootTable.definitions.LootTable>
export type LootTableRoll = JTDDataType<typeof schemaLootTable.definitions.LootTable.mapping.ROLL>
export type LootTableWeight = JTDDataType<typeof schemaLootTable.definitions.LootTable.mapping.WEIGHT>
const validate = ajv.compile<LootTableData>(schemaLootTable)

function validateLootTableData (data: any): LootTableData {

  if (validate(data)) {
    console.log("LootTableData is valid")
    return data as LootTableData
  } else{
    console.error("Error validating LootTableData: ", validate.errors);
    throw new Error("Error validating LootTableData");
  }
}

export const lootTableData = validateLootTableData(LootTableDataJSON)