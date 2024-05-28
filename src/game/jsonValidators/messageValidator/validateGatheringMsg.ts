import { JTDDataType } from "ajv/dist/jtd.js";
import { ajv } from "../ajvInstance.js";

const schemaGathering = {
  properties: {
    type: {enum: ['action']},
    limit: {type: "boolean"},
    iterations: {type: 'uint32'},
    task: {enum: ['gathering']},
    
    args: { properties: {
      node: { type: 'string' }
    }}
  }
} as const

export type GatheringMsg = JTDDataType<typeof schemaGathering>


// type inference is not supported for JTDDataType yet
export const validateGatheringMsg = ajv.compile<GatheringMsg>(schemaGathering)