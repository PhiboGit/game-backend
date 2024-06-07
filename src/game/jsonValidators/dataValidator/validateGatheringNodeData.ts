import { JTDDataType } from "ajv/dist/jtd.js";
import { ajv } from "../ajvInstance.js";
import { resourceIds } from "./validateResourceData.js";
import GatheringNodeDataJSON from "../../data/gameDataJSON/gatheringNodeData.json";
import { professionIds } from "../../models/character/profession.js";

const schemaGatheringNode = {
  "values": { "ref": "GatheringNode" },

  "definitions": {
    "GatheringNode": {
      "properties": {
        "id": { "type": "string" },
        "displayName": { "type": "string" },
        "description": { "type": "string" },
        "profession": { enum: professionIds },
        "tier": { "type": "uint32" },
        "level": { "type": "uint32" },
        "time": { "type": "uint32" },
        "exp": { "type": "uint32" },
        "expChar": { "type": "uint32" },
        "resource": { "enum": resourceIds },
        "minAmount": { "type": "uint32" },
        "maxAmount": { "type": "uint32" }
      },
      "optionalProperties": {},
      "additionalProperties": false
    }
  }
} as const

export type GatheringNodeData = JTDDataType<typeof schemaGatheringNode>
const validate = ajv.compile<GatheringNodeData>(schemaGatheringNode)

function validateGatheringNodeData (data: any): GatheringNodeData {

  if (validate(data)) {
    console.log("GatheringNodeData is valid")
    return data as GatheringNodeData
  } else{
    console.error("Error validating GatheringNodeData: ", validate.errors);
    throw new Error("Error validating GatheringNodeData");
  }
}

export const gatheringNodeData = validateGatheringNodeData(GatheringNodeDataJSON)