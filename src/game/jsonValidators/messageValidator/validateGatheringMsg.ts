import { JTDDataType } from "ajv/dist/jtd.js";
import { ajv } from "../ajvInstance.js";
import { dataLoader } from "../../data/dataLoader.js";

const schemaGathering = {
  properties: {
    type: {enum: ['gathering']},
    limit: {type: "boolean"},
    iterations: {type: 'uint32'},
    
    args: { properties: {
      node: { type: 'string' }
    }}
  }
} as const

export type GatheringMsg = JTDDataType<typeof schemaGathering>

const validate = ajv.compile<GatheringMsg>(schemaGathering)
// type inference is not supported for JTDDataType yet
export function validateGatheringMsg(data: any): GatheringMsg | null{
  if(validate(data) && dataLoader.gatheringNodeData[data.args.node]) {
    console.log("GatheringMsg is valid")
    return data as GatheringMsg
  }else{
    console.log("GatheringMsg not valid: ", validate.errors);
    if(!validate.errors) console.log("GatheringMsg not valid. 'node' not found! ");
    return null
  }
}