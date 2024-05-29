import { JTDDataType } from "ajv/dist/jtd.js";
import { ajv } from "../ajvInstance.js";

const schemaCancel = {
  properties: {
    type: {enum: ['cancelAction']},
    index: {type: 'int8'},
  }
} as const

export type CancelActionMsg = JTDDataType<typeof schemaCancel>

export const validateCancelActionMsg = ajv.compile<CancelActionMsg>(schemaCancel)