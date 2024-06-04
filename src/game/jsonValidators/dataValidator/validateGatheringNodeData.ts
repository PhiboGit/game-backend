import { JTDDataType } from "ajv/dist/jtd.js";
import { ajv } from "../ajvInstance.js";
import { resourceIds } from "../../models/character/resources.js";

const schemaGatheringNode = {
  "values": { "ref": "GatheringNode" },

  "definitions": {
    "GatheringNode": {
      "properties": {
        "id": { "type": "string" },
        "displayName": { "type": "string" },
        "description": { "type": "string" },
        "profession": { "enum": ["woodcutting", "mining", "harvesting"] },
        "tier": { "type": "int32" },
        "level": { "type": "int32" },
        "time": { "type": "int32" },
        "exp": { "type": "int32" },
        "expChar": { "type": "int32" },
        "resource": { "enum": resourceIds },
        "minAmount": { "type": "int32" },
        "maxAmount": { "type": "int32" }
      },
      "optionalProperties": {},
      "additionalProperties": false
    }
  }
} as const

export type GatheringNodeData = JTDDataType<typeof schemaGatheringNode>
const validate = ajv.compile<GatheringNodeData>(schemaGatheringNode)

export function validateGatheringNodeData (data: any): GatheringNodeData {

  if (validate(data)) {
    console.log("GatheringNodeData is valid")
    return data as GatheringNodeData
  } else{
    console.error("Error validating GatheringNodeData: ", validate.errors);
    throw new Error("Error validating GatheringNodeData");
  }
}